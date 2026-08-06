# Shan Christian Platon — Portfolio

A single-page developer portfolio built with React, Vite, and Tailwind CSS.

## Project structure

```
shan-platon-portfolio/
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
│   │   └── content.js        # ALL editable content lives here
│   └── components/
│       ├── Nav.jsx
│       ├── Hero.jsx
│       ├── About.jsx
│       ├── Skills.jsx
│       ├── Projects.jsx
│       ├── Experience.jsx
│       └── Contact.jsx
└── public/                   # Static assets (add images/resume PDF here)
```

## Editing content

Almost everything you'd want to change — name, bio, skills, projects,
experience, seminars, contact info — lives in **`src/data/content.js`**.
You shouldn't need to touch the component files for text changes.

## Running locally

Requires [Node.js](https://nodejs.org) 18+.

```bash
npm install
npm run dev
```

Then open the URL shown in the terminal (usually `http://localhost:5173`).

## Building for production

```bash
npm run build
```

This outputs a static site to the `dist/` folder.

## Deploying

The `dist/` folder is a static site and can be deployed anywhere. Since you
already use Vercel for other projects:

```bash
npm install -g vercel
vercel
```

Or just drag the `dist/` folder into [vercel.com/new](https://vercel.com/new)
or [Netlify Drop](https://app.netlify.com/drop).

## Adding real project screenshots

Currently the project cards use a status-badge design instead of screenshots
(since none were provided). To add real screenshots:

1. Drop images into `public/` (e.g. `public/projects/lipaaction.png`).
2. In `src/components/Projects.jsx`, add an `<img>` above the card content
   pointing to `/projects/lipaaction.png`.

## Adding your resume as a download

1. Drop your resume PDF/DOCX into `public/` (e.g. `public/resume.pdf`).
2. Add a link in `src/components/Contact.jsx` or `Hero.jsx`:
   `<a href="/resume.pdf" download>Download Resume</a>`
