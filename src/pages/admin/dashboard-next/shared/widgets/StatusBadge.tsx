import { Badge } from '@/design-system/UIComponents'
import type { DashboardStatusTone } from '../types'
import { mapStatusToTone } from '../utils/statusTone'
import { isDashboardPermissionGranted } from '../utils/permission'

export interface StatusBadgeProps {
  label: string
  tone?: DashboardStatusTone
  /** When tone is omitted, derive from label text. */
  status?: string
  size?: 'sm' | 'md' | 'lg'
  permission?: boolean
}

export function StatusBadge({
  label,
  tone,
  status,
  size = 'sm',
  permission,
}: StatusBadgeProps) {
  if (!isDashboardPermissionGranted(permission)) {
    return null
  }

  const color = tone ?? mapStatusToTone(status ?? label)

  return <Badge label={label} color={color} size={size} variant="soft" />
}
