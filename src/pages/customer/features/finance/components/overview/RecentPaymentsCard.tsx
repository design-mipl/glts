import { Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { BaseCard, Badge, Button } from '@/design-system/UIComponents'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import { useCustomerPortalBase } from '@/pages/customer/features/shared/hooks/useCustomerPortalBase'
import type { CustomerPaymentRow } from '../../types/customerFinance.types'

interface RecentPaymentsCardProps {
  payments: CustomerPaymentRow[]
}

export function RecentPaymentsCard({ payments }: RecentPaymentsCardProps) {
  const navigate = useNavigate()
  const { base } = useCustomerPortalBase()

  return (
    <BaseCard sx={{ p: 2, height: '100%' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
        <Typography variant="subtitle1" fontWeight={700}>
          Recent Payments
        </Typography>
        <Button
          label="View all"
          variant="text"
          size="sm"
          onClick={() => navigate(`${base}/finance/payments`)}
        />
      </Stack>
      {payments.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No payments recorded yet.
        </Typography>
      ) : (
        <Stack spacing={1.25}>
          {payments.map(pay => (
            <Stack
              key={pay.id}
              spacing={0.5}
              sx={{
                p: 1.25,
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
                cursor: 'pointer',
                '&:hover': { bgcolor: 'action.hover' },
              }}
              onClick={() => navigate(`${base}/finance/payments/${pay.id}`)}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Typography variant="body2" fontWeight={700}>
                  {pay.receiptNumber}
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {formatInr(pay.amount)}
                </Typography>
              </Stack>
              <Typography variant="caption" color="text.secondary">
                {pay.invoiceNumber} · {pay.paymentDate}
              </Typography>
              <Badge
                label={pay.verificationStatus}
                color={pay.verificationStatus === 'verified' ? 'success' : 'neutral'}
                size="sm"
              />
            </Stack>
          ))}
        </Stack>
      )}
    </BaseCard>
  )
}
