import { Box, Card, Typography, Stack, Chip } from '@mui/material'
import { CheckCircle2, Circle, AlertCircle, Clock } from 'lucide-react'
import { BORDER_RADIUS, BORDER_WIDTH, SHADOWS } from '@/design-system/tokens'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import type { ChecklistItem } from '../data/applicationFlowData'

interface DocumentChecklistPanelProps {
  country: string
  items: ChecklistItem[]
}

export function DocumentChecklistPanel({ country, items }: DocumentChecklistPanelProps) {
  const colors = usePublicBrandColors()
  const statusConfig = {
    uploaded: { icon: CheckCircle2, color: colors.greenBright, label: 'Uploaded' },
    missing: { icon: Circle, color: colors.textMuted, label: 'Missing' },
    invalid: { icon: AlertCircle, color: '#EF4444', label: 'Invalid' },
    pending: { icon: Clock, color: '#D97706', label: 'Pending review' },
  }

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: BORDER_RADIUS.xl,
        border: `${BORDER_WIDTH.thin} solid ${colors.border}`,
        bgcolor: colors.white,
      }}
    >
      <Typography sx={{ fontWeight: 700, fontSize: 14, color: colors.navy, mb: 0.5 }}>
        Checklist · {country}
      </Typography>
      <Typography sx={{ fontSize: 11, color: colors.textMuted, mb: 1.5 }}>
        Required documents for this visa type
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
          gap: 1.5,
        }}
      >
        {items.map(item => {
          const cfg = statusConfig[item.status]
          const Icon = cfg.icon
          return (
            <Card
              key={item.id}
              elevation={0}
              sx={{
                p: 1.5,
                height: '100%',
                border: `${BORDER_WIDTH.thin} solid ${colors.border}`,
                borderRadius: BORDER_RADIUS.lg,
                boxShadow: SHADOWS.sm,
                bgcolor: colors.white,
              }}
            >
              <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1}>
                <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ minWidth: 0, flex: 1 }}>
                  <Icon size={14} color={cfg.color} style={{ flexShrink: 0, marginTop: 2 }} />
                  <Typography sx={{ fontSize: 13, fontWeight: item.required ? 700 : 600, color: colors.navy }}>
                    {item.label}
                    {item.required ? (
                      <Typography component="span" sx={{ fontSize: 11, color: colors.textMuted, ml: 0.25 }}>
                        *
                      </Typography>
                    ) : null}
                  </Typography>
                </Stack>
                <Chip label={cfg.label} size="small" sx={{ height: 22, fontSize: 11, fontWeight: 700, flexShrink: 0 }} />
              </Stack>
            </Card>
          )
        })}
      </Box>
    </Box>
  )
}
