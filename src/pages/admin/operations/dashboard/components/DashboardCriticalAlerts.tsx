import { Box, Stack, Typography } from '@mui/material'
import { useTheme, type Theme } from '@mui/material/styles'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import {
  AlertTriangle,
  Calendar,
  FileWarning,
  Plane,
  ShieldAlert,
  type LucideIcon,
} from 'lucide-react'
import { BaseCard } from '@/design-system/UIComponents'
import type { AlertPriority, CriticalAlert } from '../data/operationsDashboardMock'

dayjs.extend(relativeTime)

const ALERT_ICONS: Record<string, LucideIcon> = {
  ticket: Plane,
  insurance: ShieldAlert,
  sla: AlertTriangle,
  documents: FileWarning,
  passport: Calendar,
}

function resolveIcon(alert: CriticalAlert): LucideIcon {
  if (alert.title.toLowerCase().includes('ticket')) return ALERT_ICONS.ticket
  if (alert.title.toLowerCase().includes('insurance')) return ALERT_ICONS.insurance
  if (alert.title.toLowerCase().includes('sla')) return ALERT_ICONS.sla
  if (alert.title.toLowerCase().includes('document')) return ALERT_ICONS.documents
  return ALERT_ICONS.passport
}

function priorityBorderColor(priority: AlertPriority, theme: Theme): string {
  if (priority === 'critical') return theme.palette.error.main
  if (priority === 'high') return theme.palette.warning.main
  return theme.palette.info.main
}

export interface DashboardCriticalAlertsProps {
  alerts: CriticalAlert[]
}

export function DashboardCriticalAlerts({ alerts }: DashboardCriticalAlertsProps) {
  const theme = useTheme()

  return (
    <BaseCard>
      <Box sx={{ px: 2, pt: 2, pb: 1 }}>
        <Typography variant="subtitle2" fontWeight={700}>
          Critical alerts
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Items requiring immediate ops attention
        </Typography>
      </Box>
      <Stack spacing={1} sx={{ px: 2, pb: 2 }}>
        {alerts.map((alert) => {
          const Icon = resolveIcon(alert)
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
                  <Typography variant="body2" fontWeight={600}>
                    {alert.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
                    {alert.description}
                  </Typography>
                  <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 0.5 }}>
                    {dayjs(alert.timestamp).fromNow()}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          )
        })}
      </Stack>
    </BaseCard>
  )
}
