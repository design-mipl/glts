import { entityMasterService } from '@/shared/services/entityMasterService'
import type { EntityMaster, EntityMasterFormData, EntityMasterStatus } from '@/shared/types/entityMaster'
import { validateEntityForm } from '@/shared/utils/entityMasterValidation'

const TEMPLATE_HEADERS = [
  'Entity name',
  'Contact person name',
  'Contact person email',
  'Contact person mobile',
  'Location',
  'City',
  'Country',
  'Status',
  'Notes',
] as const

export interface EntityBulkImportRowIssue {
  row: number
  reason: string
}

export interface EntityBulkImportResult {
  imported: EntityMaster[]
  skipped: EntityBulkImportRowIssue[]
}

function escapeCsvCell(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
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
    } else if (char === ',') {
      row.push(cell)
      cell = ''
    } else if (char === '\n' || (char === '\r' && next === '\n')) {
      row.push(cell)
      rows.push(row)
      row = []
      cell = ''
      if (char === '\r') i += 1
    } else if (char !== '\r') {
      cell += char
    }
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell)
    rows.push(row)
  }

  return rows.filter((cells) => cells.some((value) => value.trim().length > 0))
}

function normalizeHeader(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ')
}

function resolveStatus(raw: string): EntityMasterStatus {
  const normalized = raw.trim().toLowerCase()
  if (normalized === 'inactive' || normalized === 'disabled') return 'inactive'
  return 'active'
}

export function downloadCorporateAccountEntityTemplate(): void {
  const templateLine = [
    'Example Entity Pvt Ltd',
    'Jane Doe',
    'jane@example.com',
    '+919876543210',
    'Andheri East',
    'Mumbai',
    'India',
    'Active',
    '',
  ]
    .map(escapeCsvCell)
    .join(',')

  const csv = `\uFEFF${[TEMPLATE_HEADERS.join(','), templateLine].join('\n')}`
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `entity-upload-template-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

export function importCorporateAccountEntitiesFromCsv(
  text: string,
  options: { corporateAccountId?: string; existingEntityIds: string[] },
): EntityBulkImportResult {
  const rows = parseCsvRows(text.replace(/^\uFEFF/, ''))
  if (rows.length === 0) {
    return { imported: [], skipped: [{ row: 0, reason: 'File is empty.' }] }
  }

  const headerRow = rows[0].map(normalizeHeader)
  const expectedHeaders = TEMPLATE_HEADERS.map((header) => normalizeHeader(header))
  const headerMatches = expectedHeaders.every((header, index) => headerRow[index] === header)

  const dataRows = headerMatches ? rows.slice(1) : rows
  const startRow = headerMatches ? 2 : 1

  const existingNames = new Set(
    options.existingEntityIds
      .map((id) => entityMasterService.getById(id)?.entityName.trim().toLowerCase())
      .filter(Boolean),
  )

  const imported: EntityMaster[] = []
  const skipped: EntityBulkImportRowIssue[] = []
  const seenNames = new Set<string>()

  dataRows.forEach((cells, index) => {
    const rowNumber = startRow + index
    const getCell = (index: number) => (cells[index] ?? '').trim()

    const formData: EntityMasterFormData = {
      entityName: getCell(0),
      contactPersonName: getCell(1),
      contactPersonEmail: getCell(2),
      contactPersonMobile: getCell(3),
      location: getCell(4),
      city: getCell(5),
      country: getCell(6),
      status: resolveStatus(getCell(7)),
      notes: getCell(8),
    }

    const nameKey = formData.entityName.trim().toLowerCase()
    if (nameKey && seenNames.has(nameKey)) {
      skipped.push({ row: rowNumber, reason: `Duplicate entity name "${formData.entityName}" in upload file.` })
      return
    }

    if (nameKey && existingNames.has(nameKey)) {
      skipped.push({ row: rowNumber, reason: `Entity "${formData.entityName}" is already linked to this account.` })
      return
    }

    const validationErrors = validateEntityForm(formData)
    if (Object.keys(validationErrors).length > 0) {
      skipped.push({
        row: rowNumber,
        reason: Object.values(validationErrors)[0] ?? 'Row failed validation.',
      })
      return
    }

    const record = entityMasterService.create(formData, options.corporateAccountId)
    imported.push(record)
    if (nameKey) seenNames.add(nameKey)
  })

  return { imported, skipped }
}
