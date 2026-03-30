import type { ReactNode } from 'react'

export type SortDirection = 'asc' | 'desc' | null

export type FilterOperator =
  | 'equals' | 'not_equals'
  | 'contains' | 'not_contains'
  | 'starts_with' | 'ends_with'
  | 'greater_than' | 'less_than'
  | 'between' | 'is_empty' | 'is_not_empty'

export type ColumnType =
  | 'text' | 'number' | 'date' | 'boolean'
  | 'select' | 'multi_select' | 'email' | 'url'

export type Column<T = any> = {
  key: string
  label: string
  type?: ColumnType
  width?: number | string
  minWidth?: number
  sortable?: boolean
  filterable?: boolean
  searchable?: boolean
  editable?: boolean
  sticky?: boolean
  hideBelow?: 'sm' | 'md' | 'lg' | 'xl'
  render?: (value: any, row: T) => ReactNode
  renderEdit?: (value: any, row: T, onChange: (val: any) => void) => ReactNode
  align?: 'left' | 'center' | 'right'
  options?: { label: string; value: any }[]
  formatValue?: (value: any) => string
}

export type FilterRule = {
  id: string
  columnKey: string
  operator: FilterOperator
  value: any
}

export type TableState = {
  page: number
  pageSize: number
  sortKey: string | null
  sortDirection: SortDirection
  filters: FilterRule[]
  searchQuery: string
  columnSearch: Record<string, string>
  selectedRows: string[]
  expandedRows: string[]
}

export type BulkAction = {
  label: string
  icon?: ReactNode
  onClick: (selectedRows: any[]) => void
  variant?: 'default' | 'destructive'
}

export type SearchResult = {
  id: string
  type: 'page' | 'record' | 'user'
  title: string
  subtitle?: string
  icon?: ReactNode
  href?: string
  onClick?: () => void
}

export type SearchResults = {
  pages: SearchResult[]
  records: SearchResult[]
  users: SearchResult[]
}
