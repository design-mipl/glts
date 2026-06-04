import {
  APPLICANT_ADDITIONAL_DETAIL_SECTIONS,
  emptyApplicantAdditionalDetails,
  type ApplicantAdditionalDetails,
} from '../config/applicantAdditionalDetailsConfig'

const TEMPLATE_HEADERS = ['field_key', 'section', 'field_label', 'value'] as const

export interface AdditionalDetailExcelFieldRow {
  key: keyof ApplicantAdditionalDetails
  section: string
  label: string
}

export function getAdditionalDetailExcelFieldRows(): AdditionalDetailExcelFieldRow[] {
  return APPLICANT_ADDITIONAL_DETAIL_SECTIONS.flatMap(section =>
    section.fields.map(field => ({
      key: field.key,
      section: section.title,
      label: field.label,
    })),
  )
}

function escapeCsvCell(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

function buildTemplateCsv(details?: ApplicantAdditionalDetails): string {
  const resolved = { ...emptyApplicantAdditionalDetails(), ...details }
  const header = TEMPLATE_HEADERS.join(',')
  const lines = getAdditionalDetailExcelFieldRows().map(row =>
    [
      row.key,
      escapeCsvCell(row.section),
      escapeCsvCell(row.label),
      escapeCsvCell(resolved[row.key] ?? ''),
    ].join(','),
  )
  return `\uFEFF${[header, ...lines].join('\n')}`
}

export function downloadApplicantAdditionalDetailsExcel(
  details?: ApplicantAdditionalDetails,
  fileNameSuffix = 'applicant',
): void {
  const csv = buildTemplateCsv(details)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  const safeSuffix = fileNameSuffix.replace(/[^\w.-]+/g, '_').slice(0, 48) || 'applicant'
  link.download = `additional-details-${safeSuffix}-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

function parseCsvRows(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let cell = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i]
    const next = text[i + 1]

    if (inQuotes) {
      if (char === '"' && next === '"') {
        cell += '"'
        i += 1
      } else if (char === '"') {
        inQuotes = false
      } else {
        cell += char
      }
      continue
    }

    if (char === '"') {
      inQuotes = true
      continue
    }
    if (char === ',') {
      row.push(cell.trim())
      cell = ''
      continue
    }
    if (char === '\n' || (char === '\r' && next === '\n')) {
      row.push(cell.trim())
      if (row.some(c => c.length > 0)) rows.push(row)
      row = []
      cell = ''
      if (char === '\r') i += 1
      continue
    }
    if (char !== '\r') {
      cell += char
    }
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell.trim())
    if (row.some(c => c.length > 0)) rows.push(row)
  }

  return rows
}

const VALID_KEYS = new Set(Object.keys(emptyApplicantAdditionalDetails()))

export function parseApplicantAdditionalDetailsExcelFile(
  file: File,
): Promise<Partial<ApplicantAdditionalDetails>> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const text = String(reader.result ?? '').replace(/^\uFEFF/, '')
        const rows = parseCsvRows(text)
        if (rows.length < 2) {
          reject(new Error('The file has no data rows. Use the downloaded template.'))
          return
        }

        const header = rows[0].map(h => h.trim().toLowerCase())
        const keyIndex = header.indexOf('field_key')
        const valueIndex = header.indexOf('value')
        if (keyIndex < 0 || valueIndex < 0) {
          reject(
            new Error('Missing required columns. The template must include field_key and value headers.'),
          )
          return
        }

        const patch: Partial<ApplicantAdditionalDetails> = {}
        let imported = 0

        for (const dataRow of rows.slice(1)) {
          const fieldKey = dataRow[keyIndex]?.trim()
          if (!fieldKey || !VALID_KEYS.has(fieldKey)) continue
          patch[fieldKey as keyof ApplicantAdditionalDetails] = dataRow[valueIndex]?.trim() ?? ''
          imported += 1
        }

        if (imported === 0) {
          reject(new Error('No matching fields found. Check field_key values in your file.'))
          return
        }

        resolve(patch)
      } catch {
        reject(new Error('Could not read the file. Save your Excel sheet as CSV and try again.'))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read the file.'))
    reader.readAsText(file)
  })
}

export const ADDITIONAL_DETAILS_EXCEL_ACCEPT = '.csv,.xlsx,.xls'
