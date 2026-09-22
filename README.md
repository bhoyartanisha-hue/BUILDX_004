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

## 🛠️ Technology Stack

- **Frontend Core**: React 19, TypeScript, Vite
- **Routing & SSR**: TanStack Start, TanStack Router (file-based routing)
- **Styling & UI**: Tailwind CSS v4, Lucide Icons, Custom Design Tokens
- **Mapping**: Leaflet, React Leaflet, OpenStreetMap
- **Data & AI**: Supabase (Database & Auth Client), Groq API (AI Complaint Classification)
- **State & Form Management**: React Context, React Hook Form, Zod

---

## 🚀 Getting Started

### Prerequisites

Ensure you have Node.js (v18+) and npm installed on your machine.

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd nagar-setu
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Fill in your Supabase credentials and Groq API key if available (the application will run with local fallback data if not configured):
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GROQ_API_KEY=your_groq_api_key
   ```

4. **Start the local development server**:
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
│   ├── server.ts           # Server entry point
│   └── styles.css          # Global CSS & Tailwind configuration
├── .env.example            # Environment variable template
├── package.json            # Project dependencies and scripts
└── vite.config.ts          # Vite & TanStack Start build configuration
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
