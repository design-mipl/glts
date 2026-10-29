import { Box, Stack, Typography } from '@mui/material'
import { ArrowRight, BadgeCheck, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  site,
  siteFont,
  siteMotion,
  siteRadius,
  siteBrand,
  mrzSx,
  clippedCorner,
} from '@/pages/website/theme/siteTheme'
import { COUNTRY_TRUST_BY_ID } from '../../../config/countryTrustBadges'

/**
 * Hero support strip — registered-agent countries, and the refusal offer.
 *
 * Both of these were previously one line of small print each: the agent credential was a
 * single checked sentence at the foot of the hero, and refusal support was a whole section
 * that no longer appeared on the page at all. They are the two claims a visitor most needs
 * before they trust the search box above, so they get cards rather than a footnote.
 *
 * The countries are read from `COUNTRY_TRUST_BY_ID`, the same config the country detail
 * pages use for their agent chrome — so the homepage cannot drift out of sync with which
 * markets actually carry the credential.
 *
 * The country mark is the ISO code set in mono, not a flag. It matches the site's MRZ
 * device, needs no asset, and reads as a credential reference rather than decoration.
 */

const AGENT_COUNTRY_IDS = ['13', '21', '26'] as const

function AgentCountryCard({ countryId }: { countryId: string }) {
  const profile = COUNTRY_TRUST_BY_ID[countryId]
  const navigate = useNavigate()

  if (!profile) return null

  return (
    <Box
      component="button"
      type="button"
      onClick={() => navigate(`/countries/${profile.countryId}`)}
      sx={{
        appearance: 'none',
        cursor: 'pointer',
        textAlign: 'left',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        p: 2,
        minHeight: 44,
        borderRadius: siteRadius.card,
        border: `1px solid ${site.hairline}`,
        backgroundColor: site.surface,
        transition: `border-color 160ms ${siteMotion.easeOut}, background-color 160ms ${siteMotion.easeOut}, transform ${siteMotion.pressMs}ms ${siteMotion.easeOut}`,
        '@media (hover: hover) and (pointer: fine)': {
          '&:hover': { borderColor: siteBrand.greenBorder, backgroundColor: siteBrand.greenSoft },
        },
        '&:active': { transform: 'scale(0.98)' },
        '&:focus-visible': {
          outline: 'none',
          borderColor: siteBrand.green,
          boxShadow: `0 0 0 3px ${siteBrand.greenSoft}`,
        },
      }}
    >
      <Box
        aria-hidden
        sx={{
          width: 38,
          height: 38,
          flex: '0 0 auto',
          display: 'grid',
          placeItems: 'center',
          borderRadius: siteRadius.chip,
          border: `1px solid ${siteBrand.greenBorder}`,
          backgroundColor: siteBrand.greenSoft,
          fontFamily: siteFont.mono,
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.06em',
          color: siteBrand.greenInk,
        }}
      >
        {profile.countryCode}
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            fontFamily: siteFont.display,
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: site.ink,
            lineHeight: 1.2,
          }}
        >
          {profile.countryName}
        </Typography>
        <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mt: 0.75 }}>
          <BadgeCheck size={11} strokeWidth={2.4} style={{ color: siteBrand.greenInk }} />
          <Typography sx={{ ...mrzSx, fontSize: 8.5, letterSpacing: '0.12em' }}>
            {profile.agentBadgeLabel}
          </Typography>
        </Stack>
      </Box>
    </Box>
  )
}

function RefusalSupportCard() {
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { sm: 'center' },
        gap: { xs: 2.5, sm: 3 },
        p: { xs: 2.5, md: 3 },
        borderRadius: siteRadius.card,
        clipPath: { xs: 'none', sm: clippedCorner(18) },
        border: `1px solid ${site.hairline}`,
        backgroundColor: site.surface,
      }}
    >
      <Box
        aria-hidden
        sx={{
          width: 42,
          height: 42,
          flex: '0 0 auto',
          display: 'grid',
          placeItems: 'center',
          borderRadius: siteRadius.chip,
          border: `1px solid ${site.hairline}`,
          backgroundColor: site.warningSoft,
          color: site.warning,
        }}
      >
        <AlertCircle size={19} strokeWidth={2} />
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ ...mrzSx, fontSize: 9 }}>Visa refusal support</Typography>

        <Typography
          sx={{
            fontFamily: siteFont.display,
            fontSize: { xs: 15.5, md: 16.5 },
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: site.ink,
            lineHeight: 1.25,
            mt: 1.25,
          }}
        >
          Had your visa been refused?
        </Typography>

        <Typography
          sx={{
            fontFamily: siteFont.body,
            fontSize: 13,
            color: site.inkMuted,
            lineHeight: 1.5,
            mt: 1,
          }}
        >
          Get your refusal reviewed by a visa specialist and understand what to do next.
        </Typography>

        <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mt: 1.75 }}>
          <BadgeCheck size={12} strokeWidth={2.4} style={{ color: siteBrand.greenInk }} />
          <Typography sx={{ ...mrzSx, fontSize: 9, color: siteBrand.greenInk }}>
            Expert review within 24 hours
          </Typography>
        </Stack>
      </Box>

      <Box
        component="button"
        type="button"
        onClick={() => navigate('/track')}
        sx={{
          appearance: 'none',
          cursor: 'pointer',
          flex: '0 0 auto',
          alignSelf: { xs: 'flex-start', sm: 'center' },
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1.25,
          px: 2.5,
          minHeight: 40,
          '@media (pointer: coarse)': { minHeight: 44 },
          borderRadius: siteRadius.control,
          border: `1px solid ${site.hairline}`,
          backgroundColor: 'transparent',
          color: site.ink,
          fontFamily: siteFont.body,
          fontSize: 13,
          fontWeight: 600,
          whiteSpace: 'nowrap',
          transition: `border-color 150ms ${siteMotion.easeOut}, background-color 150ms ${siteMotion.easeOut}, transform ${siteMotion.pressMs}ms ${siteMotion.easeOut}`,
          '@media (hover: hover) and (pointer: fine)': {
            '&:hover': { borderColor: site.hairlineStrong, backgroundColor: site.canvas },
            '&:hover .refusalArrow': { transform: 'translateX(3px)' },
          },
          '&:active': { transform: 'scale(0.98)' },
          '&:focus-visible': {
            outline: 'none',
            borderColor: site.accent,
            boxShadow: `0 0 0 3px ${site.accentRing}`,
          },
        }}
      >
        Get your refusal reviewed
        <Box
          component="span"
          className="refusalArrow"
          sx={{ display: 'inline-flex', transition: `transform 180ms ${siteMotion.easeOut}` }}
        >
          <ArrowRight size={15} />
        </Box>
      </Box>
    </Box>
  )
}

export function HeroSupportStrip() {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(3, minmax(0, 1fr))',
          lg: 'repeat(3, minmax(0, 0.62fr)) minmax(0, 1.6fr)',
        },
        gap: { xs: 2, md: 2.5 },
        mt: { xs: 5, md: 6 },
        pt: { xs: 4, md: 5 },
        borderTop: `1px solid ${site.hairline}`,
      }}
    >
      {AGENT_COUNTRY_IDS.map((id) => (
        <AgentCountryCard key={id} countryId={id} />
      ))}

      <Box sx={{ gridColumn: { sm: 'span 3', lg: 'auto' } }}>
        <RefusalSupportCard />
      </Box>
    </Box>
  )
}
