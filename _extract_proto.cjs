const fs = require('fs')

const html = fs.readFileSync(
  'public/GLTS Retail Visa Prototype (Light, Standalone).html',
  'utf8',
)

const marker = 'type="__bundler/template"'
const start = html.indexOf(marker)
if (start < 0) {
  console.error('no template marker')
  process.exit(1)
}
const gt = html.indexOf('>', start)
const end = html.indexOf('</script>', gt)
const raw = html.slice(gt + 1, end).trim()
const template = JSON.parse(raw)
const content = typeof template === 'string' ? template : JSON.stringify(template)
fs.writeFileSync('_proto_extracted.html', content)
console.log('written length', content.length)

const vars = [...content.matchAll(/--([a-zA-Z0-9-]+)\s*:\s*([^;]+);/g)].map((m) => m[0])
const unique = [...new Set(vars)]
console.log('\n=== CSS VARS (' + unique.length + ') ===')
unique.forEach((v) => console.log(v))

// Extract style blocks that look like design tokens / component styles
const styleBlocks = [...content.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)]
console.log('\n=== STYLE BLOCKS:', styleBlocks.length, '===')
styleBlocks.forEach((b, i) => {
  const text = b[1]
  if (text.length < 50000) {
    fs.writeFileSync(`_proto_style_${i}.css`, text)
    console.log(`style ${i}: ${text.length} chars`)
  } else {
    fs.writeFileSync(`_proto_style_${i}.css`, text.slice(0, 80000))
    console.log(`style ${i}: ${text.length} chars (truncated write)`)
  }
})

// Look for key design phrases
const keywords = [
  'page-bg',
  'navy',
  'green',
  'Inter',
  'DM Sans',
  'font-family',
  'step-card',
  'option-card',
  'phase-nav',
  'btn-primary',
  'radius',
  'shadow',
]
for (const kw of keywords) {
  const idx = content.toLowerCase().indexOf(kw.toLowerCase())
  console.log(kw, idx >= 0 ? 'found@' + idx : 'missing')
}
