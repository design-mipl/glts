import { Button, type ButtonProps } from '@mui/material'
import {
  applyFlow,
  applyFont,
  applyRadius,
  getAccentButtonSx,
  getQuietButtonSx,
} from '@/pages/website/theme/applyFlowTheme'

/**
 * The account reuses the apply-flow button language rather than the design-system
 * `Button`, whose `contained` variant renders brand green. In the retail apply flow gold
 * is the primary interactive accent and green is reserved for "verified / complete", so a
 * green CTA here would read as a different product.
 */

const BASE = { minHeight: 36, px: 2, py: 0.75 } as const

/** Primary CTA — gold fill, ink label. One per surface. */
export function AccentButton({ sx, ...props }: ButtonProps) {
  return <Button disableElevation {...props} sx={{ ...getAccentButtonSx(), ...BASE, ...sx }} />
}

/** Secondary action — hairline border, no fill competing with the gold CTA. */
export function QuietButton({ sx, ...props }: ButtonProps) {
  return <Button disableElevation {...props} sx={{ ...getQuietButtonSx(), ...BASE, ...sx }} />
}

/** Tertiary / navigational action — no border, no fill. */
export function TextButton({ sx, ...props }: ButtonProps) {
  return (
    <Button
      disableElevation
      {...props}
      sx={{
        color: applyFlow.inkMuted,
        fontFamily: applyFont.body,
        fontSize: 13.5,
        fontWeight: 600,
        textTransform: 'none',
        borderRadius: applyRadius.control,
        '&:hover': { backgroundColor: applyFlow.canvas, color: applyFlow.ink },
        ...sx,
      }}
    />
  )
}
