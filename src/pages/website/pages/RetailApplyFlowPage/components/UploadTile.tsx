import { useRef, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { Camera, Check, RefreshCw, Upload, X } from 'lucide-react'
import {
  applyFlow,
  applyFont,
  applyMotion,
  applyRadius,
  tabularNums,
} from '@/pages/website/theme/applyFlowTheme'

export interface UploadTileProps {
  label: string
  hint?: string
  /** Data URL of the captured/uploaded image, when present. */
  value?: string
  /** Timestamp shown under the label once uploaded. */
  capturedAt?: string
  onFile: (file: File) => void
  onClear?: () => void
  /** Opens the camera capture flow instead of the file picker. */
  onCapture?: () => void
  accept?: string
  required?: boolean
  disabled?: boolean
  /** `wide` fills the row; `tile` is a fixed-ratio thumbnail target. */
  variant?: 'wide' | 'tile'
}

function formatWhen(iso?: string) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short' })
}

/**
 * The one upload target in the flow.
 *
 * Passport, photo, sponsor bank statement and every checklist document use this, so an
 * upload looks and behaves identically wherever it appears. Empty state is a hairline
 * dashed target; filled state swaps to a thumbnail with the file's own preview as the
 * evidence that it worked — no separate "uploaded!" banner.
 *
 * Green appears only once the file is in (semantic: cleared). The drop target's active
 * state is gold, because that is an interaction, not a status.
 */
