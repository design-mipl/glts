import { Box, Stack, Typography } from '@mui/material'
import { useTheme, type Theme } from '@mui/material/styles'
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
import { Badge, BaseCard } from '@/design-system/UIComponents'
import type { AlertPriority, ExecutiveCriticalAlert } from '../data/operationsDashboardMock'

const ALERT_ICONS: Record<string, LucideIcon> = {
  sla: AlertTriangle,
  documents: FileWarning,
  qc: Timer,
  passport: Clock,
  marine: Plane,
  corrected: ShieldAlert,
  movement: UserX,
  escalation: AlertTriangle,
}

function resolveIcon(title: string): LucideIcon {
  const lower = title.toLowerCase()
  if (lower.includes('sla')) return ALERT_ICONS.sla
  if (lower.includes('document')) return ALERT_ICONS.documents
  if (lower.includes('qc')) return ALERT_ICONS.qc
  if (lower.includes('passport')) return ALERT_ICONS.passport
  if (lower.includes('marine') || lower.includes('crew')) return ALERT_ICONS.marine
  if (lower.includes('corrected')) return ALERT_ICONS.corrected
  if (lower.includes('movement')) return ALERT_ICONS.movement
  return ALERT_ICONS.escalation
}

function priorityBorderColor(priority: AlertPriority, theme: Theme): string {
  if (priority === 'critical') return theme.palette.error.main
  if (priority === 'high') return theme.palette.warning.main
  return theme.palette.info.main
}

function priorityBadgeColor(priority: AlertPriority): 'error' | 'warning' | 'info' {
  if (priority === 'critical') return 'error'
  if (priority === 'high') return 'warning'
  return 'info'
}

export interface ExecutiveCriticalAlertsPanelProps {
  alerts: ExecutiveCriticalAlert[]
}

export function ExecutiveCriticalAlertsPanel({ alerts }: ExecutiveCriticalAlertsPanelProps) {
  const theme = useTheme()

  return (
    <BaseCard sx={{ height: '100%' }}>
      <Box sx={{ px: 2, pt: 2, pb: 1 }}>
        <Typography variant="subtitle2" fontWeight={700}>
          Critical alerts
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Items requiring immediate management attention
        </Typography>
      </Box>
      <Stack spacing={1} sx={{ px: 2, pb: 2 }}>
        {alerts.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
            No critical alerts for the selected filters.
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
                  cursor: 'pointer',
                  transition: 'box-shadow 150ms ease',
                  '&:hover': { boxShadow: theme.shadows[1] },
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
