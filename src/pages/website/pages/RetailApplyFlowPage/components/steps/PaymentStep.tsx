import { useMemo, useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { CalendarRange, Check, MapPin, Plane, Shield, Users } from 'lucide-react'
import type { RetailJourney } from '@/shared/services/retailJourneyResolver'
import { RETAIL_GST_RATE } from '@/shared/services/retailWebsiteApplicationService'
import { StepShell } from '../StepShell'
import {
  applyFlow,
  applyFont,
  applyMotion,
  applyRadius,
  tabularNums,
} from '@/pages/website/theme/applyFlowTheme'
import type { RetailFlowDraft, RetailPaymentMethod } from '../../types'
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
  continueLabel?: string
  previewOnly?: boolean
}

/**
 * These mirror `pricingSnapshot` in `retailWebsiteApplicationService` — the amounts shown
 * here are the amounts persisted against the application, so the two must agree. The GST
 * rate is imported rather than restated for exactly that reason.
 */
const PHYSICAL_COLLECTION_FEE_PLACEHOLDER = 499
const INSURANCE_PLACEHOLDER = 504
const GLTS_BASE_SERVICE_FEE = 2499

function formatInr(amount: number) {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`
}

function formatShortDate(iso?: string) {
  if (!iso) return '—'
  const date = new Date(`${iso}T12:00:00`)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

/** One line of the bill. Amounts are mono + tabular so the column aligns. */
function PayLine({
  label,
  amount,
  note,
  muted = false,
  emphasis = false,
}: {
  label: string
  amount: number
  note?: string
  muted?: boolean
  emphasis?: boolean
}) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="baseline"
      spacing={3}
      sx={{ py: muted ? 0.75 : 1.25 }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            fontFamily: applyFont.body,
            fontSize: emphasis ? 14 : muted ? 12.5 : 13.5,
            fontWeight: emphasis ? 700 : muted ? 400 : 500,
            color: muted ? applyFlow.inkMuted : applyFlow.ink,
            lineHeight: 1.3,
          }}
        >
          {label}
        </Typography>
        {note ? (
          <Typography
            sx={{
              fontFamily: applyFont.mono,
              fontSize: 10,
              color: applyFlow.inkFaint,
              mt: 0.5,
            }}
          >
            {note}
          </Typography>
        ) : null}
      </Box>
      <Typography
        sx={{
          ...tabularNums,
          fontFamily: applyFont.mono,
          fontSize: emphasis ? 16 : muted ? 12 : 13.5,
          fontWeight: emphasis ? 700 : muted ? 500 : 600,
          color: muted ? applyFlow.inkMuted : applyFlow.ink,
          flex: '0 0 auto',
        }}
      >
        {formatInr(amount)}
      </Typography>
    </Stack>
  )
}

/** Compact "what you are buying" row for the order summary column. */
function OrderRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin
  label: string
  value: string
}) {
  return (
    <Stack direction="row" alignItems="center" spacing={2.5} sx={{ py: 1.25 }}>
      <Box
        aria-hidden
        sx={{
          width: 24,
          height: 24,
          flex: '0 0 auto',
          display: 'grid',
          placeItems: 'center',
          borderRadius: applyRadius.chip,
          backgroundColor: applyFlow.canvas,
          border: `1px solid ${applyFlow.hairline}`,
          color: applyFlow.inkMuted,
        }}
      >
        <Icon size={13} strokeWidth={1.9} />
      </Box>
      <Typography
        sx={{
          flex: '0 0 auto',
          width: 132,
          fontFamily: applyFont.mono,
          fontSize: 9.5,
          fontWeight: 600,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: applyFlow.inkFaint,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          ...tabularNums,
          flex: 1,
          minWidth: 0,
          fontFamily: applyFont.body,
          fontSize: 13.5,
          fontWeight: 600,
          color: applyFlow.ink,
          lineHeight: 1.35,
        }}
      >
        {value}
      </Typography>
    </Stack>
  )
}

/**
 * B19 — Review & pay.
 *
 * Distinct in purpose from "Review your application": that screen is where the customer
 * verifies what they entered, this one confirms the order and settles it. So the detail
 * fields do not repeat here — this is a short order line-up plus the bill.
 *
 * Removed from the previous version: the cancellation-policy stepper and the
 * "Upgrade your trip" merchandising block. Neither belongs on a checkout screen, and the
 * policy stages were placeholder content marked as not contractual. Insurance survives as
 * a single line the customer can still add or drop, because it is part of the order.
 */
export function PaymentStep({
  journey,
  draft,
  onChange,
  onBack,
  onPay,
  continueLabel,
  previewOnly = false,
}: PaymentStepProps) {
  const [paying, setPaying] = useState(false)

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

  const insuranceSelected = draft.insurance.choice === 'glts_arranged'
  const insuranceUnit =
    journey.insuranceServices.find((s) => s.id === draft.insurance.serviceId)?.defaultPrice ??
    INSURANCE_PLACEHOLDER

  const visaFees = embassyFeeTotal
  const gltsFee = GLTS_BASE_SERVICE_FEE + vfsFeeTotal
  const courierFee =
    journey.allowsPhysicalOriginalDocuments && draft.collectionMethod
      ? PHYSICAL_COLLECTION_FEE_PLACEHOLDER
      : 0
  const insuranceTotal = insuranceSelected ? insuranceUnit * travellerCount : 0

  const gst = Math.round((gltsFee + courierFee) * RETAIL_GST_RATE)
  const grandTotal = visaFees + gltsFee + courierFee + insuranceTotal + gst

  function setInsurance(on: boolean) {
    onChange({
      insurance: on
        ? { choice: 'glts_arranged', serviceId: journey.insuranceServices[0]?.id }
        : { choice: 'skip' },
    })
  }

  function handlePay() {
    if (paying) return
    setPaying(true)
    if (!draft.paymentMethod) onChange({ paymentMethod: 'upi' })
    onPay()
  }

  const tripDates =
    draft.travelDate && draft.travelDateEnd
      ? `${formatShortDate(draft.travelDate)} → ${formatShortDate(draft.travelDateEnd)}`
      : formatShortDate(draft.travelDate)

  const body = (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) minmax(0, 340px)' },
        gap: { xs: 3, md: 4 },
        alignItems: 'start',
        width: '100%',
        textAlign: 'left',
      }}
    >
      {/* ── What is being bought ───────────────────────────────────── */}
      <Box>
        <Typography
          sx={{
            fontFamily: applyFont.mono,
            fontSize: 10.5,
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: applyFlow.inkMuted,
            mb: 1,
          }}
        >
          Your order
        </Typography>

        <Box
          sx={{
            '& > *': { borderBottom: `1px solid ${applyFlow.hairlineSoft}` },
            '& > *:last-of-type': { borderBottom: 'none' },
          }}
        >
          <OrderRow
            icon={MapPin}
            label="Visa"
            value={`${journey.country.name} · ${journey.visaType.name}`}
          />
          <OrderRow
            icon={Users}
            label="Travellers"
            value={`${travellerCount} · ${applicants
              .map((a) => a.details.fullName.trim() || a.label)
              .join(', ')}`}
          />
          <OrderRow icon={CalendarRange} label="Travel dates" value={tripDates} />
          <OrderRow
            icon={MapPin}
            label="Application centre"
            value={draft.jurisdictionName || draft.jurisdictionId || '—'}
          />
          {draft.flightTicket.choice !== 'skip' ? (
            <OrderRow
              icon={Plane}
              label="Flight ticket"
              value={
                draft.flightTicket.choice === 'self_provided'
                  ? 'Own ticket uploaded'
                  : 'Arranged by GLTS'
              }
            />
          ) : null}
        </Box>

        {/* Insurance stays on the order — as a line item the customer controls, not an ad. */}
        <Box
          sx={{
            mt: 3,
            p: 2.5,
            borderRadius: applyRadius.control,
            border: `1px solid ${insuranceSelected ? applyFlow.successBorder : applyFlow.hairline}`,
            backgroundColor: insuranceSelected ? applyFlow.successSoft : applyFlow.surface,
            display: 'flex',
            alignItems: 'center',
            gap: 3,
            transition: `border-color 180ms ${applyMotion.easeOut}, background-color 180ms ${applyMotion.easeOut}`,
          }}
        >
          <Box
            aria-hidden
            sx={{
              width: 26,
              height: 26,
              flex: '0 0 auto',
              display: 'grid',
              placeItems: 'center',
              borderRadius: applyRadius.chip,
              backgroundColor: applyFlow.surface,
              border: `1px solid ${insuranceSelected ? applyFlow.successBorder : applyFlow.hairline}`,
              color: insuranceSelected ? applyFlow.success : applyFlow.inkMuted,
            }}
          >
            {insuranceSelected ? <Check size={14} strokeWidth={3} /> : <Shield size={14} strokeWidth={1.9} />}
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontFamily: applyFont.body,
                fontSize: 13.5,
                fontWeight: 600,
                color: applyFlow.ink,
                lineHeight: 1.3,
              }}
            >
              {insuranceSelected
                ? journey.insuranceServices.find((s) => s.id === draft.insurance.serviceId)
                    ?.serviceName || 'Travel insurance'
                : 'Travel insurance'}
            </Typography>
            <Typography
              sx={{
                ...tabularNums,
                fontFamily: applyFont.mono,
                fontSize: 10.5,
                color: applyFlow.inkMuted,
                mt: 0.5,
              }}
            >
              {insuranceSelected
                ? `Added · ${formatInr(insuranceUnit)} per traveller`
                : draft.insurance.choice === 'self_provided'
                  ? 'You are using your own policy'
                  : `Not added · ${formatInr(insuranceUnit)} per traveller`}
            </Typography>
          </Box>
          <Box
            component="button"
            type="button"
            onClick={() => setInsurance(!insuranceSelected)}
            sx={{
              appearance: 'none',
              flex: '0 0 auto',
              cursor: 'pointer',
              minHeight: 36,
              '@media (pointer: coarse)': { minHeight: 44 },
              px: 3,
              borderRadius: applyRadius.chip,
              border: `1px solid ${insuranceSelected ? applyFlow.hairline : applyFlow.accentBorder}`,
              backgroundColor: insuranceSelected ? 'transparent' : applyFlow.accentSoft,
              color: insuranceSelected ? applyFlow.inkMuted : applyFlow.accentInk,
              fontFamily: applyFont.mono,
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              transition: `background-color 150ms ${applyMotion.easeOut}`,
              '&:focus-visible': {
                outline: 'none',
                borderColor: applyFlow.accent,
                boxShadow: `0 0 0 3px ${applyFlow.accentRing}`,
              },
            }}
          >
            {insuranceSelected ? 'Remove' : 'Add cover'}
          </Box>
        </Box>
      </Box>

      {/* ── The bill ───────────────────────────────────────────────── */}
      <Box
        sx={{
          borderRadius: applyRadius.control,
          border: `1px solid ${applyFlow.hairline}`,
          backgroundColor: applyFlow.surface,
          p: 3,
        }}
      >
        <Typography
          sx={{
            fontFamily: applyFont.mono,
            fontSize: 10.5,
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: applyFlow.inkMuted,
            mb: 1.5,
          }}
        >
          Payment summary
        </Typography>

        <Box
          sx={{
            '& > *': { borderBottom: `1px solid ${applyFlow.hairlineSoft}` },
            '& > *:last-of-type': { borderBottom: 'none' },
          }}
        >
          <PayLine
            label="Visa / embassy fees"
            amount={visaFees}
          />
          <PayLine
            label="GLTS fee"
            amount={gltsFee}
          />
          {courierFee > 0 ? <PayLine label="Courier & handling" amount={courierFee} /> : null}
          {insuranceTotal > 0 ? <PayLine label="Travel insurance" amount={insuranceTotal} /> : null}
          <PayLine
            label="GST"
            amount={gst}
            note={`${Math.round(RETAIL_GST_RATE * 100)}% on GLTS charges`}
          />
        </Box>

        <Box sx={{ borderTop: `1px solid ${applyFlow.hairlineStrong}`, mt: 1, pt: 1 }}>
          <PayLine label="Total amount" amount={grandTotal} emphasis />
        </Box>

        <Typography
          sx={{
            fontFamily: applyFont.mono,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: applyFlow.inkMuted,
            mt: 3,
            mb: 1.5,
          }}
        >
          Pay with
        </Typography>
        <Stack direction="row" spacing={1.5}>
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
                aria-pressed={selected}
                onClick={() => onChange({ paymentMethod: id as RetailPaymentMethod })}
                sx={{
                  appearance: 'none',
                  flex: 1,
                  minHeight: 38,
                  '@media (pointer: coarse)': { minHeight: 44 },
                  cursor: 'pointer',
                  border: `1px solid ${selected ? applyFlow.accentBorder : applyFlow.hairline}`,
                  backgroundColor: selected ? applyFlow.accentSoft : applyFlow.surface,
                  color: selected ? applyFlow.accentInk : applyFlow.inkMuted,
                  borderRadius: applyRadius.chip,
                  fontFamily: applyFont.body,
                  fontSize: 12.5,
                  fontWeight: 600,
                  transition: `background-color 150ms ${applyMotion.easeOut}, border-color 150ms ${applyMotion.easeOut}`,
                  '&:focus-visible': {
                    outline: 'none',
                    borderColor: applyFlow.accent,
                    boxShadow: `0 0 0 3px ${applyFlow.accentRing}`,
                  },
                }}
              >
                {label}
              </Box>
            )
          })}
        </Stack>
      </Box>
    </Box>
  )

  if (previewOnly) return body

  return (
    <StepShell
      title="Review & pay"
      helperText="This is your order and what it costs. Paying takes you to our secure payment provider — nothing is submitted to the consulate until payment clears."
      onBack={onBack}
      onContinue={handlePay}
      continueDisabled={paying}
      continueLabel={
        continueLabel ?? (paying ? 'Opening payment…' : `Pay ${formatInr(grandTotal)}`)
      }
      contentMaxWidth={880}
      footerCaption="Payments are processed on a PCI-compliant gateway. GLTS never stores your card details."
    >
      {body}
    </StepShell>
  )
}
