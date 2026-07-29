import { Grid } from '@mui/material'
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  Shield,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react'
import { ExecutiveCompactKpiCard } from '@/pages/admin/dashboard/components'
import type { DashboardKpiMetric } from '../../data/operationsDashboardMock'

const ICON_MAP: Record<string, LucideIcon> = {
  files: FileText,
  activity: Activity,
  shield: Shield,
  check: CheckCircle2,
  wallet: Wallet,
  alert: AlertTriangle,
  clock: Clock,
  users: Users,
}

export interface ExecutiveKpiSectionProps {
  metrics: DashboardKpiMetric[]
}

export function ExecutiveKpiSection({ metrics }: ExecutiveKpiSectionProps) {
  return (
    <Grid container spacing={1.25}>
      {metrics.map((metric) => (
        <Grid key={metric.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <ExecutiveCompactKpiCard
            label={metric.label}
            value={metric.formattedValue ?? metric.value.toLocaleString()}
            comparisonLabel={metric.subtitle || metric.deltaLabel}
            delta={metric.delta}
            accent={metric.accent}
            icon={ICON_MAP[metric.iconKey] ?? FileText}
            href={metric.href}
          />
        </Grid>
      ))}
    </Grid>
  )
}