export function UploadTile({
  label,
  hint,
  value,
  capturedAt,
  onFile,
  onClear,
  onCapture,
  accept = 'image/*,application/pdf',
  required = false,
  disabled = false,
  variant = 'wide',
}: UploadTileProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [dragging, setDragging] = useState(false)
  const filled = Boolean(value)

  function pick(file?: File | null) {
    if (file) onFile(file)
  }

  const isTile = variant === 'tile'

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: isTile ? 'column' : 'row',
        alignItems: isTile ? 'stretch' : 'center',
        gap: isTile ? 0 : 3,
        width: '100%',
        minHeight: isTile ? 0 : 64,
        p: isTile ? 0 : 2.5,
        borderRadius: applyRadius.control,
        border: `1px ${filled ? 'solid' : 'dashed'} ${
          dragging ? applyFlow.accent : filled ? applyFlow.hairline : applyFlow.hairlineStrong
        }`,
        backgroundColor: dragging ? applyFlow.accentSoft : applyFlow.surface,
        boxShadow: dragging ? `0 0 0 3px ${applyFlow.accentRing}` : 'none',
        overflow: 'hidden',
        transition: `border-color 150ms ${applyMotion.easeOut}, background-color 150ms ${applyMotion.easeOut}, box-shadow 150ms ${applyMotion.easeOut}`,
        opacity: disabled ? 0.55 : 1,
      }}
      onDragOver={(e) => {
        if (disabled) return
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        if (disabled) return
        e.preventDefault()
        setDragging(false)
        pick(e.dataTransfer.files?.[0])
      }}
    >
      <Box
        component="input"
        ref={inputRef}
        type="file"
        accept={accept}
        disabled={disabled}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          pick(e.target.files?.[0])
          e.target.value = ''
        }}
        sx={{ display: 'none' }}
      />

      {/* Preview / icon */}
      <Box
        aria-hidden
        sx={{
          flex: '0 0 auto',
          width: isTile ? '100%' : 44,
          height: isTile ? 104 : 44,
          display: 'grid',
          placeItems: 'center',
          borderRadius: isTile ? 0 : applyRadius.chip,
          borderBottom: isTile ? `1px solid ${applyFlow.hairlineSoft}` : 'none',
          backgroundColor: filled ? applyFlow.canvas : 'transparent',
          backgroundImage: filled && value ? `url(${value})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: applyFlow.inkFaint,
        }}
      >
        {!filled ? <Upload size={isTile ? 18 : 16} strokeWidth={1.8} /> : null}
      </Box>

      {/* Label + state */}
      <Box sx={{ flex: '1 1 auto', minWidth: 0, p: isTile ? 2.5 : 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography
            sx={{
              fontFamily: applyFont.body,
              fontSize: 13.5,
              fontWeight: 600,
              color: applyFlow.ink,
              lineHeight: 1.3,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {label}
          </Typography>
          {required && !filled ? (
            <Box component="span" sx={{ color: applyFlow.accentInk, fontSize: 13 }} aria-hidden>
              *
            </Box>
          ) : null}
          {filled ? (
            <Box
              aria-label="Uploaded"
              sx={{
                width: 15,
                height: 15,
                flex: '0 0 auto',
                display: 'grid',
                placeItems: 'center',
                borderRadius: '50%',
                backgroundColor: applyFlow.success,
                color: '#FFFFFF',
              }}
            >
              <Check size={9} strokeWidth={4} />
            </Box>
          ) : null}
        </Box>
        <Typography
          sx={{
            ...tabularNums,
            fontFamily: applyFont.mono,
            fontSize: 10.5,
            color: applyFlow.inkMuted,
            mt: 0.75,
            lineHeight: 1.4,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {filled ? `Uploaded${capturedAt ? ` · ${formatWhen(capturedAt)}` : ''}` : hint || 'PDF, JPG or PNG'}
        </Typography>
      </Box>

      {/* Actions */}
      <Box
        sx={{
          flex: '0 0 auto',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          p: isTile ? 2.5 : 0,
          pt: isTile ? 0 : undefined,
        }}
      >
        {onCapture && !filled ? (
          <ActionButton label={`Take a photo of ${label}`} onClick={onCapture} disabled={disabled}>
            <Camera size={14} />
          </ActionButton>
        ) : null}
        <ActionButton
          label={filled ? `Replace ${label}` : `Upload ${label}`}
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
          emphasis={!filled}
        >
          {filled ? <RefreshCw size={13} /> : <Upload size={13} />}
        </ActionButton>
        {filled && onClear ? (
          <ActionButton label={`Remove ${label}`} onClick={onClear} disabled={disabled} danger>
            <X size={14} />
          </ActionButton>
        ) : null}
      </Box>
    </Box>
  )
}

function ActionButton({
  label,
  onClick,
  children,
  disabled,
  emphasis = false,
  danger = false,
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
  disabled?: boolean
  emphasis?: boolean
  danger?: boolean
}) {
  return (
    <Box
      component="button"
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      sx={{
        width: 34,
        height: 34,
        '@media (pointer: coarse)': { width: 44, height: 44 },
        display: 'grid',
        placeItems: 'center',
        appearance: 'none',
        cursor: disabled ? 'default' : 'pointer',
        borderRadius: applyRadius.chip,
        border: `1px solid ${emphasis ? applyFlow.accentBorder : applyFlow.hairline}`,
        backgroundColor: emphasis ? applyFlow.accentSoft : 'transparent',
        color: danger ? applyFlow.critical : emphasis ? applyFlow.accentInk : applyFlow.inkMuted,
        transition: `border-color 150ms ${applyMotion.easeOut}, color 150ms ${applyMotion.easeOut}, transform ${applyMotion.pressMs}ms ${applyMotion.easeOut}`,
        '@media (hover: hover) and (pointer: fine)': {
          '&:hover:not(:disabled)': {
            borderColor: danger ? applyFlow.critical : applyFlow.hairlineStrong,
            color: danger ? applyFlow.critical : applyFlow.ink,
          },
        },
        '&:active:not(:disabled)': { transform: 'scale(0.95)' },
        '&:focus-visible': {
          outline: 'none',
          borderColor: applyFlow.accent,
          boxShadow: `0 0 0 3px ${applyFlow.accentRing}`,
        },
      }}
    >
      {children}
    </Box>
  )
}
