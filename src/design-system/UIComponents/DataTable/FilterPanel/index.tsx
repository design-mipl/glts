import {
  Box, Typography, IconButton, Button, Select, MenuItem,
  TextField, Drawer, FormControl,
  useTheme, useMediaQuery, Popover,
} from '@mui/material'
import { X, Plus, Trash2 } from 'lucide-react'
import type { Column, FilterRule, FilterOperator, ColumnType } from '../types'

export interface FilterPanelProps {
  open: boolean
  onClose: () => void
  anchorEl?: HTMLElement | null
  columns: Column[]
  filters: FilterRule[]
  onFiltersChange: (filters: FilterRule[]) => void
}

const OPERATORS_BY_TYPE: Record<ColumnType, FilterOperator[]> = {
  text: ['contains', 'not_contains', 'equals', 'not_equals', 'starts_with', 'ends_with', 'is_empty', 'is_not_empty'],
  email: ['contains', 'not_contains', 'equals', 'not_equals', 'starts_with', 'ends_with', 'is_empty', 'is_not_empty'],
  url: ['contains', 'not_contains', 'equals', 'not_equals', 'is_empty', 'is_not_empty'],
  number: ['equals', 'not_equals', 'greater_than', 'less_than', 'between', 'is_empty', 'is_not_empty'],
  date: ['equals', 'greater_than', 'less_than', 'between', 'is_empty', 'is_not_empty'],
  boolean: ['equals', 'is_empty', 'is_not_empty'],
  select: ['equals', 'not_equals', 'is_empty', 'is_not_empty'],
  multi_select: ['contains', 'not_contains', 'is_empty', 'is_not_empty'],
}

const OPERATOR_LABELS: Record<FilterOperator, string> = {
  equals: 'is', not_equals: 'is not',
  contains: 'contains', not_contains: "doesn't contain",
  starts_with: 'starts with', ends_with: 'ends with',
  greater_than: 'is after / greater than', less_than: 'is before / less than',
  between: 'is between',
  is_empty: 'is empty', is_not_empty: 'is not empty',
}

function newRule(columns: Column[]): FilterRule {
  const col = columns.find(c => c.filterable !== false) ?? columns[0]
  const type = col?.type ?? 'text'
  const ops = OPERATORS_BY_TYPE[type] ?? OPERATORS_BY_TYPE.text
  return { id: crypto.randomUUID(), columnKey: col?.key ?? '', operator: ops[0], value: '' }
}

function ValueInput({ rule, col, onChange }: { rule: FilterRule; col: Column | undefined; onChange: (val: any) => void }) {
  if (rule.operator === 'is_empty' || rule.operator === 'is_not_empty') return null
  const type = col?.type ?? 'text'

  if (type === 'boolean') {
    return (
      <Select value={rule.value === true ? 'true' : 'false'} onChange={(e) => onChange(e.target.value === 'true')} size="small" fullWidth>
        <MenuItem value="true">True</MenuItem>
        <MenuItem value="false">False</MenuItem>
      </Select>
    )
  }
  if ((type === 'select' || type === 'multi_select') && col?.options) {
    return (
      <Select value={rule.value ?? ''} onChange={(e) => onChange(e.target.value)} size="small" fullWidth>
        {col.options.map(o => <MenuItem key={String(o.value)} value={o.value}>{o.label}</MenuItem>)}
      </Select>
    )
  }
  if (rule.operator === 'between') {
    const [a, b] = Array.isArray(rule.value) ? rule.value : ['', '']
    return (
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField size="small" value={a} onChange={(e) => onChange([e.target.value, b])} placeholder="From" fullWidth />
        <TextField size="small" value={b} onChange={(e) => onChange([a, e.target.value])} placeholder="To" fullWidth />
      </Box>
    )
  }
  const htmlType = type === 'number' ? 'number' : type === 'date' ? 'date' : type === 'email' ? 'email' : type === 'url' ? 'url' : 'text'
  return (
    <TextField
      size="small"
      fullWidth
      type={htmlType}
      value={rule.value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Value"
    />
  )
}

function PanelContent({ columns, filters, onFiltersChange, onClose }: Omit<FilterPanelProps, 'open' | 'anchorEl'>) {
  const filterableCols = columns.filter(c => c.filterable !== false)

  const updateRule = (id: string, patch: Partial<FilterRule>) => {
    onFiltersChange(filters.map(f => f.id === id ? { ...f, ...patch } : f))
  }

  const removeRule = (id: string) => {
    onFiltersChange(filters.filter(f => f.id !== id))
  }

  const addRule = () => {
    onFiltersChange([...filters, newRule(filterableCols)])
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="subtitle1" fontWeight={600} sx={{ flex: 1 }}>Filters</Typography>
        {filters.length > 0 && (
          <Button size="small" onClick={() => onFiltersChange([])} sx={{ mr: 1 }}>Clear all</Button>
        )}
        <IconButton size="small" onClick={onClose}><X size={16} /></IconButton>
      </Box>

      {/* Rules */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {filters.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
            No filters applied
          </Typography>
        )}
        {filters.map((rule) => {
          const col = filterableCols.find(c => c.key === rule.columnKey)
          const type = col?.type ?? 'text'
          const operators = OPERATORS_BY_TYPE[type] ?? OPERATORS_BY_TYPE.text
          return (
            <Box key={rule.id} sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                {/* Column selector */}
                <FormControl size="small" sx={{ flex: 1 }}>
                  <Select
                    value={rule.columnKey}
                    onChange={(e) => {
                      const newCol = filterableCols.find(c => c.key === e.target.value)
                      const newType = newCol?.type ?? 'text'
                      const newOps = OPERATORS_BY_TYPE[newType] ?? OPERATORS_BY_TYPE.text
                      updateRule(rule.id, { columnKey: e.target.value as string, operator: newOps[0], value: '' })
                    }}
                  >
                    {filterableCols.map(c => <MenuItem key={c.key} value={c.key}>{c.label}</MenuItem>)}
                  </Select>
                </FormControl>
                <IconButton size="small" onClick={() => removeRule(rule.id)} sx={{ mt: 0.25 }}>
                  <Trash2 size={16} />
                </IconButton>
              </Box>
              {/* Operator selector */}
              <FormControl size="small" fullWidth>
                <Select
                  value={rule.operator}
                  onChange={(e) => updateRule(rule.id, { operator: e.target.value as FilterOperator, value: '' })}
                >
                  {operators.map(op => (
                    <MenuItem key={op} value={op}>{OPERATOR_LABELS[op]}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              {/* Value input */}
              <ValueInput rule={rule} col={col} onChange={(val) => updateRule(rule.id, { value: val })} />
            </Box>
          )
        })}
        <Button startIcon={<Plus size={16} />} onClick={addRule} size="small" variant="outlined" sx={{ alignSelf: 'flex-start' }}>
          Add filter
        </Button>
      </Box>
    </Box>
  )
}

export default function FilterPanel({ open, onClose, anchorEl, columns, filters, onFiltersChange }: FilterPanelProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('xl'))

  const content = (
    <PanelContent
      columns={columns}
      filters={filters}
      onFiltersChange={onFiltersChange}
      onClose={onClose}
    />
  )

  if (isMobile) {
    return (
      <Drawer anchor="right" open={open} onClose={onClose} slotProps={{ paper: { sx: { width: 320 } } }}>
        {content}
      </Drawer>
    )
  }

  return (
    <Popover
      open={open}
      onClose={onClose}
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      slotProps={{ paper: { sx: { width: 360, maxHeight: 520 } } }}
    >
      {content}
    </Popover>
  )
}
