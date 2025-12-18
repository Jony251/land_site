# Blue Cat Website (React + Vite)

This folder contains the frontend website.

## Run locally

From this directory:

```bash
npm install
npm run dev
```

Then open:

```text
http://localhost:5173/
```

## Contact form (EmailJS)

The Contact page uses EmailJS. Create a `.env` file in this folder (`land_site/.env`) and add:

```bash
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

After editing `.env`, restart the dev server.

## Build

```bash
npm run build
npm run preview
```
