import type { Column } from '@/design-system/UIComponents'
import {
  RAG_STATUS_IDS,
  RAG_STATUS_LABELS,
  type RagStatusId,
} from '../config/ragStatus'
import { StatusBadge } from '../widgets/StatusBadge'

/** Render RAG status cells as colored Red / Amber / Green tags. */
export function withReportRagStatusBadges<T>(columns: Column<T>[]): Column<T>[] {
  return columns.map((col) => {
    if (col.key !== 'ragStatus' && col.key !== 'healthScore') return col
    return {
      ...col,
      render: (value: unknown) => {
        const raw = String(value ?? '')
        const key = raw.trim().toLowerCase()
        const isRag = (RAG_STATUS_IDS as readonly string[]).includes(key)
        const label = isRag ? RAG_STATUS_LABELS[key as RagStatusId] : raw
        return <StatusBadge label={label} status={key} />
      },
    }
  })
}
