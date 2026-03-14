"""
trainGNN.py
Lemon-Aid - Phase 3: GraphSAGE Training

Trains a 2-layer GraphSAGE model for 3-class node classification
(wait_bucket: 0 = 0-15 min, 1 = 15-45 min, 2 = 45+ min).

Reads:  ml/nodes.csv, ml/edges.csv
Writes: ml/lemontree_gnn_v1.pth, ml/predictions.csv, ml/output/training_log.o

Run:
    pip install -r requirements.txt
    cd ml
    python trainGNN.py

CUDA is used automatically if available.

# =========================================================
# ARCHITECTURE OVERVIEW
# =========================================================

  Input features (11-dim) per node
           |
           v
  +-----------------------------+
  |   SAGEConv(11 -> 64)        |  Layer 1: each node aggregates its
  |   + ReLU + Dropout(0.3)     |  neighbors' features into a 64-dim
  +-----------------------------+  neighborhood-aware representation
           |
           v
  +-----------------------------+
  |   SAGEConv(64 -> 32)        |  Layer 2: aggregates again - now each
  |   + ReLU                    |  node sees 2 hops away. Output is a
  +-----------------------------+  32-dim embedding per node.
           |
           v
  +-----------------------------+
  |   Linear(32 -> 3)           |  Classifier head: maps embedding to
  +-----------------------------+  3 class logits (low/moderate/high)
           |
           v
      CrossEntropyLoss
      (with class weights)

HOW GRAPHSAGE AGGREGATION WORKS
-------------------------------
At each SAGEConv layer, for node v:

  h_v^new = W * CONCAT(h_v, MEAN({h_u : u in neighbors(v)}))

In plain English: take your own current representation, concatenate
it with the average of all your neighbors' representations, then
multiply by a learned weight matrix W. This is done for every node
simultaneously, using the edge_index to know who connects to whom.

After Layer 1: each node's 64-dim vector encodes its own features
  PLUS a summary of its immediate neighbors (1-hop).

After Layer 2: each node's 32-dim vector now encodes its own features
  PLUS neighbors PLUS neighbors-of-neighbors (2-hop).

This is the demand spillover signal: a food pantry surrounded by
overwhelmed neighbors will have that pressure reflected in its
embedding, even if its own historical wait time was low.

WHY GRAPHSAGE SPECIFICALLY
--------------------------
Unlike vanilla GCN, GraphSAGE learns an aggregation function (W above)
rather than a fixed embedding per node. This means:
  - New pantries can be added without retraining - just run a forward
    pass with their features and their computed neighbors.
  - The model generalizes to unseen nodes inductively.

TRAINING SETUP
--------------
  - Only labeled nodes (has_label=True, ~4416 nodes) contribute to loss
  - Unlabeled nodes (~4094) still receive messages from neighbors and
    pass their own messages - they participate fully in aggregation
  - Stratified 80/20 split ensures class 2 (183 samples) appears in
    both train and val despite being rare
  - Class weights in CrossEntropyLoss force the model to care about
    getting the rare high-demand class right (weight ~8x vs class 0)
  - Best model saved by val F1 macro (not accuracy - accuracy is
    misleading when 65% of labels are class 0)
# =========================================================
"""

import os
from pathlib import Path

import numpy as np
import pandas as pd
import torch
import torch.nn.functional as F
from torch_geometric.data import Data
from torch_geometric.nn import SAGEConv
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, f1_score
from tqdm.auto import tqdm

# -- Config --------------------------------------------------------------------
ML_DIR = Path(".")

# All 11 node features - must match the column order in nodes.csv.
# build_features.py produces these columns; any change there must be
# reflected here.
FEATURE_COLS = [
    "resource_type",           # 0=Food Pantry, 1=Soup Kitchen, 2=Community Fridge
    "rating_normalized",       # ratingAverage / 3.0, null -> dataset mean
    "wait_time_normalized",    # waitTimeMinutesAverage / 240, null/neg -> 0.5
    "magnet_score",            # fraction of high-draw OFFERING tags present
    "barrier_score",           # fraction of access-restriction REQUIREMENT tags
    "days_covered",            # unique scheduled weekdays / 7
    "poverty_index",           # ACS5 census tract poverty rate (0-1)
    "subscriber_normalized",   # log1p(subscribers) / log1p(max)
    "review_normalized",       # log1p(reviews) / log1p(max)
    "confidence",              # Lemontree data quality score (0-1, no nulls)
    "appointment_required",    # 1 if appointment required, else 0
]

