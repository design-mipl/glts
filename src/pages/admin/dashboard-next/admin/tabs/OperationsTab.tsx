import { Box, Stack, Typography } from '@mui/material'
import { Truck, UserPlus } from 'lucide-react'
import { Button } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { executiveCardLevel2Sx } from '@/pages/admin/dashboard/components/executiveDashboardTokens'
import {
  AlertCenter,
  InTransitCourierListing,
  MarineTimeline,
  ProcessingTrend,
  DASHBOARD_SPACING,
} from '../../shared'
import type { AdminDashboardTabProps } from '../types'

/**
 * Operations story (delivery & field focus):
 * pulse → ops alerts → IN TRANSIT → throughput → joining-date risk.
 *
 * Queue ageing · market · workload live on Overview (shared with Ops / Docs).
 */
export function OperationsTab({
  data,
  loading,
  onRetry,
  onNavigate,
}: AdminDashboardTabProps) {
  const colors = usePublicBrandColors()
  const inTransitRows = data.inTransitCourierRows ?? []
  const inTransitCount = inTransitRows.length
  const delayed = data.operationsHealth.delayedCases
  const critical = data.operationsHealth.criticalCases
  const unassigned = data.unassignedCount ?? 0

  const openLogistics = () => onNavigate('/admin/ground-operations/logistics')
  const openMarine = () => onNavigate('/admin/application-management/marine')
  const openAssignment = () => onNavigate('/admin/assignment-priority/retail')

  const joiningRiskRows = [...data.marineTimeline].sort((a, b) => {
    const rank = (r: string) => (r === 'red' ? 0 : r === 'amber' ? 1 : 2)
    return rank(a.ragStatus) - rank(b.ragStatus)
  })

  const signalParts = [
    inTransitCount > 0 ? `${inTransitCount} in transit` : null,
    delayed > 0 ? `${delayed} delayed` : null,
    critical > 0 ? `${critical} critical` : null,
    unassigned > 0 ? `${unassigned} unassigned` : null,
  ].filter(Boolean)

  const pulseNeedsAttention = critical > 0 || delayed > 0 || unassigned > 0

  return (
    <Stack spacing={DASHBOARD_SPACING.field}>
      {signalParts.length > 0 ? (
        <Box
          sx={{
            ...executiveCardLevel2Sx(colors),
            px: 2,
            py: 1.5,
            display: 'flex',
            alignItems: { xs: 'stretch', sm: 'center' },
            justifyContent: 'space-between',
            gap: 1.5,
            flexDirection: { xs: 'column', sm: 'row' },
          }}
        >
          <Stack direction="row" spacing={1.25} alignItems="center" minWidth={0}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '8px',
                display: 'grid',
                placeItems: 'center',
                bgcolor: pulseNeedsAttention
                  ? unassigned > 0
                    ? 'error.main'
                    : 'warning.main'
                  : 'info.main',
                color: 'common.white',
                flexShrink: 0,
                opacity: 0.92,
              }}
            >
              {unassigned > 0 ? <UserPlus size={16} /> : <Truck size={16} />}
            </Box>
            <Box minWidth={0}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: 13 }}>
                Operations pulse
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
                {signalParts.join(' · ')}
                {unassigned > 0
                  ? ' — open Assignment Priority to assign user, vendor, or passenger.'
                  : ' — open logistics to manage courier and delivery.'}
              </Typography>
            </Box>
          </Stack>
          <Button
            label={unassigned > 0 ? 'Open assignment desk' : 'Open logistics'}
            variant="outlined"
            size="sm"
            onClick={unassigned > 0 ? openAssignment : openLogistics}
          />
        </Box>
      ) : null}

      <AlertCenter
        title="Ops alerts"
        subtitle="Re-check · payment · arrange · assignment · ground"
        alerts={data.opsAlerts.map((alert) => ({
          id: alert.id,
          title: alert.title,
          description: alert.description,
          severity: alert.severity,
          count: alert.count,
          onClick: () => onNavigate(alert.href),
        }))}
        loading={loading}
        maxItems={6}
        onShowMore={openAssignment}
      />

      <InTransitCourierListing
        title="IN TRANSIT"
        description="Passport/visa with courier — AWB and tracking from Tracking & Logistics"
        rows={inTransitRows}
        loading={loading}
        includeMethod
        pageSize={10}
        onOpen={openLogistics}
        onViewAll={openLogistics}
        viewAllLabel="Open logistics"
      />

      <Box
        sx={{
          ...executiveCardLevel2Sx(colors),
          p: 2,
          minWidth: 0,
        }}
      >
        <ProcessingTrend
          title="Throughput trend"
          subtitle="Processed vs completed"
          points={data.processingTrend}
          loading={loading}
          onRetry={onRetry}
          secondaryLabel="Completed"
        />
      </Box>

      <MarineTimeline
        title="Joining date & crew risk"
        rows={joiningRiskRows}
        loading={loading}
        onRetry={onRetry}
        onViewAll={openMarine}
        onRowClick={() => openMarine()}
      />
    </Stack>
  )
}
