# Land Site

Landing page (SPA) built with React + Vite.

## Used stack

- **Frontend**: React, Vite
- **Routing**: react-router-dom
- **i18n**: EN / RU / HE (RTL)
- **Contact form**: EmailJS
- **Container**: Docker (Nginx serves `dist/`)

## Environment

- **WhatsApp link (optional)**: `VITE_WHATSAPP_URL`
- **Contact email (optional)**: `VITE_CONTACT_EMAIL`
- **EmailJS**: `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY`

## Run

- The app source lives in `land_site/`.
- Local dev:
  - `npm ci`
  - `npm run dev`
- Preview production build locally:
  - `npm run build`
  - `npm run preview`

## Docker

- Build + run via Docker Compose (Nginx serves the built `dist/`)
- Set env vars (optional) in your shell or in an `.env` file in `land_site/`.
- Run:
  - `docker compose up --build`
- App will be available on:
  - `http://localhost:8080`

## AWS EC2 (quick notes)

- Open ports: 80 (and 443 if needed)
- Install Docker on the server
- Build and run the container with Docker Compose
