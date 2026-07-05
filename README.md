# Prism Dashboard

## Overview
A modern React dashboard built with Vite showcasing product listings, detailed product views, role‑based visibility, column configuration, and live polling. The UI follows a premium design aesthetic with smooth animations, dark‑mode‑compatible colors, and Google‑font typography.

## Features
- **Authentication** – Simple mock auth with two demo users (admin & user).
- **Role‑Based Product Visibility** – Admins see all products; regular users cannot view products flagged as hidden.
- **Product List** – Grid and table view, searchable, sortable, paginated, and filterable by category.
- **Product Detail** – Image carousel, rich product metadata, and hidden‑product guard.
- **Column Settings** – Persisted column visibility and order for the table view.
- **Live Polling** – Background refresh of product data every few seconds.
- **Responsive Design** – Works on desktop and mobile with a glass‑morphism feel.

## Demo Credentials
| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| User  | `user`  | `user123` |

## Setup
```bash
# Clone the repository (if not already)
git clone <repo-url>
cd prism-dashboard

# Install dependencies
npm install

# Start the development server
npm run dev
```
The app will be available at `http://localhost:5173/`.

## Build for Production
```bash
npm run build
# Then serve the `dist` folder with any static server
```

## License
MIT



# changes to make
- move product filter to the side
- put some background image behind the whole page
- create a home route(landing page), show product cards with explicit design
- set the theme of the website in a perticular colour(including the buttons and product cards)
- change the font of the page
- Particular logo
- better brand name
