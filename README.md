# Backend Developer Portfolio — React + Vite + Tailwind

A single-page backend developer portfolio with dark/light mode, a rotating 3D
hero shape (Three.js), an animated circular avatar, tilt cards, and a working
contact form.

## Run it

```bash
npm install
npm run dev      # start dev server (http://localhost:5173)
npm run build    # production build into /dist
npm run preview  # preview the production build
```

Requires Node.js 18+.

## Make it yours

- **Name / brand:** `src/components/Nav.jsx`, `About.jsx`, `Footer.jsx` — replace `Your_Name` / `[Your Name]`.
- **Your photo:** drop an image into a `public/` folder (create it next to `index.html`) named e.g. `me.jpg`, then set `src="/me.jpg"` in `src/components/About.jsx`. The silhouette shows until a valid image loads.
- **Experience / Skills / Projects:** edit the data arrays at the top of `Experience.jsx`, `Skills.jsx`, and `Work.jsx`. Replace bracketed metrics like `[X] requests/day` with real numbers.
- **Email + contact form:** in `src/components/Contact.jsx` set `EMAIL`. For inbox delivery, create a free form at https://formspree.io and replace `YOUR_FORM_ID` in `FORMSPREE_ACTION`. Without it, the form opens the visitor's email app instead.
- **Colors:** the crimson accent lives in CSS variables in `src/index.css` (`:root` = light, `.dark` = dark). Change `--accent` / `--accent-2`.

## Deploy

`npm run build`, then deploy the `dist/` folder to Netlify, Vercel, or GitHub Pages.
On Vercel/Netlify you can also just connect the repo and it builds automatically.