# in_channels is derived automatically - no need to update when adding features
IN_CHANNELS   = len(FEATURE_COLS)   # 11
HIDDEN_DIM    = 64
EMBED_DIM     = 32
NUM_CLASSES   = 3
DROPOUT       = 0.3
LR            = 0.01
WEIGHT_DECAY  = 5e-4
EPOCHS        = 300
TRAIN_RATIO   = 0.8

OUTPUT_DIR       = ML_DIR / "output"
MODEL_PATH       = ML_DIR / "lemontree_gnn_v1.pth"
PREDICTIONS_PATH = ML_DIR / "predictions.csv"
TRAINING_LOG     = OUTPUT_DIR / "training_log.o"


# -- Model ---------------------------------------------------------------------

class GraphSAGEWithEmbeddings(torch.nn.Module):
    """
    2-layer GraphSAGE that returns class logits and 32-dim node embeddings.

    Forward pass data flow:
        x (N x 11)
          -> SAGEConv(11 -> 64) + ReLU + Dropout   [1-hop neighborhood summary]
          -> SAGEConv(64 -> 32) + ReLU              [2-hop neighborhood summary]
          -> embeddings (N x 32)
          -> Linear(32 -> 3)
          -> logits (N x 3)

    The embeddings are the 32-dim vectors saved to predictions.csv.
    They can be used downstream for clustering, similarity search, or
    visualisation (e.g. UMAP/t-SNE of pantry demand profiles).
    """

    def __init__(
        self,
        in_channels: int,
        hidden_channels: int = 64,
        embed_dim: int = 32,
        out_channels: int = 3,
        dropout: float = 0.3,
    ):
        super().__init__()
        self.conv1      = SAGEConv(in_channels, hidden_channels)
        self.conv2      = SAGEConv(hidden_channels, embed_dim)
        self.classifier = torch.nn.Linear(embed_dim, out_channels)
        self.dropout    = dropout

    def forward(self, x, edge_index):
        # -- Layer 1 ----------------------------------------------------------
        # SAGEConv aggregates each node's own features with its neighbors'
        # features via mean pooling, then applies a learned linear transform.
        # Output: each node has a 64-dim vector encoding its 1-hop context.
        x = self.conv1(x, edge_index)
        x = F.relu(x)
        x = F.dropout(x, p=self.dropout, training=self.training)

        # -- Layer 2 ----------------------------------------------------------
        # Same aggregation again, but now the input already encodes 1-hop
        # context. After this layer each node's vector encodes 2-hop context
        # (neighbors of neighbors). Output: 32-dim embeddings.
        embeddings = self.conv2(x, edge_index)
        embeddings = F.relu(embeddings)

        # -- Classifier head ---------------------------------------------------
        # Simple linear layer mapping 32-dim embedding -> 3 class logits.
        # No activation here - CrossEntropyLoss expects raw logits.
        logits = self.classifier(embeddings)

        return logits, embeddings


# -- Data loading --------------------------------------------------------------

def load_data() -> tuple[Data, pd.DataFrame]:
    """Load nodes.csv and edges.csv into a PyG Data object."""
    nodes_df = pd.read_csv(ML_DIR / "nodes.csv")
    edges_df  = pd.read_csv(ML_DIR / "edges.csv")

    print(f"  Nodes: {len(nodes_df)}, Edges: {len(edges_df)}")

    # Validate all feature columns are present
    missing = [c for c in FEATURE_COLS if c not in nodes_df.columns]
    if missing:
        raise ValueError(
            f"Missing feature columns in nodes.csv: {missing}\n"
            f"Re-run build_features.py to regenerate nodes.csv."
        )

    # Feature matrix: N x 11
    x = torch.tensor(nodes_df[FEATURE_COLS].values, dtype=torch.float)

    # Edge index: shape (2, E)
    edge_index = torch.tensor(
        np.array([edges_df["source"].values, edges_df["target"].values]),
        dtype=torch.long,
    )

    # Labels: -1 for unlabeled nodes (excluded from loss by mask)
    has_label = nodes_df["has_label"].values.astype(bool)
    raw_labels = nodes_df["wait_bucket"].values

    y = torch.full((len(nodes_df),), -1, dtype=torch.long)
    for i in range(len(nodes_df)):
        if has_label[i] and not np.isnan(raw_labels[i]):
            y[i] = int(raw_labels[i])

    data = Data(x=x, edge_index=edge_index, y=y)
    data.labeled_mask = torch.tensor(has_label, dtype=torch.bool)
    data.resource_ids = nodes_df["resource_id"].values

    return data, nodes_df


