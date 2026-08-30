import { useCallback, useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react'
import { Box, Typography } from '@mui/material'
import { MapPin, Search } from 'lucide-react'
import { applyFlow, applyFont, applyMotion, applyRadius } from '@/pages/website/theme/applyFlowTheme'
import { ApplyTextField, ApplyTextarea, FieldLabel } from '@/pages/website/theme/applyFormControls'
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
        border: `1px solid ${applyFlow.hairline}`,
        borderRadius: applyRadius.card,
        overflow: 'hidden',
        position: 'relative',
        minHeight: { xs: 260, md: 360 },
        height: '100%',
      }}
    >
      <Box sx={{ position: 'absolute', top: 10, left: 10, right: 10, zIndex: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            bgcolor: applyFlow.surface,
            borderRadius: applyRadius.control,
            border: `1px solid ${applyFlow.hairline}`,
            boxShadow: '0 4px 14px rgba(15,27,43,0.08)',
            px: 1.5,
            py: 1,
          }}
        >
          <Search size={14} style={{ color: applyFlow.inkFaint, flexShrink: 0 }} />
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
              fontFamily: applyFont.body,
              fontSize: 13,
              color: applyFlow.ink,
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
              bgcolor: applyFlow.accent,
              color: applyFlow.onAccent,
              borderRadius: applyRadius.chip,
              px: 1.25,
              py: 0.6,
              fontSize: 11.5,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: applyFont.body,
              transition: `background-color 150ms ${applyMotion.easeOut}`,
              '&:hover': { backgroundColor: applyFlow.accentStrong },
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
          bgcolor: applyFlow.canvas,
          backgroundImage: [
            'linear-gradient(rgba(15, 23, 42, 0.05) 1px, transparent 1px)',
            'linear-gradient(90deg, rgba(15, 23, 42, 0.05) 1px, transparent 1px)',
            `radial-gradient(circle at 70% 65%, rgba(${'254, 193, 7'}, 0.08), transparent 45%)`,
          ].join(', '),
          backgroundSize: '28px 28px, 28px 28px, auto',
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
              width: 38,
              height: 38,
              borderRadius: '50% 50% 50% 0',
              transform: 'rotate(-45deg)',
              bgcolor: applyFlow.accent,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 16px rgba(15,27,43,0.22)',
            }}
          >
            <Box sx={{ transform: 'rotate(45deg)', color: applyFlow.onAccent, display: 'flex' }}>
              <MapPin size={17} strokeWidth={2.4} />
            </Box>
          </Box>
        </Box>

        <Typography
          sx={{
            position: 'absolute',
            bottom: 10,
            left: 12,
            right: 12,
            fontFamily: applyFont.body,
            fontSize: 11,
            color: applyFlow.inkMuted,
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
    <Box sx={{ height: '100%' }}>
      <Typography sx={{ fontFamily: applyFont.body, fontSize: 14.5, fontWeight: 700, color: applyFlow.ink, mb: 2 }}>
        Pickup address
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.25 }}>
        <Box>
          <FieldLabel required>Address line 1</FieldLabel>
          <ApplyTextField value={addressLine1} onChange={(v) => setField('addressLine1', v)} placeholder="Building, street" />
        </Box>
        <Box>
          <FieldLabel>Address line 2</FieldLabel>
          <ApplyTextField value={addressLine2} onChange={(v) => setField('addressLine2', v)} placeholder="Landmark, floor" />
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.25 }}>
          <Box>
            <FieldLabel required>PIN code</FieldLabel>
            <ApplyTextField value={pinCode} onChange={(v) => setField('pinCode', v)} placeholder="e.g. 400021" />
          </Box>
          <Box>
            <FieldLabel required>City</FieldLabel>
            <ApplyTextField value={city} onChange={(v) => setField('city', v)} placeholder="City" />
          </Box>
        </Box>
        <Box>
          <FieldLabel required>State</FieldLabel>
          <ApplyTextField value={state} onChange={(v) => setField('state', v)} placeholder="State" />
        </Box>
        <Box>
          <FieldLabel>Delivery instructions</FieldLabel>
          <ApplyTextarea
            value={deliveryInstructions}
            onChange={(v) => {
              onChange('deliveryInstructions', v)
              onChange('remarks', v)
            }}
            placeholder="Gate code, preferred time window, contact on site…"
          />
        </Box>
      </Box>
    </Box>
  )

  const body = (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        gap: 3,
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
