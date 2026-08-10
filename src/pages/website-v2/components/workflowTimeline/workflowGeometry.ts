/** Shared geometry for zig-zag workflow — keep connector path and icon anchors in sync. */
export const WORKFLOW_ICON_SIZE = 68
export const WORKFLOW_BADGE_SIZE = 26
export const WORKFLOW_ICON_INNER = 28

export const WORKFLOW_STEP_X_PERCENT = [12.5, 37.5, 62.5, 87.5] as const

/** Icon center Y positions within the track band (px). Lower / upper alternating. */
export const WORKFLOW_STEP_Y_DESKTOP = [110, 42, 110, 42] as const
export const WORKFLOW_STEP_Y_TABLET = [104, 40, 104, 40] as const

export const WORKFLOW_TRACK_HEIGHT = {
  desktop: 152,
  tablet: 144,
} as const

/** SVG path through step centers — viewBox 0 0 1000 152 */
export const WORKFLOW_ZIGZAG_PATH = 'M 125 110 L 375 42 L 625 110 L 875 42'
export const WORKFLOW_ZIGZAG_VIEWBOX = '0 0 1000 152'
