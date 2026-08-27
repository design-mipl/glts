import { useCallback, useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { MapPin, Search } from 'lucide-react'
import { FormField, Input, Textarea } from '@/design-system/UIComponents'
import { BORDER_RADIUS } from '@/design-system/tokens'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { getElevatedCardSx, retailFlowColors } from '@/pages/website-v2/theme/retailFlowTokens'
import { StepShell } from '../StepShell'

export interface PickupLocationValues {
  searchQuery?: string
  addressLine1: string
  addressLine2: string
  pinCode: string
  city: string
  state: string
  deliveryInstructions: string
  /** 0–100 percent positions for the faux map pin (no map library in repo). */
  pinX?: number
  pinY?: number
}

interface PickupLocationStepProps {
  values: Record<string, string>
  onChange: (key: string, value: string) => void
  onBack: () => void
  onContinue: () => void
  previewOnly?: boolean
}

/**
 * B16 — GLTS Pickup location.
 * No map library (leaflet / Google Maps / Mapbox) exists in this codebase.
 * Uses an interactive faux map (search overlay + draggable pin) until a maps SDK is adopted.
 */
export function PickupLocationStep({
  values,
  onChange,
  onBack,
  onContinue,
  previewOnly = false,
}: PickupLocationStepProps) {
  const colors = usePublicBrandColors()
  const mapRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const [pin, setPin] = useState({
    x: Number(values.pinX || 52),
    y: Number(values.pinY || 48),
  })
  const [query, setQuery] = useState(values.searchQuery ?? values.pickupAddress ?? '')

  const addressLine1 = values.addressLine1 ?? values.pickupAddress ?? ''
  const addressLine2 = values.addressLine2 ?? ''
  const pinCode = values.pinCode ?? ''
  const city = values.city ?? ''
  const state = values.state ?? ''
  const deliveryInstructions = values.deliveryInstructions ?? values.remarks ?? ''

  const requiredComplete = [addressLine1, pinCode, city, state].every(
    (v) => String(v).trim().length > 0,
  )

  const setField = useCallback(
    (key: string, value: string) => {
      onChange(key, value)
      // Keep legacy pickupAddress in sync for payment/collection summary.
      if (key === 'addressLine1' || key === 'addressLine2' || key === 'city' || key === 'pinCode') {
        const line1 = key === 'addressLine1' ? value : addressLine1
        const line2 = key === 'addressLine2' ? value : addressLine2
        const c = key === 'city' ? value : city
        const pc = key === 'pinCode' ? value : pinCode
        const composed = [line1, line2, c, pc].filter((part) => part.trim()).join(', ')
        onChange('pickupAddress', composed)
      }
    },
    [onChange, addressLine1, addressLine2, city, pinCode],
  )

  function updatePinFromEvent(clientX: number, clientY: number) {
    const el = mapRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = Math.min(94, Math.max(6, ((clientX - rect.left) / rect.width) * 100))
    const y = Math.min(94, Math.max(6, ((clientY - rect.top) / rect.height) * 100))
    setPin({ x, y })
    onChange('pinX', String(Math.round(x)))
    onChange('pinY', String(Math.round(y)))
  }

  function applySearch() {
    const next = query.trim()
    onChange('searchQuery', next)
    if (!next) return
    if (!addressLine1.trim()) setField('addressLine1', next)
  }

  const mapColumn = (
    <Box
      sx={{
        ...getElevatedCardSx(colors.border),
        borderRadius: BORDER_RADIUS.lg,
        overflow: 'hidden',
        bgcolor: colors.white,
        position: 'relative',
        minHeight: { xs: 280, md: 420 },
        height: '100%',
      }}
    >
      <Box sx={{ position: 'absolute', top: 12, left: 12, right: 12, zIndex: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            bgcolor: colors.white,
            borderRadius: BORDER_RADIUS.md,
            border: `1px solid ${colors.border}`,
            boxShadow: '0 4px 14px rgba(15,27,43,0.08)',
            px: 1.25,
            py: 0.75,
          }}
        >
          <Search size={15} color={colors.textMuted} />
          <Box
            component="input"
            value={query}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
            onKeyDown={(e: KeyboardEvent) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                applySearch()
              }
            }}
            placeholder="Search address or landmark"
            sx={{
              flex: 1,
              border: 'none',
              outline: 'none',
              font: 'inherit',
              fontSize: 13,
              color: colors.navy,
              bgcolor: 'transparent',
              minWidth: 0,
            }}
          />
          <Box
            component="button"
            type="button"
            onClick={applySearch}
            sx={{
              appearance: 'none',
              border: 'none',
              bgcolor: retailFlowColors.greenMuted,
              color: colors.greenDark,
              borderRadius: '8px',
              px: 1.1,
              py: 0.55,
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Go
          </Box>
        </Box>
      </Box>

      <Box
        ref={mapRef}
        onPointerDown={(e) => {
          dragging.current = true
          ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
          updatePinFromEvent(e.clientX, e.clientY)
        }}
        onPointerMove={(e) => {
          if (!dragging.current) return
          updatePinFromEvent(e.clientX, e.clientY)
        }}
        onPointerUp={() => {
          dragging.current = false
        }}
        sx={{
          position: 'absolute',
          inset: 0,
          cursor: 'grab',
          bgcolor: '#E8EEF2',
          backgroundImage: `
            linear-gradient(rgba(15, 23, 42, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(15, 23, 42, 0.05) 1px, transparent 1px),
            radial-gradient(circle at 30% 40%, rgba(115, 192, 100, 0.12), transparent 45%),
            radial-gradient(circle at 70% 65%, rgba(15, 23, 42, 0.06), transparent 40%)
          `,
          backgroundSize: '28px 28px, 28px 28px, auto, auto',
          userSelect: 'none',
          touchAction: 'none',
        }}
      >
        {/* Soft road strokes */}
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            left: '8%',
            right: '10%',
            top: '42%',
            height: 10,
            borderRadius: 999,
            bgcolor: 'rgba(255,255,255,0.7)',
            transform: 'rotate(-6deg)',
          }}
        />
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            left: '35%',
            width: 10,
            top: '12%',
            bottom: '18%',
            borderRadius: 999,
            bgcolor: 'rgba(255,255,255,0.55)',
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            left: `${pin.x}%`,
            top: `${pin.y}%`,
            transform: 'translate(-50%, -100%)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50% 50% 50% 0',
              transform: 'rotate(-45deg)',
              bgcolor: retailFlowColors.green,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 16px rgba(15,27,43,0.22)',
            }}
          >
            <Box sx={{ transform: 'rotate(45deg)', color: '#fff', display: 'flex' }}>
              <MapPin size={18} strokeWidth={2.4} />
            </Box>
          </Box>
        </Box>

        <Typography
          sx={{
            position: 'absolute',
            bottom: 10,
            left: 12,
            right: 12,
            fontSize: 11,
            color: colors.textMuted,
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          Drag the pin — map tiles when a maps SDK is added
        </Typography>
      </Box>
    </Box>
  )

  const formColumn = (
    <Box
      sx={{
        ...getElevatedCardSx(colors.border),
        borderRadius: BORDER_RADIUS.lg,
        bgcolor: colors.white,
        p: 2,
        height: '100%',
      }}
    >
      <Typography sx={{ fontSize: 15, fontWeight: 800, color: colors.navy, mb: 1.5 }}>
        Pickup address
      </Typography>
      <Stack spacing={1.75}>
        <FormField label="Address line 1" required>
          <Input
            value={addressLine1}
            onChange={(v) => setField('addressLine1', v)}
            placeholder="Building, street"
            fullWidth
          />
        </FormField>
        <FormField label="Address line 2" optional>
          <Input
            value={addressLine2}
            onChange={(v) => setField('addressLine2', v)}
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
            <Input value={pinCode} onChange={(v) => setField('pinCode', v)} placeholder="e.g. 400021" fullWidth />
          </FormField>
          <FormField label="City" required>
            <Input value={city} onChange={(v) => setField('city', v)} placeholder="City" fullWidth />
          </FormField>
        </Box>
        <FormField label="State" required>
          <Input value={state} onChange={(v) => setField('state', v)} placeholder="State" fullWidth />
        </FormField>
        <FormField label="Delivery instructions" optional>
          <Textarea
            value={deliveryInstructions}
            onChange={(v) => {
              onChange('deliveryInstructions', v)
              onChange('remarks', v)
            }}
            placeholder="Gate code, preferred time window, contact on site…"
            fullWidth
          />
        </FormField>
      </Stack>
    </Box>
  )

  const body = (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1.05fr 0.95fr' },
        gap: 2,
        alignItems: 'stretch',
        width: '100%',
      }}
    >
      {mapColumn}
      {formColumn}
    </Box>
  )

  if (previewOnly) return body

  return (
    <StepShell
      title="Where should we pick up?"
      helperText="Drop the pin near the entrance and confirm the address our courier will use."
      onBack={onBack}
      onContinue={onContinue}
      continueLabel="Confirm pick-up"
      continueDisabled={!requiredComplete}
      contentMaxWidth={920}
    >
      {body}
    </StepShell>
  )
}
