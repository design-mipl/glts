/** Canonical listing column widths — keep in sync with admin listing docs and CLAUDE.md */
export const LISTING_COLUMN_WIDTHS = {
  /** Checkbox / expand affordances (system columns). */
  xxs: 48,
  /** Actions, icon-only columns. */
  xs: 60,
  /** Priority, SLA, counts, short badges. */
  sm: 100,
  /** Country, jurisdiction, dates, codes. */
  md: 140,
  /** Passenger, company, assignment — default data column. */
  lg: 180,
  /** Status groups, vendors, services. */
  xl: 240,
  /** Application summaries, stacked cells. */
  xxl: 320,
  /** Descriptions, remarks, activity logs. */
  xxxl: 400,
} as const

export type ListingColumnWidthSize = keyof typeof LISTING_COLUMN_WIDTHS

export const LISTING_COLUMN_DEFAULT_WIDTH = LISTING_COLUMN_WIDTHS.lg

export function resolveListingColumnWidth(size: ListingColumnWidthSize): number {
  return LISTING_COLUMN_WIDTHS[size]
}
