import { Box } from '@mui/material'

/** Subtle global network pattern for the corporate final CTA band. */
export function CorporateCtaBackgroundPattern() {
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
        opacity: 0.2,
      }}
    >
      <defs>
        <pattern id="corporate-dots" width="32" height="32" patternUnits="userSpaceOnUse">
          <circle cx="16" cy="16" r="1.25" fill="rgba(255,255,255,0.14)" />
        </pattern>
      </defs>
      <rect width="1440" height="400" fill="url(#corporate-dots)" />
      <circle cx="280" cy="160" r="4" fill="rgba(115, 192, 100, 0.5)" />
      <circle cx="520" cy="100" r="4" fill="rgba(115, 192, 100, 0.5)" />
      <circle cx="760" cy="180" r="4" fill="rgba(115, 192, 100, 0.5)" />
      <circle cx="1000" cy="120" r="4" fill="rgba(115, 192, 100, 0.5)" />
      <circle cx="1240" cy="200" r="4" fill="rgba(115, 192, 100, 0.5)" />
      <line x1="280" y1="160" x2="520" y2="100" stroke="rgba(255,255,255,0.14)" strokeWidth="1.5" />
      <line x1="520" y1="100" x2="760" y2="180" stroke="rgba(255,255,255,0.14)" strokeWidth="1.5" />
      <line x1="760" y1="180" x2="1000" y2="120" stroke="rgba(255,255,255,0.14)" strokeWidth="1.5" />
      <line x1="1000" y1="120" x2="1240" y2="200" stroke="rgba(255,255,255,0.14)" strokeWidth="1.5" />
      <line x1="280" y1="160" x2="760" y2="180" stroke="rgba(115, 192, 100, 0.2)" strokeWidth="1" strokeDasharray="4 8" />
      <rect
        x="640"
        y="260"
        width="160"
        height="48"
        rx="10"
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1.5"
      />
      <rect
        x="900"
        y="280"
        width="120"
        height="36"
        rx="8"
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1.5"
      />
    </Box>
  )
}
