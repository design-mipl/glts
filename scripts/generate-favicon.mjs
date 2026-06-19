import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const logoPath = path.join(root, 'public', 'sm_logo.jpg')
const outPath = path.join(root, 'public', 'favicon.svg')

const base64 = fs.readFileSync(logoPath).toString('base64')
const borderRadius = 7

const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32">
  <defs>
    <clipPath id="rounded">
      <rect width="32" height="32" rx="${borderRadius}" ry="${borderRadius}" />
    </clipPath>
  </defs>
  <image
    xlink:href="data:image/jpeg;base64,${base64}"
    width="32"
    height="32"
    clip-path="url(#rounded)"
    preserveAspectRatio="xMidYMid slice"
  />
</svg>
`

fs.writeFileSync(outPath, svg)
console.log(`Wrote ${outPath}`)
