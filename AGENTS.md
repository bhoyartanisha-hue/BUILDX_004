# Nagar Setu — Agent Guidelines

## Repository Overview
Nagar Setu is a standalone civic infrastructure & operations platform for municipal utility tracking, road health monitoring, work order verification, asset expiry management, and citizen complaint tracking.

## Technical Architecture
- **Framework**: React 19, TypeScript, TanStack Start & TanStack Router (file-based routing under `src/routes/`).
- **Styling**: Tailwind CSS v4, Lucide React icons.
- **Maps**: Leaflet & React Leaflet with OpenStreetMap tiles.
- **State & Storage**: React context store with local persistence.

## Guidelines
- Avoid rewriting published git history. Keep commits clean and working.
- Ensure all components maintain dark mode styling using design system tokens.
