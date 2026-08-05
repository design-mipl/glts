import type { ReactNode } from 'react'
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Clock,
  FileText,
  HandCoins,
  Hourglass,
  Shield,
  Truck,
  Users,
  Wallet,
} from 'lucide-react'

/** Single source for Admin dashboard KPI icons (HeroStrip + re-exports). */
export const KPI_ICONS: Record<string, ReactNode> = {
  'total-applications': <FileText size={16} />,
  'applications-in-progress': <Activity size={16} />,
  'completed-today': <CheckCircle2 size={16} />,
  'critical-cases': <AlertTriangle size={16} />,
  'cases-over-7d': <Hourglass size={16} />,
  'sla-compliance': <Shield size={16} />,
  'applications-delayed': <Clock size={16} />,
  'team-utilization': <Users size={16} />,
  'revenue-today': <Wallet size={16} />,
}

export const ACTION_ICONS: Record<string, ReactNode> = {
  'qa-retail-queue': <ClipboardList size={16} />,
  'qa-applications': <FileText size={16} />,
  'qa-finance': <HandCoins size={16} />,
  'qa-ground': <Truck size={16} />,
}
