import type { AdminListingFilterState } from '@/pages/admin/components/listing'
import type { TemplateDemoRecord, TemplateListingTab } from '../config/demoEntity'

const SUBMITTED_STATUSES = new Set(['Active', 'Pending'])

export function filterTemplateRowsByTab(rows: TemplateDemoRecord[], tab: TemplateListingTab): TemplateDemoRecord[] {
  switch (tab) {
    case 'single':
      return rows.filter((row) => row.recordKind === 'single' && row.status !== 'Draft')
    case 'bulk':
      return rows.filter((row) => row.recordKind === 'bulk' && row.status !== 'Draft')
    case 'draft':
      return rows.filter((row) => row.status === 'Draft')
    case 'submitted':
      return rows.filter((row) => SUBMITTED_STATUSES.has(row.status))
    default:
      return rows
  }
}

export function getTemplateTabCounts(rows: TemplateDemoRecord[]) {
  return {
    single: filterTemplateRowsByTab(rows, 'single').length,
    bulk: filterTemplateRowsByTab(rows, 'bulk').length,
    draft: filterTemplateRowsByTab(rows, 'draft').length,
    submitted: filterTemplateRowsByTab(rows, 'submitted').length,
  }
}

export function applyTemplateAdvancedFilters(
  rows: TemplateDemoRecord[],
  filters: AdminListingFilterState,
): TemplateDemoRecord[] {
  return rows.filter((row) => {
    if (filters.country && row.country !== filters.country) return false
    if (filters.status && row.status !== filters.status) return false
    if (filters.priority && row.priority !== filters.priority) return false
    return true
  })
}

export function getTemplateCellValue(row: TemplateDemoRecord, key: string): string {
  return String((row as unknown as Record<string, unknown>)[key] ?? '')
}

export function matchesTemplateSearch(row: TemplateDemoRecord, query: string): boolean {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return true
  return [row.reference, row.name, row.country, row.assignee, row.status].some((part) =>
    part.toLowerCase().includes(normalized),
  )
}

export function getTemplateFilterOptions(rows: TemplateDemoRecord[]) {
  return {
    countries: Array.from(new Set(rows.map((row) => row.country))).sort(),
    statuses: Array.from(new Set(rows.map((row) => row.status))).sort(),
    priorities: Array.from(new Set(rows.map((row) => row.priority))).sort(),
  }
}

export function mapTemplateRowsToGridItems(rows: TemplateDemoRecord[]) {
  return rows.map((row) => ({
    id: row.id,
    title: row.name,
    subtitle: row.reference,
    meta: `${row.country} · ${row.assignee}`,
    status: row.status,
    statusColor:
      row.status === 'Active' ? ('success' as const) : row.status === 'Pending' ? ('warning' as const) : ('default' as const),
  }))
}

export interface TemplateListingEmptyState {
  emptyTitle: string
  emptyDescription: string
  emptyAction?: { label: string; onClick: () => void }
}

export function getTemplateEmptyState(tab: TemplateListingTab): TemplateListingEmptyState {
  switch (tab) {
    case 'bulk':
      return {
        emptyTitle: 'No bulk records',
        emptyDescription: 'Create a bulk batch to process multiple travelers together.',
        emptyAction: { label: 'Create bulk record', onClick: () => {} },
      }
    case 'draft':
      return {
        emptyTitle: 'No draft records',
        emptyDescription: 'Drafts are saved automatically when users pause a workflow.',
        emptyAction: { label: 'Create record', onClick: () => {} },
      }
    case 'submitted':
      return {
        emptyTitle: 'No submitted records',
        emptyDescription: 'Submitted records appear once they enter the operational pipeline.',
        emptyAction: { label: 'View single records', onClick: () => {} },
      }
    default:
      return {
        emptyTitle: 'No single records',
        emptyDescription: 'Adjust filters or create a new single record to get started.',
        emptyAction: { label: 'Create record', onClick: () => {} },
      }
  }
}
