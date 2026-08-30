import { useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Plane, Shield } from 'lucide-react'
import type { ServiceMaster } from '@/shared/types/serviceMaster'
import {
  applyFlow,
  applyFont,
  applyMotion,
  applyRadius,
} from '@/pages/website/theme/applyFlowTheme'
import { ApplyTextField, FieldLabel, SectionHeading } from '@/pages/website/theme/applyFormControls'
import { UploadTile } from './UploadTile'
import { StepShell } from './StepShell'
import type { ExtraServiceChoice, RetailExtraSelection, RetailCapturedImage } from '../types'

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
  return (
    <Box
      role="radiogroup"
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: 0.5,
        p: 0.5,
        borderRadius: applyRadius.control,
        backgroundColor: applyFlow.canvas,
        border: `1px solid ${applyFlow.hairline}`,
      }}
    >
      {SEGMENT_OPTIONS.map((option) => {
        const selected = option.choice === value
        return (
          <Box
            key={option.choice}
            component="button"
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.choice)}
            sx={{
              appearance: 'none',
              border: 'none',
              cursor: 'pointer',
              font: 'inherit',
              fontFamily: applyFont.body,
              py: 1.15,
              px: 1,
              borderRadius: applyRadius.chip,
              backgroundColor: selected ? applyFlow.surface : 'transparent',
              color: selected ? applyFlow.ink : applyFlow.inkMuted,
              fontSize: 12.5,
              fontWeight: selected ? 700 : 600,
              boxShadow: selected ? `inset 0 0 0 1px ${applyFlow.accentBorder}` : 'none',
              transition: `background-color 150ms ${applyMotion.easeOut}, color 150ms ${applyMotion.easeOut}, transform 160ms ${applyMotion.easeOut}`,
              '&:active': { transform: 'scale(0.96)' },
            }}
          >
            {option.label}
          </Box>
        )
      })}
    </Box>
  )
}

/** Left-column booking fields, shown only when the traveller wants GLTS to arrange it. */
function BookingFields({
  kind,
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
  travelStart: string
  travelEnd: string
  onTravelStart: (v: string) => void
  onTravelEnd: (v: string) => void
  origin?: string
  destination?: string
  onOrigin?: (v: string) => void
  onDestination?: (v: string) => void
}) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
        gap: 2.5,
      }}
    >
      {kind === 'flight' ? (
        <>
          <Box>
            <FieldLabel>From</FieldLabel>
            <ApplyTextField value={origin ?? ''} onChange={(v) => onOrigin?.(v)} placeholder="e.g. BOM — Mumbai" />
          </Box>
          <Box>
            <FieldLabel>To</FieldLabel>
            <ApplyTextField
              value={destination ?? ''}
              onChange={(v) => onDestination?.(v)}
              placeholder="e.g. CDG — Paris"
            />
          </Box>
        </>
      ) : null}
      <Box>
        <FieldLabel>{kind === 'flight' ? 'Departure' : 'Trip start'}</FieldLabel>
        <ApplyTextField type="date" value={travelStart} onChange={onTravelStart} />
      </Box>
      <Box>
        <FieldLabel>{kind === 'flight' ? 'Return' : 'Trip end'}</FieldLabel>
        <ApplyTextField type="date" value={travelEnd} onChange={onTravelEnd} />
      </Box>
    </Box>
  )
}

/** Right-column sticky reference — what GLTS provides, regardless of the choice made on the left. */
function ReferenceCard({
  kind,
  service,
}: {
  kind: ExtraServiceKind
  service?: ServiceMaster
}) {
  const [showAll, setShowAll] = useState(false)
  const lines = kind === 'insurance' ? INSURANCE_BENEFITS : FLIGHT_DETAILS
  const visible = showAll ? lines : lines.slice(0, 4)
  const hiddenCount = Math.max(0, lines.length - 4)
  const Icon = kind === 'insurance' ? Shield : Plane
  const brandLabel = service?.serviceName ?? (kind === 'insurance' ? 'GLTS Protect' : 'GLTS E-ticket')
  const headline =
    kind === 'insurance' ? '$50,000 covered on your trip' : 'Provisional ticket for your visa filing'
  const price = service?.defaultPrice != null ? `₹${service.defaultPrice.toLocaleString('en-IN')}` : null

  return (
    <Box>
      <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ mb: 3 }}>
        <Box
          aria-hidden
          sx={{
            width: 38,
            height: 38,
            borderRadius: applyRadius.chip,
            backgroundColor: applyFlow.canvas,
            border: `1px solid ${applyFlow.hairline}`,
            color: applyFlow.inkMuted,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon size={18} strokeWidth={1.9} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontFamily: applyFont.mono,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: applyFlow.inkFaint,
            }}
          >
            {brandLabel}
          </Typography>
          <Typography
            sx={{
              fontFamily: applyFont.display,
              fontSize: 16,
              fontWeight: 700,
              color: applyFlow.ink,
              mt: 0.4,
              lineHeight: 1.25,
            }}
          >
            {headline}
          </Typography>
          {price ? (
            <Typography sx={{ fontFamily: applyFont.mono, fontSize: 12, color: applyFlow.inkMuted, mt: 0.75 }}>
              From {price}
            </Typography>
          ) : null}
        </Box>
      </Stack>

      <Stack spacing={0}>
        {visible.map((line) => (
          <Stack
            key={line.label}
            direction="row"
            justifyContent="space-between"
            sx={{ py: 1.25, borderBottom: `1px solid ${applyFlow.hairlineSoft}` }}
          >
            <Typography sx={{ fontFamily: applyFont.body, fontSize: 12.5, color: applyFlow.inkMuted }}>
              {line.label}
            </Typography>
            <Typography
              sx={{
                fontFamily: applyFont.mono,
                fontSize: 12,
                fontWeight: 600,
                color: applyFlow.ink,
                textAlign: 'right',
                flexShrink: 0,
                pl: 2,
              }}
            >
              {line.amount}
            </Typography>
          </Stack>
        ))}
      </Stack>
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
            display: 'flex',
            alignItems: 'center',
            gap: 0.75,
            mt: 1.5,
            p: 0,
            color: applyFlow.accentInk,
            fontFamily: applyFont.body,
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {hiddenCount} more {kind === 'insurance' ? 'benefits' : 'details'}
          <ChevronDown size={13} />
        </Box>
      ) : null}
    </Box>
  )
}

