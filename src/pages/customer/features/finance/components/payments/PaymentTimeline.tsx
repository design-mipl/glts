import { Stack, Typography } from '@mui/material'
import { CustomerTimeline } from '@/pages/customer/features/shared/components/CustomerPrimitives'
import type { CustomerPaymentRow } from '../../types/customerFinance.types'

interface PaymentTimelineProps {
  payment: CustomerPaymentRow
}

export function PaymentTimeline({ payment }: PaymentTimelineProps) {
  const events = [
    {
      id: 'recorded',
      title: 'Payment recorded',
      description: `${payment.paymentMode} · ${payment.transactionReference} · ${payment.amount}`,
      timestamp: payment.paymentDate,
      status: 'completed' as const,
    },
    ...(payment.invoice.activities ?? [])
      .filter(a => a.action.toLowerCase().includes('payment') || a.action.toLowerCase().includes('paid'))
      .map(a => ({
        id: a.id,
        title: a.action,
        description: a.detail,
        timestamp: a.timestamp.slice(0, 10),
        status: 'completed' as const,
      })),
    {
      id: 'verification',
      title: `Verification — ${payment.verificationStatus}`,
      description: payment.payment.accountsNotes ?? 'Awaiting accounts team verification.',
      timestamp: payment.payment.proofUploadedAt?.slice(0, 10) ?? payment.paymentDate,
      status: payment.verificationStatus === 'verified' ? ('completed' as const) : ('pending' as const),
    },
  ]

  if (events.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No timeline events for this payment.
      </Typography>
    )
  }

  return (
    <Stack spacing={1}>
      <CustomerTimeline items={events} />
    </Stack>
  )
}
