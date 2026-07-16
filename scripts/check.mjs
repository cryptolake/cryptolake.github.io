import { access, readFile, readdir } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const publicDir = path.join(root, "public")

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const absolute = path.join(directory, entry.name)
    if (entry.isDirectory()) files.push(...(await walk(absolute)))
    else files.push(absolute)
  }
  return files
}

const files = await walk(publicDir)
const htmlFiles = files.filter((file) => file.endsWith(".html"))
const failures = []

for (const file of htmlFiles) {
  const html = await readFile(file, "utf8")
  if (!html.includes("<main id=\"main\">")) failures.push(`${file}: missing main landmark`)
  if (!html.includes("<meta name=\"description\"")) failures.push(`${file}: missing description`)
  if ((html.match(/<h1[\s>]/g) || []).length !== 1) failures.push(`${file}: expected exactly one h1`)

  const linkPattern = /(?:href|src)="(\/[^"]+)"/g
  for (const [, rawLink] of html.matchAll(linkPattern)) {
    const cleanLink = decodeURIComponent(rawLink.split("#")[0].split("?")[0])
    if (!cleanLink || cleanLink.startsWith("//")) continue
    const candidate = path.join(publicDir, cleanLink)
    const candidates = path.extname(candidate) ? [candidate] : [candidate, path.join(candidate, "index.html")]
    let found = false
    for (const possible of candidates) {
      try {
        await access(possible)
        found = true
        break
      } catch {}
    }
    if (!found) failures.push(`${path.relative(root, file)}: broken local reference ${rawLink}`)
  }
}

if (failures.length) {
  console.error(failures.join("\n"))
  process.exitCode = 1
} else {
  console.log(`Checked ${htmlFiles.length} HTML pages and all local references.`)
}
