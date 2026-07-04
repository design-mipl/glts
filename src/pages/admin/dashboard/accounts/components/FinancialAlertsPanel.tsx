import { Box, Stack, Typography } from '@mui/material'
import { useTheme, type Theme } from '@mui/material/styles'
import {
  AlertTriangle,
  Calendar,
  Clock,
  CreditCard,
  FileText,
  Scale,
  Wallet,
  type LucideIcon,
} from 'lucide-react'
import { Badge, BaseCard } from '@/design-system/UIComponents'
import type { AccountsAlertPriority, FinancialAlert } from '../data/accountsDashboardMock'

function resolveIcon(title: string): LucideIcon {
  const lower = title.toLowerCase()
  if (lower.includes('overdue')) return AlertTriangle
  if (lower.includes('reconciliation')) return Scale
  if (lower.includes('vendor')) return Wallet
  if (lower.includes('follow-up') || lower.includes('collection')) return CreditCard
  if (lower.includes('credit')) return AlertTriangle
  if (lower.includes('submission')) return Calendar
  if (lower.includes('invoice')) return FileText
  return Clock
}

function priorityBorderColor(priority: AccountsAlertPriority, theme: Theme): string {
  if (priority === 'critical') return theme.palette.error.main
  if (priority === 'high') return theme.palette.warning.main
  return theme.palette.info.main
}

function priorityBadgeColor(priority: AccountsAlertPriority): 'error' | 'warning' | 'info' {
  if (priority === 'critical') return 'error'
  if (priority === 'high') return 'warning'
  return 'info'
}

export interface FinancialAlertsPanelProps {
  alerts: FinancialAlert[]
}

export function FinancialAlertsPanel({ alerts }: FinancialAlertsPanelProps) {
  const theme = useTheme()

  return (
    <BaseCard sx={{ height: '100%' }}>
      <Box sx={{ px: 2, pt: 2, pb: 1 }}>
        <Typography variant="subtitle2" fontWeight={700}>
          Financial alerts
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Items requiring accounts team attention
        </Typography>
      </Box>
      <Stack spacing={1} sx={{ px: 2, pb: 2 }}>
        {alerts.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
            No financial alerts at this time.
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
                      Oldest pending: {alert.oldestPending}
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
