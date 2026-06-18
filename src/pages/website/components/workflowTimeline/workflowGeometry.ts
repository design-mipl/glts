/** Shared geometry for zig-zag workflow — keep connector path and icon anchors in sync. */
export const WORKFLOW_ICON_SIZE = 52
export const WORKFLOW_BADGE_SIZE = 22
export const WORKFLOW_ICON_INNER = 22

export const WORKFLOW_STEP_X_PERCENT = [12.5, 37.5, 62.5, 87.5] as const

/** Icon center Y positions within the track band (px). Lower / upper alternating. */
export const WORKFLOW_STEP_Y_DESKTOP = [92, 32, 92, 32] as const
export const WORKFLOW_STEP_Y_TABLET = [88, 30, 88, 30] as const

export const WORKFLOW_TRACK_HEIGHT = {
  desktop: 120,
  tablet: 112,
} as const

/** SVG path through step centers — viewBox 0 0 1000 120 */
export const WORKFLOW_ZIGZAG_PATH = 'M 125 92 L 375 32 L 625 92 L 875 32'
