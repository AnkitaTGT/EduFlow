# Edu Flow

Edu Flow is a complete, static, web-based education dashboard designed for course and student progress tracking. It is built as a fully static HTML/CSS/JS application requiring **No React**, **No Next.js**, **No Firebase** (currently simulated), and **No npm**.

## Features

- **Role-based Dashboards:** Dedicated views for Admin, Teacher, and Student.
- **Mock Data Simulation:** Generates 400 student records, 20 teachers, and 15 courses locally, storing state in `sessionStorage`.
- **High Performance:** Achieves quick initial load times with no build steps required. Virtual scrolling used for student tables capable of rendering 400 records seamlessly.
- **Responsive Design:** A custom minimal CSS design system (light and dark mode supported) ensures functionality over decoration and responsiveness across devices.
- **Interactive Analytics:** Uses Chart.js for data visualization on trends and cohorts.

## Deployment / How to Run Locally

This project consists purely of static files. You can run it by:

1. Opening `index.html` directly in your web browser.
2. Using a simple local server like VS Code Live Server or `python3 -m http.server`.

For online deployment, simply drop the `eduflow` folder into any static hosting service like GitHub Pages, Netlify, or Firebase Hosting.

### Demo Users (No real auth)
When presented with the login page, use the dropdown to select a role or input manually:
- **Admin**: `admin@eduflow.com` / `admin123`
- **Teacher**: `teacher@eduflow.com` / `teach123`
- **Student**: `student@eduflow.com` / `study123`

## File Structure

- `index.html`: Login page.
- `dashboard.html`: Redirects based on user role.
- `admin.html`, `teacher.html`, `student.html`: Main role dashboards.
- `pages/`: Additional section views (e.g., `students.html`, `analytics.html`).
- `css/`: Styling organized into `base.css`, `layout.css`, `components.css`, and `theme.css`.
- `js/`: Application logic including `mock-data.js`, `auth.js`, `router.js`, `tables.js` (virtual scrolling), `charts.js`, and `utils.js`.
- `assets/`: Inline SVG assets.

## Future Enhancements & Firebase Integration

Throughout the codebase, specific comments highlight areas intended to be swapped with Firebase endpoints.
To replace the mock data setup with Firebase:
1. Replace `window.EduFlowData` reads/assignments in `js/mock-data.js` with Firestore collection operations.
2. Update the caching logic from `sessionStorage` to use Firestore real-time listeners.
3. Replace the local simulation in `js/auth.js` with Firebase Authentication logic.

## Performance Notes

- Uses `debounce` for instant in-memory filtering.
- Implements custom virtual scrolling in `VirtualTable` (`js/tables.js`) ensuring optimal performance rendering 400 records.
- Lazy-loads component structures where applicable and dynamically populates lists.

## Version History

* **v1.0.0 (May 2026)**
  - Initial structure and CSS design system.
  - Mock data generator script (`mock-data.js`).
  - Virtual Scrolling and charting utils (`tables.js`, `charts.js`, `utils.js`).
  - Role-based routing configured directly in JS templates (`views.js`) for full `file://` protocol compatibility.
  - Complete features for Admin, Teacher, and Student roles with charts, filtering, and side-panels.
