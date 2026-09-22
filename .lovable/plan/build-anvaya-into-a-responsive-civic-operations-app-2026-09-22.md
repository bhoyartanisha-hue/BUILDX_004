# Build ANVAYA into a responsive civic operations app

## Outcome
Turn the uploaded prototype into the working `/` experience, preserve its dark civic-control-room visual language, rename the product to **Anvaya**, and complete both official and citizen workflows without adding a backend.

## Implementation

### 1. Foundation and shared state
- Port the uploaded React prototype into the existing TanStack Start app rather than replacing the project framework.
- Define the ANVAYA color, spacing, typography, focus, motion, and responsive tokens centrally in the Tailwind v4 design system.
- Add a shared in-memory app store for complaints, work orders, notification read state, profile fields, evidence images, and role selection so counts and statuses react immediately across screens.
- Add reusable controls for buttons, filters, empty states, status badges, image capture/upload, and mobile list-to-detail navigation.
- Add date utilities for computed relative timestamps and dynamic expiry/status values.

### 2. Real Nagpur map
- Install Leaflet and React Leaflet, load the map client-side for SSR safety, and use OpenStreetMap tiles with attribution.
- Convert all map records and road records to realistic Nagpur latitude/longitude coordinates and polyline geometry.
- Render utilities, roads, repairs, households, chambers, and work sites as color-coded Leaflet layers.
- Preserve layer toggles, legend, marker selection, and contextual details; replace custom pan/zoom math with Leaflet controls.
- On mobile, keep the map full-screen, collapse layers into a floating action button, and show selected details as a bottom sheet.

### 3. Official workflows
- **Roads:** searchable/sortable road list, dynamic repair counts and road-health score, recurring/hotspot flags, mobile list → detail flow, and lat/lng-backed records.
- **Work list:** working severity/status/type/area filters, sort control, dynamic counts, expandable details, and mobile list → detail behavior.
- **Verification:** mutable workflow state, real approve/reject actions, required rejection reason, reusable before/after photo upload with camera capture, drag/drop, previews, remove/replace, and single-column mobile stepper/info/evidence layouts.
- **Expiry:** live computed status/counts, working search/status/type/ward filters and sorting, with responsive rows.
- **Search:** unified dynamic search across roads, utilities, chambers, households, contractors, repairs, work orders, assets, and complaints; clicking a result opens the relevant screen; complete no-match state.
- **Notifications:** computed timestamps, recent/earlier grouping, per-item and mark-all read behavior synchronized with the top-bar count.
- **Profile/settings:** editable name, role, zone/ward, email and phone; initials-based avatar; role-relevant complaint/work-order history; working language and notification controls.

### 4. Citizen workflows
- Add task navigation and screens for a public dashboard, complaint filing, complaint tracking, and filing receipt.
- Complaint filing will validate fields, run the existing-style local AI mock classification/priority suggestion, accept issue photography through the reusable camera/drag-drop control, create a tracked complaint, and update dashboard/history/search counts.
- Model complaints around clustered reports and linked road segments, compute hotspot flags and road-health scores from current data.
- After submission, show a dark receipt with tracking ID, exact timestamp, category/department, QR-style visual, and working print/download action.
- Complaint tracker will search real in-memory submissions and show their current timeline/status.

### 5. Responsive shell, motion, and accessibility
- Desktop keeps task navigation and split views; below roughly 900px, use a compact top bar, bottom task navigation, stacked list/detail screens, and map bottom sheets.
- Below roughly 640px, reflow verification labels, work-order fields, uploads, profile forms, and list metadata to one column.
- Replace ad hoc inline hover handlers with consistent 150–300ms hover, press, focus, screen-transition, and stagger animation classes; respect reduced-motion settings.
- Use semantic `header`, `nav`, `main`, `section`, headings, forms, labels, and buttons; add accessible names to icon controls and meaningful alt text to all previews.

### 6. Brand, metadata, and audit
- Replace every CivicMap/localized legacy brand occurrence in the full source tree with Anvaya naming.
- Add app-specific route title, description, Open Graph, and Twitter metadata plus an ANVAYA favicon.
- Remove generic placeholder copy and normalize layout spacing to a 4/8px rhythm using responsive `clamp()` values.
- Verify desktop and mobile layouts with browser screenshots, then click through every navigation item, map control, list/filter/sort, form, upload, approval/rejection action, notification action, profile control, complaint flow, tracker, receipt, and public dashboard.

## Technical notes
- The app remains frontend-only: uploads use object URLs/base64 and state resets on reload.
- Leaflet is loaded only after hydration to avoid server-rendering failures.
- OpenStreetMap tiles require network access and retain required attribution.
- The uploaded archive does not include the prior citizen screens, `src/lib/ai.ts`, or Cluster/RoadSegment models, so these will be reconstructed from the requirements rather than copied.
