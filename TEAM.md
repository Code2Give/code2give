# Lemontree InsightEngine — Team Docs
**Morgan Stanley Code to Give Hackathon**

---

## The Pitch (30-second version)

> Most food insecurity tools tell you *where* the food is. InsightEngine tells you *why* people aren't getting it.

By layering Lemontree's qualitative feedback with NYC Census data, we move from simple mapping to **Decision Intelligence** — helping nonprofits, donors, and city agencies see exactly where the "Impact Gaps" are across the five boroughs.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Database | PostgreSQL via Prisma 7 (embedded local dev server) |
| DB Client | Raw `pg` driver (direct connection) |
| Map | React-Leaflet + OpenStreetMap tiles |
| AI | Google Gemini API (`gemini-2.0-flash`) with keyword fallback |
| Icons | Lucide React |
| Runtime | Node.js 25 |

---

## How to Run Locally

You need **two terminals** running at all times:

```bash
# Terminal 1 — starts the embedded Postgres database (keep this open)
npx prisma dev

# Terminal 2 — starts the Next.js app
npm run dev
```

App runs at: **http://localhost:3000**

### First-time setup
```bash
npm install
npx prisma db push      # creates tables from schema
npm run seed            # populates DB with NYC mock data
```

### Environment variables (`.env`)
```
DATABASE_URL=...            # prisma+postgres:// URL (already set)
DIRECT_DATABASE_URL=...     # postgres:// direct URL (already set)
GEMINI_API_KEY=""           # add your key here to enable real AI
```

> `GEMINI_API_KEY` is optional — without it the app falls back to keyword-based classification. With it, every feedback submission goes through Gemini.

---

## What's Built (Current V1)

### Persona Switcher
A dropdown in the top bar lets you switch between three dashboard views instantly — no login required. Defaults to Donor on load.

| Persona | Route | Who it's for |
|---|---|---|
| Donor | (default) | Donors tracking ROI |
| Gov (City Planner) | switcher | City agencies identifying food deserts |
| Admin (Lemontree) | switcher | Lemontree ops team |

---

### Donor Dashboard
- **4 metric cards** — Meals Provided, Community Reach, Active Pantries, ROI per $100
- **Interactive NYC Map** — live pantry locations pulled from DB, toggleable layers
- Status: metric cards are hardcoded mock values; map is live

---

### Gov / City Planner Dashboard
- **3 metric cards** — Critical Priority Tracts, SNAP Need Met %, New Pantries Needed
- **Interactive NYC Map** — same live map component
- Status: metric cards are hardcoded mock values; map is live

---

### Admin / Lemontree Dashboard
**This is the most complete view.**

- **Live stats bar** — Total feedback processed, Positive count, Negative count (all computed from DB in real time)
- **AI Demo form** — type any feedback text, hit "Analyze with AI", it classifies and saves to DB immediately
- **Live feedback feed** — streams the last 20 feedback entries from DB, each showing timestamp, sentiment badge, and category tags
- **Reliability Score widget** — donut chart showing a composite Operating Reliability Score (formula: `Qualitative AI Grade × 0.6 + Hours Consistency × 0.4`)
- Status: stats and feed are fully live; Reliability Score uses hardcoded constants (not yet computed from DB)

---

### Interactive Impact Map
- Renders via React-Leaflet (client-side only, no SSR)
- **Layer toggle:**
  - **Pantry Density** — pin markers for each pantry, clicking shows name, description, hours
  - **Poverty SNAP Need** — red circle overlays (currently uses pantry coordinates as proxy — Census layer not yet wired)
- Pantry data is fetched live from the DB on every page load

---

### AI Feedback Pipeline
- `POST /api/analyze-feedback` — accepts raw text, returns `{ sentiment, tags }`
- **With Gemini key:** sends text to `gemini-2.0-flash`, parses JSON response
- **Without key (fallback):** keyword matching — detects sentiment and tags from words like "wait", "fresh", "staff", "hours", etc.
- Both paths save result to the `Feedback` table in Postgres

