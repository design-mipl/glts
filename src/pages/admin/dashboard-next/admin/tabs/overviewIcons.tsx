import type { ReactNode } from 'react'
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Clock,
  FileText,
  HandCoins,
  Shield,
  Truck,
  Users,
  Wallet,
} from 'lucide-react'

export const KPI_ICONS: Record<string, ReactNode> = {
  'total-applications': <FileText size={18} />,
  'applications-in-progress': <Activity size={18} />,
  'completed-today': <CheckCircle2 size={18} />,
  'critical-cases': <AlertTriangle size={18} />,
  'sla-compliance': <Shield size={18} />,
  'applications-delayed': <Clock size={18} />,
  'team-utilization': <Users size={18} />,
  'revenue-today': <Wallet size={18} />,
}

export const ACTION_ICONS: Record<string, ReactNode> = {
  'qa-retail-queue': <ClipboardList size={18} />,
  'qa-applications': <FileText size={18} />,
  'qa-finance': <HandCoins size={18} />,
  'qa-ground': <Truck size={18} />,
}
