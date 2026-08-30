import { Box, Stack, Typography } from '@mui/material'
import { Badge, BaseCard } from '@/design-system/UIComponents'
import {
  formatRetailPaymentAmount,
  retailPaymentMethodLabel,
  retailPaymentStatusLabel,
  type RetailCustomerPaymentSnapshot,
} from '@/shared/types/retailCustomerPayment'

interface CustomerPaymentPanelProps {
  payment?: RetailCustomerPaymentSnapshot | null
}

function ReadRow({ label, value }: { label: string; value: string }) {
  return (
    <Stack spacing={0.25}>
      <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11, fontWeight: 600 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 500 }}>
        {value || '—'}
      </Typography>
    </Stack>
  )
}

function formatPaidAt(iso?: string): string {
  if (!iso?.trim()) return '—'
  const d = new Date(iso.includes('T') ? iso : `${iso}T12:00:00`)
  if (Number.isNaN(d.getTime())) return iso
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

/**
 * Read-only view of customer-paid amounts from the website retail journey.
 * Ops cannot edit; finance-only edits are out of scope for this panel.
 */
export function CustomerPaymentPanel({ payment }: CustomerPaymentPanelProps) {
  if (!payment) {
    return (
      <BaseCard sx={{ p: 2 }}>
        <Stack spacing={1}>
          <Typography variant="subtitle2" sx={{ fontSize: 13, fontWeight: 600 }}>
            Customer payment
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
            No customer payment recorded for this application yet. Payments from the website retail
            journey appear here after the customer completes checkout.
          </Typography>
        </Stack>
      </BaseCard>
    )
  }

  const currency = payment.currency || 'INR'
  const methodLabel = payment.methodLabel || retailPaymentMethodLabel(payment.method)
  const statusLabel = retailPaymentStatusLabel(payment.status)
  const statusColor =
    payment.status === 'paid'
      ? 'success'
      : payment.status === 'failed'
        ? 'error'
        : payment.status === 'refunded'
          ? 'warning'
          : 'neutral'

  return (
    <Stack spacing={2} sx={{ minHeight: 0 }}>
      <BaseCard sx={{ p: 2 }}>
        <Stack spacing={2}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
            <Typography variant="subtitle2" sx={{ fontSize: 13, fontWeight: 600 }}>
              Customer payment
            </Typography>
            <Badge label={statusLabel} color={statusColor} size="sm" />
          </Stack>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 1.5,
            }}
          >
            <ReadRow label="Payment method" value={methodLabel} />
            <ReadRow label="Paid at" value={formatPaidAt(payment.paidAt)} />
            <ReadRow label="Reference" value={payment.referenceNumber || '—'} />
            <ReadRow
              label="Travellers"
              value={payment.travellerCount != null ? String(payment.travellerCount) : '—'}
            />
            {payment.processingTierLabel ? (
              <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
                <ReadRow label="Processing tier" value={payment.processingTierLabel} />
              </Box>
            ) : null}
          </Box>
        </Stack>
      </BaseCard>

      <BaseCard sx={{ p: 2 }}>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2" sx={{ fontSize: 13, fontWeight: 600 }}>
            Amount breakdown
          </Typography>
          <Stack spacing={1}>
            {payment.lineItems.map(item => (
              <Stack
                key={item.id}
                direction="row"
                justifyContent="space-between"
                alignItems="baseline"
                spacing={2}
              >
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                  {item.label}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontSize: 13, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}
                >
                  {formatRetailPaymentAmount(item.amount, item.currency || currency)}
                </Typography>
              </Stack>
            ))}
            <Box sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 1 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="baseline">
                <Typography variant="body2" sx={{ fontSize: 13, fontWeight: 700 }}>
                  Total paid
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontSize: 14, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}
                >
                  {formatRetailPaymentAmount(payment.totalAmount, currency)}
                </Typography>
              </Stack>
            </Box>
          </Stack>
          {payment.remarks?.trim() ? (
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
              Remarks: {payment.remarks}
            </Typography>
          ) : null}
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
            Read-only for operations. Finance may adjust records separately when required.
          </Typography>
        </Stack>
      </BaseCard>
    </Stack>
  )
}
