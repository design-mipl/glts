import { Box, Stack, Typography } from '@mui/material'
import { AnimatePresence, motion } from 'framer-motion'
import { Building2, Check, Clock, FileCheck, Hand, MapPin } from 'lucide-react'
import { listReceivingOfficeOptions } from '@/shared/utils/originalDocumentCollectionUtils'
import type { OriginalDocumentCollectionMethod } from '@/shared/types/originalDocumentCollection'
import { RETAIL_COLLECTION_METHOD_OPTIONS } from '../../config/retailCollectionMethods'
import { PickupLocationStep } from './PickupLocationStep'
import { StepShell } from '../StepShell'
import { applyFlow, applyFont, applyRadius, getSelectableSx } from '@/pages/website-v2/theme/applyFlowTheme'
import { ApplySelect, ApplyTextField, ApplyTextarea, FieldLabel, SectionHeading } from '@/pages/website-v2/theme/applyFormControls'

interface CollectionDetailsStepProps {
  method: OriginalDocumentCollectionMethod
  values: Record<string, string>
  onChange: (key: string, value: string) => void
  /** When provided, shows the method rail so users can switch methods here. */
  onSelectMethod?: (method: OriginalDocumentCollectionMethod) => void
  onBack: () => void
  onContinue: () => void
  previewOnly?: boolean
}

/** Soft office addresses for Drop-at-GLTS / Hand-carry — not a live map. */
const OFFICE_GUIDES: Record<string, { address: string; hours: string; prep: string[] }> = {
  'office-mumbai': {
    address: 'GreenLight Travel, 4th Floor, Maker Chambers, Nariman Point, Mumbai 400021',
    hours: 'Mon–Sat · 10:00–18:30',
    prep: [
      'Bring original passport and any other documents marked Original required',
      'Carry a printed application reference if you have one',
      'Ask for a receipt when you hand over originals',
    ],
  },
  'office-delhi': {
    address: 'GreenLight Travel, Connaught Place, Block A, New Delhi 110001',
    hours: 'Mon–Sat · 10:00–18:30',
    prep: [
      'Bring original passport and any other documents marked Original required',
      'Carry a printed application reference if you have one',
      'Ask for a receipt when you hand over originals',
    ],
  },
  'partner-chennai': {
    address: 'Partner desk · Anna Salai, Chennai',
    hours: 'Mon–Fri · 10:00–17:00',
    prep: ['Bring original passport', 'Confirm partner desk hours before you leave'],
  },
  'partner-kolkata': {
    address: 'Partner desk · Park Street, Kolkata',
    hours: 'Mon–Fri · 10:00–17:00',
    prep: ['Bring original passport', 'Confirm partner desk hours before you leave'],
  },
  'partner-bangalore': {
    address: 'Partner desk · MG Road, Bengaluru',
    hours: 'Mon–Fri · 10:00–17:00',
    prep: ['Bring original passport', 'Confirm partner desk hours before you leave'],
  },
}

/** Left rail — vertical method list. Selecting a row swaps the panel on the right. */
function MethodRail({
  selectedMethod,
  onSelect,
}: {
  selectedMethod: OriginalDocumentCollectionMethod
  onSelect: (method: OriginalDocumentCollectionMethod) => void
}) {
  return (
    <Stack role="radiogroup" aria-label="Handover method" spacing={1.5}>
      {RETAIL_COLLECTION_METHOD_OPTIONS.map((option) => {
        const selected = option.value === selectedMethod
        const Icon = option.icon
        return (
          <Box
            key={option.value}
            component="button"
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onSelect(option.value)}
            sx={{
              ...getSelectableSx(selected),
              appearance: 'none',
              font: 'inherit',
              textAlign: 'left',
              width: '100%',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 2,
              pl: 3,
              pr: 2.5,
              py: 2.25,
            }}
          >
            <Box
              aria-hidden
              sx={{
                width: 32,
                height: 32,
                flex: '0 0 auto',
                display: 'grid',
                placeItems: 'center',
                borderRadius: applyRadius.chip,
                backgroundColor: selected ? 'transparent' : applyFlow.canvas,
                border: `1px solid ${selected ? applyFlow.accentBorder : applyFlow.hairline}`,
                color: selected ? applyFlow.accentInk : applyFlow.inkMuted,
              }}
            >
              <Icon size={15} strokeWidth={1.9} />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                <Typography
                  sx={{
                    fontFamily: applyFont.body,
                    fontSize: 13.5,
                    fontWeight: 600,
                    color: applyFlow.ink,
                    lineHeight: 1.3,
                  }}
                >
                  {option.label}
                </Typography>
                {selected ? (
                  <Box
                    aria-hidden
                    sx={{
                      width: 16,
                      height: 16,
                      flex: '0 0 auto',
                      display: 'grid',
                      placeItems: 'center',
                      borderRadius: '50%',
                      backgroundColor: applyFlow.accent,
                      color: applyFlow.onAccent,
                    }}
                  >
                    <Check size={10} strokeWidth={3.5} />
                  </Box>
                ) : null}
              </Stack>
              <Typography
                sx={{
                  fontFamily: applyFont.body,
                  fontSize: 12,
                  color: applyFlow.inkMuted,
                  mt: 0.5,
                  lineHeight: 1.4,
                }}
              >
                {option.description}
              </Typography>
            </Box>
          </Box>
        )
      })}
    </Stack>
  )
}

