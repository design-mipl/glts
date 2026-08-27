import { useMemo, useState } from 'react'
import { Box, Collapse, Stack, Typography } from '@mui/material'
import { ChevronDown, Plane, Shield } from 'lucide-react'
import { FormField, Input } from '@/design-system/UIComponents'
import { BORDER_RADIUS } from '@/design-system/tokens'
import type { ServiceMaster } from '@/shared/types/serviceMaster'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { getElevatedCardSx, retailFlowColors } from '@/pages/website-v2/theme/retailFlowTokens'
import { StepShell } from './StepShell'
import type { ExtraServiceChoice, RetailExtraSelection } from '../types'

export type ExtraServiceKind = 'insurance' | 'flight'

interface BenefitLine {
  label: string
  amount: string
}

interface ExtraServiceStepProps {
  title: string
  helperText: string
  kind: ExtraServiceKind
  services: ServiceMaster[]
  selection: RetailExtraSelection
  travelDate?: string
  onChange: (selection: RetailExtraSelection) => void
  onBack: () => void
  onContinue: () => void
  previewOnly?: boolean
}

const INSURANCE_BENEFITS: BenefitLine[] = [
  { label: 'Medical expenses abroad', amount: '$50,000' },
  { label: 'Emergency medical evacuation', amount: '$25,000' },
  { label: 'Trip cancellation', amount: '$2,500' },
  { label: 'Baggage loss / delay', amount: '$1,000' },
  { label: 'Personal liability', amount: '$10,000' },
  { label: 'Passport loss assistance', amount: 'Covered' },
  { label: '24×7 assistance helpline', amount: 'Included' },
]

const FLIGHT_DETAILS: BenefitLine[] = [
  { label: 'Ticket type', amount: 'Dummy / provisional' },
  { label: 'Purpose', amount: 'Visa filing support' },
  { label: 'Cabin', amount: 'Economy' },
  { label: 'PNR / booking ref', amount: 'Issued after confirm' },
  { label: 'Name change', amount: 'Not required for filing' },
  { label: 'Refund after decision', amount: 'Per airline rules' },
  { label: 'Delivery', amount: 'PDF to your email' },
]

const SEGMENT_OPTIONS: { choice: ExtraServiceChoice; label: string }[] = [
  { choice: 'self_provided', label: 'Upload own' },
  { choice: 'glts_arranged', label: 'Get from GLTS' },
  { choice: 'skip', label: 'Skip' },
]

function SegmentedChoice({
  value,
  onChange,
}: {
  value: ExtraServiceChoice
  onChange: (choice: ExtraServiceChoice) => void
}) {
  const colors = usePublicBrandColors()
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: 0.5,
        p: 0.5,
        borderRadius: BORDER_RADIUS.lg,
        bgcolor: colors.surfaceAlt,
        ...getElevatedCardSx(colors.border),
      }}
    >
      {SEGMENT_OPTIONS.map((option) => {
        const selected = option.choice === value
        return (
          <Box
            key={option.choice}
            component="button"
            type="button"
            onClick={() => onChange(option.choice)}
            sx={{
              appearance: 'none',
              border: 'none',
              cursor: 'pointer',
              font: 'inherit',
              py: 1.15,
              px: 1,
              borderRadius: BORDER_RADIUS.md,
              bgcolor: selected ? colors.white : 'transparent',
              color: selected ? colors.navy : colors.textMuted,
              fontSize: 12.5,
              fontWeight: selected ? 700 : 600,
              boxShadow: selected ? '0 1px 2px rgba(15,27,43,0.06)' : 'none',
              outline: selected ? `1.5px solid ${retailFlowColors.greenBorderSoft}` : 'none',
              transition: 'background-color 0.15s ease, color 0.15s ease',
            }}
          >
            {option.label}
          </Box>
        )
      })}
    </Box>
  )
}

