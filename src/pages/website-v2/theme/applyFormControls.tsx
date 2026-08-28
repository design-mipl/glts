import type { ChangeEvent, ReactNode } from 'react'
import { Box, Typography } from '@mui/material'
import { ChevronDown } from 'lucide-react'
import {
  applyFlow,
  applyFont,
  applyMotion,
  applyRadius,
  tabularNums,
} from './applyFlowTheme'

/**
 * Shared form + data primitives for the retail apply flow.
 *
 * These exist so the steps stop looking like separately-built screens. Every field label,
 * section break, data readout, and upload target in the flow comes from here, which is what
 * makes the journey read as one product instead of a sequence of forms.
 *
 * Reminder: theme spacing unit is 4px (see generateTheme.ts) — `4` = 16px.
 */

/** Field label. Sits above the control, never a placeholder-only label. */
export function FieldLabel({
  children,
  required,
  htmlFor,
}: {
  children: ReactNode
  required?: boolean
  htmlFor?: string
}) {
  return (
    <Typography
      component="label"
      htmlFor={htmlFor}
      sx={{
        display: 'block',
        fontFamily: applyFont.body,
        fontSize: 13,
        fontWeight: 600,
        letterSpacing: '-0.005em',
        color: applyFlow.ink,
        mb: 1.25,
      }}
    >
      {children}
      {required ? (
        <Box component="span" sx={{ color: applyFlow.accentInk, ml: 0.5 }} aria-hidden>
          *
        </Box>
      ) : null}
    </Typography>
  )
}

/**
 * Section break — an eyebrow with a rule that runs to the edge.
 * Groups fields without wrapping them in yet another card.
 */
export function SectionHeading({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 3, width: '100%' }}>
      <Typography
        sx={{
          ...tabularNums,
          flex: '0 0 auto',
          fontFamily: applyFont.mono,
          fontSize: 10.5,
          fontWeight: 700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: applyFlow.inkMuted,
        }}
      >
        {children}
      </Typography>
      <Box sx={{ flex: '1 1 auto', height: '1px', backgroundColor: applyFlow.hairline }} />
      {action ? <Box sx={{ flex: '0 0 auto' }}>{action}</Box> : null}
    </Box>
  )
}

/** Label/value readout. Value is mono + tabular so figures align down a column. */
export function DataRow({
  label,
  value,
  emphasis = false,
}: {
  label: ReactNode
  value: ReactNode
  emphasis?: boolean
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        gap: 3,
        py: 2,
        borderBottom: `1px solid ${applyFlow.hairlineSoft}`,
      }}
    >
      <Typography
        sx={{
          fontFamily: applyFont.body,
          fontSize: 13.5,
          color: applyFlow.inkMuted,
          lineHeight: 1.4,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          ...tabularNums,
          fontFamily: applyFont.mono,
          fontSize: emphasis ? 15 : 13,
          fontWeight: emphasis ? 700 : 500,
          color: emphasis ? applyFlow.ink : applyFlow.inkMuted,
          textAlign: 'right',
          flex: '0 0 auto',
        }}
      >
        {value}
      </Typography>
    </Box>
  )
}

/**
 * Base styles for a native input / select / MUI control.
 * 44px min height (touch), hairline resting border, gold focus ring.
 */
export const applyControlSx = {
  width: '100%',
  minHeight: 42,
  boxSizing: 'border-box' as const,
  px: 2.75,
  py: 1.75,
  fontFamily: applyFont.body,
  fontSize: 14,
  color: applyFlow.ink,
  backgroundColor: applyFlow.surface,
  border: `1px solid ${applyFlow.hairline}`,
  borderRadius: applyRadius.control,
  outline: 'none',
  transition: `border-color 150ms ${applyMotion.easeOut}, box-shadow 150ms ${applyMotion.easeOut}`,
  '&::placeholder': { color: applyFlow.inkFaint, opacity: 1 },
  '@media (hover: hover) and (pointer: fine)': {
    '&:hover:not(:disabled)': { borderColor: applyFlow.hairlineStrong },
  },
  '&:focus, &:focus-visible': {
    borderColor: applyFlow.accent,
    boxShadow: `0 0 0 3px ${applyFlow.accentRing}`,
  },
  '&:disabled': {
    backgroundColor: applyFlow.canvas,
    color: applyFlow.inkFaint,
    cursor: 'not-allowed',
  },
} as const

