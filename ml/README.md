# Lemon-Aid ML — Graph Neural Network

Predicts demand level (wait time class) for food resources nationwide using a
GraphSAGE model trained on spatial neighborhood context and resource features.

---

## What are nodes and edges in this context?

### Nodes
Each **node is one food resource** — a food pantry, soup kitchen, or community
fridge — published in the Lemontree database. A node represents a real physical
location where people go to get food. Each node carries an 11-dimensional feature
vector describing the resource (what it offers, how accessible it is, how busy it
tends to be, what neighborhood it sits in).

### Edges
Each **edge connects two nearby resources**. Two nodes get an edge if they are
within **2 km of each other** (roughly a 25-minute walk). The edge weight is
inversely proportional to distance — closer resources have stronger connections.

Edges capture the real-world dynamic of **demand spillover**: if a pantry closes
unexpectedly, or runs out of food, people don't go home — they walk to the next
nearest option. By connecting nearby resources, the GNN can learn that a
high-demand neighbor puts pressure on you even if your own historical wait time
is low. A node with three overwhelmed neighbors in its 2km radius is at much
higher risk than an isolated node with the same individual features.

Edges are **bidirectional** — if A influences B, B also influences A.

---

## Scripts

### 1. `build_features.py`
Queries the database, computes all node features, builds the spatial graph,
and writes `nodes.csv` and `edges.csv`.

```bash
cd ml
python build_features.py
```

**Inputs:** Supabase PostgreSQL (via `DIRECT_URL` in `.env.local`)  
**Outputs:** `ml/nodes.csv`, `ml/edges.csv`, `ml/tract_cache.json`

### 2. `train_gnn.py` *(next step)*
Loads `nodes.csv` and `edges.csv`, trains a GraphSAGE model for 3-class demand
prediction, and writes the trained model and predictions.

```bash
cd ml
python train_gnn.py
```

**Inputs:** `ml/nodes.csv`, `ml/edges.csv`  
**Outputs:** `ml/lemontree_gnn_v1.pth`, `ml/predictions.csv`

---

## Output files

### `nodes.csv`
One row per food resource. 8,510 rows total.

| Column | Description |
|--------|-------------|
| `node_idx` | Integer index (0-based), used as row reference in `edges.csv` |
| `resource_id` | Original Lemontree resource ID (string) |
| `latitude`, `longitude` | Coordinates |
| `resource_type` | 0=Food Pantry, 1=Soup Kitchen, 2=Community Fridge |
| `rating_normalized` | Community rating / 3.0. Nulls → dataset mean (~0.598) |
| `wait_time_normalized` | Wait time capped at 240 min / 240. Nulls and negatives → 0.5 |
| `magnet_score` | Fraction of high-demand offering tags present (see Features) |
| `barrier_score` | Fraction of access-restriction requirement tags present |
| `days_covered` | Unique days of scheduled service / 7 |
| `poverty_index` | ACS5 census tract poverty rate (0–1) |
| `subscriber_normalized` | log1p(subscribers) / log1p(max subscribers) |
| `review_normalized` | log1p(reviews) / log1p(max reviews) |
| `confidence` | Lemontree data quality score (0–1, no nulls) |
| `appointment_required` | 1 if appointment required, 0 otherwise |
| `wait_bucket` | Training label: 0=low (0–15 min), 1=moderate (15–45 min), 2=high (45+ min). NaN = unlabeled |
| `has_label` | True if `wait_bucket` is not NaN |

### `edges.csv`
One row per directed edge. 111,526 rows total (bidirectional pairs).

| Column | Description |
|--------|-------------|
| `source` | `node_idx` of the source node |
| `target` | `node_idx` of the target node |
| `weight` | `1 / (dist_km + 0.01)` — higher weight = closer neighbors |

### `tract_cache.json`
Cache of `"lat,lon"` → census tract GEOID lookups from the censusgeocode API.
Prevents redundant API calls on re-runs. Safe to delete to force a full refresh.

### `lemontree_gnn_v1.pth` *(after training)*
Saved PyTorch model weights. Load with:
```python
model = FoodAccessGNN(in_channels=11, hidden_channels=64, out_channels=3)
model.load_state_dict(torch.load("ml/lemontree_gnn_v1.pth"))
model.eval()
```

