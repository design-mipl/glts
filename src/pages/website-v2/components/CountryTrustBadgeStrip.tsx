import { Box, Stack, Typography } from '@mui/material'
import { BadgeCheck, Sparkles, type LucideIcon } from 'lucide-react'
import {
  getCountryTrustProfile,
  resolveTrustClaims,
  type CountryTrustClaimId,
  type CountryTrustProfile,
} from '../config/countryTrustBadges'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'

const CLAIM_ICONS: Partial<Record<CountryTrustClaimId, LucideIcon>> = {
  ai: Sparkles,
}

interface CountryTrustBadgeStripProps {
  countryId: string
  /** Dark hero overlay vs light page surface */
  variant?: 'onDark' | 'onLight'
  showSubTagline?: boolean
  /** Limit claim chips on compact surfaces */
  maxClaims?: number
}

export function CountryTrustBadgeStrip({
  countryId,
  variant = 'onLight',
  showSubTagline = true,
  maxClaims,
}: CountryTrustBadgeStripProps) {
  const colors = usePublicBrandColors()
  const profile = getCountryTrustProfile(countryId)
  if (!profile) return null

  return (
    <CountryTrustBadgeStripView
      profile={profile}
      variant={variant}
      showSubTagline={showSubTagline}
      maxClaims={maxClaims}
      colors={colors}
    />
  )
}

interface ViewProps {
  profile: CountryTrustProfile
  variant: 'onDark' | 'onLight'
  showSubTagline: boolean
  maxClaims?: number
  colors: ReturnType<typeof usePublicBrandColors>
}

function CountryTrustBadgeStripView({
  profile,
  variant,
  showSubTagline,
  maxClaims,
  colors,
}: ViewProps) {
  const onDark = variant === 'onDark'
  const claims = resolveTrustClaims(profile)
  const visibleClaims = typeof maxClaims === 'number' ? claims.slice(0, maxClaims) : claims

  const chipBg = onDark ? 'rgba(255,255,255,0.12)' : colors.greenMuted
  const chipBorder = onDark ? 'rgba(255,255,255,0.28)' : `rgba(115, 192, 100, 0.35)`
  const chipText = onDark ? '#fff' : colors.greenDark
  const agentBg = onDark ? 'rgba(115, 192, 100, 0.22)' : colors.greenMuted
  const agentBorder = onDark ? 'rgba(115, 192, 100, 0.55)' : `rgba(115, 192, 100, 0.45)`
  const muted = onDark ? 'rgba(255,255,255,0.72)' : colors.textSecondary

  return (
    <Stack spacing={1.25} alignItems="center" sx={{ width: '100%' }}>
      <Stack direction="row" flexWrap="wrap" gap={1} useFlexGap justifyContent="center">
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.75,
            px: 1.5,
            py: 0.65,
            borderRadius: '8px',
            bgcolor: agentBg,
            border: `1px solid ${agentBorder}`,
          }}
        >
          <BadgeCheck size={14} color={onDark ? colors.greenBright : colors.greenDark} strokeWidth={2.25} />
          <Typography sx={{ fontSize: '12px', fontWeight: 800, color: chipText, letterSpacing: '0.01em' }}>
            {profile.agentBadgeLabel} · {profile.countryName}
          </Typography>
        </Box>

        {visibleClaims.map((claim) => {
          const Icon = CLAIM_ICONS[claim.id]
          return (
            <Box
              key={claim.id}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.6,
                px: 1.35,
                py: 0.6,
                borderRadius: '8px',
                bgcolor: chipBg,
                border: `1px solid ${chipBorder}`,
              }}
            >
              {Icon ? <Icon size={12} color={chipText} /> : null}
              <Typography sx={{ fontSize: '11px', fontWeight: 700, color: chipText }}>{claim.label}</Typography>
            </Box>
          )
        })}
      </Stack>

      {showSubTagline ? (
        <Typography
          sx={{
            fontSize: { xs: '13px', md: '14px' },
            fontWeight: 600,
            color: muted,
            textAlign: 'center',
            maxWidth: 520,
            lineHeight: 1.45,
          }}
        >
          {profile.subTagline}
        </Typography>
      ) : null}
    </Stack>
  )
}
