import { Typography } from '@mui/material'
import { formatInr } from '@/shared/utils/invoiceCalculations'

interface FinanceAmountCellProps {
  amount: number
  fontWeight?: number
  color?: string
}

export function FinanceAmountCell({ amount, fontWeight = 500, color }: FinanceAmountCellProps) {
  return (
    <Typography variant="body2" fontWeight={fontWeight} color={color ?? 'text.primary'}>
      {formatInr(amount)}
    </Typography>
  )
}
