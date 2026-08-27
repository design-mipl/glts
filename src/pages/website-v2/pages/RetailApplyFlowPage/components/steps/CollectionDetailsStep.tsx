import { Box, Grid, Stack, Typography } from '@mui/material'
import { Building2, Clock, FileCheck, Hand, MapPin } from 'lucide-react'
import { FormField, Input, Select, Textarea } from '@/design-system/UIComponents'
import { BORDER_RADIUS } from '@/design-system/tokens'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { getElevatedCardSx, retailFlowColors } from '@/pages/website-v2/theme/retailFlowTokens'
import { listReceivingOfficeOptions } from '@/shared/utils/originalDocumentCollectionUtils'
import type { OriginalDocumentCollectionMethod } from '@/shared/types/originalDocumentCollection'
import { RETAIL_COLLECTION_METHOD_OPTIONS } from '../../config/retailCollectionMethods'
import { PickupLocationStep } from './PickupLocationStep'
import { StepShell } from '../StepShell'

interface CollectionDetailsStepProps {
  method: OriginalDocumentCollectionMethod
  values: Record<string, string>
  onChange: (key: string, value: string) => void
  /** When provided, shows the shared B16 method card grid so users can switch methods here. */
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

const ICON_TONES = [
  { bg: 'rgba(15, 169, 104, 0.12)', fg: '#0F766E' },
  { bg: 'rgba(8, 145, 178, 0.12)', fg: '#0E7490' },
  { bg: 'rgba(180, 83, 9, 0.12)', fg: '#B45309' },
  { bg: 'rgba(79, 70, 229, 0.12)', fg: '#4338CA' },
] as const

function MethodSelectorGrid({
  selectedMethod,
  onSelect,
}: {
  selectedMethod: OriginalDocumentCollectionMethod
  onSelect: (method: OriginalDocumentCollectionMethod) => void
}) {
  const colors = usePublicBrandColors()

  return (
    <Grid container spacing={1.5} sx={{ mb: 2.5 }}>
      {RETAIL_COLLECTION_METHOD_OPTIONS.map((option, index) => {
        const selected = option.value === selectedMethod
        const Icon = option.icon
        const tone = ICON_TONES[index % ICON_TONES.length]
        return (
          <Grid size={{ xs: 6, sm: 3 }} key={option.value}>
            <Box
              onClick={() => onSelect(option.value)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  onSelect(option.value)
                }
              }}
              aria-pressed={selected}
              sx={{
                p: 1.5,
                cursor: 'pointer',
                height: '100%',
                ...getElevatedCardSx(selected ? 'rgba(115, 192, 100, 0.55)' : colors.border),
                bgcolor: selected ? retailFlowColors.optionBgSelected : colors.white,
                borderRadius: BORDER_RADIUS.lg,
                textAlign: 'center',
                outline: 'none',
                transition: 'border-color 0.15s ease',
                '&:hover': { borderColor: 'rgba(115, 192, 100, 0.55)' },
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  mx: 'auto',
                  mb: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: tone.bg,
                  color: tone.fg,
                }}
              >
                <Icon size={18} strokeWidth={2.1} />
              </Box>
              <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: colors.navy, lineHeight: 1.25 }}>
                {option.label}
              </Typography>
              <Typography
                sx={{
                  fontSize: 10.5,
                  color: colors.textMuted,
                  mt: 0.35,
                  lineHeight: 1.35,
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                {option.description}
              </Typography>
            </Box>
          </Grid>
        )
      })}
    </Grid>
  )
}

