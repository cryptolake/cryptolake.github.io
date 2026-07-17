import { execFileSync } from "node:child_process"
import {
  cp,
  mkdir,
  readFile,
  readdir,
  rm,
  stat,
  writeFile,
} from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

import { toHtml } from "hast-util-to-html"
import rehypeKatex from "rehype-katex"
import rehypeRaw from "rehype-raw"
import rehypeSlug from "rehype-slug"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import { unified } from "unified"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const contentDir = path.join(root, "content")
const publicDir = path.join(root, "public")
const config = JSON.parse(await readFile(path.join(root, "site.config.json"), "utf8"))

const encodePath = (value) =>
  value
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/")

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")

const slugify = (value) =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’‘]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase()

const titleCase = (value) =>
  value
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue
    const absolute = path.join(directory, entry.name)
    const relative = path.relative(contentDir, absolute)
    if (relative.startsWith("templates") || relative.startsWith("private")) continue
    if (entry.isDirectory()) files.push(...(await walk(absolute)))
    else files.push(absolute)
  }

  return files
}

function routeFor(relativePath) {
  const normalized = relativePath.replaceAll(path.sep, "/").replace(/\.md$/i, "")
  if (normalized.toLowerCase() === "index") return "/"

  const parts = normalized.split("/")
  if (parts[0].toLowerCase() === "articles") {
    return `/writing/${slugify(parts.at(-1))}/`
  }

  if (parts[0].toLowerCase() === "notes") {
    return `/notes/${parts.slice(1).map(slugify).join("/")}/`
  }

  return `/${parts.map(slugify).join("/")}/`
}

function outputPath(route) {
  if (route === "/") return path.join(publicDir, "index.html")
  return path.join(publicDir, route.slice(1), "index.html")
}

function topicFor(relativePath) {
  if (relativePath.startsWith("notes/Mathematics")) return "Mathematics"
  if (relativePath.startsWith("notes/")) return "Machine learning"

  const name = path.basename(relativePath).toLowerCase()
  const systemsTerms = ["c ", "shell", "libraries", "links"]
  return systemsTerms.some((term) => name.includes(term))
    ? "Systems"
    : "Machine learning"
}

