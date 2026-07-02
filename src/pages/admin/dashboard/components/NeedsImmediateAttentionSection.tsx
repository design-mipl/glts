import { Box, Grid, Stack, Typography } from '@mui/material'
import { ArrowRight, type LucideIcon } from 'lucide-react'
import { Badge, Button } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { ExecutiveSectionHeader } from './ExecutiveSectionHeader'
import { executiveCardLevel3Sx } from './executiveDashboardTokens'

export type ExecutiveAlertPriority = 'critical' | 'high' | 'medium'

export interface ExecutiveAttentionAlert {
  id: string
  title: string
  count: number
  oldestWaiting: string
  priority: ExecutiveAlertPriority
}

function priorityAccent(priority: ExecutiveAlertPriority, colors: ReturnType<typeof usePublicBrandColors>) {
  if (priority === 'critical') return '#DC2626'
  if (priority === 'high') return '#D97706'
  return colors.greenDark
}

function priorityBadge(priority: ExecutiveAlertPriority): 'error' | 'warning' | 'info' {
  if (priority === 'critical') return 'error'
  if (priority === 'high') return 'warning'
  return 'info'
}

function AttentionAlertCard({
  alert,
  icon: Icon,
  onView,
}: {
  alert: ExecutiveAttentionAlert
  icon: LucideIcon
  onView?: (alert: ExecutiveAttentionAlert) => void
}) {
  const colors = usePublicBrandColors()
  const accent = priorityAccent(alert.priority, colors)

  return (
    <Box sx={{ ...executiveCardLevel3Sx(colors, accent), p: 1.5, height: '100%' }}>
      <Stack spacing={1.25} sx={{ height: '100%' }}>
        <Stack direction="row" spacing={1} alignItems="flex-start">
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '10px',
              bgcolor: colors.surfaceAlt,
              color: accent,
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0,
            }}
          >
            <Icon size={16} />
          </Box>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={0.5}>
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: colors.navy, lineHeight: 1.25 }}>
                {alert.title}
              </Typography>
              <Badge label={String(alert.count)} color={priorityBadge(alert.priority)} size="sm" />
            </Stack>
            <Typography sx={{ fontSize: 11, color: colors.textMuted, mt: 0.5 }}>
              Oldest waiting: {alert.oldestWaiting}
            </Typography>
          </Box>
        </Stack>
        {onView ? (
          <Button
            label="Review cases"
            variant="text"
            size="sm"
            endIcon={<ArrowRight size={14} />}
            onClick={() => onView(alert)}
            sx={{ alignSelf: 'flex-start', mt: 'auto' }}
          />
        ) : null}
      </Stack>
    </Box>
  )
}

export interface NeedsImmediateAttentionSectionProps {
  alerts: ExecutiveAttentionAlert[]
  resolveIcon: (title: string) => LucideIcon
  onViewAlert?: (alert: ExecutiveAttentionAlert) => void
}

export function NeedsImmediateAttentionSection({
  alerts,
  resolveIcon,
  onViewAlert,
}: NeedsImmediateAttentionSectionProps) {
  const colors = usePublicBrandColors()

  return (
    <Box>
      <ExecutiveSectionHeader
        title="Needs immediate attention"
        description="Priority operational alerts requiring management action."
        actionLabel="Open alert center"
        onAction={onViewAlert ? () => onViewAlert(alerts[0]) : undefined}
      />
      {alerts.length === 0 ? (
        <Box sx={{ ...executiveCardLevel3Sx(colors, colors.border), p: 3, textAlign: 'center' }}>
          <Typography sx={{ fontSize: 13, color: colors.textMuted }}>
            No priority alerts for the selected filters.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {alerts.map((alert) => (
            <Grid key={alert.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <AttentionAlertCard alert={alert} icon={resolveIcon(alert.title)} onView={onViewAlert} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )
}