/** MUI `sx` for OutlinedInput/Select so themed controls match `applyControlSx`. */
export const applyMuiControlSx = {
  fontFamily: applyFont.body,
  fontSize: 14,
  borderRadius: applyRadius.control,
  backgroundColor: applyFlow.surface,
  '& .MuiOutlinedInput-notchedOutline': { borderColor: applyFlow.hairline },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: applyFlow.hairlineStrong },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: applyFlow.accent,
    borderWidth: '1px',
  },
  '&.Mui-focused': { boxShadow: `0 0 0 3px ${applyFlow.accentRing}` },
  '& .MuiSelect-select, & .MuiOutlinedInput-input': {
    minHeight: 'unset',
    paddingTop: '11px',
    paddingBottom: '11px',
  },
} as const

/**
 * Plain text/date input, styled to `applyControlSx`. Pair with `FieldLabel` — this
 * component renders only the control, not the label, so callers keep control over
 * required/optional/helper text placement.
 */
export function ApplyTextField({
  value,
  onChange,
  placeholder,
  type = 'text',
  id,
  disabled,
  min,
  max,
  'aria-label': ariaLabel,
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
  id?: string
  disabled?: boolean
  min?: string
  max?: string
  'aria-label'?: string
}) {
  return (
    <Box
      component="input"
      id={id}
      type={type}
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      min={min}
      max={max}
      aria-label={ariaLabel}
      onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
      sx={applyControlSx}
    />
  )
}

/** Multi-line counterpart to `ApplyTextField`. */
export function ApplyTextarea({
  value,
  onChange,
  placeholder,
  id,
  rows = 2,
  disabled,
  'aria-label': ariaLabel,
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  id?: string
  rows?: number
  disabled?: boolean
  'aria-label'?: string
}) {
  return (
    <Box
      component="textarea"
      id={id}
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      rows={rows}
      aria-label={ariaLabel}
      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
      sx={{ ...applyControlSx, resize: 'vertical', minHeight: 'unset', lineHeight: 1.5 }}
    />
  )
}

/** Native `<select>` for label/value option lists too short to need `ApplyStateSelect`'s search. */
export function ApplySelect({
  value,
  options,
  onChange,
  id,
  'aria-label': ariaLabel,
}: {
  value: string
  options: { label: string; value: string }[]
  onChange: (value: string) => void
  id?: string
  'aria-label'?: string
}) {
  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <Box
        component="select"
        id={id}
        value={value}
        aria-label={ariaLabel}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
        sx={{
          ...applyControlSx,
          appearance: 'none',
          cursor: 'pointer',
          pr: 5,
        }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Box>
      <ChevronDown
        size={15}
        style={{
          position: 'absolute',
          right: 12,
          top: '50%',
          transform: 'translateY(-50%)',
          color: applyFlow.inkFaint,
          pointerEvents: 'none',
        }}
      />
    </Box>
  )
}

/** Status tone for upload/verification states. Green is semantic only — never a selection. */
export type ApplyStatusTone = 'idle' | 'done' | 'attention' | 'error'

export function statusColors(tone: ApplyStatusTone) {
  switch (tone) {
    case 'done':
      return { fg: applyFlow.success, bg: applyFlow.successSoft, border: applyFlow.successBorder }
    case 'attention':
      return { fg: applyFlow.warning, bg: applyFlow.warningSoft, border: 'rgba(180, 83, 9, 0.35)' }
    case 'error':
      return { fg: applyFlow.critical, bg: applyFlow.criticalSoft, border: 'rgba(180, 35, 24, 0.35)' }
    default:
      return { fg: applyFlow.inkMuted, bg: 'transparent', border: applyFlow.hairline }
  }
}

/** Small status pill — tint background + same-family dark text. Never a saturated fill. */
export function StatusPill({ tone, children }: { tone: ApplyStatusTone; children: ReactNode }) {
  const c = statusColors(tone)
  return (
    <Box
      component="span"
      sx={{
        ...tabularNums,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1,
        px: 2,
        py: 0.75,
        borderRadius: applyRadius.chip,
        backgroundColor: tone === 'idle' ? applyFlow.canvas : c.bg,
        color: c.fg,
        fontFamily: applyFont.mono,
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </Box>
  )
}
