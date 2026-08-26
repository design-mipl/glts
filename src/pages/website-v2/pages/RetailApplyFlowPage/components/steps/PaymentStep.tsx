import { useMemo, type ReactNode } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { Building2, CreditCard, Landmark, Smartphone } from 'lucide-react'
import { BORDER_RADIUS } from '@/design-system/tokens'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { retailFlowColors } from '@/pages/website-v2/theme/retailFlowTokens'
import type { RetailJourney } from '@/shared/services/retailJourneyResolver'
import { StepShell } from '../StepShell'
import type {
  RetailFlowDraft,
  RetailPaymentMethod,
  RetailProcessingTier,
} from '../../types'

interface PaymentStepProps {
  journey: RetailJourney
  draft: RetailFlowDraft
  onChange: (patch: Partial<Pick<RetailFlowDraft, 'processingTier' | 'paymentMethod'>>) => void
  onBack: () => void
  onPay: () => void
}

const TIER_OPTIONS: {
  id: RetailProcessingTier
  label: string
  description: string
  surcharge: number
}[] = [
  {
    id: 'standard',
    label: 'Standard',
    description: 'Regular embassy timeline for this visa.',
    surcharge: 0,
  },
  {
    id: 'priority',
    label: 'Priority',
    description: 'Faster file prep and earlier appointment preference.',
    surcharge: 1499,
  },
  {
    id: 'concierge',
    label: 'Concierge',
    description: 'Dedicated specialist, rush handling, and proactive updates.',
    surcharge: 3999,
  },
]

const PAYMENT_OPTIONS: {
  id: RetailPaymentMethod
  label: string
  description: string
  icon: typeof Smartphone
}[] = [
  { id: 'upi', label: 'UPI', description: 'GPay, PhonePe, Paytm, and other UPI apps', icon: Smartphone },
  { id: 'card', label: 'Cards', description: 'Credit or debit cards', icon: CreditCard },
  { id: 'netbanking', label: 'Net banking', description: 'Pay directly from your bank', icon: Landmark },
]

function formatInr(amount: number) {
  return `₹${amount.toLocaleString('en-IN')}`
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

function PriceRow({
  label,
  hint,
  amount,
  emphasize,
}: {
  label: string
  hint?: string
  amount: number
  emphasize?: boolean
}) {
  const colors = usePublicBrandColors()
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="flex-start"
      spacing={2}
      sx={{
        py: emphasize ? 1.25 : 0.85,
        borderTop: emphasize ? `1.5px solid ${colors.border}` : 'none',
        mt: emphasize ? 0.5 : 0,
      }}
    >
      <Box>
        <Typography
          sx={{
            fontSize: emphasize ? 15 : 13.5,
            fontWeight: emphasize ? 700 : 600,
            color: colors.navy,
          }}
        >
          {label}
        </Typography>
        {hint ? (
          <Typography sx={{ fontSize: 12, color: colors.textMuted, mt: 0.25 }}>{hint}</Typography>
        ) : null}
      </Box>
      <Typography
        sx={{
          fontSize: emphasize ? 15 : 13.5,
          fontWeight: emphasize ? 700 : 600,
          color: colors.navy,
          flexShrink: 0,
        }}
      >
        {formatInr(amount)}
      </Typography>
    </Stack>
  )
}

function SelectableRow({
  selected,
  onSelect,
  children,
}: {
  selected: boolean
  onSelect: () => void
  children: ReactNode
}) {
  const colors = usePublicBrandColors()
  return (
    <Box
      component="button"
      type="button"
      onClick={onSelect}
      sx={{
        appearance: 'none',
        width: '100%',
        textAlign: 'left',
        font: 'inherit',
        color: 'inherit',
        cursor: 'pointer',
        border: `1.5px solid ${selected ? retailFlowColors.optionBorderSelected : colors.border}`,
        bgcolor: selected ? retailFlowColors.optionBgSelected : colors.white,
        borderRadius: BORDER_RADIUS.lg,
        px: 1.75,
        py: 1.5,
        transition: 'border-color 0.15s ease, background-color 0.15s ease',
        '&:hover': {
          borderColor: selected ? retailFlowColors.optionBorderSelected : retailFlowColors.greenBorderSoft,
        },
      }}
    >
      {children}
    </Box>
  )
}

