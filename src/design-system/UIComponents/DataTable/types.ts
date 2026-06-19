import type { ReactNode } from 'react'

import type { FoundationBreakpointKey } from '../../breakpoints'
import type { ListingColumnWidthSize } from '../../listingColumnWidths'

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
  /** Standard listing width token — preferred over ad-hoc `width` / `minWidth` in admin listings. */
  widthSize?: ListingColumnWidthSize
  sortable?: boolean
  filterable?: boolean
  searchable?: boolean
  editable?: boolean
  /** Pin column to the left edge while scrolling horizontally. */
  sticky?: boolean
  /** Pin column to the right edge while scrolling horizontally. Defaults to true when `key === 'actions'`. */
  stickyEnd?: boolean
  /** Column hidden until this min-width tier; `undefined` = always visible in table. */
  hideBelow?: FoundationBreakpointKey
  /** When true, column is omitted from the table between 600px and 1023px (tablet); still respects `hideBelow`. */
  hideOnTablet?: boolean
  render?: (value: any, row: T) => ReactNode
  renderEdit?: (value: any, row: T, onChange: (val: any) => void) => ReactNode
  align?: 'left' | 'center' | 'right'
  options?: { label: string; value: any }[]
  formatValue?: (value: any) => string
  /** When false, column is always shown and omitted from the column picker. Default true. */
  hideable?: boolean
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
  /** Keys of hideable columns the user has turned off; always-on columns ignore this. */
  hiddenColumnKeys: string[]
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
