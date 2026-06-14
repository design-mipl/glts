import { vesselTypeLabel, vesselTypeOptions } from '@/pages/customer/features/masters/vessels/config/vesselTypeConfig'
import { entityMasterService } from '@/shared/services/entityMasterService'
import { vesselMasterService } from '@/shared/services/vesselMasterService'
import type { VesselMaster, VesselMasterFormData, VesselMasterStatus, VesselType } from '@/shared/types/vesselMaster'
import { validateVesselForm } from '@/shared/utils/vesselMasterValidation'

const TEMPLATE_HEADERS = [
  'Linked entity',
  'Vessel name',
  'IMO number',
  'Vessel type',
  'Flag country',
  'Port of registry',
  'Contact person name',
  'Contact person email',
  'Contact person mobile',
  'Status',
  'Notes',
] as const

export interface VesselBulkImportRowIssue {
  row: number
  reason: string
}

export interface VesselBulkImportResult {
  imported: VesselMaster[]
  skipped: VesselBulkImportRowIssue[]
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

function resolveVesselType(raw: string): VesselType | undefined {
  const normalized = raw.trim().toLowerCase()
  if (!normalized) return 'bulk_carrier'

  const byValue = vesselTypeOptions.find((option) => option.value === normalized)
  if (byValue) return byValue.value

  const byLabel = vesselTypeOptions.find((option) => option.label.toLowerCase() === normalized)
  if (byLabel) return byLabel.value

  const byPartialLabel = vesselTypeOptions.find((option) =>
    option.label.toLowerCase().includes(normalized),
  )
  return byPartialLabel?.value
}

function resolveStatus(raw: string): VesselMasterStatus {
  const normalized = raw.trim().toLowerCase()
  if (normalized === 'inactive' || normalized === 'disabled') return 'inactive'
  return 'active'
}

function resolveLinkedEntityId(raw: string, entityIds: string[]): string {
  const normalized = raw.trim().toLowerCase()
  if (!normalized) return ''

  for (const entityId of entityIds) {
    const entity = entityMasterService.getById(entityId)
    if (!entity) continue
    if (entity.entityName.trim().toLowerCase() === normalized) return entity.id
    if (entity.id.trim().toLowerCase() === normalized) return entity.id
  }

  return ''
}

export function downloadCorporateAccountVesselTemplate(): void {
  const exampleType = vesselTypeLabel.bulk_carrier
  const templateLine = [
    '',
    'Example Vessel',
    '1234567',
    exampleType,
    'Panama',
    'Panama City',
    'John Smith',
    'john@example.com',
    '+919876543210',
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
  link.download = `vessel-upload-template-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

export function importCorporateAccountVesselsFromCsv(
  text: string,
  options: { entityIds: string[]; corporateAccountId?: string; existingVesselIds: string[] },
): VesselBulkImportResult {
  const rows = parseCsvRows(text.replace(/^\uFEFF/, ''))
  if (rows.length === 0) {
    return { imported: [], skipped: [{ row: 0, reason: 'File is empty.' }] }
  }

  const headerRow = rows[0].map(normalizeHeader)
  const expectedHeaders = TEMPLATE_HEADERS.map((header) => normalizeHeader(header))
  const headerMatches = expectedHeaders.every((header, index) => headerRow[index] === header)

  const dataRows = headerMatches ? rows.slice(1) : rows
  const startRow = headerMatches ? 2 : 1

  const imported: VesselMaster[] = []
  const skipped: VesselBulkImportRowIssue[] = []
  const seenImos = new Set<string>()

  dataRows.forEach((cells, index) => {
    const rowNumber = startRow + index
    const getCell = (index: number) => (cells[index] ?? '').trim()

    const linkedEntityName = getCell(0)
    const linkedEntityId = resolveLinkedEntityId(linkedEntityName, options.entityIds)
    if (linkedEntityName && !linkedEntityId) {
      skipped.push({ row: rowNumber, reason: `Linked entity "${linkedEntityName}" was not found.` })
      return
    }

    const vesselType = resolveVesselType(getCell(3))
    if (!vesselType) {
      skipped.push({ row: rowNumber, reason: 'Vessel type is invalid.' })
      return
    }

    const formData: VesselMasterFormData = {
      linkedEntityId,
      vesselName: getCell(1),
      imoNumber: getCell(2),
      vesselType,
      flagCountry: getCell(4),
      portOfRegistry: getCell(5),
      contactPersonName: getCell(6),
      contactPersonEmail: getCell(7),
      contactPersonMobile: getCell(8),
      status: resolveStatus(getCell(9)),
      notes: getCell(10),
    }

    const imoKey = formData.imoNumber.trim()
    if (imoKey && seenImos.has(imoKey)) {
      skipped.push({ row: rowNumber, reason: `Duplicate IMO ${imoKey} in upload file.` })
      return
    }

    const validationErrors = validateVesselForm(formData, {
      isImoTaken: (imo, excludeId) =>
        vesselMasterService.isImoTaken(imo, excludeId) ||
        options.existingVesselIds.some((id) => vesselMasterService.getById(id)?.imoNumber === imo.trim()),
    })

    if (Object.keys(validationErrors).length > 0) {
      skipped.push({
        row: rowNumber,
        reason: Object.values(validationErrors)[0] ?? 'Row failed validation.',
      })
      return
    }

    const record = vesselMasterService.create(formData, options.corporateAccountId)
    imported.push(record)
    if (imoKey) seenImos.add(imoKey)
  })

  return { imported, skipped }
}
