import type { ComponentType } from 'react'

export type StatusStepState = 'completed' | 'current' | 'pending'

export interface StatusStepIconProps {
  size?: number
  strokeWidth?: number
}

export interface StatusStepConfig {
  id: string
  label: string
  /** Optional secondary line, e.g. a timestamp or short detail. */
  description?: string
  state: StatusStepState
  /** Icon for the current step's fill. Completed always shows a checkmark; pending shows a plain dashed ring. */
  icon?: ComponentType<StatusStepIconProps>
}
