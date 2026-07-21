# Portfolio — Shubham Singh Panwar

Vite + React, no backend. Deploys as a static site.

## Run locally
```
npm install
npm run dev
```

## Deploy to Vercel
1. Push this folder to a new GitHub repo (e.g. `SSPlaucode/portfolio`).
2. Go to vercel.com → **New Project** → import the repo.
3. Framework preset: **Vite** (auto-detected). Build command `npm run build`, output dir `dist` — Vercel fills these in automatically.
4. Deploy. You'll get a `*.vercel.app` URL; add a custom domain later from the project settings if you want one.

## Editing content
All page content (projects, mission log, skills) lives in plain arrays at the
top of `src/App.jsx` — edit those, no need to touch the JSX structure below.

## What's still a placeholder / worth revisiting
- The mission log and project list reflect your resume as of July 2026 — update
  as CampusMove, BAH 2026, and the ADCS simulator progress.
- No phone number is on the public site by design; add one in the Contact
  section if you want it there.
- Consider adding a resume PDF download link once you're happy with the resume
  version you want public.
