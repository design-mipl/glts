import type { Column } from './types'
import {
  LISTING_COLUMN_DEFAULT_WIDTH,
  LISTING_COLUMN_WIDTHS,
  type ListingColumnWidthSize,
} from '../../listingColumnWidths'

/** @deprecated Prefer `LISTING_COLUMN_DEFAULT_WIDTH` from `listingColumnWidths`. */
export const DEFAULT_COLUMN_MIN_WIDTH = LISTING_COLUMN_DEFAULT_WIDTH

export const ACTION_COLUMN_WIDTH = LISTING_COLUMN_WIDTHS.xs

export const CHECKBOX_COLUMN_WIDTH = LISTING_COLUMN_WIDTHS.xxs

export const EXPAND_COLUMN_WIDTH = LISTING_COLUMN_WIDTHS.xxs

export function isActionColumn(col: Column): boolean {
  return col.key === 'actions' || col.stickyEnd === true
}

export function resolveActionColumnWidth(_col: Column): number {
  return ACTION_COLUMN_WIDTH
}

function resolveExplicitColumnWidth(col: Column): number | undefined {
  if (typeof col.width === 'number') return col.width
  if (col.minWidth != null) return col.minWidth
  if (col.widthSize != null) return LISTING_COLUMN_WIDTHS[col.widthSize]
  return undefined
}

export function resolveColumnMinWidth(col: Column): number {
  if (isActionColumn(col)) return ACTION_COLUMN_WIDTH
  return resolveExplicitColumnWidth(col) ?? LISTING_COLUMN_DEFAULT_WIDTH
}

export function resolveColumnMaxWidth(col: Column): number {
  return resolveColumnMinWidth(col)
}

/** Resolved pixel width for a column definition (actions, width, minWidth, widthSize, or default). */
export function resolveColumnWidthPx(col: Column): number {
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

export type { ListingColumnWidthSize }
