import { FORM_CONTROL } from '@/design-system/formControl'

/** Country configuration workspace layout tokens — aligned with GLTS admin + publicBrand. */

/** Tree search row + detail panel header — py 1.25 + 34px field row + py 1.25 */
export const COUNTRY_WORKSPACE_SEARCH_ROW_FIELD_HEIGHT = FORM_CONTROL.heightSm

export const COUNTRY_WORKSPACE_SEARCH_ROW_HEIGHT_PX =
  10 * 2 + parseInt(FORM_CONTROL.heightSm, 10)

/** Shared chrome for tree search and hierarchy panel title row. */
export const COUNTRY_WORKSPACE_SEARCH_ROW_SX = {
  display: 'flex',
  alignItems: 'center',
  flexShrink: 0,
  boxSizing: 'border-box',
  height: COUNTRY_WORKSPACE_SEARCH_ROW_HEIGHT_PX,
  minHeight: COUNTRY_WORKSPACE_SEARCH_ROW_HEIGHT_PX,
  maxHeight: COUNTRY_WORKSPACE_SEARCH_ROW_HEIGHT_PX,
  py: 1.25,
  borderBottom: 1,
  borderColor: 'divider',
} as const

/** Subtle row tint when a hierarchy node is active or hovered. */
export const COUNTRY_WORKSPACE_TREE_HIERARCHY_MUTED = {
  segment: 'rgba(13, 148, 136, 0.12)',
  visaType: 'rgba(124, 58, 237, 0.12)',
  jurisdiction: 'rgba(234, 88, 12, 0.12)',
} as const

export const COUNTRY_WORKSPACE_TREE_HIERARCHY_MUTED_HOVER = {
  segment: 'rgba(13, 148, 136, 0.08)',
  visaType: 'rgba(124, 58, 237, 0.08)',
  jurisdiction: 'rgba(234, 88, 12, 0.08)',
} as const

/** Tree row chrome — guide line sits under the chevron column center. */
export const COUNTRY_WORKSPACE_TREE_INDENT = {
  rowPaddingLeft: 1,
  chevronColumnPx: 18,
  /** px from branch start to 1px guide (row pl 8 + chevron center 9). */
  guideLineLeftPx: 17,
  /** Branch content indent after the guide line. */
  childBranchPaddingLeftPx: 25,
} as const

/** Matches DS IconButton `sm` scaled for compact tree rows. */
export const COUNTRY_WORKSPACE_TREE_ACTION_SLOT_PX = 24

export const COUNTRY_WORKSPACE_TREE_ROW_HEIGHT_PX = 30

/** Vertical gap between sibling tree node rows. */
export const COUNTRY_WORKSPACE_TREE_ROW_GAP_PX = 4

export const COUNTRY_WORKSPACE_LAYOUT = {
  treeWidth: 248,
  treeMinHeight: 520,
  /** Main workspace body — tree + detail fill viewport below admin chrome. */
  workspaceBodyMinHeight: { xs: 400, lg: 'calc(100vh - 220px)' },
  sectionStackGap: 2,
  panelHeaderMinHeight: COUNTRY_WORKSPACE_SEARCH_ROW_HEIGHT_PX,
  /** Side-by-side section cards from this breakpoint (panel ~695px uses 2 columns). */
  sectionColumnsFrom: 'sm' as const,
  fieldColumnsFrom: 'xs' as const,
} as const

export const COUNTRY_WORKSPACE_TREE_SX = {
  column: {
    borderRight: 1,
    borderColor: 'divider',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
    height: '100%',
    alignSelf: 'stretch',
  },
  searchWrap: {
    ...COUNTRY_WORKSPACE_SEARCH_ROW_SX,
    px: 1.5,
  },
  scrollArea: {
    flex: 1,
    overflow: 'auto',
    py: 0.75,
    px: 0.5,
  },
} as const
