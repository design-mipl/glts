import { Box, Card, Typography } from '@mui/material'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { BORDER_RADIUS, BORDER_WIDTH, SHADOWS } from '@/design-system/tokens'
import type { FinanceSnapshot } from '../types/accountWorkspace'

export interface ProfileFinanceMetricsProps {
  finance: FinanceSnapshot
}

export function ProfileFinanceMetrics({ finance }: ProfileFinanceMetricsProps) {
  const colors = usePublicBrandColors()

  const items = [
    { id: 'cycle', label: 'Billing cycle', value: finance.billingCycle },
    { id: 'limit', label: 'Credit limit', value: finance.creditLimit },
    {
      id: 'outstanding',
      label: 'Outstanding amount',
      value: finance.outstandingAmount,
      highlight: finance.outstandingAlert,
    },
    { id: 'invoice', label: 'Invoice summary', value: finance.invoiceSummary },
  ]

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
        gap: 1.5,
      }}
    >
      {items.map(item => (
        <Card
          key={item.id}
          elevation={0}
          sx={{
            p: 1.5,
            minHeight: 80,
            border: `${BORDER_WIDTH.thin} solid`,
            borderColor: item.highlight ? 'warning.main' : 'divider',
            borderRadius: BORDER_RADIUS.lg,
            boxShadow: SHADOWS.sm,
            bgcolor: 'background.paper',
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.2, fontWeight: 600 }}>
            {item.label}
          </Typography>
          <Typography
            sx={{
              mt: 0.5,
              fontSize: '1.1rem',
              fontWeight: 700,
              lineHeight: 1.2,
              color: item.highlight ? 'warning.dark' : colors.navy,
            }}
          >
            {item.value}
          </Typography>
        </Card>
      ))}
    </Box>
  )
}
