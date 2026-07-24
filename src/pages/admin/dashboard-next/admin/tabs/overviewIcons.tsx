import type { ReactNode } from 'react'
import {
  CheckCircle2,
  ClipboardList,
  FileText,
  HandCoins,
  IndianRupee,
  ShieldAlert,
  Truck,
} from 'lucide-react'

export const KPI_ICONS: Record<string, ReactNode> = {
  'open-cases': <FileText size={18} />,
  'sla-at-risk': <ShieldAlert size={18} />,
  'completed-today': <CheckCircle2 size={18} />,
  'revenue-mtd': <IndianRupee size={18} />,
}

export const ACTION_ICONS: Record<string, ReactNode> = {
  'qa-retail-queue': <ClipboardList size={18} />,
  'qa-applications': <FileText size={18} />,
  'qa-finance': <HandCoins size={18} />,
  'qa-ground': <Truck size={18} />,
}