function InstructionsCard({
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
  const colors = usePublicBrandColors()
  const Icon = icon === 'drop' ? Building2 : Hand

  return (
    <Box
      sx={{
        ...getElevatedCardSx(colors.border),
        borderRadius: BORDER_RADIUS.lg,
        bgcolor: colors.white,
        p: 2.5,
      }}
    >
      <Stack direction="row" spacing={1.25} alignItems="flex-start" sx={{ mb: 2 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            bgcolor: retailFlowColors.greenMuted,
            color: retailFlowColors.green,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon size={18} strokeWidth={2.2} />
        </Box>
        <Box>
          <Typography sx={{ fontSize: 15, fontWeight: 800, color: colors.navy }}>{title}</Typography>
          <Typography sx={{ fontSize: 13, color: colors.textSecondary, mt: 0.5, lineHeight: 1.45 }}>
            {address}
          </Typography>
        </Box>
      </Stack>

      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
        <Clock size={14} color={colors.textMuted} />
        <Typography sx={{ fontSize: 12.5, color: colors.textMuted }}>{hours}</Typography>
      </Stack>

      <Typography sx={{ fontSize: 12, fontWeight: 700, color: colors.navy, mb: 1, letterSpacing: '0.02em' }}>
        Before you go
      </Typography>
      <Stack spacing={1}>
        {bullets.map((line) => (
          <Stack key={line} direction="row" spacing={1} alignItems="flex-start">
            <FileCheck size={14} color={retailFlowColors.green} style={{ marginTop: 2, flexShrink: 0 }} />
            <Typography sx={{ fontSize: 13, color: colors.textSecondary, lineHeight: 1.4 }}>{line}</Typography>
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
  const colors = usePublicBrandColors()
  const officeOptions = listReceivingOfficeOptions()
  const guide = OFFICE_GUIDES[officeId] ?? OFFICE_GUIDES['office-mumbai']

  return (
    <Stack spacing={2}>
      <FormField label="GLTS office" required>
        <Select
          fullWidth
          value={officeId || 'office-mumbai'}
          onChange={(value) => onSelectOffice(String(value))}
          options={officeOptions.map((option) => ({ label: option.label, value: option.value }))}
        />
      </FormField>
      <InstructionsCard
        title="Drop-off location"
        address={guide.address}
        hours={guide.hours}
        bullets={guide.prep}
        icon="drop"
      />
      <Typography sx={{ fontSize: 12, color: colors.textMuted }}>
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
    <Stack spacing={2}>
      <FormField label="Bring documents to" required>
        <Select
          fullWidth
          value={officeId || 'office-mumbai'}
          onChange={(value) => onSelectOffice(String(value))}
          options={officeOptions.map((option) => ({ label: option.label, value: option.value }))}
        />
      </FormField>
      <InstructionsCard
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
  const colors = usePublicBrandColors()
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
    <Box
      sx={{
        ...getElevatedCardSx(colors.border),
        borderRadius: BORDER_RADIUS.lg,
        bgcolor: colors.white,
        p: 2,
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
        <MapPin size={16} color={retailFlowColors.green} />
        <Typography sx={{ fontSize: 15, fontWeight: 800, color: colors.navy }}>
          Courier collection address
        </Typography>
      </Stack>
      <Typography sx={{ fontSize: 12.5, color: colors.textMuted, mb: 2, lineHeight: 1.4 }}>
        Where should the courier pick up your originals? Same address fields as pickup — no map.
      </Typography>
      <Stack spacing={1.75}>
        <FormField label="Address line 1" required>
          <Input
            value={addressLine1}
            onChange={(v) => setAddressField('addressLine1', v)}
            placeholder="Building, street"
            fullWidth
          />
        </FormField>
        <FormField label="Address line 2" optional>
          <Input
            value={addressLine2}
            onChange={(v) => setAddressField('addressLine2', v)}
            placeholder="Landmark, floor"
            fullWidth
          />
        </FormField>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 1.75,
          }}
        >
          <FormField label="PIN code" required>
            <Input value={pinCode} onChange={(v) => setAddressField('pinCode', v)} placeholder="e.g. 400021" fullWidth />
          </FormField>
          <FormField label="City" required>
            <Input value={city} onChange={(v) => setAddressField('city', v)} placeholder="City" fullWidth />
          </FormField>
        </Box>
        <FormField label="State" required>
          <Input value={state} onChange={(v) => setAddressField('state', v)} placeholder="State" fullWidth />
        </FormField>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 1.75,
          }}
        >
          <FormField label="Preferred date" required>
            <Input
              type="date"
              value={preferredDate}
              onChange={(v) => {
                onChange('preferredDate', v)
                onChange('pickupDate', v)
              }}
              fullWidth
            />
          </FormField>
          <FormField label="Preferred time window" required>
            <Input
              value={preferredWindow}
              onChange={(v) => {
                onChange('preferredWindow', v)
                onChange('pickupTime', v)
              }}
              placeholder="e.g. 10:00–13:00"
              fullWidth
            />
          </FormField>
        </Box>
        <FormField label="Delivery instructions" optional>
          <Textarea
            value={deliveryInstructions}
            onChange={(v) => {
              onChange('deliveryInstructions', v)
              onChange('remarks', v)
            }}
            placeholder="Gate code, contact on site…"
            fullWidth
          />
        </FormField>
      </Stack>
    </Box>
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
 * Shared method card grid at top; method-specific panel below.
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
      <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
        This collection method isn’t available in the retail flow.
      </Typography>
    )

  const body = (
    <Box sx={{ width: '100%', textAlign: 'left' }}>
      {onSelectMethod ? <MethodSelectorGrid selectedMethod={method} onSelect={onSelectMethod} /> : null}
      {panel}
    </Box>
  )

  if (previewOnly) return body

  const titleByMethod: Record<string, string> = {
    picked_up_from_company: 'Where should we pick up?',
    delivered_to_office: 'Drop originals at GLTS',
    couriered_by_applicant: 'Courier collection details',
    hand_carry_by_applicant: 'Hand-carry your originals',
  }

  return (
    <StepShell
      title={titleByMethod[method] ?? 'Collection details'}
      helperText="Choose how originals reach us, then confirm the details for that method."
      onBack={onBack}
      onContinue={onContinue}
      continueLabel={method === 'picked_up_from_company' ? 'Confirm pick-up' : 'Continue'}
      continueDisabled={!detailsComplete(method, values)}
      contentMaxWidth={920}
    >
      {body}
    </StepShell>
  )
}