# -- Utilities -----------------------------------------------------------------

def stratified_split(data: Data) -> tuple[torch.Tensor, torch.Tensor]:
    """
    Stratified 80/20 train/val split on labeled nodes only.
    Stratification ensures the rare class 2 (183 samples) appears in
    both splits rather than being accidentally concentrated in one.
    """
    labeled_indices = data.labeled_mask.nonzero(as_tuple=True)[0].numpy()
    labeled_labels  = data.y[data.labeled_mask].numpy()

    train_idx, val_idx = train_test_split(
        labeled_indices,
        test_size=1 - TRAIN_RATIO,
        stratify=labeled_labels,
        random_state=42,
    )

    train_mask = torch.zeros(data.num_nodes, dtype=torch.bool)
    val_mask   = torch.zeros(data.num_nodes, dtype=torch.bool)
    train_mask[train_idx] = True
    val_mask[val_idx]     = True

    return train_mask, val_mask


def compute_class_weights(data: Data, train_mask: torch.Tensor) -> torch.Tensor:
    """
    Inverse frequency weights: total / (num_classes x count_per_class).

    With distribution ~65% / 31% / 4%, this produces roughly:
        Class 0 (low):      ~0.51  - underweighted relative to uniform
        Class 1 (moderate): ~1.08  - near uniform
        Class 2 (high):     ~8.0   - heavily upweighted

    This prevents the model from collapsing to always predict class 0.
    """
    train_labels = data.y[train_mask]
    total = train_labels.shape[0]
    weights = []
    for c in range(NUM_CLASSES):
        count = (train_labels == c).sum().item()
        weights.append(total / (NUM_CLASSES * count) if count > 0 else 1.0)
    return torch.tensor(weights, dtype=torch.float)


# -- Train / eval steps --------------------------------------------------------

def train_epoch(
    model: torch.nn.Module,
    data: Data,
    optimizer: torch.optim.Optimizer,
    criterion: torch.nn.Module,
) -> float:
    model.train()
    optimizer.zero_grad()
    logits, _ = model(data.x, data.edge_index)
    loss = criterion(logits[data.train_mask], data.y[data.train_mask])
    loss.backward()
    optimizer.step()
    return loss.item()


@torch.no_grad()
def evaluate(
    model: torch.nn.Module,
    data: Data,
    criterion: torch.nn.Module,
) -> tuple[float, float, float, np.ndarray]:
    model.eval()
    logits, _ = model(data.x, data.edge_index)

    val_logits = logits[data.val_mask]
    val_labels = data.y[data.val_mask]

    loss     = criterion(val_logits, val_labels).item()
    preds    = val_logits.argmax(dim=1).cpu().numpy()
    labels   = val_labels.cpu().numpy()
    acc      = (preds == labels).mean()
    f1_macro = f1_score(labels, preds, average="macro",  zero_division=0)
    f1_per   = f1_score(labels, preds, average=None,     zero_division=0)

    return loss, acc, f1_macro, f1_per


# -- Main ----------------------------------------------------------------------