function GltsDetailCard({
  kind,
  service,
  travelStart,
  travelEnd,
  onTravelStart,
  onTravelEnd,
  origin,
  destination,
  onOrigin,
  onDestination,
}: {
  kind: ExtraServiceKind
  service?: ServiceMaster
  travelStart: string
  travelEnd: string
  onTravelStart: (v: string) => void
  onTravelEnd: (v: string) => void
  origin?: string
  destination?: string
  onOrigin?: (v: string) => void
  onDestination?: (v: string) => void
}) {
  const colors = usePublicBrandColors()
  const [expanded, setExpanded] = useState(true)
  const [showAll, setShowAll] = useState(false)

  const lines = kind === 'insurance' ? INSURANCE_BENEFITS : FLIGHT_DETAILS
  const visible = showAll ? lines : lines.slice(0, 4)
  const hiddenCount = Math.max(0, lines.length - 4)
  const Icon = kind === 'insurance' ? Shield : Plane
  const brandLabel =
    service?.serviceName ?? (kind === 'insurance' ? 'GLTS Protect' : 'GLTS E-ticket')
  const headline =
    kind === 'insurance' ? '$50,000 covered on your trip' : 'Provisional ticket for your visa filing'
  const price =
    service?.defaultPrice != null ? `₹${service.defaultPrice.toLocaleString('en-IN')}` : null

  return (
    <Box
      sx={{
        ...getElevatedCardSx(colors.border),
        borderRadius: BORDER_RADIUS.lg,
        bgcolor: colors.white,
        overflow: 'hidden',
      }}
    >
      <Box sx={{ p: 2.25 }}>
        <Stack direction="row" spacing={1.5} alignItems="flex-start">
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: BORDER_RADIUS.md,
              bgcolor: retailFlowColors.greenMuted,
              color: retailFlowColors.green,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Icon size={22} strokeWidth={2.1} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: retailFlowColors.green,
              }}
            >
              {brandLabel}
            </Typography>
            <Typography sx={{ fontSize: 18, fontWeight: 800, color: colors.navy, mt: 0.35, lineHeight: 1.25 }}>
              {headline}
            </Typography>
            {price ? (
              <Typography sx={{ fontSize: 13, color: colors.textMuted, mt: 0.5 }}>
                From {price}
              </Typography>
            ) : null}
          </Box>
        </Stack>

        {kind === 'flight' ? (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 1.5,
              mt: 2,
            }}
          >
            <FormField label="From">
              <Input
                fullWidth
                value={origin ?? ''}
                onChange={(v) => onOrigin?.(v)}
                placeholder="e.g. BOM — Mumbai"
              />
            </FormField>
            <FormField label="To">
              <Input
                fullWidth
                value={destination ?? ''}
                onChange={(v) => onDestination?.(v)}
                placeholder="e.g. CDG — Paris"
              />
            </FormField>
            <FormField label="Departure">
              <Input type="date" fullWidth value={travelStart} onChange={onTravelStart} />
            </FormField>
            <FormField label="Return">
              <Input type="date" fullWidth value={travelEnd} onChange={onTravelEnd} />
            </FormField>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 1.5,
              mt: 2,
            }}
          >
            <FormField label="Trip start">
              <Input type="date" fullWidth value={travelStart} onChange={onTravelStart} />
            </FormField>
            <FormField label="Trip end">
              <Input type="date" fullWidth value={travelEnd} onChange={onTravelEnd} />
            </FormField>
          </Box>
        )}
      </Box>

      <Box sx={{ borderTop: `1px solid ${colors.border}` }}>
        <Box
          component="button"
          type="button"
          onClick={() => setExpanded((v) => !v)}
          sx={{
            appearance: 'none',
            border: 'none',
            bgcolor: 'transparent',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2.25,
            py: 1.35,
            cursor: 'pointer',
            font: 'inherit',
          }}
        >
          <Typography sx={{ fontSize: 13, fontWeight: 700, color: colors.navy }}>
            {kind === 'insurance' ? "What's included" : 'Ticket details'}
          </Typography>
          <ChevronDown
            size={16}
            color={colors.textMuted}
            style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }}
          />
        </Box>
        <Collapse in={expanded}>
          <Stack spacing={0} sx={{ px: 2.25, pb: 2 }}>
            {visible.map((line) => (
              <Stack
                key={line.label}
                direction="row"
                justifyContent="space-between"
                sx={{
                  py: 1,
                  borderBottom: `1px solid ${colors.border}`,
                  '&:last-of-type': { borderBottom: showAll || hiddenCount === 0 ? 'none' : undefined },
                }}
              >
                <Typography sx={{ fontSize: 13, color: colors.textSecondary }}>{line.label}</Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: colors.navy }}>{line.amount}</Typography>
              </Stack>
            ))}
            {!showAll && hiddenCount > 0 ? (
              <Box
                component="button"
                type="button"
                onClick={() => setShowAll(true)}
                sx={{
                  appearance: 'none',
                  border: 'none',
                  bgcolor: 'transparent',
                  cursor: 'pointer',
                  font: 'inherit',
                  mt: 1,
                  p: 0,
                  textAlign: 'left',
                  color: retailFlowColors.green,
                  fontSize: 12.5,
                  fontWeight: 700,
                }}
              >
                View {hiddenCount} more {kind === 'insurance' ? 'benefits' : 'details'}
              </Box>
            ) : null}
          </Stack>
        </Collapse>
      </Box>
    </Box>
  )
}

