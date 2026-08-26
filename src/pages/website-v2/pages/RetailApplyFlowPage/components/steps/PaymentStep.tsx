import { Stack, Typography } from '@mui/material'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import type { RetailJourney } from '@/shared/services/retailJourneyResolver'
import { StepShell } from '../StepShell'
import type { RetailFlowDraft } from '../../types'

interface PaymentStepProps {
  journey: RetailJourney
  draft: RetailFlowDraft
  onBack: () => void
  onPay: () => void
}

function resolveExtraLineItem(
  label: string,
  selection: RetailFlowDraft['insurance'],
  services: RetailJourney['insuranceServices'],
): { label: string; amount: number } | undefined {
  if (selection.choice !== 'glts_arranged') return undefined
  const service = services.find((entry) => entry.id === selection.serviceId)
  if (!service || service.defaultPrice == null) return undefined
  return { label: `${label} — ${service.serviceName}`, amount: service.defaultPrice }
}

export function PaymentStep({ journey, draft, onBack, onPay }: PaymentStepProps) {
  const colors = usePublicBrandColors()

  const extraLineItems = [
    resolveExtraLineItem('Travel insurance', draft.insurance, journey.insuranceServices),
    resolveExtraLineItem('Flight ticket', draft.flightTicket, journey.flightTicketServices),
  ].filter((item): item is { label: string; amount: number } => Boolean(item))

  const extrasTotal = extraLineItems.reduce((sum, item) => sum + item.amount, 0)
  const grandTotal = journey.pricing.total + extrasTotal

  return (
    <StepShell title="Payment" helperText="Itemized breakdown of everything you're paying for." onBack={onBack} onContinue={onPay} continueLabel={`Pay ₹${grandTotal.toLocaleString('en-IN')}`}>
      <Stack spacing={0.75}>
        {journey.pricing.visaFee.map((item) => (
          <Stack key={item.id} direction="row" justifyContent="space-between" sx={{ py: 0.5 }}>
            <Typography sx={{ fontSize: '13px', color: colors.textSecondary }}>{item.label}</Typography>
            <Typography sx={{ fontSize: '13px', color: colors.text }}>₹{item.amount.toLocaleString('en-IN')}</Typography>
          </Stack>
        ))}
        {journey.pricing.vfsServiceRates
          .filter((rate) => !rate.isUrgentCharge)
          .map((rate) => (
            <Stack key={rate.id} direction="row" justifyContent="space-between" sx={{ py: 0.5 }}>
              <Typography sx={{ fontSize: '13px', color: colors.textSecondary }}>{rate.serviceName}</Typography>
              <Typography sx={{ fontSize: '13px', color: colors.text }}>₹{rate.amount.toLocaleString('en-IN')}</Typography>
            </Stack>
          ))}
        {extraLineItems.map((item) => (
          <Stack key={item.label} direction="row" justifyContent="space-between" sx={{ py: 0.5 }}>
            <Typography sx={{ fontSize: '13px', color: colors.textSecondary }}>{item.label}</Typography>
            <Typography sx={{ fontSize: '13px', color: colors.text }}>₹{item.amount.toLocaleString('en-IN')}</Typography>
          </Stack>
        ))}
        <Stack direction="row" justifyContent="space-between" sx={{ pt: 1.5, mt: 1, borderTop: `1.5px solid ${colors.border}` }}>
          <Typography sx={{ fontSize: '15px', fontWeight: 700, color: colors.text }}>Total</Typography>
          <Typography sx={{ fontSize: '15px', fontWeight: 700, color: colors.text }}>₹{grandTotal.toLocaleString('en-IN')}</Typography>
        </Stack>
      </Stack>
    </StepShell>
  )
}
