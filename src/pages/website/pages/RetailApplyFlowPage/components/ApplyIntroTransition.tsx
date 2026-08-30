import { useEffect, useRef, useState } from 'react'
import { Box, LinearProgress, Stack, Typography, keyframes } from '@mui/material'
import { BadgeCheck } from 'lucide-react'
import {
  APPLY_INTRO_DURATION_MS,
  resolveTrustClaims,
  type CountryTrustProfile,
} from '../../../config/countryTrustBadges'
import { usePublicBrandColors, publicFonts } from '@/shared/theme/publicBrand'
import { CountryFlagVisual } from '@/shared/components/CountryFlagVisual'

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
`

const pulse = keyframes`
  0%, 100% { opacity: 0.55; }
  50% { opacity: 1; }
`

interface ApplyIntroTransitionProps {
  profile: CountryTrustProfile
  flagEmoji?: string
  countryCode?: string
  onComplete: () => void
  durationMs?: number
}

/** Full-screen trust intro before the first apply step (auto-advances). */
export function ApplyIntroTransition({
  profile,
  flagEmoji,
  countryCode,
  onComplete,
  durationMs = APPLY_INTRO_DURATION_MS,
}: ApplyIntroTransitionProps) {
  const colors = usePublicBrandColors()
  const claims = resolveTrustClaims(profile)
  const [progress, setProgress] = useState(0)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete
  const completedRef = useRef(false)

  useEffect(() => {
    completedRef.current = false
    const started = performance.now()
    let frame = 0

    const tick = (now: number) => {
      const ratio = Math.min(1, (now - started) / durationMs)
      setProgress(ratio * 100)
      if (ratio >= 1) {
        if (!completedRef.current) {
          completedRef.current = true
          onCompleteRef.current()
        }
        return
      }
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [durationMs])

  return (
    <Box
      role="status"
      aria-live="polite"
      aria-label={`Preparing ${profile.countryName} visa application`}
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 1400,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 3,
        background: `radial-gradient(ellipse at 50% 20%, rgba(115, 192, 100, 0.18) 0%, transparent 55%),
          linear-gradient(165deg, ${colors.navy} 0%, ${colors.navyMid} 48%, #0d3d4a 100%)`,
        overflow: 'hidden',
      }}
    >
      {/* Soft tech grid */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          opacity: 0.12,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.35) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.35) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse at center, #000 30%, transparent 75%)',
        }}
      />

      <Stack
        spacing={3}
        alignItems="center"
        sx={{
          position: 'relative',
          maxWidth: 560,
          width: '100%',
          textAlign: 'center',
          animation: `${fadeUp} 0.55s ease both`,
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          {flagEmoji || countryCode ? (
            <CountryFlagVisual flag={flagEmoji ?? ''} countryCode={countryCode} size={40} />
          ) : null}
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.75,
              px: 1.5,
              py: 0.7,
              borderRadius: '8px',
              bgcolor: 'rgba(115, 192, 100, 0.2)',
              border: '1px solid rgba(115, 192, 100, 0.5)',
            }}
          >
            <BadgeCheck size={16} color={colors.greenBright} strokeWidth={2.4} />
            <Typography sx={{ fontSize: '13px', fontWeight: 800, color: '#fff' }}>
              {profile.agentBadgeLabel}
            </Typography>
          </Box>
        </Stack>

        <Box>
          <Typography
            component="h1"
            sx={{
              fontFamily: publicFonts.heading,
              fontWeight: 800,
              fontSize: { xs: '26px', md: '34px' },
              color: '#fff',
              lineHeight: 1.2,
              mb: 1.25,
            }}
          >
            {profile.countryName} visa — guided apply
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: '14px', md: '16px' },
              fontWeight: 600,
              color: 'rgba(255,255,255,0.78)',
              lineHeight: 1.5,
              maxWidth: 480,
              mx: 'auto',
            }}
          >
            {profile.subTagline}
          </Typography>
        </Box>

        <Stack direction="row" flexWrap="wrap" gap={1} useFlexGap justifyContent="center">
          {claims.map((claim, index) => (
            <Box
              key={claim.id}
              sx={{
                px: 1.4,
                py: 0.7,
                borderRadius: '8px',
                bgcolor: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.22)',
                animation: `${fadeUp} 0.45s ease both`,
                animationDelay: `${120 + index * 70}ms`,
              }}
            >
              <Typography sx={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>{claim.label}</Typography>
            </Box>
          ))}
        </Stack>

        <Box sx={{ width: '100%', maxWidth: 280, pt: 1 }}>
          <Typography
            sx={{
              fontSize: '12px',
              fontWeight: 600,
              color: 'rgba(255,255,255,0.55)',
              mb: 1,
              animation: `${pulse} 1.6s ease-in-out infinite`,
            }}
          >
            Preparing your secure application…
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 4,
              borderRadius: 999,
              bgcolor: 'rgba(255,255,255,0.12)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 999,
                bgcolor: colors.greenBright,
              },
            }}
          />
        </Box>
      </Stack>
    </Box>
  )
}
