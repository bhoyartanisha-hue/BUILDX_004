# Nagar Setu (नगर सेतु)

**Nagar Setu** is a modern, unified civic infrastructure operations and citizen complaint management platform. Built for municipal authorities, utility engineers, field inspectors, and citizens, Nagar Setu connects civic data, road health monitoring, contractor work verification, and public complaint resolution into an interactive, real-time command center.

---

## 🌟 Key Features

### 🏛️ Municipal Operations & Interactive Map
- **Live Utility & Infrastructure Map**: Track water pipelines, electricity grids, gas mains, sewage lines, and chamber covers on interactive Leaflet maps with OpenStreetMap tiles.
- **Road Health Index**: Monitor road quality scores, defect types (potholes, surface erosion, drainage issues), traffic loads, and maintenance schedules across municipal wards.
- **Contractor Work Verification**: Multi-step verification workflow for contractor completion evidence with before/after photo documentation and approval tracking.
- **Asset Expiry & Warranty Tracker**: Proactive tracking of utility warranty windows, road defect liability periods, and upcoming maintenance schedules.

### 🏙️ Citizen Portal & Complaint Resolution
- **Citizen Dashboard & File Complaint**: Simple filing flow for road defects, pipe leaks, sewage overflows, and street light outages with photo attachment support.
- **Automated Complaint Classification**: AI-powered categorization and routing of incoming citizen complaints to responsible municipal departments.
- **Real-Time Tracking & Digital Receipts**: Printable civic complaint receipts with unique tracking IDs, status updates, and resolution timestamps.
- **Global Civic Search**: Multi-category search across work orders, citizen complaints, road segments, and utility assets.

---

## 🛠️ Technology Stack & Backend Architecture

- **Frontend Core**: React 19, TypeScript, Vite
- **Routing & SSR**: TanStack Start, TanStack Router (file-based routing)
- **Styling & UI**: Tailwind CSS v4, Lucide Icons, Custom Design Tokens
- **Mapping**: Leaflet, React Leaflet, OpenStreetMap
- **Backend Stack**: Supabase Local CLI Stack (Postgres + Edge Functions via Docker)
- **AI & LLM**: Groq API (`llama-3.3-70b-versatile`) with shared client integration

---

## 🗄️ Database Schema & Local Supabase Stack

The backend runs entirely on your local machine using the Supabase CLI development stack.

### Postgres Database Tables (`supabase/migrations/`)
- `complaints`: Citizen complaint reports (category, department, severity 1-5, source, lat/lng, status, timeline, cluster_id, acknowledgment).
- `clusters`: Grouped spatial complaint clusters (centroid coordinates, occurrence_count, is_hotspot flag).
- `assets`: Municipal infrastructure assets (streetlights, wires, pipelines, chambers, install/expiry dates, GeoJSON geometry, cost).
- `road_segments`: Road health monitoring segments (GeoJSON coordinates, repair_history, health_score, last_prediction).

### ⚡ Supabase Edge Functions (`supabase/functions/`)
Each function maps directly to a PRD feature:
1. `classify-complaint` (PRD §4.1, §5): Uses Groq LLM to classify complaint text into category, department, urgency, and severity (1-5).
2. `draft-acknowledgment` (PRD §4.3): Uses shared Groq client module to generate empathetic acknowledgment messages in `en`, `hi`, or `mr`.
3. `check-duplicates` (PRD §4.2): Performs spatial 500m radius query + local TF-IDF cosine text similarity scoring to find duplicate reports.
4. `cluster-complaint` (PRD §4.4): Groups complaints into spatial clusters, updates centroids, and flags recurring hotspots (`occurrence_count >= 3`).
5. `predict-maintenance` (PRD §4.12): Analyzes road repair history & health scores with Groq LLM to generate plain-language maintenance recommendations.
6. `compute-health-score` (PRD §4.11, §13): Deterministic road health score formula (`100 - (activeComplaints * 8 + criticalComplaints * 15)`).
7. `update-verification` (PRD §4.13): Advances complaint from Pending Verification → Verified and appends verification entry to complaint timeline.

---

## 🚀 Getting Started & Local Backend Setup

### Prerequisites

Ensure you have Node.js (v18+), npm, Docker Desktop (for local Supabase CLI), and Supabase CLI installed.

### 1. Installation & Environment

Clone the repository and install dependencies:
```bash
git clone <repository-url>
cd nagar-setu
npm install
```

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Set your `GROQ_API_KEY` in `.env`:
```env
GROQ_API_KEY=your_groq_api_key_here
```

### 2. Starting Local Supabase Stack & Migrations

Start the local Supabase services (Postgres, Studio, Storage, Edge Runtime):
```bash
npx supabase start
```

Run migrations and seed the local Postgres database with Nagpur demo data:
```bash
npx supabase db reset
```

Serve the local Supabase Edge Functions:
```bash
npx supabase functions serve
```

### 3. Starting Local Frontend Server

Start the local dev server:
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

---

## 📜 Available Scripts

- `npm run dev`: Starts the Vite development server with TanStack Start SSR support.
- `npm run build`: Builds the production bundle.
- `npm run preview`: Previews the built production application locally.
- `npm run lint`: Runs ESLint checks across the codebase.
- `npm run format`: Formats code files using Prettier.

---

## 📁 Project Structure

```
nagar-setu/
├── public/                 # Static assets (favicons, robots.txt)
├── src/
│   ├── components/         # Reusable UI components (Radix UI, buttons, inputs)
│   ├── features/
│   │   └── anvaya/         # Main Nagar Setu application modules & screens
│   │       ├── screens/    # Map, Roads, WorkList, Verification, Citizen screens
│   │       ├── App.tsx     # Application shell & navigation layout
│   │       ├── data.ts     # Seed data for roads, complaints & work orders
│   │       ├── store.tsx   # React state management store
│   │       └── types.ts    # Type definitions for civic domain model
│   ├── routes/             # TanStack Start file-based routes (__root.tsx, index.tsx)
│   └── server.ts           # Server entry point
├── supabase/
│   ├── config.toml         # Supabase local development configuration
│   ├── seed.sql            # Seed dataset for Nagpur ward utility features & complaints
│   ├── migrations/         # Postgres schema migrations (complaints, clusters, assets, roads)
│   └── functions/          # Deno Edge Functions
│       ├── _shared/        # Shared Groq API client & CORS headers
│       ├── classify-complaint/
│       ├── draft-acknowledgment/
│       ├── check-duplicates/
│       ├── cluster-complaint/
│       ├── predict-maintenance/
│       ├── compute-health-score/
│       └── update-verification/
├── .env.example            # Environment variable template
├── package.json            # Project dependencies and scripts
└── vite.config.ts          # Vite & TanStack Start build configuration
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