/** Shared B17 essentials step — segmented Upload own / Get from GLTS / Skip + nested GLTS detail. */
export function ExtraServiceStep({
  title,
  helperText,
  kind,
  services,
  selection,
  travelDate,
  onChange,
  onBack,
  onContinue,
  previewOnly = false,
}: ExtraServiceStepProps) {
  const colors = usePublicBrandColors()
  const primaryService = services[0]
  const [travelStart, setTravelStart] = useState(travelDate ?? '')
  const [travelEnd, setTravelEnd] = useState('')
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')

  const choiceHint = useMemo(() => {
    if (selection.choice === 'self_provided') {
      return kind === 'insurance'
        ? 'You’ll upload your own policy in the document checklist.'
        : 'You’ll upload your own ticket when documents are due.'
    }
    if (selection.choice === 'skip') {
      return 'You can add this later before submission if your embassy requires it.'
    }
    return null
  }, [selection.choice, kind])

  function setChoice(choice: ExtraServiceChoice) {
    onChange({
      choice,
      serviceId: choice === 'glts_arranged' ? selection.serviceId ?? primaryService?.id : undefined,
    })
  }

  const continueDisabled = selection.choice === 'glts_arranged' && !selection.serviceId && services.length > 0

  const body = (
    <Stack spacing={2.5} sx={{ width: '100%', textAlign: 'left' }}>
      <SegmentedChoice value={selection.choice} onChange={setChoice} />

      {choiceHint ? (
        <Typography sx={{ fontSize: 13, color: colors.textMuted, lineHeight: 1.45 }}>{choiceHint}</Typography>
      ) : null}

      {selection.choice === 'glts_arranged' ? (
        <GltsDetailCard
          kind={kind}
          service={services.find((s) => s.id === selection.serviceId) ?? primaryService}
          travelStart={travelStart}
          travelEnd={travelEnd}
          onTravelStart={setTravelStart}
          onTravelEnd={setTravelEnd}
          origin={origin}
          destination={destination}
          onOrigin={setOrigin}
          onDestination={setDestination}
        />
      ) : null}
    </Stack>
  )

  if (previewOnly) return body

  return (
    <StepShell
      title={title}
      helperText={helperText}
      onBack={onBack}
      onContinue={onContinue}
      continueDisabled={continueDisabled}
      contentMaxWidth={640}
    >
      {body}
    </StepShell>
  )
}
