# Dhia Dahmeni: research notebook

A small, purpose-built static site for [dhia.xyz](https://dhia.xyz). It uses no framework, client JavaScript, Hugo, or Quartz.

## Work locally

Requires Node.js 22 or newer.

```sh
npm install
npm run dev
```

The development server builds the site and serves it at `http://127.0.0.1:4173`.

## Content

- Long-form writing lives in `content/Articles/`.
- Working notes live in `content/notes/`.
- Profile details and selected work live in `site.config.json`.
- The design lives in `styles/site.css`.

Standard Markdown and Obsidian-style `[[wikilinks]]` and `![[embeds]]` are supported. The build writes the complete static site to `public/`.

## Deploy

Every push to `main` runs `.github/workflows/deploy.yaml`, builds and checks the site, then publishes `public/` to GitHub Pages. Pull requests run the same build and link checks without deploying.