export function PaymentStep({ journey, draft, onChange, onBack, onPay }: PaymentStepProps) {
  const colors = usePublicBrandColors()
  const processingTier = draft.processingTier ?? 'standard'
  const paymentMethod = draft.paymentMethod

  const embassyFee = useMemo(
    () => journey.pricing.visaFee.reduce((sum, item) => sum + item.amount, 0),
    [journey.pricing.visaFee],
  )

  const baseServiceFee = useMemo(() => {
    const vfs = journey.pricing.vfsServiceRates
      .filter((rate) => !rate.isUrgentCharge)
      .reduce((sum, rate) => sum + rate.amount, 0)
    return vfs > 0 ? vfs : 2499
  }, [journey.pricing.vfsServiceRates])

  const extraLineItems = [
    resolveExtraLineItem('Travel insurance', draft.insurance, journey.insuranceServices),
    resolveExtraLineItem('Flight ticket', draft.flightTicket, journey.flightTicketServices),
  ].filter((item): item is { label: string; amount: number } => Boolean(item))

  const extrasTotal = extraLineItems.reduce((sum, item) => sum + item.amount, 0)
  const tierSurcharge = TIER_OPTIONS.find((tier) => tier.id === processingTier)?.surcharge ?? 0
  const greenLightFee = baseServiceFee + extrasTotal + tierSurcharge
  const grandTotal = embassyFee + greenLightFee

  const canPay = Boolean(processingTier && paymentMethod)

  return (
    <StepShell
      title="Payment"
      helperText="Confirm fees, pick a processing tier, and choose how you’d like to pay."
      onBack={onBack}
      onContinue={onPay}
      continueLabel={`Pay ${formatInr(grandTotal)}`}
      continueDisabled={!canPay}
      contentMaxWidth={640}
    >
      <Stack spacing={3} sx={{ width: '100%', textAlign: 'left' }}>
        <Box
          sx={{
            border: `1px solid ${colors.border}`,
            borderRadius: BORDER_RADIUS.lg,
            bgcolor: colors.white,
            px: 2,
            py: 1.25,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
            <Building2 size={15} color={colors.textMuted} />
            <Typography sx={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', color: colors.textMuted, textTransform: 'uppercase' }}>
              Price breakdown
            </Typography>
          </Stack>
          <PriceRow
            label="Embassy / Government fee"
            hint="Paid through to the embassy or visa authority"
            amount={embassyFee}
          />
          <PriceRow
            label="GreenLight service fee"
            hint="Our charge for filing, coordination, and support"
            amount={greenLightFee}
          />
          <PriceRow label="Total" amount={grandTotal} emphasize />
        </Box>

        <Box>
          <Typography sx={{ fontSize: 13, fontWeight: 700, color: colors.navy, mb: 1.25 }}>
            Processing tier
          </Typography>
          <Stack spacing={1.1}>
            {TIER_OPTIONS.map((tier) => {
              const selected = processingTier === tier.id
              return (
                <SelectableRow
                  key={tier.id}
                  selected={selected}
                  onSelect={() => onChange({ processingTier: tier.id })}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1.5}>
                    <Box>
                      <Typography sx={{ fontSize: 14, fontWeight: 700, color: colors.navy }}>
                        {tier.label}
                      </Typography>
                      <Typography sx={{ fontSize: 12.5, color: colors.textMuted, mt: 0.35 }}>
                        {tier.description}
                      </Typography>
                    </Box>
                    <Typography sx={{ fontSize: 13, fontWeight: 700, color: colors.navy, flexShrink: 0 }}>
                      {tier.surcharge > 0 ? `+${formatInr(tier.surcharge)}` : 'Included'}
                    </Typography>
                  </Stack>
                </SelectableRow>
              )
            })}
          </Stack>
        </Box>

        <Box>
          <Typography sx={{ fontSize: 13, fontWeight: 700, color: colors.navy, mb: 1.25 }}>
            Payment method
          </Typography>
          <Stack spacing={1.1}>
            {PAYMENT_OPTIONS.map((option) => {
              const selected = paymentMethod === option.id
              const Icon = option.icon
              return (
                <SelectableRow
                  key={option.id}
                  selected={selected}
                  onSelect={() => onChange({ paymentMethod: option.id })}
                >
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        bgcolor: selected ? retailFlowColors.greenMuted : colors.surfaceAlt,
                        color: selected ? retailFlowColors.green : colors.navy,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={17} strokeWidth={1.85} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: 14, fontWeight: 700, color: colors.navy }}>
                        {option.label}
                      </Typography>
                      <Typography sx={{ fontSize: 12.5, color: colors.textMuted, mt: 0.2 }}>
                        {option.description}
                      </Typography>
                    </Box>
                  </Stack>
                </SelectableRow>
              )
            })}
          </Stack>
        </Box>
      </Stack>
    </StepShell>
  )
}