---

### Database Schema

```
Stakeholder   — id, role (DONOR/GOV/ADMIN), name, email
Pantry        — id, name, location, latitude, longitude, hours, description
Feedback      — id, text, sentiment, tags[], createdAt
CensusData    — id, tractId, povertyIndex, population
```

### Seeded Mock Data
- **4 Pantries** — Downtown Manhattan, Brooklyn, Bronx, East Harlem (real coordinates)
- **4 Census Tracts** — BKN-001/002, BRX-001, MHT-001 with realistic poverty indices
- **6 Feedback entries** — mix of positive/negative, pre-tagged with categories

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/map-data` | Returns all pantries + census stats |
| `GET` | `/api/analyze-feedback` | Returns last 20 feedback items |
| `POST` | `/api/analyze-feedback` | Analyzes text via AI, saves to DB |

---

## What's Left / To-Do

### High priority (for the demo)
- [ ] **Wire Reliability Score to real DB data** — query Feedback table, compute average sentiment score per pantry, display live in the widget
- [ ] **Wire Donor + Gov metric cards to DB** — replace hardcoded numbers with real counts from Pantry and Feedback tables
- [ ] **Poverty layer from CensusData** — map the actual `povertyIndex` values from the DB onto the map as proper circle overlays
- [ ] **Add Gemini API key** — one line in `.env`, activates real AI for the demo

### Medium priority
- [ ] **Client persona** (food seeker view) — "Where can I get food quickly?" — simple pantry finder by borough
- [ ] **Pantry persona** (food bank manager) — "How is my pantry performing?" — shows feedback specific to their location, their reliability score
- [ ] **Real NYC Open Data** — replace mock census/SNAP data with actual NYC Open Data API calls

### Nice to have
- [ ] `.env.example` file for onboarding teammates
- [ ] Per-pantry feedback breakdown — filter feed by pantry name
- [ ] Tag frequency chart — bar chart of most common feedback categories (Wait Time, Food Quality, etc.)

---

## File Structure (key files)

```
src/
  app/
    page.tsx                          — main page, persona routing
    layout.tsx                        — wraps app in PersonaProvider
    api/
      map-data/route.ts               — GET pantries + census from DB
      analyze-feedback/route.ts       — GET/POST feedback with AI
  components/
    layout/
      PersonaWrapper.tsx              — persona context + top switcher bar
    dashboard/
      DonorDashboard.tsx              — donor view
      GovDashboard.tsx                — city planner view
      AdminDashboard.tsx              — lemontree admin view (most complete)
      ImpactMap.tsx                   — leaflet map with layer toggle
      ReliabilityScore.tsx            — donut chart widget
    ui/
      Badge.tsx / Button.tsx / Card.tsx

  lib/db/
    pool.ts                           — shared pg connection pool

prisma/
  schema.prisma                       — DB schema (4 models)
  seed.ts                             — NYC mock data seeder
```

---

## The "Winning" Feature to Highlight in the Demo

**The Reliability Score** — judges will ask "what's *new* here?" The answer is this metric. It's not data Lemontree already had. It's a synthesized insight generated by layering:
1. LLM-extracted sentiment from unstructured human feedback
2. Operational consistency data (hours)

Frame it as: *"We didn't just display Lemontree's data. We created a new signal that didn't exist before."*

---

## Squad Responsibilities Going Forward

| Squad | Focus | Key files |
|---|---|---|
| **A — Data/AI** | Wire CensusData to map poverty layer, add real NYC Open Data, activate Gemini key | `ImpactMap.tsx`, `api/map-data/route.ts`, `prisma/seed.ts` |
| **B — Dashboard** | Wire Reliability Score to DB, wire Donor/Gov metric cards to DB, build Client + Pantry persona views | `DonorDashboard.tsx`, `GovDashboard.tsx`, `ReliabilityScore.tsx`, new persona files |
| **C — Pitch/Docs** | Demo video, judge narrative, polish this doc, README | `README.md`, slide deck, video |
