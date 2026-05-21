import { Box, Typography, Card } from '@mui/material'
import { useTheme, alpha } from '@mui/material/styles'
import { FileText, CheckCircle, AlertTriangle, Info } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { BORDER_RADIUS, BORDER_WIDTH, SHADOWS } from '@/design-system/tokens'
import type { KpiCardData } from '../types'

const ICON_MAP: Record<string, LucideIcon> = {
  total: FileText,
  received: CheckCircle,
  outstanding: AlertTriangle,
  tds: Info,
}

export interface BillingKPICardsProps {
  kpis: KpiCardData[]
  formatAmount: (amount: number) => string
}

export default function BillingKPICards({ kpis, formatAmount }: BillingKPICardsProps) {
  const theme = useTheme()

  const colorMap = {
    primary: theme.palette.primary.main,
    success: theme.palette.success.main,
    warning: theme.palette.warning.main,
    info: theme.palette.info.main,
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
        gap: 1.5,
        mb: 3,
      }}
    >
      {kpis.map((kpi) => {
        const Icon = ICON_MAP[kpi.id] ?? FileText
        const mainColor = colorMap[kpi.color]

        return (
          <Card
            key={kpi.id}
            elevation={0}
            sx={{
              p: 1.5,
              height: 80,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              border: `${BORDER_WIDTH.thin} solid`,
              borderColor: 'divider',
              borderRadius: BORDER_RADIUS.lg,
              boxShadow: SHADOWS.sm,
              bgcolor: 'background.paper',
              transition: 'box-shadow 0.2s ease',
              '&:hover': { boxShadow: SHADOWS.md },
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: BORDER_RADIUS.md,
                bgcolor: alpha(mainColor, 0.12),
                color: mainColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Icon size={24} strokeWidth={1.75} />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: 11, display: 'block', lineHeight: 1.3 }}
              >
                {kpi.label}
              </Typography>
              <Typography
                sx={{
                  fontSize: 20,
                  fontWeight: 700,
                  lineHeight: 1,
                  mt: 0.25,
                }}
                noWrap
              >
                {formatAmount(kpi.amount)}
              </Typography>
            </Box>
          </Card>
        )
      })}
    </Box>
  )
}
