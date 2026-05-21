import { Box, Typography } from '@mui/material'
import { BillingKPICards } from '@/design-system/UIComponents/Templates/BillingTemplate'
import { useBillingData } from '../hooks/useBillingData'

export default function PaymentsPage() {
  const { kpiData, formatINR } = useBillingData()

  return (
    <Box>
      <BillingKPICards kpis={kpiData} formatAmount={formatINR} />
      <Typography variant="h1" sx={{ mb: 1 }}>
        Payments
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Payments view — template stub. Copy the Billings listing pattern and filter by paid / partially paid status.
      </Typography>
    </Box>
  )
}
