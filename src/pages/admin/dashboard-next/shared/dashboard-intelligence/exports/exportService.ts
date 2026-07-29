import type { ExportFormat, ExportRequest } from '../types'

export interface ExportResult {
  ok: boolean
  format: ExportFormat
  filename: string
  message: string
}

function downloadBlob(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

function toCsv(payload: unknown): string {
  if (Array.isArray(payload)) {
    if (payload.length === 0) return ''
    const keys = Object.keys(payload[0] as object)
    const rows = payload.map((row) =>
      keys.map((key) => JSON.stringify((row as Record<string, unknown>)[key] ?? '')).join(','),
    )
    return [keys.join(','), ...rows].join('\n')
  }
  return JSON.stringify(payload, null, 2)
}

/**
 * Reusable dashboard export service — not coupled to Super Admin.
 * PDF / PPTX are scaffolded for future integration; CSV downloads immediately.
 */
export async function exportDashboardSnapshot(request: ExportRequest): Promise<ExportResult> {
  const filename =
    request.filename ??
    `${request.title.replace(/\s+/g, '-').toLowerCase()}.${request.format === 'excel' ? 'csv' : request.format}`

  switch (request.format) {
    case 'csv':
    case 'excel': {
      downloadBlob(filename, toCsv(request.payload), 'text/csv;charset=utf-8')
      return {
        ok: true,
        format: request.format,
        filename,
        message: `${request.format.toUpperCase()} export downloaded.`,
      }
    }
    case 'pdf':
      return {
        ok: true,
        format: 'pdf',
        filename,
        message: 'PDF export queued (framework ready — wire print engine later).',
      }
    case 'pptx':
      return {
        ok: true,
        format: 'pptx',
        filename,
        message: 'PowerPoint export reserved for future board-pack automation.',
      }
    default:
      return {
        ok: false,
        format: request.format,
        filename,
        message: 'Unsupported export format.',
      }
  }
}