function normalizeKey(value) {
  return value
    .replaceAll("\\", "/")
    .replace(/^\.\//, "")
    .replace(/\.md$/i, "")
    .toLowerCase()
}

function extractTitle(markdown, fallback) {
  const match = markdown.match(/^#\s+(.+)$/m)
  return match?.[1]?.trim() || titleCase(fallback)
}

function parseDocument(source) {
  if (!source.startsWith("---\n")) return { data: {}, content: source }
  const closing = source.indexOf("\n---\n", 4)
  if (closing === -1) return { data: {}, content: source }

  const data = {}
  for (const line of source.slice(4, closing).split("\n")) {
    const match = line.match(/^([a-zA-Z][\w-]*):\s*(.*)$/)
    if (!match) continue
    data[match[1]] = match[2].trim().replace(/^(["'])(.*)\1$/, "$2")
  }

  return { data, content: source.slice(closing + 5) }
}

function prepareBody(markdown) {
  const lines = markdown.split("\n")
  let removedTitle = false
  let inFence = false

  return lines
    .filter((line) => {
      if (/^\s*(```|~~~)/.test(line)) inFence = !inFence
      if (!inFence && !removedTitle && /^#\s+/.test(line)) {
        removedTitle = true
        return false
      }
      return true
    })
    .map((line) => (!inFence && /^#\s+/.test(line) ? `#${line}` : line))
    .join("\n")
}

function fallbackDescription(markdown) {
  const clean = markdown
    .replace(/^---[\s\S]*?---/m, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/!\[\[[^\]]+\]\]/g, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+.*$/gm, "")
    .replace(/^[-*>]\s+/gm, "")
    .replace(/[*_`$]/g, "")
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.replace(/\s+/g, " ").trim())
    .find((paragraph) => paragraph.length > 70)

  if (!clean) return "Study note by Dhia Dahmeni."
  const clipped = clean.length > 180 ? `${clean.slice(0, 177).trim()}…` : clean
  return clipped
}

function readingTime(markdown) {
  const words = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length
  return Math.max(1, Math.ceil(words / 220))
}

const allFiles = await walk(contentDir)
const markdownFiles = allFiles.filter((file) => file.endsWith(".md"))
const assetFiles = allFiles.filter((file) => !file.endsWith(".md"))
const pages = []

for (const absolutePath of markdownFiles) {
  const relativePath = path.relative(contentDir, absolutePath).replaceAll(path.sep, "/")
  if (relativePath === "index.md") continue
  const source = await readFile(absolutePath, "utf8")
  const parsed = parseDocument(source)
  const filename = path.basename(relativePath)
  const title = parsed.data.title || extractTitle(parsed.content, path.basename(filename, ".md"))
  const description =
    parsed.data.description || config.descriptions[filename] || fallbackDescription(parsed.content)

  pages.push({
    absolutePath,
    relativePath,
    filename,
    source: parsed.content,
    title,
    description,
    route: routeFor(relativePath),
    topic: topicFor(relativePath),
    kind: relativePath.startsWith("Articles/") ? "Essay" : "Note",
    minutes: readingTime(parsed.content),
  })
}

const pageLookup = new Map()
for (const page of pages) {
  const withoutExtension = page.relativePath.replace(/\.md$/i, "")
  const basename = path.basename(withoutExtension)
  const variants = [
    withoutExtension,
    withoutExtension.replace(/^notes\//i, ""),
    withoutExtension.replace(/^Articles\//i, ""),
    basename,
  ]
  for (const variant of variants) pageLookup.set(normalizeKey(variant), page)
}

const assetLookup = new Map()
for (const absolutePath of assetFiles) {
  const relativePath = path.relative(contentDir, absolutePath).replaceAll(path.sep, "/")
  const variants = [relativePath, relativePath.replace(/^notes\//i, ""), path.basename(relativePath)]
  for (const variant of variants) assetLookup.set(normalizeKey(variant), relativePath)
}

function resolvePage(target, currentPage) {
  const cleanTarget = target.split("#")[0].replace(/\.md$/i, "")
  const currentDirectory = path.posix.dirname(currentPage.relativePath)
  const candidates = [
    cleanTarget,
    path.posix.join(currentDirectory, cleanTarget),
    `notes/${cleanTarget}`,
    `Articles/${cleanTarget}`,
  ]

  for (const candidate of candidates) {
    const match = pageLookup.get(normalizeKey(candidate))
    if (match?.source.trim()) return match
  }
}

function resolveAsset(target, currentPage) {
  const currentDirectory = path.posix.dirname(currentPage.relativePath)
  const candidates = [
    target,
    path.posix.join(currentDirectory, target),
    `notes/${target}`,
  ]

  for (const candidate of candidates) {
    const match = assetLookup.get(normalizeKey(candidate))
    if (match) return `/${encodePath(match)}`
  }
}

function replaceWikiLinks(markdown, page) {
  const withImages = markdown.replace(/!\[\[([^\]]+)\]\]/g, (_, rawTarget) => {
    const [target, alias] = rawTarget.split("|")
    const url = resolveAsset(target.trim(), page)
    if (!url) return `*Missing research figure: ${escapeHtml(alias || path.basename(target))}*`
    const rawAlt = alias || path.basename(target, path.extname(target))
    const alt = rawAlt.startsWith("Pasted image") ? "Research figure" : rawAlt
    return `![${alt}](${url})`
  })

  return withImages.replace(/\[\[([^\]]+)\]\]/g, (_, rawTarget) => {
    const [targetWithAnchor, alias] = rawTarget.split("|")
    const [target, anchor] = targetWithAnchor.split("#")

    const assetUrl = resolveAsset(target.trim(), page)
    if (assetUrl) return `[${alias || path.basename(target)}](${assetUrl})`

    const linkedPage = resolvePage(target.trim(), page)
    const label = alias || linkedPage?.title || target
    if (!linkedPage) return label
    const hash = anchor ? `#${slugify(anchor)}` : ""
    return `[${label}](${linkedPage.route}${hash})`
  })
}

function decorateTree(node) {
  if (!node || typeof node !== "object") return

  if (node.type === "element") {
    node.properties ||= {}
    if (node.tagName === "a" && /^https?:\/\//.test(node.properties.href || "")) {
      node.properties.target = "_blank"
      node.properties.rel = ["noreferrer"]
    }
    if (node.tagName === "img") {
      node.properties.loading = "lazy"
      node.properties.decoding = "async"
    }
  }

  for (const child of node.children || []) decorateTree(child)
}

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkMath)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeSlug)
  .use(rehypeKatex)

async function markdownToHtml(markdown) {
  const tree = await processor.run(processor.parse(markdown))
  decorateTree(tree)
  return toHtml(tree, { allowDangerousHtml: true })
}

function nav(active) {
  const items = [
    ["home", "/", "Index"],
    ["projects", "/projects/", "Projects"],
    ["writing", "/writing/", "Log"],
    ["notes", "/notes/", "Notes"],
  ]

  return `<header class="site-header">
    <a class="identity" href="/" aria-label="Dhia Dahmeni, home">
      <span class="identity-mark" aria-hidden="true">D/01</span>
      <span>Dhia Dahmeni</span>
    </a>
    <nav aria-label="Primary navigation">
      ${items
        .map(
          ([key, href, label]) =>
            `<a href="${href}"${active === key ? ' aria-current="page"' : ""}>${label}</a>`,
        )
        .join("")}
    </nav>
  </header>`
}

function layout({ title, description, content, active = "", pageClass = "", route = "" }) {
  const fullTitle = title === config.name ? title : `${title} | ${config.name}`
  const canonical = route ? `${config.url}${route}` : ""

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(fullTitle)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <meta name="author" content="${escapeHtml(config.name)}">
    <meta name="theme-color" content="#f4f2ea">
    ${canonical ? `<link rel="canonical" href="${canonical}">` : ""}
    <meta property="og:type" content="website">
    <meta property="og:title" content="${escapeHtml(fullTitle)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:image" content="${config.url}/assets/social-card.svg">
    <meta name="twitter:card" content="summary_large_image">
    <link rel="icon" href="/icon.svg" type="image/svg+xml">
    <link rel="manifest" href="/site.webmanifest">
    <link rel="stylesheet" href="/assets/katex.min.css">
    <link rel="stylesheet" href="/assets/site.css">
  </head>
  <body class="${escapeHtml(pageClass)}">
    <a class="skip-link" href="#main">Skip to content</a>
    <div class="shell">
      ${nav(active)}
      <main id="main">${content}</main>
      <footer class="site-footer">
        <div>
          <span class="footer-name">Dhia Dahmeni</span>
          <span>ML systems / computer vision / software</span>
        </div>
        <div class="footer-links">
          <a href="mailto:${config.email}">Email</a>
          <a href="${config.github}" rel="me noreferrer">GitHub</a>
          <a href="${config.linkedin}" rel="me noreferrer">LinkedIn</a>
          <a href="${config.cv}">CV</a>
        </div>
      </footer>
    </div>
  </body>
</html>`
}

function workRow(page, index) {
  return `<a class="work-row" href="${page.route}">
    <span class="work-index">${String(index + 1).padStart(2, "0")}</span>
    <div class="work-copy">
      <span class="mono-label">${escapeHtml(page.topic)} / ${page.minutes} min</span>
      <h3>${escapeHtml(page.title)}</h3>
      <p>${escapeHtml(page.description)}</p>
    </div>
    <span class="work-arrow" aria-hidden="true">↗</span>
  </a>`
}

const selectedPages = config.selected
  .map((filename) => pages.find((page) => page.filename === filename))
  .filter(Boolean)

const homeContent = `
  <section class="hero" aria-labelledby="hero-title">
    <div class="hero-kicker mono-label">Lead AI Researcher</div>
    <h1 id="hero-title">I build and study <span>machine learning systems.</span></h1>
    <div class="hero-detail">
      <p class="hero-intro">My work covers computer vision, model training, inference runtimes and low-level software. This site has my project write-ups and study notes.</p>
      <div class="focus-list" aria-label="Areas of focus">
        <span class="mono-label">Areas of focus</span>
        ${config.focus.map((item, index) => `<div><span>0${index + 1}</span>${escapeHtml(item)}</div>`).join("")}
      </div>
    </div>
  </section>

  <section class="section-block" aria-labelledby="selected-title">
    <div class="section-heading">
      <span class="mono-label">01 / Selected work</span>
      <h2 id="selected-title">Projects and articles</h2>
      <p>Longer pieces on computer vision, machine learning and systems programming.</p>
    </div>
    <div class="work-list">${selectedPages.map(workRow).join("")}</div>
    <div class="section-actions">
      <a class="text-link" href="/projects/">All projects <span aria-hidden="true">→</span></a>
      <a class="text-link" href="/writing/">All articles <span aria-hidden="true">→</span></a>
    </div>
  </section>

  <section class="about section-block" id="about" aria-labelledby="about-title">
    <div class="section-heading">
      <span class="mono-label">02 / About</span>
      <h2 id="about-title">Dhia Dahmeni</h2>
    </div>
    <div class="about-copy">
      <p>I'm a lead AI researcher. I work on ML systems, computer vision, runtimes and developer tools.</p>
      <p>I keep project write-ups and study notes here. Some are complete; some are not.</p>
      <div class="about-links">
        <a href="mailto:${config.email}">${config.email}</a>
        <a href="${config.github}" rel="me noreferrer">github.com/cryptolake</a>
      </div>
    </div>
  </section>`

function indexRow(page) {
  return `<a class="index-row" href="${page.route}">
    <div><span class="mono-label">${escapeHtml(page.kind)} / ${page.minutes} min</span><h2>${escapeHtml(page.title)}</h2></div>
    <p>${escapeHtml(page.description)}</p>
    <span class="index-arrow" aria-hidden="true">↗</span>
  </a>`
}

function archivePage(title, eyebrow, intro, groupedPages, active) {
  const groups = Object.entries(groupedPages)
    .map(
      ([group, groupPages], index) => `<section class="archive-group" aria-labelledby="group-${index}">
        <div class="archive-label"><span class="mono-label">${String(index + 1).padStart(2, "0")}</span><h2 id="group-${index}">${escapeHtml(group)}</h2></div>
        <div class="index-list">${groupPages.map(indexRow).join("")}</div>
      </section>`,
    )
    .join("")

  return layout({
    title,
    description: intro,
    active,
    route: active === "writing" ? "/writing/" : "/notes/",
    pageClass: "archive-page",
    content: `<header class="page-intro"><span class="mono-label">${eyebrow}</span><h1>${title}</h1><p>${intro}</p></header>${groups}`,
  })
}

function projectRow(project) {
  return `<a class="index-row" href="${escapeHtml(project.url)}" target="_blank" rel="noreferrer">
    <div><span class="mono-label">${escapeHtml(project.area)} / GitHub</span><h2>${escapeHtml(project.name)}</h2></div>
    <p>${escapeHtml(project.description)}</p>
    <span class="index-arrow" aria-hidden="true">↗</span>
  </a>`
}

function projectsPage(groupedProjects) {
  const groups = Object.entries(groupedProjects)
    .map(
      ([group, projects], index) => `<section class="archive-group" aria-labelledby="project-group-${index}">
        <div class="archive-label"><span class="mono-label">${String(index + 1).padStart(2, "0")}</span><h2 id="project-group-${index}">${escapeHtml(group)}</h2></div>
        <div class="index-list">${projects.map(projectRow).join("")}</div>
      </section>`,
    )
    .join("")

  const intro = "Code for machine learning, systems programming and mathematics projects."
  return layout({
    title: "Projects",
    description: intro,
    active: "projects",
    route: "/projects/",
    pageClass: "archive-page projects-page",
    content: `<header class="page-intro"><span class="mono-label">Source code / experiments</span><h1>Projects</h1><p>${intro}</p></header>${groups}`,
  })
}

function groupBy(items, key) {
  return items.reduce((groups, item) => {
    const value = item[key]
    groups[value] ||= []
    groups[value].push(item)
    return groups
  }, {})
}

await rm(publicDir, { recursive: true, force: true })
await mkdir(publicDir, { recursive: true })

await writeFile(
  outputPath("/"),
  layout({
    title: config.name,
    description: config.description,
    active: "home",
    route: "/",
    pageClass: "home-page",
    content: homeContent,
  }),
)

const essays = pages.filter((page) => page.kind === "Essay")
const notes = pages.filter((page) => page.kind === "Note" && page.source.trim())

await mkdir(path.dirname(outputPath("/writing/")), { recursive: true })
await writeFile(
  outputPath("/writing/"),
  archivePage(
    "Research log",
    "Articles / experiments / project notes",
    "Articles and project write-ups on machine learning, computer vision and systems software.",
    groupBy(essays, "topic"),
    "writing",
  ),
)

await mkdir(path.dirname(outputPath("/notes/")), { recursive: true })
await writeFile(
  outputPath("/notes/"),
  archivePage(
    "Field notes",
    "Study notes / drafts",
    "Study notes and unfinished drafts. I update them when I return to the subject.",
    groupBy(notes, "topic"),
    "notes",
  ),
)

await mkdir(path.dirname(outputPath("/projects/")), { recursive: true })
await writeFile(outputPath("/projects/"), projectsPage(groupBy(config.projects, "area")))

for (const page of pages) {
  if (!page.source.trim()) continue
  const processedMarkdown = replaceWikiLinks(prepareBody(page.source), page)
  const articleHtml = await markdownToHtml(processedMarkdown)
  const active = page.kind === "Essay" ? "writing" : "notes"
  const sectionLabel = page.kind === "Essay" ? "Research log" : "Field notes"
  const sectionRoute = page.kind === "Essay" ? "/writing/" : "/notes/"
  const content = `<article class="article">
    <header class="article-header">
      <a class="back-link mono-label" href="${sectionRoute}">← ${sectionLabel}</a>
      <div class="article-type mono-label">${page.topic} / ${page.kind} / ${page.minutes} min read</div>
      <h1>${escapeHtml(page.title)}</h1>
      <p class="article-deck">${escapeHtml(page.description)}</p>
    </header>
    <div class="article-rule" aria-hidden="true"><span></span></div>
    <div class="prose">${articleHtml}</div>
    <footer class="article-footer">
      <span class="mono-label">End of note</span>
      <a class="text-link" href="${sectionRoute}">Return to ${sectionLabel.toLowerCase()} <span aria-hidden="true">→</span></a>
    </footer>
  </article>`

  const destination = outputPath(page.route)
  await mkdir(path.dirname(destination), { recursive: true })
  await writeFile(
    destination,
    layout({
      title: page.title,
      description: page.description,
      active,
      route: page.route,
      pageClass: "article-page",
      content,
    }),
  )
}

for (const absolutePath of assetFiles) {
  const relativePath = path.relative(contentDir, absolutePath)
  const destination = path.join(publicDir, relativePath)
  await mkdir(path.dirname(destination), { recursive: true })
  await cp(absolutePath, destination)
}

await mkdir(path.join(publicDir, "assets"), { recursive: true })
await cp(path.join(root, "static", "icon.svg"), path.join(publicDir, "icon.svg"))
await cp(path.join(root, "styles", "site.css"), path.join(publicDir, "assets", "site.css"))
await cp(
  path.join(root, "node_modules", "katex", "dist", "katex.min.css"),
  path.join(publicDir, "assets", "katex.min.css"),
)
await cp(
  path.join(root, "node_modules", "katex", "dist", "fonts"),
  path.join(publicDir, "assets", "fonts"),
  { recursive: true },
)
await cp(
  path.join(root, "static", "social-card.svg"),
  path.join(publicDir, "assets", "social-card.svg"),
)

const notFound = layout({
  title: "Not found",
  description: "This path does not exist in Dhia's research notebook.",
  pageClass: "not-found-page",
  content: `<section class="not-found"><span class="mono-label">Error / 404</span><h1>Page not found.</h1><p>The link may be old or incorrect.</p><a class="text-link" href="/">Return to the index <span aria-hidden="true">→</span></a></section>`,
})
await writeFile(path.join(publicDir, "404.html"), notFound)

await writeFile(
  path.join(publicDir, "robots.txt"),
  `User-agent: *\nAllow: /\nSitemap: ${config.url}/sitemap.xml\n`,
)

const indexableRoutes = ["/", "/projects/", "/writing/", "/notes/", ...pages.filter((p) => p.source.trim()).map((p) => p.route)]
await writeFile(
  path.join(publicDir, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${indexableRoutes
    .map((route) => `\n  <url><loc>${config.url}${route}</loc></url>`)
    .join("")}\n</urlset>\n`,
)

await writeFile(
  path.join(publicDir, "site.webmanifest"),
  JSON.stringify(
    {
      name: `${config.name}: research notebook`,
      short_name: config.shortName,
      start_url: "/",
      display: "standalone",
      background_color: "#f4f2ea",
      theme_color: "#2442ff",
      icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
    },
    null,
    2,
  ),
)

let revision = "local"
try {
  revision = execFileSync("git", ["rev-parse", "--short", "HEAD"], { cwd: root, encoding: "utf8" }).trim()
} catch {}

console.log(`Built ${pages.filter((page) => page.source.trim()).length + 4} pages from ${revision}.`)