function InstructionsBlock({
  title,
  address,
  hours,
  bullets,
  icon,
}: {
  title: string
  address: string
  hours: string
  bullets: string[]
  icon: 'drop' | 'hand'
}) {
  const Icon = icon === 'drop' ? Building2 : Hand

  return (
    <Box
      sx={{
        border: `1px solid ${applyFlow.hairline}`,
        borderRadius: applyRadius.card,
        p: 2.75,
      }}
    >
      <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 2.5 }}>
        <Box
          aria-hidden
          sx={{
            width: 36,
            height: 36,
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
          <Icon size={17} strokeWidth={1.9} />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontFamily: applyFont.body, fontSize: 14.5, fontWeight: 700, color: applyFlow.ink }}>
            {title}
          </Typography>
          <Typography sx={{ fontFamily: applyFont.body, fontSize: 12.5, color: applyFlow.inkMuted, mt: 0.5, lineHeight: 1.45 }}>
            {address}
          </Typography>
        </Box>
      </Stack>

      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
        <Clock size={13} style={{ color: applyFlow.inkFaint }} />
        <Typography sx={{ fontFamily: applyFont.mono, fontSize: 11.5, color: applyFlow.inkMuted }}>{hours}</Typography>
      </Stack>

      <Typography
        sx={{
          fontFamily: applyFont.mono,
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: applyFlow.inkFaint,
          mb: 1.25,
        }}
      >
        Before you go
      </Typography>
      <Stack spacing={1}>
        {bullets.map((line) => (
          <Stack key={line} direction="row" spacing={1.25} alignItems="flex-start">
            <FileCheck size={13} style={{ color: applyFlow.success, marginTop: 3, flexShrink: 0 }} />
            <Typography sx={{ fontFamily: applyFont.body, fontSize: 12.5, color: applyFlow.inkMuted, lineHeight: 1.45 }}>
              {line}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  )
}

function DropAtGltsPanel({
  officeId,
  onSelectOffice,
}: {
  officeId: string
  onSelectOffice: (id: string) => void
}) {
  const officeOptions = listReceivingOfficeOptions()
  const guide = OFFICE_GUIDES[officeId] ?? OFFICE_GUIDES['office-mumbai']

  return (
    <Stack spacing={2.5}>
      <Box>
        <FieldLabel htmlFor="drop-office" required>
          GLTS office
        </FieldLabel>
        <ApplySelect
          id="drop-office"
          value={officeId || 'office-mumbai'}
          onChange={onSelectOffice}
          options={officeOptions.map((option) => ({ label: option.label, value: option.value }))}
        />
      </Box>
      <InstructionsBlock
        title="Drop-off location"
        address={guide.address}
        hours={guide.hours}
        bullets={guide.prep}
        icon="drop"
      />
      <Typography sx={{ fontFamily: applyFont.body, fontSize: 12, color: applyFlow.inkFaint }}>
        No map needed — choose an office and bring originals during operating hours.
      </Typography>
    </Stack>
  )
}

function HandCarryPanel({
  officeId,
  onSelectOffice,
}: {
  officeId: string
  onSelectOffice: (id: string) => void
}) {
  const officeOptions = listReceivingOfficeOptions()
  const guide = OFFICE_GUIDES[officeId] ?? OFFICE_GUIDES['office-mumbai']

  return (
    <Stack spacing={2.5}>
      <Box>
        <FieldLabel htmlFor="carry-office" required>
          Bring documents to
        </FieldLabel>
        <ApplySelect
          id="carry-office"
          value={officeId || 'office-mumbai'}
          onChange={onSelectOffice}
          options={officeOptions.map((option) => ({ label: option.label, value: option.value }))}
        />
      </Box>
      <InstructionsBlock
        title="Hand-carry process"
        address={guide.address}
        hours={guide.hours}
        bullets={[
          'Arrive during desk hours with original passport and flagged originals',
          'Our team will verify documents against your application and issue a receipt',
          'Keep the receipt — you’ll need it when originals are returned',
          'Expect a short wait while we log the handover',
        ]}
        icon="hand"
      />
    </Stack>
  )
}

function CourierPanel({
  values,
  onChange,
}: {
  values: Record<string, string>
  onChange: (key: string, value: string) => void
}) {
  const addressLine1 = values.addressLine1 ?? values.pickupAddress ?? ''
  const addressLine2 = values.addressLine2 ?? ''
  const pinCode = values.pinCode ?? ''
  const city = values.city ?? ''
  const state = values.state ?? ''
  const preferredDate = values.preferredDate ?? values.pickupDate ?? ''
  const preferredWindow = values.preferredWindow ?? values.pickupTime ?? ''
  const deliveryInstructions = values.deliveryInstructions ?? values.remarks ?? ''

  function setAddressField(key: string, value: string) {
    onChange(key, value)
    const line1 = key === 'addressLine1' ? value : addressLine1
    const line2 = key === 'addressLine2' ? value : addressLine2
    const c = key === 'city' ? value : city
    const pc = key === 'pinCode' ? value : pinCode
    const composed = [line1, line2, c, pc].filter((part) => String(part).trim()).join(', ')
    onChange('pickupAddress', composed)
  }

  return (
    <Stack spacing={2.5}>
      <Stack direction="row" spacing={1.25} alignItems="center">
        <MapPin size={15} style={{ color: applyFlow.inkMuted }} />
        <Typography sx={{ fontFamily: applyFont.body, fontSize: 14.5, fontWeight: 700, color: applyFlow.ink }}>
          Courier collection address
        </Typography>
      </Stack>
      <Typography sx={{ fontFamily: applyFont.body, fontSize: 12.5, color: applyFlow.inkMuted, lineHeight: 1.45, mt: -1.5 }}>
        Where should the courier pick up your originals? Same address fields as pickup — no map.
      </Typography>

      <Box>
        <FieldLabel required>Address line 1</FieldLabel>
        <ApplyTextField value={addressLine1} onChange={(v) => setAddressField('addressLine1', v)} placeholder="Building, street" />
      </Box>
      <Box>
        <FieldLabel>Address line 2</FieldLabel>
        <ApplyTextField value={addressLine2} onChange={(v) => setAddressField('addressLine2', v)} placeholder="Landmark, floor" />
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
        <Box>
          <FieldLabel required>PIN code</FieldLabel>
          <ApplyTextField value={pinCode} onChange={(v) => setAddressField('pinCode', v)} placeholder="e.g. 400021" />
        </Box>
        <Box>
          <FieldLabel required>City</FieldLabel>
          <ApplyTextField value={city} onChange={(v) => setAddressField('city', v)} placeholder="City" />
        </Box>
      </Box>
      <Box>
        <FieldLabel required>State</FieldLabel>
        <ApplyTextField value={state} onChange={(v) => setAddressField('state', v)} placeholder="State" />
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
        <Box>
          <FieldLabel required>Preferred date</FieldLabel>
          <ApplyTextField
            type="date"
            value={preferredDate}
            onChange={(v) => {
              onChange('preferredDate', v)
              onChange('pickupDate', v)
            }}
          />
        </Box>
        <Box>
          <FieldLabel required>Preferred time window</FieldLabel>
          <ApplyTextField
            value={preferredWindow}
            onChange={(v) => {
              onChange('preferredWindow', v)
              onChange('pickupTime', v)
            }}
            placeholder="e.g. 10:00–13:00"
          />
        </Box>
      </Box>
      <Box>
        <FieldLabel>Delivery instructions</FieldLabel>
        <ApplyTextarea
          value={deliveryInstructions}
          onChange={(v) => {
            onChange('deliveryInstructions', v)
            onChange('remarks', v)
          }}
          placeholder="Gate code, contact on site…"
        />
      </Box>
    </Stack>
  )
}

function detailsComplete(method: OriginalDocumentCollectionMethod, values: Record<string, string>): boolean {
  if (method === 'picked_up_from_company') {
    return ['addressLine1', 'pinCode', 'city', 'state'].every(
      (k) => (values[k] ?? (k === 'addressLine1' ? values.pickupAddress : '') ?? '').trim().length > 0,
    )
  }
  if (method === 'delivered_to_office' || method === 'hand_carry_by_applicant') {
    return Boolean((values.receivingOfficeId ?? 'office-mumbai').trim())
  }
  if (method === 'couriered_by_applicant') {
    const line1 = values.addressLine1 ?? values.pickupAddress ?? ''
    return [line1, values.pinCode, values.city, values.state, values.preferredDate ?? values.pickupDate, values.preferredWindow ?? values.pickupTime].every(
      (v) => String(v ?? '').trim().length > 0,
    )
  }
  return true
}

/**
 * B16 — Physical collection details for all four retail methods.
 * Left rail picks the method; right panel is the method-specific form, and swaps in place.
 */
export function CollectionDetailsStep({
  method,
  values,
  onChange,
  onSelectMethod,
  onBack,
  onContinue,
  previewOnly = false,
}: CollectionDetailsStepProps) {
  const officeId = values.receivingOfficeId || 'office-mumbai'

  const panel =
    method === 'picked_up_from_company' ? (
      <PickupLocationStep
        values={values}
        onChange={onChange}
        onBack={onBack}
        onContinue={onContinue}
        previewOnly
      />
    ) : method === 'delivered_to_office' ? (
      <DropAtGltsPanel officeId={officeId} onSelectOffice={(id) => onChange('receivingOfficeId', id)} />
    ) : method === 'couriered_by_applicant' ? (
      <CourierPanel values={values} onChange={onChange} />
    ) : method === 'hand_carry_by_applicant' ? (
      <HandCarryPanel officeId={officeId} onSelectOffice={(id) => onChange('receivingOfficeId', id)} />
    ) : (
      <Typography sx={{ fontFamily: applyFont.body, fontSize: 13, color: applyFlow.inkMuted }}>
        This collection method isn’t available in the retail flow.
      </Typography>
    )

  const body = onSelectMethod ? (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'flex-start',
        gap: { xs: 5, md: 6 },
        width: '100%',
      }}
    >
      <Box sx={{ flex: { xs: '1 1 auto', md: '0 0 260px' }, width: { xs: '100%', md: 260 }, minWidth: 0 }}>
        <SectionHeading>Handover method</SectionHeading>
        <MethodRail selectedMethod={method} onSelect={onSelectMethod} />
      </Box>
      <Box sx={{ flex: '1 1 auto', minWidth: 0, width: '100%' }}>
        <SectionHeading>{RETAIL_COLLECTION_METHOD_OPTIONS.find((o) => o.value === method)?.label ?? 'Details'}</SectionHeading>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={method}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
          >
            {panel}
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  ) : (
    <Box sx={{ width: '100%', textAlign: 'left' }}>{panel}</Box>
  )

  if (previewOnly) return body
  return (
    <StepShell
      title="How should we get your original documents?"
      helperText="Choose how originals reach us, then confirm the details for that method."
      onBack={onBack}
      onContinue={onContinue}
      continueLabel={method === 'picked_up_from_company' ? 'Confirm pick-up' : 'Continue'}
      continueDisabled={!detailsComplete(method, values)}
      contentMaxWidth={980}
    >
      {body}
    </StepShell>
  )
}
