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

- Local dev: install deps with npm and run `npm run dev`
- Production build: `npm run build`

## Docker

- Build + run via Docker Compose (Nginx serves the built `dist/`)

## AWS EC2 (quick notes)

- Open ports: 80 (and 443 if needed)
- Install Docker on the server
- Build and run the container with Docker Compose
