import {
  AlertTriangle,
  Clock,
  FileWarning,
  Plane,
  ShieldAlert,
  Timer,
  UserX,
  type LucideIcon,
} from 'lucide-react'

export function resolveExecutiveAlertIcon(title: string): LucideIcon {
  const lower = title.toLowerCase()
  if (lower.includes('sla')) return AlertTriangle
  if (lower.includes('document')) return FileWarning
  if (lower.includes('qc')) return Timer
  if (lower.includes('passport')) return Clock
  if (lower.includes('marine') || lower.includes('crew')) return Plane
  if (lower.includes('corrected')) return ShieldAlert
  if (lower.includes('movement')) return UserX
  return AlertTriangle
}
