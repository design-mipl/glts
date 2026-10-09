import { websiteDesignSystem as ds } from '../../theme/websiteDesignSystem'

/** Shared geometry for zig-zag workflow — keep connector path and icon anchors in sync. */
export const WORKFLOW_ICON_SIZE = ds.icon.processContainer
export const WORKFLOW_BADGE_SIZE = 26
export const WORKFLOW_ICON_INNER = ds.icon.process

export const WORKFLOW_STEP_X_PERCENT = [12.5, 37.5, 62.5, 87.5] as const

/** Icon center Y positions within the track band (px). Lower / upper alternating. */
export const WORKFLOW_STEP_Y_DESKTOP = [110, 42, 110, 42] as const
export const WORKFLOW_STEP_Y_TABLET = [104, 40, 104, 40] as const

export const WORKFLOW_TRACK_HEIGHT = {
  desktop: 152,
  tablet: 144,
} as const

/** Keep endpoint insets stable while distributing any supported step count evenly. */
export function getWorkflowStepXPercent(stepCount: number): number[] {
  if (stepCount <= 0) return []
  if (stepCount === 1) return [50]
  const first = WORKFLOW_STEP_X_PERCENT[0]
  const last = WORKFLOW_STEP_X_PERCENT[WORKFLOW_STEP_X_PERCENT.length - 1]
  return Array.from({ length: stepCount }, (_, index) => first + ((last - first) * index) / (stepCount - 1))
}

export function getWorkflowStepYPositions(stepCount: number, variant: 'desktop' | 'tablet'): number[] {
  const positions = variant === 'desktop' ? WORKFLOW_STEP_Y_DESKTOP : WORKFLOW_STEP_Y_TABLET
  return Array.from({ length: stepCount }, (_, index) => positions[index % positions.length])
}

export function getWorkflowZigZagPath(stepCount: number, variant: 'desktop' | 'tablet'): string {
  const xPositions = getWorkflowStepXPercent(stepCount)
  const yPositions = getWorkflowStepYPositions(stepCount, variant)
  return xPositions.map((x, index) => `${index === 0 ? 'M' : 'L'} ${x * 10} ${yPositions[index]}`).join(' ')
}

/** SVG path through step centers — viewBox 0 0 1000 152 */
export const WORKFLOW_ZIGZAG_PATH = 'M 125 110 L 375 42 L 625 110 L 875 42'
export const WORKFLOW_ZIGZAG_VIEWBOX = '0 0 1000 152'
