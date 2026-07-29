import type { UiKitStateProps, UiKitViewState } from '../types'
import { isDashboardPermissionGranted } from '../../utils/permission'

export function resolveUiKitViewState(props: UiKitStateProps): UiKitViewState {
  if (!isDashboardPermissionGranted(props.permission)) return 'restricted'
  if (props.error) return 'error'
  if (props.loading) return 'loading'
  if (props.empty) return 'empty'
  return 'ready'
}

export function preferFullWidthTable(columnCount: number, threshold = 6): boolean {
  return columnCount >= threshold
}

export function clampProgress(value: number): number {
  if (Number.isNaN(value)) return 0
  return Math.min(100, Math.max(0, value))
}

export function formatDelta(delta: number): string {
  if (delta > 0) return `↑ ${delta.toFixed(1)}%`
  if (delta < 0) return `↓ ${Math.abs(delta).toFixed(1)}%`
  return '0%'
}
