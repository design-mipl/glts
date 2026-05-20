import { Chip } from '@mui/material'
import type { FilterRule, Column } from '../types'

export interface FilterChipProps {
  filter: FilterRule
  columns: Column[]
  onRemove: (id: string) => void
  onEdit: (filter: FilterRule) => void
}

const OPERATOR_LABELS: Record<string, string> = {
  equals: 'is',
  not_equals: 'is not',
  contains: 'contains',
  not_contains: "doesn't contain",
  starts_with: 'starts with',
  ends_with: 'ends with',
  greater_than: 'is after',
  less_than: 'is before',
  between: 'is between',
  is_empty: 'is empty',
  is_not_empty: 'is not empty',
}

function formatValue(filter: FilterRule, col: Column | undefined): string {
  if (filter.operator === 'is_empty' || filter.operator === 'is_not_empty') return ''
  if (filter.operator === 'between' && Array.isArray(filter.value)) {
    return `${filter.value[0]} – ${filter.value[1]}`
  }
  if (col?.options) {
    const opt = col.options.find(o => o.value === filter.value)
    if (opt) return opt.label
  }
  if (typeof filter.value === 'boolean') return filter.value ? 'true' : 'false'
  return String(filter.value ?? '')
}

export default function FilterChip({ filter, columns, onRemove, onEdit }: FilterChipProps) {
  const col = columns.find(c => c.key === filter.columnKey)
  const colLabel = col?.label ?? filter.columnKey
  const opLabel = OPERATOR_LABELS[filter.operator] ?? filter.operator
  const valLabel = formatValue(filter, col)

  const label = valLabel
    ? `${colLabel} ${opLabel} ${valLabel}`
    : `${colLabel} ${opLabel}`

  return (
    <Chip
      label={label}
      size="small"
      color="primary"
      variant="outlined"
      onClick={() => onEdit(filter)}
      onDelete={() => onRemove(filter.id)}
      sx={{ fontSize: 12 }}
    />
  )
}
