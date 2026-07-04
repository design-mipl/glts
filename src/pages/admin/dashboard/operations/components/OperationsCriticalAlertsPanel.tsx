import { Box, Stack, Typography } from '@mui/material'
import { useTheme, type Theme } from '@mui/material/styles'
import {
  AlertTriangle,
  Calendar,
  FileWarning,
  Plane,
  Timer,
  type LucideIcon,
} from 'lucide-react'
import { Badge, BaseCard } from '@/design-system/UIComponents'
import type { OpsAlertPriority, OperationsCriticalAlert } from '../data/operationsConsultantDashboardMock'

const ALERT_ICONS: Record<string, LucideIcon> = {
  sla: AlertTriangle,
  documents: FileWarning,
  qc: Timer,
  appointment: Calendar,
  marine: Plane,
  escalation: AlertTriangle,
}

function resolveIcon(title: string): LucideIcon {
  const lower = title.toLowerCase()
  if (lower.includes('sla')) return ALERT_ICONS.sla
  if (lower.includes('document')) return ALERT_ICONS.documents
  if (lower.includes('qc')) return ALERT_ICONS.qc
  if (lower.includes('appointment')) return ALERT_ICONS.appointment
  if (lower.includes('marine')) return ALERT_ICONS.marine
  return ALERT_ICONS.escalation
}

function priorityBorderColor(priority: OpsAlertPriority, theme: Theme): string {
  if (priority === 'critical') return theme.palette.error.main
  if (priority === 'high') return theme.palette.warning.main
  return theme.palette.info.main
}

function priorityBadgeColor(priority: OpsAlertPriority): 'error' | 'warning' | 'info' {
  if (priority === 'critical') return 'error'
  if (priority === 'high') return 'warning'
  return 'info'
}

export interface OperationsCriticalAlertsPanelProps {
  alerts: OperationsCriticalAlert[]
}

export function OperationsCriticalAlertsPanel({ alerts }: OperationsCriticalAlertsPanelProps) {
  const theme = useTheme()

  return (
    <BaseCard sx={{ height: '100%' }}>
      <Box sx={{ px: 2, pt: 2, pb: 1 }}>
        <Typography variant="subtitle2" fontWeight={700}>
          Critical alerts
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Items requiring your immediate attention
        </Typography>
      </Box>
      <Stack spacing={1} sx={{ px: 2, pb: 2 }}>
        {alerts.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
            No critical alerts for your queue.
          </Typography>
        ) : (
          alerts.map((alert) => {
            const Icon = resolveIcon(alert.title)
            const borderColor = priorityBorderColor(alert.priority, theme)
            return (
              <Box
                key={alert.id}
                sx={{
                  p: 1.5,
                  borderRadius: '10px',
                  border: 1,
                  borderColor: 'divider',
                  borderLeftWidth: 3,
                  borderLeftColor: borderColor,
                  bgcolor: 'background.paper',
                }}
              >
                <Stack direction="row" spacing={1.25} alignItems="flex-start">
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '8px',
                      bgcolor: 'action.hover',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: borderColor,
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={16} />
                  </Box>
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                      <Typography variant="body2" fontWeight={600}>
                        {alert.title}
                      </Typography>
                      <Badge
                        label={String(alert.count)}
                        color={priorityBadgeColor(alert.priority)}
                        size="sm"
                      />
                    </Stack>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                      Oldest waiting: {alert.oldestWaiting}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            )
          })
        )}
      </Stack>
    </BaseCard>
  )
}