def main():
    # -- Device ----------------------------------------------------------------
    if torch.cuda.is_available():
        device = torch.device("cuda")
        props  = torch.cuda.get_device_properties(0)
        print(f"Using CUDA: {torch.cuda.get_device_name(0)}")
        print(f"  CUDA version: {torch.version.cuda}")
        print(f"  GPU memory:   {props.total_memory / 1e9:.1f} GB")
    else:
        device = torch.device("cpu")
        print("CUDA not available - using CPU")

    # -- Load ------------------------------------------------------------------
    print(f"\nLoading graph data...")
    data, nodes_df = load_data()

    print(f"\n  Feature dimensions:  {IN_CHANNELS}  ({', '.join(FEATURE_COLS)})")

    # -- Split -----------------------------------------------------------------
    train_mask, val_mask = stratified_split(data)
    data.train_mask = train_mask
    data.val_mask   = val_mask

    n_labeled   = data.labeled_mask.sum().item()
    n_unlabeled = data.num_nodes - n_labeled
    print(f"\n  Total nodes:   {data.num_nodes}")
    print(f"  Labeled:       {n_labeled}  (train: {train_mask.sum().item()}, val: {val_mask.sum().item()})")
    print(f"  Unlabeled:     {n_unlabeled}  (participate in message passing, excluded from loss)")

    # -- Class weights ---------------------------------------------------------
    class_weights = compute_class_weights(data, train_mask)
    print(f"\n  Class weights: {[round(w, 3) for w in class_weights.tolist()]}")
    print(f"    Class 0 (0-15 min):   {class_weights[0]:.3f}")
    print(f"    Class 1 (15-45 min):  {class_weights[1]:.3f}")
    print(f"    Class 2 (45+ min):    {class_weights[2]:.3f}  * upweighted due to rarity")

    # -- Move to device --------------------------------------------------------
    data          = data.to(device)
    class_weights = class_weights.to(device)

    # -- Model -----------------------------------------------------------------
    model = GraphSAGEWithEmbeddings(
        in_channels     = IN_CHANNELS,    # 11
        hidden_channels = HIDDEN_DIM,     # 64
        embed_dim       = EMBED_DIM,      # 32
        out_channels    = NUM_CLASSES,    # 3
        dropout         = DROPOUT,
    ).to(device)

    total_params = sum(p.numel() for p in model.parameters())
    print(f"\n  Model:     GraphSAGEWithEmbeddings")
    print(f"  Layers:    SAGEConv({IN_CHANNELS}->{HIDDEN_DIM}) -> SAGEConv({HIDDEN_DIM}->{EMBED_DIM}) -> Linear({EMBED_DIM}->{NUM_CLASSES})")
    print(f"  Params:    {total_params:,}")

    optimizer = torch.optim.Adam(
        model.parameters(), lr=LR, weight_decay=WEIGHT_DECAY
    )
    criterion = torch.nn.CrossEntropyLoss(weight=class_weights)

    # -- Training loop ---------------------------------------------------------
    print(f"\nTraining for {EPOCHS} epochs (saving best by val F1 macro)...")
    header = f"{'Epoch':>6} {'Train Loss':>11} {'Val Loss':>10} {'Val Acc':>9} {'Val F1':>8}  F1 per class [0, 1, 2]"

    # Create output directory and open log file
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    log_file = open(TRAINING_LOG, "w", encoding="utf-8")
    log_file.write(header + "\n")
    log_file.write("-" * len(header) + "\n")

    best_f1    = 0.0
    best_epoch = 0

    pbar = tqdm(range(1, EPOCHS + 1))
    for epoch in pbar:
        train_loss = train_epoch(model, data, optimizer, criterion)
        val_loss, val_acc, val_f1, f1_per = evaluate(model, data, criterion)

        # Update tqdm bar with train loss only
        pbar.set_postfix(train_loss=f"{train_loss:.4f}")

        # Save best checkpoint by val F1 macro - not accuracy.
        # Accuracy is misleading with 65% class 0: a model that predicts
        # everything as class 0 would get 65% accuracy but F1 macro of ~0.26.
        if val_f1 > best_f1:
            best_f1    = val_f1
            best_epoch = epoch
            torch.save(
                {
                    "model_state_dict": model.state_dict(),
                    "epoch":            epoch,
                    "val_f1_macro":     val_f1,
                    "val_acc":          val_acc,
                    "feature_cols":     FEATURE_COLS,
                    "in_channels":      IN_CHANNELS,
                    "hidden_dim":       HIDDEN_DIM,
                    "embed_dim":        EMBED_DIM,
                    "num_classes":      NUM_CLASSES,
                    "class_weights":    class_weights.cpu().tolist(),
                },
                MODEL_PATH,
            )

        # Write detailed metrics to log file at key epochs
        if epoch % 10 == 0 or epoch == 1 or epoch == EPOCHS:
            f1_str = "  ".join(f"{f:.3f}" for f in f1_per)
            log_file.write(
                f"{epoch:>6} {train_loss:>11.4f} {val_loss:>10.4f} "
                f"{val_acc:>9.4f} {val_f1:>8.4f}  [{f1_str}]\n"
            )
            log_file.flush()

    log_file.write("-" * len(header) + "\n")
    log_file.write(f"\nBest checkpoint: epoch {best_epoch}, val F1 macro = {best_f1:.4f}\n")
    log_file.close()

    # Print final summary to console
    print(f"\n{'-' * len(header)}")
    print(header)
    print("-" * len(header))
    f1_str = "  ".join(f"{f:.3f}" for f in f1_per)
    print(
        f"{epoch:>6} {train_loss:>11.4f} {val_loss:>10.4f} "
        f"{val_acc:>9.4f} {val_f1:>8.4f}  [{f1_str}]"
    )
    print("-" * len(header))
    print(f"Best checkpoint: epoch {best_epoch}, val F1 macro = {best_f1:.4f}")
    print(f"Full training log saved to {TRAINING_LOG}")

    # -- Load best model for inference -----------------------------------------
    print("\nLoading best checkpoint for inference...")
    checkpoint = torch.load(MODEL_PATH, map_location=device, weights_only=False)
    model.load_state_dict(checkpoint["model_state_dict"])
    model.eval()

    # -- Inference on ALL nodes ------------------------------------------------
    print("Running inference on all 8,510 nodes...")
    with torch.no_grad():
        logits, embeddings = model(data.x, data.edge_index)
        probs      = F.softmax(logits, dim=1)
        predicted  = probs.argmax(dim=1).cpu().numpy()
        confidence = probs.max(dim=1).values.cpu().numpy()
        embeddings = embeddings.cpu().numpy()

    # -- Save predictions.csv --------------------------------------------------
    pred_dict = {
        "resource_id":      data.resource_ids,
        "predicted_bucket": predicted,
        "confidence":       np.round(confidence, 4),
        # Per-class probabilities (useful for dashboard ranking)
        "prob_class0":      np.round(probs.cpu().numpy()[:, 0], 4),
        "prob_class1":      np.round(probs.cpu().numpy()[:, 1], 4),
        "prob_class2":      np.round(probs.cpu().numpy()[:, 2], 4),
    }
    # 32-dim embedding columns for downstream use (clustering, UMAP, etc.)
    for d in range(embeddings.shape[1]):
        pred_dict[f"emb_{d}"] = np.round(embeddings[:, d], 6)

    predictions_df = pd.DataFrame(pred_dict)
    predictions_df.to_csv(PREDICTIONS_PATH, index=False)
    print(f"Saved {PREDICTIONS_PATH}  ({len(predictions_df)} rows, "
          f"{len(predictions_df.columns)} columns)")

    # -- Classification report on val set --------------------------------------
    val_indices = data.val_mask.cpu().numpy().astype(bool)
    val_true    = data.y.cpu().numpy()[val_indices]
    val_pred    = predicted[val_indices]

    print("\n" + "=" * 60)
    print("Classification Report - Validation Set")
    print("=" * 60)
    print(classification_report(
        val_true, val_pred,
        target_names=["0: 0-15 min", "1: 15-45 min", "2: 45+ min"],
        zero_division=0,
    ))

    # -- Bottleneck alert candidates -------------------------------------------
    unlabeled_mask  = ~data.labeled_mask.cpu().numpy()
    unlabeled_preds = predicted[unlabeled_mask]
    n_bottleneck    = (unlabeled_preds == 2).sum()

    print("=" * 60)
    print("Bottleneck Alert Candidates (unlabeled nodes)")
    print("=" * 60)
    print(f"  Total unlabeled:                  {unlabeled_mask.sum()}")
    print(f"  Predicted class 2 (45+ min):      {n_bottleneck}")
    print(f"  -> These are pantries with no historical wait data that the")
    print(f"    model predicts are under high demand based on their features")
    print(f"    and neighborhood context. Surface these in the dashboard.")
    print(f"\n  Full distribution (unlabeled nodes):")
    labels_desc = {0: "low (0-15 min)", 1: "moderate (15-45 min)", 2: "HIGH (45+ min)"}
    for cls in range(NUM_CLASSES):
        count = (unlabeled_preds == cls).sum()
        pct   = 100 * count / len(unlabeled_preds) if len(unlabeled_preds) > 0 else 0
        print(f"    Class {cls} - {labels_desc[cls]}: {count} ({pct:.1f}%)")

    print(f"\n{'=' * 60}")
    print("Done!")


if __name__ == "__main__":
    main()