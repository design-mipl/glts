import { Box } from '@mui/material'

/** Subtle nautical route and map pattern for the marine final CTA band. */
export function MarineCtaBackgroundPattern() {
  return (
    <Box
      component="svg"
      aria-hidden
      viewBox="0 0 1440 400"
      preserveAspectRatio="xMidYMid slice"
      sx={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity: 0.22,
      }}
    >
      <defs>
        <pattern id="marine-grid" width="48" height="48" patternUnits="userSpaceOnUse">
          <path d="M 48 0 L 0 0 0 48" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="1440" height="400" fill="url(#marine-grid)" />
      <path
        d="M 80 280 C 220 180, 360 320, 520 220 S 820 120, 980 200 S 1180 280, 1360 180"
        fill="none"
        stroke="rgba(115, 192, 100, 0.35)"
        strokeWidth="2"
        strokeDasharray="6 8"
      />
      <path
        d="M 120 120 C 280 200, 420 80, 600 160 S 880 240, 1040 140 S 1240 60, 1380 120"
        fill="none"
        stroke="rgba(255, 255, 255, 0.18)"
        strokeWidth="1.5"
        strokeDasharray="4 10"
      />
      <circle cx="520" cy="220" r="5" fill="rgba(115, 192, 100, 0.55)" />
      <circle cx="980" cy="200" r="5" fill="rgba(115, 192, 100, 0.55)" />
      <circle cx="1360" cy="180" r="5" fill="rgba(115, 192, 100, 0.55)" />
      <path
        d="M 200 300 L 220 290 L 240 305 L 260 285 L 280 300"
        fill="none"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1.5"
      />
      <path
        d="M 1080 80 L 1100 70 L 1120 85 L 1140 65 L 1160 80"
        fill="none"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1.5"
      />
    </Box>
  )
}
