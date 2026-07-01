import { Box, Stack, Typography } from '@mui/material'
import { useTheme, type Theme } from '@mui/material/styles'
import {
  AlertTriangle,
  Calendar,
  Clock,
  CreditCard,
  FileText,
  FileWarning,
  Send,
  Timer,
  type LucideIcon,
} from 'lucide-react'
import { Badge, BaseCard } from '@/design-system/UIComponents'
import type { DocAlertPriority, DocumentationCriticalAlert } from '../data/documentationDashboardMock'

function resolveIcon(title: string): LucideIcon {
  const lower = title.toLowerCase()
  if (lower.includes('document')) return FileWarning
  if (lower.includes('qc')) return Timer
  if (lower.includes('form')) return FileText
  if (lower.includes('fee')) return CreditCard
  if (lower.includes('appointment')) return Calendar
  if (lower.includes('submission')) return Send
  if (lower.includes('sla')) return AlertTriangle
  return Clock
}

function priorityBorderColor(priority: DocAlertPriority, theme: Theme): string {
  if (priority === 'critical') return theme.palette.error.main
  if (priority === 'high') return theme.palette.warning.main
  return theme.palette.info.main
}

function priorityBadgeColor(priority: DocAlertPriority): 'error' | 'warning' | 'info' {
  if (priority === 'critical') return 'error'
  if (priority === 'high') return 'warning'
  return 'info'
}

export interface DocumentationCriticalAlertsPanelProps {
  alerts: DocumentationCriticalAlert[]
}

export function DocumentationCriticalAlertsPanel({
  alerts,
}: DocumentationCriticalAlertsPanelProps) {
  const theme = useTheme()

  return (
    <BaseCard sx={{ height: '100%' }}>
      <Box sx={{ px: 2, pt: 2, pb: 1 }}>
        <Typography variant="subtitle2" fontWeight={700}>
          Critical alerts
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Documentation processing items needing attention
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
