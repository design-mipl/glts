import type { Column } from './types'

/** Uniform width for listing/data columns across all DataTable surfaces. */
export const DEFAULT_COLUMN_MIN_WIDTH = 180

export const ACTION_COLUMN_WIDTH = 60

export const CHECKBOX_COLUMN_WIDTH = 48

export const EXPAND_COLUMN_WIDTH = 48

export function isActionColumn(col: Column): boolean {
  return col.key === 'actions' || col.stickyEnd === true
}

export function resolveActionColumnWidth(_col: Column): number {
  return ACTION_COLUMN_WIDTH
}

/** Global data-column width; per-column `minWidth` / `width` are ignored for consistency. */
export function resolveColumnMinWidth(col: Column): number {
  if (isActionColumn(col)) return ACTION_COLUMN_WIDTH
  return DEFAULT_COLUMN_MIN_WIDTH
}

export function resolveColumnMaxWidth(col: Column): number {
  return resolveColumnMinWidth(col)
}

export function getDataTableColumnWidthSx(col: Column, stickyEnd: boolean) {
  const width = stickyEnd ? resolveActionColumnWidth(col) : resolveColumnMinWidth(col)
  return { width, minWidth: width, maxWidth: width }
}

export function getDataTableLayoutWidth(
  columns: Column[],
  options: { bulkActions?: boolean; renderExpanded?: boolean } = {},
): number {
  let total = 0
  if (options.bulkActions) total += CHECKBOX_COLUMN_WIDTH
  for (const col of columns) {
    total += getDataTableColumnWidthSx(col, isActionColumn(col)).width
  }
  if (options.renderExpanded) total += EXPAND_COLUMN_WIDTH
  return total
}
