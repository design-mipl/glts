import { Box, Grid, Stack, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { useNavigate } from 'react-router-dom'
import {
  Calendar,
  CheckCircle2,
  ClipboardList,
  FileText,
  Send,
  Wallet,
  type LucideIcon,
} from 'lucide-react'
import { BaseCard } from '@/design-system/UIComponents'
import type { DocumentationKpiMetric } from '../../data/documentationDashboardMock'

const ICON_MAP: Record<string, LucideIcon> = {
  files: FileText,
  documents: ClipboardList,
  review: CheckCircle2,
  form: FileText,
  fee: Wallet,
  calendar: Calendar,
  ready: CheckCircle2,
  submit: Send,
}

function TodayKpiCard({ metric }: { metric: DocumentationKpiMetric }) {
  const theme = useTheme()
  const navigate = useNavigate()
  const Icon = ICON_MAP[metric.iconKey] ?? FileText
  const paletteColor =
    (metric.accent in theme.palette
      ? (theme.palette[metric.accent as keyof typeof theme.palette] as { main?: string })?.main
      : undefined) ?? theme.palette.primary.main

  return (
    <BaseCard hoverable sx={{ height: '100%', cursor: 'pointer' }} onClick={() => navigate(metric.href)}>
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1}>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={600}
              sx={{ textTransform: 'uppercase', letterSpacing: 0.4, lineHeight: 1.2 }}
            >
              {metric.label}
            </Typography>
            <Typography variant="h5" fontWeight={700} sx={{ mt: 0.5, lineHeight: 1.1 }}>
              {metric.total.toLocaleString()}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 0.5 }} flexWrap="wrap" useFlexGap>
              <Typography variant="caption" color="text.secondary">
                Due today: <strong>{metric.dueToday}</strong>
              </Typography>
              {metric.overdue > 0 ? (
                <Typography variant="caption" color="error.main" fontWeight={600}>
                  Overdue: {metric.overdue}
                </Typography>
              ) : null}
            </Stack>
          </Box>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              bgcolor: alpha(paletteColor, 0.12),
              color: paletteColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Icon size={18} />
          </Box>
        </Stack>
      </Box>
    </BaseCard>
  )
}

export interface TodayKpiSectionProps {
  metrics: DocumentationKpiMetric[]
}

export function TodayKpiSection({ metrics }: TodayKpiSectionProps) {
  return (
    <Grid container spacing={2}>
      {metrics.map((metric) => (
        <Grid key={metric.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <TodayKpiCard metric={metric} />
        </Grid>
      ))}
    </Grid>
  )
}
