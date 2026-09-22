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

## Production deploy (bluecat.cc)

The site is live on the same Lightsail instance as `coinset-api`
(`ec2-user@18.197.102.183`). Because that instance only has 419MB RAM, the
site is **not** run as a Docker container there — Docker is used for local
builds/testing only. In production, nginx serves the static `dist/` build
directly from `/var/www/bluecat.cc` (config: `/etc/nginx/conf.d/bluecat.conf`
on the server), reusing the existing Cloudflare Origin certificate that
already covers `*.bluecat.cc`.

`.github/workflows/deploy.yml` builds the site and rsyncs `land_site/dist/`
to `/var/www/bluecat.cc/` on every push to `main` that touches `land_site/`.
Required GitHub Actions repository secrets:

- `DEPLOY_HOST` — `18.197.102.183`
- `DEPLOY_USER` — `ec2-user`
- `DEPLOY_SSH_KEY` — private key with access to the instance (PEM contents)
- `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY`,
  `VITE_WHATSAPP_URL`, `VITE_CONTACT_EMAIL` — same values as local `.env`
