import type { TableState } from '@/design-system/UIComponents'
import { tokens } from '@/design-system/tokens'
import { publicShadows } from '@/shared/theme/publicBrand'

/** Spacing multipliers for MUI `theme.spacing` / Stack `spacing`. */
export const DASHBOARD_SPACING = {
  section: 2.5,
  dense: 1.5,
  field: 1.25,
  card: 2.5,
} as const

/** Default chart body height via theme spacing units (×8px MUI base). */
export const DASHBOARD_CHART_HEIGHT_SPACING = 32

export const DASHBOARD_TABLE_DEFAULT_PAGE_SIZE = 6

export const DASHBOARD_TRANSITION = tokens.transition.normal

/** Shared surface chrome for dashboard-next cards and filter bars. */
export const DASHBOARD_SURFACE = {
  radius: tokens.borderRadius.xl,
  shadow: publicShadows.card,
  filterBarSx: {
    p: { xs: 1.5, md: 2 },
    borderRadius: tokens.borderRadius.xl,
    border: '1px solid',
    borderColor: 'divider',
    bgcolor: 'background.paper',
    boxShadow: publicShadows.card,
  },
  sectionCardSx: {
    p: { xs: 2, md: 2.5 },
    borderRadius: tokens.borderRadius.xl,
    border: '1px solid',
    borderColor: 'divider',
    bgcolor: 'background.paper',
    boxShadow: publicShadows.card,
    mb: 0,
  },
  stickyHeaderSx: {
    position: 'sticky' as const,
    top: 0,
    zIndex: tokens.zIndex.sticky,
    bgcolor: 'background.default',
    borderBottom: '1px solid',
    borderColor: 'divider',
    pt: 0.5,
    pb: 2,
    mb: 2.5,
    backdropFilter: 'blur(8px)',
  },
} as const

export const INITIAL_DASHBOARD_TABLE_STATE: TableState = {
  page: 0,
  pageSize: DASHBOARD_TABLE_DEFAULT_PAGE_SIZE,
  sortKey: null,
  sortDirection: 'asc',
  filters: [],
  searchQuery: '',
  columnSearch: {},
  selectedRows: [],
  expandedRows: [],
  hiddenColumnKeys: [],
}