### `predictions.csv` *(after training)*
One row per node. Columns: `resource_id`, `predicted_bucket`, `confidence_score`,
and optionally 32-dimensional embeddings for downstream use.

---

## Node features (11 dimensions)

| # | Feature | Range | What it captures |
|---|---------|-------|-----------------|
| 1 | `resource_type` | 0 / 1 / 2 | Type of resource. Soup kitchens serve on-site meals with longer queues; community fridges are unstaffed with no wait; pantries are in between. |
| 2 | `rating_normalized` | 0.33–1.0 | Community satisfaction. Raw scale 1–3 stars. Captures perceived quality independently of raw wait time — a pantry can have short waits but still rate poorly due to chaotic experience. |
| 3 | `wait_time_normalized` | 0–1 | Historical average wait, capped at 240 min. Also the source of training labels. Imputed to 0.5 for unlabeled nodes. |
| 4 | `magnet_score` | 0–0.5 | Fraction of high-draw offering tags present: Fresh produce, Client choice, Halal, Kosher, Delivery, Diapers. High magnet pantries attract visitors from further away and face higher structural demand. |
| 5 | `barrier_score` | 0–0.8 | Fraction of access-restriction tags present: ID required, Registration, Proof of income, Proof of address, Referral required. High barriers suppress walk-in demand even in high-need neighborhoods. |
| 6 | `days_covered` | 0–1 | Unique scheduled weekdays / 7. A pantry open once a week (0.14) creates single-day demand spikes; one open daily (1.0) distributes load evenly. |
| 7 | `poverty_index` | 0–1 | ACS5 poverty rate of the census tract the resource sits in. Represents structural demand pressure from the surrounding neighborhood, independent of pantry operations. |
| 8 | `subscriber_normalized` | 0–1 | Log-normalized active follower count. Captures community reliance — high-subscriber pantries are depended on and their disruptions ripple outward. |
| 9 | `review_normalized` | 0–1 | Log-normalized total review count. Doubles as a data confidence signal and secondary demand proxy. |
| 10 | `confidence` | 0–1 | Lemontree's internal data completeness score. No nulls. Low-confidence nodes have less reliable features and their predictions should be treated with more uncertainty. |
| 11 | `appointment_required` | 0 / 1 | Whether the resource requires a scheduled appointment. Appointment-only pantries control their own queue and show lower wait times not because they are less needed, but because they cap intake. The GNN needs this to avoid misreading their low wait as low demand. |

---

## Graph statistics (current run)

| Metric | Value |
|--------|-------|
| Total nodes | 8,510 |
| Total edges | 111,526 |
| Labeled nodes | 4,416 (51.9%) |
| Unlabeled nodes | 4,094 (48.1%) |
| Class 0 — low demand (0–15 min) | 2,874 (65.1% of labeled) |
| Class 1 — moderate (15–45 min) | 1,359 (30.8% of labeled) |
| Class 2 — high demand (45+ min) | 183 (4.1% of labeled) |
| Avg edges per node | 16.0 |
| Median edges per node | 7 |
| Isolated nodes (0 edges) | 1,557 |

### Class weights for training
Computed as `total_labeled / (3 × class_count)`:

| Class | Weight |
|-------|--------|
| 0 (low) | 0.512 |
| 1 (moderate) | 1.083 |
| 2 (high) | **8.044** |

Pass these directly to `torch.nn.CrossEntropyLoss(weight=torch.tensor([0.512, 1.083, 8.044]))`.

### Note on isolated nodes
1,557 nodes have no neighbors within 2km — mostly rural resources spread across
low-density areas. These nodes still participate in the graph but receive no
neighborhood messages. Their predictions rely entirely on their own feature vector.
This is expected and acceptable behavior for GraphSAGE.

---

## Inference on a new resource

When Lemontree adds a new pantry:

1. Compute its 11 feature values using the same logic as `build_features.py`
2. Find its neighbors: run Haversine distance against all existing node coordinates,
   keep nodes within 2km
3. Run a **forward pass only** through the loaded model — no retraining needed
4. The model returns a 3-class probability distribution; argmax is the predicted
   demand bucket

This is the key property of GraphSAGE (inductive learning): the model learns an
aggregation function, not fixed per-node embeddings, so it generalizes to nodes
it has never seen.