import { Badge, type Column } from '@/design-system/UIComponents'
import type { DocumentationWorkRow } from '../types'

function slaColor(status: string): 'success' | 'warning' | 'error' | 'neutral' {
  if (status === 'breached') return 'error'
  if (status === 'at_risk') return 'warning'
  if (status === 'on_track') return 'success'
  return 'neutral'
}

function qcColor(outcome: string): 'success' | 'warning' | 'error' | 'info' | 'neutral' {
  if (outcome === 'ready') return 'success'
  if (outcome === 'correction') return 'warning'
  if (outcome === 'blocked') return 'error'
  if (outcome === 'pending_qc') return 'info'
  return 'neutral'
}

/** Columns for Docs Work desks (Submission Pending / Payment / Waiting on Ops). */
export function buildDocWorkColumns(): Column<DocumentationWorkRow>[] {
  return [
    { key: 'glNumber', label: 'GL Number', widthSize: 'md', searchable: true, sortable: true },
    { key: 'applicant', label: 'Applicant', widthSize: 'lg', searchable: true, sortable: true },
    { key: 'company', label: 'Client', widthSize: 'lg', searchable: true, filterable: true },
    { key: 'country', label: 'Country', widthSize: 'md', filterable: true, sortable: true },
    { key: 'nextAction', label: 'Next action', widthSize: 'lg', searchable: true },
    {
      key: 'qcOutcomeLabel',
      label: 'QC outcome',
      widthSize: 'lg',
      filterable: true,
      render: (_v, row) => (
        <Badge label={row.qcOutcomeLabel} color={qcColor(row.qcOutcome)} size="sm" />
      ),
    },
    {
      key: 'slaStatus',
      label: 'SLA',
      widthSize: 'sm',
      render: (_v, row) => (
        <Badge label={row.slaTimer} color={slaColor(row.slaStatus)} size="sm" />
      ),
    },
    { key: 'waitingOn', label: 'Waiting on', widthSize: 'sm', filterable: true },
  ]
}
