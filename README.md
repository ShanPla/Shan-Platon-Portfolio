# Developer Portfolio

A single-page developer portfolio built with React, Vite, and Tailwind CSS.
Features a status-dashboard visual style, section-based layout (About,
Skills, Projects, Contact), and a content file separated from the UI code
for easy editing.

## Tech stack

- [React](https://react.dev) — UI library
- [Vite](https://vitejs.dev) — build tool and dev server
- [Tailwind CSS](https://tailwindcss.com) — utility-first styling

## Project structure

```
├── index.html              # HTML entry point, fonts, meta tags
├── package.json
├── vite.config.js
├── tailwind.config.js      # Design tokens (colors, fonts)
├── postcss.config.js
├── src/
│   ├── main.jsx             # React entry point
│   ├── App.jsx               # Composes all page sections
│   ├── index.css             # Tailwind directives + base styles
│   ├── data/
│   │   └── content.js        # All editable content lives here
│   └── components/
│       ├── Nav.jsx
│       ├── Hero.jsx
│       ├── About.jsx
│       ├── Skills.jsx
│       ├── Projects.jsx
│       └── Contact.jsx
└── public/                   # Static assets (images, resume, etc.)
```

## Getting started

Requires [Node.js](https://nodejs.org) 18+.

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## Editing content

Site text — name, bio, skills, project descriptions, contact info — lives
in `src/data/content.js`. Component files under `src/components/` handle
layout and styling only, so most updates don't require touching them.

## Building for production

```bash
npm run build
```

Outputs a static site to the `dist/` folder.

## Deployment

The `dist/` folder is a static site and can be deployed to any static host:

```bash
npm install -g vercel
vercel
```

Or drag the `dist/` folder into [Vercel](https://vercel.com/new) or
[Netlify Drop](https://app.netlify.com/drop).

## Adding a profile photo

1. Add a photo to `public/` (e.g. `public/profile.jpg`). Square images work best.
2. In `src/data/content.js`, set `profile.image` to the path, e.g. `"/profile.jpg"`.
3. If left as `null`, the hero shows initials in a circle instead.

## Adding project screenshots

1. Add image files to `public/projects/` (e.g. `public/projects/lipaaction.png`).
2. In `src/data/content.js`, set the `image` field on the relevant project entry,
   e.g. `"/projects/lipaaction.png"`.
3. If left as `null`, that project card falls back to the status-badge design
   with no screenshot.

## Adding a downloadable resume

1. Add a resume file to `public/` (e.g. `public/resume.pdf`).
2. Add a link in `src/components/Contact.jsx` or `Hero.jsx`:
   `<a href="/resume.pdf" download>Download Resume</a>`

## License

This project is available for personal use and modification.