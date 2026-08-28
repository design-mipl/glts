import { useMemo, useState, type ReactNode } from 'react'
import { Box, Collapse, Stack, Typography } from '@mui/material'
import { ChevronDown, Clock3, Minus, Pencil, Plane, Plus, Shield } from 'lucide-react'
import { BORDER_RADIUS } from '@/design-system/tokens'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { StatusStepper } from '@/pages/website-v2/components/statusStepper/StatusStepper'
import type { StatusStepConfig } from '@/pages/website-v2/components/statusStepper/types'
import type { RetailJourney } from '@/shared/services/retailJourneyResolver'
import { StepShell } from '../StepShell'
import {
  applyFlow,
  applyFont,
  applyMotion,
  applyRadius,
} from '@/pages/website-v2/theme/applyFlowTheme'
import type {
  RetailExtraSelection,
  RetailFlowDraft,
  RetailPaymentMethod,
} from '../../types'
import { EMPTY_TRAVELLER_DETAILS } from '../../types'

interface PaymentStepProps {
  journey: RetailJourney
  draft: RetailFlowDraft
  onChange: (
    patch: Partial<
      Pick<RetailFlowDraft, 'processingTier' | 'paymentMethod' | 'insurance' | 'flightTicket'>
    >,
  ) => void
  onBack: () => void
  onPay: () => void
  previewOnly?: boolean
}

const PHYSICAL_COLLECTION_FEE_PLACEHOLDER = 499
const INSURANCE_PLACEHOLDER = 504
const DEFAULT_STAY_DAYS = 30
const DEFAULT_VALIDITY_DAYS = 90

/**
 * Provisional GLTS cancellation / refund stages for B19.
 * TODO: Replace with product-confirmed Ground Ops milestones when policy is finalized
 * (inventory open question — do not treat amounts/cutovers as contractual).
 */
const CANCELLATION_POLICY_STEPS: StatusStepConfig[] = [
  {
    id: 'full-before-submit',
    label: 'Full refund',
    description: 'Cancel any time before we submit to the VAC / consulate',
    state: 'completed',
  },
  {
    id: 'full-until-decision',
    label: 'Full refund',
    description: 'While Ground Ops is coordinating and before a decision is issued',
    state: 'current',
  },
  {
    id: 'no-refund-after-decision',
    label: 'No refund',
    description: 'After a visa decision (approved or refused)',
    state: 'pending',
  },
]

function formatInr(amount: number) {
  return `₹${amount.toLocaleString('en-IN')}`
}

