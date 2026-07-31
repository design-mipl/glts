import {
  AlertTriangle,
  Clock,
  FileWarning,
  Hourglass,
  Plane,
  ShieldAlert,
  Timer,
  UserX,
  type LucideIcon,
} from 'lucide-react'

/** Icon map for Needs Immediate Attention cards on Admin Dashboard Next. */
export function resolveAdminAttentionIcon(title: string): LucideIcon {
  const lower = title.toLowerCase()
  if (lower.includes('sla')) return AlertTriangle
  if (lower.includes('document')) return FileWarning
  if (lower.includes('qc')) return Timer
  if (lower.includes('passport')) return Clock
  if (lower.includes('marine') || lower.includes('crew')) return Plane
  if (lower.includes('stage') || lower.includes('>7') || lower.includes('7 day')) return Hourglass
  if (lower.includes('corrected') || lower.includes('correction')) return ShieldAlert
  if (lower.includes('movement')) return UserX
  return AlertTriangle
}
