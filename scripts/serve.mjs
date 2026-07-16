import { spawn } from "node:child_process"
import { createReadStream } from "node:fs"
import { access, stat } from "node:fs/promises"
import { createServer } from "node:http"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const publicDir = path.join(root, "public")
const port = Number(process.env.PORT || 4173)

await new Promise((resolve, reject) => {
  const build = spawn(process.execPath, [path.join(root, "scripts", "build.mjs")], {
    cwd: root,
    stdio: "inherit",
  })
  build.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`Build failed with ${code}`))))
})

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webmanifest": "application/manifest+json",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".xml": "application/xml; charset=utf-8",
}

createServer(async (request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname)
  let requestedPath = path.join(publicDir, pathname)

  if (!requestedPath.startsWith(publicDir)) {
    response.writeHead(403).end("Forbidden")
    return
  }

  try {
    const info = await stat(requestedPath)
    if (info.isDirectory()) requestedPath = path.join(requestedPath, "index.html")
    await access(requestedPath)
  } catch {
    requestedPath = path.join(publicDir, "404.html")
    response.statusCode = 404
  }

  response.setHeader("Content-Type", contentTypes[path.extname(requestedPath)] || "application/octet-stream")
  createReadStream(requestedPath).pipe(response)
}).listen(port, "127.0.0.1", () => {
  console.log(`Research notebook available at http://127.0.0.1:${port}`)
})