function formatShortDate(iso?: string) {
  if (!iso) return '—'
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${iso}T12:00:00`))
}

function addDaysIso(iso: string, days: number) {
  const d = new Date(`${iso}T12:00:00`)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

function parseStayDays(validity: string | undefined): number {
  if (!validity) return DEFAULT_STAY_DAYS
  const match = validity.match(/(\d+)\s*day/i)
  return match ? Number(match[1]) : DEFAULT_STAY_DAYS
}

/**
 * Grouping block for the price panel. A hairline box, not an elevated card — on a payment
 * screen the money is the thing that should carry weight, so nothing else gets a shadow.
 */
function ElevatedCard({ children, sx }: { children: ReactNode; sx?: object }) {
  return (
    <Box
      sx={{
        border: `1px solid ${applyFlow.hairline}`,
        borderRadius: applyRadius.control,
        backgroundColor: applyFlow.surface,
        ...sx,
      }}
    >
      {children}
    </Box>
  )
}

function MetaDivider() {
  return (
    <Box
      aria-hidden
      sx={{
        width: '1px',
        alignSelf: 'stretch',
        minHeight: 26,
        bgcolor: applyFlow.hairline,
        mx: { xs: 2, sm: 3 },
      }}
    />
  )
}

function DayStepper({
  value,
  onChange,
  min = 1,
  max = 90,
}: {
  value: number
  onChange: (next: number) => void
  min?: number
  max?: number
}) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={0}
      sx={{
        border: `1px solid ${applyFlow.hairline}`,
        borderRadius: applyRadius.chip,
        backgroundColor: applyFlow.surface,
        overflow: 'hidden',
      }}
    >
      <Box
        component="button"
        type="button"
        aria-label="One day fewer"
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        sx={stepperIconBtn()}
      >
        <Minus size={13} />
      </Box>
      <Typography
        sx={{
          fontFamily: applyFont.mono,
          fontSize: 12,
          fontWeight: 600,
          color: applyFlow.ink,
          minWidth: 58,
          textAlign: 'center',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}d
      </Typography>
      <Box
        component="button"
        type="button"
        aria-label="One day more"
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        sx={stepperIconBtn()}
      >
        <Plus size={13} />
      </Box>
    </Stack>
  )
}

function stepperIconBtn() {
  return {
    appearance: 'none' as const,
    width: 34,
    height: 34,
    '@media (pointer: coarse)': { width: 44, height: 44 },
    borderRadius: 0,
    border: 'none',
    bgcolor: 'transparent',
    color: applyFlow.inkMuted,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: `background-color 150ms ${applyMotion.easeOut}, color 150ms ${applyMotion.easeOut}`,
    '@media (hover: hover) and (pointer: fine)': {
      '&:hover:not(:disabled)': { backgroundColor: applyFlow.accentSoft, color: applyFlow.accentInk },
    },
    '&:disabled': { color: applyFlow.inkDisabled, cursor: 'default' },
    '&:focus-visible': {
      outline: 'none',
      boxShadow: `inset 0 0 0 2px ${applyFlow.accent}`,
    },
  }
}

export function PaymentStep({
  journey,
  draft,
  onChange,
  onBack,
  onPay,
  previewOnly = false,
}: PaymentStepProps) {
  const colors = usePublicBrandColors()
  const [feesOpen, setFeesOpen] = useState(false)
  const [cancellationOpen, setCancellationOpen] = useState(true)
  const [insuranceDays, setInsuranceDays] = useState(7)

  const applicants =
    draft.applicants.length > 0
      ? draft.applicants
      : [
          {
            id: 'preview-traveller',
            label: 'You',
            details: { ...EMPTY_TRAVELLER_DETAILS, fullName: 'Traveller' },
          },
        ]
  const travellerCount = Math.max(1, applicants.length)

  const countryCode = (journey.country.code || journey.country.name.slice(0, 2)).toUpperCase()
  const stayDays = parseStayDays(journey.visaType.validity)
  const validFromIso = draft.travelDate
  const validTillIso = validFromIso ? addDaysIso(validFromIso, DEFAULT_VALIDITY_DAYS) : undefined
  const guaranteedIso = validFromIso ? addDaysIso(validFromIso, 11) : undefined

  const embassyFeeTotal = useMemo(
    () => journey.pricing.visaFee.reduce((sum, item) => sum + item.amount, 0),
    [journey.pricing.visaFee],
  )
  const vfsFeeTotal = useMemo(
    () =>
      journey.pricing.vfsServiceRates
        .filter((rate) => !rate.isUrgentCharge)
        .reduce((sum, rate) => sum + rate.amount, 0),
    [journey.pricing.vfsServiceRates],
  )

  const gltsServiceFee = 2499 + vfsFeeTotal
  const physicalCollectionFee =
    journey.allowsPhysicalOriginalDocuments && draft.collectionMethod
      ? PHYSICAL_COLLECTION_FEE_PLACEHOLDER
      : 0

  const insuranceSelected = draft.insurance.choice === 'glts_arranged'
  const insuranceUnit =
    journey.insuranceServices.find((s) => s.id === draft.insurance.serviceId)?.defaultPrice ??
    INSURANCE_PLACEHOLDER
  const insuranceTotal = insuranceSelected ? insuranceUnit * travellerCount : 0

  const visaFees = embassyFeeTotal
  const serviceFees = gltsServiceFee
  const courierFees = physicalCollectionFee
  const grandTotal = visaFees + serviceFees + courierFees + insuranceTotal

  const pickupAddress =
    draft.collectionDetails.pickupAddress ||
    [
      draft.collectionDetails.addressLine1,
      draft.collectionDetails.addressLine2,
      draft.collectionDetails.city,
      draft.collectionDetails.state,
      draft.collectionDetails.pinCode,
    ]
      .filter(Boolean)
      .join(', ') ||
    null

  const showPickup = Boolean(pickupAddress) || Boolean(draft.collectionMethod)
  const insuranceFrom = validFromIso
  const insuranceTill = validFromIso ? addDaysIso(validFromIso, insuranceDays) : undefined

  function setInsurance(on: boolean) {
    const choice: RetailExtraSelection['choice'] = on ? 'glts_arranged' : 'skip'
    const serviceId = on ? journey.insuranceServices[0]?.id : undefined
    onChange({ insurance: { choice, serviceId } })
  }

  function handlePay() {
    if (!draft.paymentMethod) onChange({ paymentMethod: 'upi' })
    onPay()
  }

  const guaranteeHelper = (
    <>
      Get {journey.country.name} {journey.visaType.name} Guaranteed on{' '}
      <Box component="span" sx={{ color: colors.greenDark, fontWeight: 800 }}>
        {formatShortDate(guaranteedIso)}
      </Box>
    </>
  )

  const body = (
    <Stack spacing={2.75} sx={{ width: '100%', textAlign: 'left' }}>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          rowGap: 1.25,
          px: 0.5,
        }}
      >
        <MetaBlock label="Length of Stay" value={`${stayDays} days`} />
        <MetaDivider />
        <MetaBlock
          label="Valid from"
          value={formatShortDate(validFromIso)}
          endAdornment={<Pencil size={12} color={colors.textMuted} />}
        />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            px: { xs: 0.75, sm: 1.25 },
            color: colors.textMuted,
          }}
        >
          <Box sx={{ width: 16, borderTop: `1px dashed ${colors.border}` }} />
          <Plane size={14} style={{ margin: '0 6px' }} />
          <Box sx={{ width: 16, borderTop: `1px dashed ${colors.border}` }} />
        </Box>
        <MetaBlock label="Valid Till" value={formatShortDate(validTillIso)} />
        <MetaDivider />
        <MetaBlock
          label="No. of Travelers"
          value={String(travellerCount)}
          endAdornment={<ChevronDown size={14} color={colors.textMuted} />}
        />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1.05fr 0.95fr' },
          gap: { xs: 2.5, md: 3 },
          alignItems: 'start',
        }}
      >
        <Stack spacing={2.25}>
          {showPickup ? (
            <Box>
              <Stack direction="row" alignItems="center" spacing={0.85} sx={{ mb: 0.75 }}>
                <Box
                  sx={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    bgcolor: applyFlow.accentSoft,
                    color: colors.greenDark,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Clock3 size={12} strokeWidth={2.4} />
                </Box>
                <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: colors.navy }}>
                  Passport Pick-Up Address
                </Typography>
              </Stack>
              <Typography
                sx={{ fontSize: 13, color: colors.textSecondary, lineHeight: 1.5, pl: 3.75 }}
              >
                {pickupAddress || 'Address confirmed in the collection step.'}
              </Typography>
            </Box>
          ) : null}

          <Box>
            <Typography sx={{ fontSize: 16, fontWeight: 800, color: colors.navy, mb: 1.25 }}>
              Upgrade your trip
            </Typography>
            <ElevatedCard sx={{ p: 2 }}>
              <Stack direction="row" alignItems="flex-start" spacing={1.25}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    bgcolor: colors.surfaceAlt,
                    color: colors.navy,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Shield size={18} strokeWidth={2} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    gap={1}
                  >
                    <Typography sx={{ fontSize: 14.5, fontWeight: 800, color: colors.navy }}>
                      $50,000 Travel Coverage
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography
                        sx={{
                          fontSize: 14,
                          fontWeight: 800,
                          color: colors.navy,
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {formatInr(insuranceUnit)}
                      </Typography>
                      <Box
                        component="button"
                        type="button"
                        aria-label={insuranceSelected ? 'Remove insurance' : 'Add insurance'}
                        onClick={() => setInsurance(!insuranceSelected)}
                        sx={{
                          appearance: 'none',
                          width: 30,
                          height: 30,
                          borderRadius: '50%',
                          border: 'none',
                          bgcolor: insuranceSelected ? colors.navy : applyFlow.accent,
                          color: '#fff',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          p: 0,
                        }}
                      >
                        {insuranceSelected ? <Minus size={15} /> : <Plus size={15} />}
                      </Box>
                    </Stack>
                  </Stack>
                  <Typography
                    sx={{
                      fontSize: 12.5,
                      color: colors.greenDark,
                      fontWeight: 600,
                      mt: 0.35,
                    }}
                  >
                    Baggage loss · flight delay · more
                  </Typography>

                  <Box
                    sx={{
                      mt: 1.5,
                      bgcolor: colors.surfaceAlt,
                      borderRadius: BORDER_RADIUS.md,
                      px: 1.25,
                      py: 1.1,
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 1,
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={0.75} sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontSize: 11.5, color: colors.textMuted }}>
                        {formatShortDate(insuranceFrom)}
                      </Typography>
                      <Plane size={12} color={colors.textMuted} />
                      <Typography sx={{ fontSize: 11.5, color: colors.textMuted }}>
                        {formatShortDate(insuranceTill)}
                      </Typography>
                    </Stack>
                    <DayStepper value={insuranceDays} onChange={setInsuranceDays} />
                  </Box>
                </Box>
              </Stack>
            </ElevatedCard>
          </Box>

          <ElevatedCard sx={{ overflow: 'hidden' }}>
            <Box
              component="button"
              type="button"
              onClick={() => setCancellationOpen((v) => !v)}
              sx={{
                appearance: 'none',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1,
                border: 'none',
                bgcolor: 'transparent',
                cursor: 'pointer',
                font: 'inherit',
                px: 2,
                py: 1.5,
                textAlign: 'left',
              }}
            >
              <Box>
                <Typography sx={{ fontSize: 14.5, fontWeight: 800, color: colors.navy }}>
                  Cancellation Policy
                </Typography>
                <Typography sx={{ fontSize: 12, color: colors.textMuted, mt: 0.25 }}>
                  Full refund → Full refund → No refund
                </Typography>
              </Box>
              <ChevronDown
                size={16}
                color={colors.textMuted}
                style={{
                  transform: cancellationOpen ? 'rotate(180deg)' : undefined,
                  transition: 'transform 0.15s ease',
                  flexShrink: 0,
                }}
              />
            </Box>
            <Collapse in={cancellationOpen}>
              <Box sx={{ px: 2, pb: 2, pt: 0.5, borderTop: `1px solid ${colors.border}` }}>
                <StatusStepper steps={CANCELLATION_POLICY_STEPS} orientation="vertical" />
                <Typography sx={{ fontSize: 11.5, color: colors.textMuted, mt: 1.5, lineHeight: 1.4 }}>
                  Stages follow Ground Ops milestones. Final cutovers will match published GLTS policy.
                </Typography>
              </Box>
            </Collapse>
          </ElevatedCard>
        </Stack>

        <ElevatedCard sx={{ p: { xs: 2.25, sm: 2.75 } }}>
          <Typography
            sx={{
              fontSize: 12.5,
              fontWeight: 600,
              color: colors.textMuted,
              textAlign: 'center',
              mb: 0.5,
            }}
          >
            You Pay Now
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: 36, sm: 40 },
              fontWeight: 800,
              color: colors.goldBright,
              textAlign: 'center',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              fontVariantNumeric: 'tabular-nums',
              mb: 2,
            }}
          >
            {formatInr(grandTotal)}
          </Typography>

          <Stack spacing={0}>
            <PayLine label="Visa Fees" amount={visaFees} />
            <Box sx={{ borderTop: `1px solid ${colors.border}` }}>
              <Box
                component="button"
                type="button"
                onClick={() => setFeesOpen((v) => !v)}
                sx={{
                  appearance: 'none',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: 'none',
                  bgcolor: 'transparent',
                  cursor: 'pointer',
                  font: 'inherit',
                  py: 1.35,
                  px: 0,
                }}
              >
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <Typography sx={{ fontSize: 14, fontWeight: 600, color: colors.navy }}>
                    GreenLight Fees
                  </Typography>
                  <ChevronDown
                    size={15}
                    color={colors.textMuted}
                    style={{ transform: feesOpen ? 'rotate(180deg)' : undefined }}
                  />
                </Stack>
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: colors.navy,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {formatInr(serviceFees)}
                </Typography>
              </Box>
              <Collapse in={feesOpen}>
                <Box sx={{ pb: 1, pl: 0.5 }}>
                  <PayLine label="Service coordination" amount={2499} muted />
                  {vfsFeeTotal > 0 ? (
                    <PayLine label="VFS / facilitation" amount={vfsFeeTotal} muted />
                  ) : null}
                </Box>
              </Collapse>
            </Box>
            {courierFees > 0 ? (
              <Box sx={{ borderTop: `1px solid ${colors.border}` }}>
                <PayLine label="Courier & Handling Fees" amount={courierFees} />
              </Box>
            ) : null}
            {insuranceTotal > 0 ? (
              <Box sx={{ borderTop: `1px solid ${colors.border}` }}>
                <PayLine label="Travel insurance" amount={insuranceTotal} />
              </Box>
            ) : null}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="baseline"
              sx={{ borderTop: `1px solid ${colors.border}`, pt: 1.5, mt: 0.25 }}
            >
              <Typography sx={{ fontSize: 14.5, fontWeight: 800, color: colors.navy }}>
                Total Amount
              </Typography>
              <Typography
                sx={{
                  fontSize: 16,
                  fontWeight: 800,
                  color: colors.navy,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {formatInr(grandTotal)}
              </Typography>
            </Stack>
          </Stack>

          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            {(
              [
                ['upi', 'UPI'],
                ['card', 'Card'],
                ['netbanking', 'Net banking'],
              ] as const
            ).map(([id, label]) => {
              const selected = (draft.paymentMethod ?? 'upi') === id
              return (
                <Box
                  key={id}
                  component="button"
                  type="button"
                  onClick={() => onChange({ paymentMethod: id as RetailPaymentMethod })}
                  sx={{
                    appearance: 'none',
                    flex: 1,
                    border: `1.5px solid ${
                      selected ? applyFlow.accentBorder : colors.border
                    }`,
                    bgcolor: selected ? applyFlow.accentSoft : colors.white,
                    color: selected ? colors.greenDark : colors.navy,
                    borderRadius: BORDER_RADIUS.md,
                    py: 0.85,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  {label}
                </Box>
              )
            })}
          </Stack>
        </ElevatedCard>
      </Box>
    </Stack>
  )

  if (previewOnly) {
    return (
      <Stack spacing={1.25} sx={{ width: '100%' }}>
        <Typography sx={{ fontSize: 22, fontWeight: 800, color: colors.navy, textAlign: 'center' }}>
          {countryCode}
        </Typography>
        <Typography
          component="div"
          sx={{ fontSize: 13, fontWeight: 700, color: colors.navy, textAlign: 'center', mb: 0.5 }}
        >
          {guaranteeHelper}
        </Typography>
        {body}
      </Stack>
    )
  }

  return (
    <StepShell
      title="Review and pay"
      helperText={guaranteeHelper}
      onBack={onBack}
      onContinue={handlePay}
      continueLabel={`Pay ${formatInr(grandTotal)} to Submit`}
      contentMaxWidth={880}
    >
      {body}
    </StepShell>
  )
}

function MetaBlock({
  label,
  value,
  endAdornment,
}: {
  label: string
  value: string
  endAdornment?: ReactNode
}) {
  return (
    <Box sx={{ textAlign: 'left' }}>
      <Typography
        sx={{
          fontFamily: applyFont.mono,
          fontSize: 9.5,
          fontWeight: 600,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: applyFlow.inkFaint,
          mb: 1,
        }}
      >
        {label}
      </Typography>
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Typography
          sx={{
            fontFamily: applyFont.body,
            fontSize: 13.5,
            fontWeight: 600,
            color: applyFlow.ink,
            lineHeight: 1.25,
          }}
        >
          {value}
        </Typography>
        {endAdornment}
      </Stack>
    </Box>
  )
}

/** One line of the bill. Amounts are mono + tabular so the column aligns on the decimal. */
function PayLine({
  label,
  amount,
  muted,
}: {
  label: string
  amount: number
  muted?: boolean
}) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="baseline"
      spacing={3}
      sx={{ py: muted ? 1 : 1.75 }}
    >
      <Typography
        sx={{
          fontFamily: applyFont.body,
          fontSize: muted ? 12.5 : 13.5,
          fontWeight: muted ? 400 : 500,
          color: muted ? applyFlow.inkMuted : applyFlow.ink,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontFamily: applyFont.mono,
          fontSize: muted ? 12 : 13.5,
          fontWeight: muted ? 500 : 600,
          color: muted ? applyFlow.inkMuted : applyFlow.ink,
          fontVariantNumeric: 'tabular-nums',
          flex: '0 0 auto',
        }}
      >
        {formatInr(amount)}
      </Typography>
    </Stack>
  )
}
