import { Box, Typography, Stack, Chip } from '@mui/material'
import { CheckCircle2, Circle, AlertCircle, Clock } from 'lucide-react'
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
        borderRadius: '12px',
        border: `1px solid ${colors.border}`,
        bgcolor: colors.white,
      }}
    >
      <Typography sx={{ fontWeight: 700, fontSize: '14px', color: colors.navy, mb: 0.5 }}>
        Checklist · {country}
      </Typography>
      <Typography sx={{ fontSize: '11px', color: colors.textMuted, mb: 1.5 }}>
        Required documents for this visa type
      </Typography>
      <Stack spacing={1}>
        {items.map(item => {
          const cfg = statusConfig[item.status]
          const Icon = cfg.icon
          return (
            <Stack key={item.id} direction="row" alignItems="center" spacing={1}>
              <Icon size={14} color={cfg.color} />
              <Typography sx={{ flex: 1, fontSize: '12px', fontWeight: item.required ? 600 : 500 }}>
                {item.label}
                {item.required && (
                  <Typography component="span" sx={{ fontSize: '10px', color: colors.textMuted, ml: 0.5 }}>
                    *
                  </Typography>
                )}
              </Typography>
              <Chip label={cfg.label} size="small" sx={{ height: 20, fontSize: '10px', fontWeight: 700 }} />
            </Stack>
          )
        })}
      </Stack>
    </Box>
  )
}
