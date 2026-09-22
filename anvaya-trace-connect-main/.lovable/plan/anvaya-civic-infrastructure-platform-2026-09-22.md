# ANVAYA Civic Infrastructure Platform

## Goal
Build a complete, responsive frontend demo for Nagpur that carries the full citizen-to-official narrative. Use realistic seeded infrastructure, complaint, cluster, asset, and road data now; keep Firebase and Groq behind clearly documented service boundaries for later activation.

## Experience
- Create a persistent ANVAYA header with English, Hindi, and Marathi switching, language persistence, and a clearly labeled demo-role selector.
- Build separate pages for Home, File Complaint, Track Complaint, Public Infrastructure, Official Dashboard, Road Segment Detail, and Asset Registry.
- Preserve in-progress complaint form values when the language changes.
- Support keyboard focus, readable contrast, mobile layouts, and reduced-motion preferences.

## Visual system
- Implement the specified blueprint/tracing-paper palette and IBM Plex Sans, IBM Plex Sans Devanagari, and IBM Plex Mono.
- Use the trace line as the shared visual lineage from complaint to cluster, hotspot, road segment, and resolution.
- Keep surfaces flat and disciplined; avoid generic dashboard card grids, decorative gradients, and repeated entrance effects.
- Add the single homepage line-drawing entrance, action-triggered timeline/form/map motion, and subtle pipeline flow.

## Functional demo flow
- File a complaint with text, optional photo preview, browser geolocation, category, language, and source.
- Run local TF-IDF/cosine duplicate detection against seeded complaints, then generate deterministic seeded classification and multilingual acknowledgment through the Groq service boundary.
- Reveal a tracking receipt and allow the tracking ID to open a live-feeling status timeline with expandable stages and citizen confirmation.
- Provide official severity sorting, zone/department filtering, grouped hotspots, source and contractor verification status.
- Render interactive Leaflet/OpenStreetMap views with seeded utility GeoJSON, complaint clusters, and clickable road segments.
- Show road health, repair history, seeded maintenance prediction, expenditure totals, and an overdue asset registry.

## Technical structure
- Add reusable components, contexts, hooks, i18n dictionaries, services, and typed seed datasets.
- Keep Firebase collection contracts for `complaints`, `clusters`, `assets`, and `roadSegments` in one service module, while frontend-first mode uses the same typed seed shape.
- Keep classification, acknowledgment, and maintenance prediction in one Groq service module so live calls can replace seeded responses without changing screens.
- Add route-specific metadata, an ANVAYA wordmark/favicon treatment, package naming, and README setup/seed guidance.
- Verify the central report → duplicate check → tracking receipt → timeline flow and map-to-road-detail flow on desktop and mobile.

## Deferred activation
- Live Firebase credentials and the Groq credential are not configured in this phase. The app will visibly identify seeded/demo data and will not claim live persistence or live AI generation.
