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