/** Two-column B17 essentials step — decision + upload on the left, GLTS reference sticky on the right. */
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
  const primaryService = services[0]
  const [travelStart, setTravelStart] = useState(travelDate ?? '')
  const [travelEnd, setTravelEnd] = useState('')
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')

  const docLabel = kind === 'insurance' ? 'Insurance policy' : 'Flight ticket'

  function setChoice(choice: ExtraServiceChoice) {
    onChange({
      choice,
      serviceId: choice === 'glts_arranged' ? selection.serviceId ?? primaryService?.id : undefined,
      document: choice === 'self_provided' ? selection.document : undefined,
    })
  }

  function handleDocFile(file: File) {
    const reader = new FileReader()
    reader.onload = () => {
      const document: RetailCapturedImage = {
        dataUrl: reader.result as string,
        capturedAt: new Date().toISOString(),
      }
      onChange({ ...selection, document })
    }
    reader.readAsDataURL(file)
  }

  const continueDisabled =
    (selection.choice === 'glts_arranged' && !selection.serviceId && services.length > 0) ||
    (selection.choice === 'self_provided' && !selection.document)

  const body = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'flex-start',
        gap: { xs: 5, md: 7 },
        width: '100%',
      }}
    >
      <Box sx={{ flex: '1 1 auto', minWidth: 0, width: '100%', order: { xs: 2, md: 1 } }}>
        <SectionHeading>Choose an option</SectionHeading>
        <Stack spacing={2.5} sx={{ width: '100%', textAlign: 'left' }}>
          <SegmentedChoice value={selection.choice} onChange={setChoice} />

          <AnimatePresence mode="wait" initial={false}>
            {selection.choice === 'self_provided' ? (
              <motion.div
                key="upload"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
              >
                <UploadTile
                  label={docLabel}
                  hint="PDF, JPG or PNG"
                  value={selection.document?.dataUrl}
                  capturedAt={selection.document?.capturedAt}
                  onFile={handleDocFile}
                  onClear={() => onChange({ ...selection, document: undefined })}
                  required
                />
              </motion.div>
            ) : selection.choice === 'glts_arranged' ? (
              <motion.div
                key="booking"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
              >
                <BookingFields
                  kind={kind}
                  travelStart={travelStart}
                  travelEnd={travelEnd}
                  onTravelStart={setTravelStart}
                  onTravelEnd={setTravelEnd}
                  origin={origin}
                  destination={destination}
                  onOrigin={setOrigin}
                  onDestination={setDestination}
                />
              </motion.div>
            ) : (
              <motion.div
                key="skip"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
              >
                <Typography sx={{ fontFamily: applyFont.body, fontSize: 13, color: applyFlow.inkMuted, lineHeight: 1.5 }}>
                  You can add this later before submission if your embassy requires it.
                </Typography>
              </motion.div>
            )}
          </AnimatePresence>
        </Stack>
      </Box>

      <Box
        sx={{
          flex: { xs: '1 1 auto', md: '0 0 296px' },
          width: { xs: '100%', md: 296 },
          minWidth: 0,
          order: { xs: 1, md: 2 },
          position: { xs: 'static', md: 'sticky' },
          top: 0,
        }}
      >
        <SectionHeading>{kind === 'insurance' ? "What's included" : 'Ticket details'}</SectionHeading>
        <ReferenceCard kind={kind} service={services.find((s) => s.id === selection.serviceId) ?? primaryService} />
      </Box>
    </Box>
  )

  if (previewOnly) return body

  return (
    <StepShell
      title={title}
      helperText={helperText}
      onBack={onBack}
      onContinue={onContinue}
      continueDisabled={continueDisabled}
      contentMaxWidth={820}
    >
      {body}
    </StepShell>
  )
}
