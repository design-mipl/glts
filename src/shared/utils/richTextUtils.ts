/** Strip tags and non-breaking spaces to detect empty rich text. */
export function isRichTextEmpty(html: string): boolean {
  const text = html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .trim()
  return text.length === 0
}

/** Normalize editor HTML for persistence — empty content becomes ''. */
export function normalizeRichTextForSave(html: string): string {
  return isRichTextEmpty(html) ? '' : html.trim()
}

/** True when value contains HTML markup (vs plain text from Document Master). */
export function containsHtml(value: string): boolean {
  return /<[a-z][\s\S]*>/i.test(value)
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function bulletLinesToListHtml(lines: string[]): string {
  const items = lines
    .map((line) => `<li>${escapeHtml(line.replace(/^[•\-*]\s+/, ''))}</li>`)
    .join('')
  return `<ul>${items}</ul>`
}

function plainTextToBulletListHtml(value: string): string | null {
  const lines = value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
  if (lines.length < 2) return null
  if (!lines.every((line) => /^[•\-*]\s+/.test(line))) return null
  return bulletLinesToListHtml(lines)
}

function inlineBulletsToListHtml(value: string): string | null {
  const parts = value
    .split(/\s*•\s+/)
    .map((line) => line.trim())
    .filter(Boolean)
  if (parts.length < 2) return null
  const items = parts.map((line) => `<li>${escapeHtml(line)}</li>`).join('')
  return `<ul>${items}</ul>`
}

/** Normalize GLTS scope text to a TipTap bullet list (`<ul><li>…</li></ul>`). */
export function normalizeGltsScopeRichText(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) return ''
  if (/<ul[\s>]/i.test(trimmed)) return trimmed

  const multiline = plainTextToBulletListHtml(trimmed)
  if (multiline) return multiline

  const plain = containsHtml(trimmed) ? richTextToPlainText(trimmed) : trimmed
  const inline = inlineBulletsToListHtml(plain)
  if (inline) return inline

  return ensureRichTextHtml(trimmed)
}

/** Wrap plain Document Master text as a single paragraph for TipTap / rich-text display. */
export function ensureRichTextHtml(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) return ''
  if (containsHtml(trimmed)) return trimmed
  const bulletList = plainTextToBulletListHtml(trimmed)
  if (bulletList) return bulletList
  const inline = inlineBulletsToListHtml(trimmed)
  if (inline) return inline
  return `<p>${escapeHtml(trimmed)}</p>`
}

/** Plain text for tables, search, and truncated previews. */
export function richTextToPlainText(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}
