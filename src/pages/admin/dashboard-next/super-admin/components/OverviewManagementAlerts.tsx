import { useMemo } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { Button } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { executiveCardLevel2Sx } from '@/pages/admin/dashboard/components/executiveDashboardTokens'
import { AlertPanel } from '../../shared/dashboard-ui-kit'
import { sortManagementAlerts } from '../../shared/dashboard-intelligence/alerts'
import type { ManagementAlertRecord } from '../../shared/dashboard-intelligence'
import type { DashboardAlertItem, DashboardAlertSeverity } from '../../shared/types'
import type { UiKitListItem } from '../../shared/dashboard-ui-kit'

export interface OverviewManagementAlertsProps {
  alerts: ManagementAlertRecord[] | DashboardAlertItem[]
  loading?: boolean
  onOpenWork?: () => void
  onOpenTab?: (tabId: string) => void
}

function isManagementRecord(
  alert: ManagementAlertRecord | DashboardAlertItem,
): alert is ManagementAlertRecord {
  return 'businessImpact' in alert || 'financialImpact' in alert || 'affectedSegment' in alert
}

function severityBadge(severity: string): { label: string; tone: UiKitListItem['badgeTone'] } {
  const s = severity.toLowerCase()
  if (s === 'critical') return { label: 'Critical', tone: 'negative' }
  if (s === 'high' || s === 'warning') return { label: 'High', tone: 'warning' }
  if (s === 'medium' || s === 'info') return { label: 'Medium', tone: 'info' }
  return { label: 'Low', tone: 'neutral' }
}

function alertTab(alert: ManagementAlertRecord | DashboardAlertItem): string {
  const hay = [
    alert.title,
    'description' in alert ? alert.description : '',
    isManagementRecord(alert) ? alert.affectedSegment : '',
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  if (hay.includes('receivable') || hay.includes('finance') || hay.includes('cash') || hay.includes('credit')) {
    return 'finance'
  }
  if (hay.includes('embassy') || hay.includes('sla') || hay.includes('documentation') || hay.includes('ops') || hay.includes('marine')) {
    return 'operations'
  }
  if (hay.includes('client')) return 'clients'
  return 'work'
}

/** Business-critical alerts only — Critical → Low. */
export function OverviewManagementAlerts({
  alerts,
  loading,
  onOpenWork,
  onOpenTab,
}: OverviewManagementAlertsProps) {
  const colors = usePublicBrandColors()

  const items = useMemo((): UiKitListItem[] => {
    const management = alerts.filter(isManagementRecord) as ManagementAlertRecord[]
    const sorted =
      management.length > 0
        ? sortManagementAlerts(management, 'severity')
        : [...(alerts as DashboardAlertItem[])].sort((a, b) => {
            const rank: Record<DashboardAlertSeverity, number> = {
              critical: 0,
              warning: 1,
              info: 2,
              success: 3,
            }
            return rank[a.severity] - rank[b.severity]
          })

    return sorted.map((alert) => {
      const badge = severityBadge(
        isManagementRecord(alert) ? alert.severity : alert.severity,
      )
      const count =
        'count' in alert && alert.count != null ? `${alert.count} affected` : null
      const financial =
        isManagementRecord(alert) && alert.financialImpact
          ? `Impact ${alert.financialImpact}`
          : null
      const description =
        ('description' in alert && alert.description
          ? String(alert.description)
          : isManagementRecord(alert)
            ? alert.businessImpact
            : undefined) ?? undefined

      return {
        id: alert.id,
        primary: alert.title.replace(/^Critical · |^High · |^Medium · |^Low · /i, ''),
        secondary: [description, count, financial, 'View details']
          .filter(Boolean)
          .join(' · '),
        badgeLabel: badge.label,
        badgeTone: badge.tone,
        onClick: () => onOpenTab?.(alertTab(alert)),
      }
    })
  }, [alerts, onOpenTab])

  return (
    <Box sx={{ ...executiveCardLevel2Sx(colors), p: 0, overflow: 'hidden', height: '100%' }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'stretch', sm: 'flex-start' }}
        justifyContent="space-between"
        spacing={1}
        sx={{ px: 2, pt: 2, pb: 0 }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: 14 }}>
            Management alerts
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
            Critical · High · Medium · Low
          </Typography>
        </Box>
        <Button label="Open Work Queue" variant="text" size="sm" onClick={onOpenWork} />
      </Stack>
      <Box sx={{ px: 1, pb: 1.5 }}>
        <AlertPanel
          items={items}
          loading={loading}
          maxItems={8}
          onShowMore={onOpenWork}
          empty={!loading && items.length === 0}
          emptyTitle="No management alerts"
          sx={{
            boxShadow: 'none',
            border: 'none',
            bgcolor: 'transparent',
            '& .MuiCardHeader-root': { display: 'none' },
          }}
        />
      </Box>
    </Box>
  )
}
