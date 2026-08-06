import type { ReactNode } from 'react'
import { Box, Stack } from '@mui/material'
import {
  AlertTriangle,
  ClipboardList,
  FileWarning,
  Inbox,
  Package,
  Send,
  XCircle,
} from 'lucide-react'
import { Button } from '@/design-system/UIComponents'
import {
  OpsOrgInfographics,
  OpsOrgWorkloadBySegment,
  DASHBOARD_SPACING,
} from '../../shared'
import { HeroMetric } from '../../shared/dashboard-ui-kit'
import { SuperAdminPulseBanner } from '../components/SuperAdminChrome'
import type { SuperAdminDashboardTabProps } from '../types'

const OPS_DASHBOARD_HREF = '/admin/dashboard-next/operations'

type NetworkKpi = {
  id: string
  label: string
  value: number
  tone: 'info' | 'positive' | 'negative' | 'warning' | 'neutral'
  icon: ReactNode
}

/**
 * Operations — network pulse + KPI strip + Ops org infographics
 * (donut / bar charts from Ops Overview · Admin Operations).
 */
export function OperationsTab({
  data,
  loading,
  onNavigate,
}: SuperAdminDashboardTabProps) {
  const today = data.operationsToday
  const snapshot = data.opsQueueSnapshot

  const pulseParts = [
    today.slaBreaches > 0 ? `${today.slaBreaches} SLA breaches` : null,
    today.pendingEmbassy > 0 ? `${today.pendingEmbassy} pending embassy` : null,
    today.pendingClientDocuments > 0
      ? `${today.pendingClientDocuments} pending documents`
      : null,
  ].filter(Boolean)

  const networkKpis: NetworkKpi[] = [
    {
      id: 'received',
      label: 'Received',
      value: today.receivedToday,
      tone: 'info',
      icon: <Inbox size={16} />,
    },
    {
      id: 'submitted',
      label: 'Submitted',
      value: today.submittedToday,
      tone: 'positive',
      icon: <Send size={16} />,
    },
    {
      id: 'collected',
      label: 'Collected',
      value: today.collectedToday,
      tone: 'positive',
      icon: <Package size={16} />,
    },
    {
      id: 'rejected',
      label: 'Rejected',
      value: today.rejectedToday,
      tone: 'negative',
      icon: <XCircle size={16} />,
    },
    {
      id: 'embassy',
      label: 'Pending embassy',
      value: today.pendingEmbassy,
      tone: 'warning',
      icon: <ClipboardList size={16} />,
    },
    {
      id: 'documents',
      label: 'Pending docs',
      value: today.pendingClientDocuments,
      tone: 'warning',
      icon: <FileWarning size={16} />,
    },
    {
      id: 'sla',
      label: 'SLA breaches',
      value: today.slaBreaches,
      tone: 'negative',
      icon: <AlertTriangle size={16} />,
    },
  ]

  return (
    <Stack spacing={DASHBOARD_SPACING.field}>
      {pulseParts.length > 0 ? (
        <SuperAdminPulseBanner
          icon={<ClipboardList size={16} />}
          title="Operations pulse"
          description={pulseParts.join(' · ')}
          tone={today.slaBreaches > 0 ? 'error' : 'warning'}
          action={
            <Button
              label="Open Ops dashboard"
              variant="outlined"
              size="sm"
              onClick={() => onNavigate(OPS_DASHBOARD_HREF)}
            />
          }
        />
      ) : null}

      <Box
        sx={{
          display: 'grid',
          gap: 1,
          gridTemplateColumns: {
            xs: 'repeat(2, minmax(0, 1fr))',
            sm: 'repeat(4, minmax(0, 1fr))',
            lg: 'repeat(7, minmax(0, 1fr))',
          },
        }}
      >
        {networkKpis.map((kpi) => (
          <Box key={kpi.id} sx={{ minWidth: 0 }}>
            <HeroMetric
              label={kpi.label}
              value={kpi.value}
              icon={kpi.icon}
              tone={kpi.tone}
              loading={loading}
              animate
            />
          </Box>
        ))}
      </Box>

      <OpsOrgInfographics data={snapshot} loading={loading} dense />

      <OpsOrgWorkloadBySegment data={snapshot} loading={loading} dense />
    </Stack>
  )
}
