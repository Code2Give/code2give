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
| Charts | Recharts |
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

## What's Built (Current V2 — Figma Design Integrated)

The UI has been fully rebuilt to match the team's Figma design. The old persona-based dashboards have been replaced with a unified multi-page app shell.

### App Layout

A persistent sidebar + top nav wraps all pages.

- **Sidebar** — 7 nav items, highlights active page
- **Role switcher** — top-right dropdown, 4 roles, switches context instantly (no login required)

| Role | Who it's for |
|---|---|
| Lemontree Team | Lemontree ops/admin |
| Government Agency | City planners identifying food deserts |
| Donor / Foundation | Donors tracking ROI and impact |
| Food Provider | Pantry/food bank managers |

---

### Pages

#### Overview
- **4 KPI cards** — Feedback Processed, Active Pantries, Positive Sentiment %, Needs Attention count — all pulled live from DB
- **Active Pantry list** — live from DB, with hours and status badges
- **Recent Feedback feed** — last 6 entries from DB with sentiment badges
- **Wait Time & Report Trends** — Recharts line chart (mock trend data)

#### Food Resource Map
- Interactive Leaflet map with pantry markers (live from DB)
- Clicking a marker shows pantry name, hours, and description
- Resource list below the map with status chips

#### Community Reports
- Live feedback feed from DB with search + filter (by category)
- AI feedback submission form — type text, hit "Analyze", classifies and saves to DB instantly
- Each card shows sentiment badge, category tags, timestamp

#### Trends & Analytics
- **4 insight summary cards** — Report Volume, Avg Wait Time, Peak Day, Food Availability
- **Wait Time & Report Volume line chart** — dual-axis Recharts chart
- **Demand by Borough bar chart** — weekly report counts per borough
- **Food Availability trends line chart** — produce/meat/staples over 4 weeks

#### Service Issues
- **3 summary cards** — Active Issues, Monitoring, Resolved This Week
- Issue cards grouped by status (active / monitoring / resolved) with severity badges
- Negative community feedback section — live from DB, AI-classified as negative/critical

#### Food Availability
- Placeholder page (real-time inventory tracking marked as coming soon)

#### Settings
- Current role info, notification toggles, data/privacy statement, system info

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
- [ ] **Wire KPI cards to real DB computations** — Feedback Processed, Positive Sentiment % should be calculated server-side from the Feedback table
- [ ] **Poverty / Census layer on the map** — map the actual `povertyIndex` values from CensusData onto the map as circle overlays
- [ ] **Role-aware page content** — currently the role switcher changes the label but not the page data; Donor/Gov/Provider views should show different KPIs and filtered data
- [ ] **Add Gemini API key** — one line in `.env`, activates real AI for the demo

### Medium priority
- [ ] **Real NYC Open Data** — replace mock trend/demand data with actual NYC Open Data API calls
- [ ] **Food Availability page** — wire real pantry inventory data (if Lemontree has it)
- [ ] **Per-pantry breakdown** — filter Community Reports by pantry name
- [ ] **Reliability Score widget** — bring back the donut chart showing a composite Operating Reliability Score per pantry

### Nice to have
- [ ] `.env.example` file for onboarding teammates
- [ ] Tag frequency bar chart — most common feedback categories
- [ ] Export reports as CSV/PDF

---

## File Structure (key files)

```
src/
  app/
    page.tsx                          — app entry, renders AppLayout + page switcher
    layout.tsx                        — root HTML shell (no provider needed)
    api/
      map-data/route.ts               — GET pantries + census from DB
      analyze-feedback/route.ts       — GET/POST feedback with AI
  components/
    layout/
      AppLayout.tsx                   — sidebar, top nav, role/page context
    dashboard/
      KPICard.tsx                     — reusable metric card component
      ImpactMap.tsx                   — leaflet map (legacy, kept for reference)
      ReliabilityScore.tsx            — donut chart widget (legacy)
    pages/
      OverviewPage.tsx                — KPIs + pantry list + feedback feed + chart
      FoodResourceMapPage.tsx         — Leaflet map wired to DB
      CommunityReportsPage.tsx        — live feedback + AI submit form
      TrendsPage.tsx                  — Recharts analytics charts
      ServiceIssuesPage.tsx           — service disruptions + negative feedback
      SettingsPage.tsx                — role info + settings UI
    ui/
      Badge.tsx / Button.tsx / Card.tsx

  lib/db/
    pool.ts                           — shared pg connection pool

prisma/
  schema.prisma                       — DB schema (4 models)
  seed.ts                             — NYC mock data seeder

design_temp/                          — teammate's Figma Make export (reference only)
```

---

## The "Winning" Feature to Highlight in the Demo

**The AI-powered Feedback Intelligence pipeline.** Judges will ask "what's *new* here?" The answer is the combination of:
1. Unstructured community feedback → structured sentiment + category signals via Gemini AI
2. Real pantry location data overlaid on a live map
3. Role-specific dashboards that show the same data through different lenses (Lemontree ops vs. city planner vs. donor)

Frame it as: *"We didn't just display Lemontree's data. We created new signals from qualitative human feedback that didn't exist before — and we made them actionable for four different audiences in one unified dashboard."*

---

## Squad Responsibilities Going Forward

| Squad | Focus | Key files |
|---|---|---|
| **A — Data/AI** | Wire CensusData to map poverty layer, add real NYC Open Data, activate Gemini key, compute DB-driven KPIs | `api/map-data/route.ts`, `OverviewPage.tsx`, `prisma/seed.ts` |
| **B — Dashboard** | Role-aware page content, Reliability Score widget, Food Availability page | `AppLayout.tsx`, `OverviewPage.tsx`, `SettingsPage.tsx` |
| **C — Pitch/Docs** | Demo video, judge narrative, polish this doc, README | `README.md`, slide deck, video |
