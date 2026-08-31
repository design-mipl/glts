import { useMemo } from 'react'
import { Box, Typography } from '@mui/material'
import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getAllCountries } from '@/shared/services/visaService'
import { SiteSection, SiteSectionHeading } from '../../../components/SiteSection'
import { site, siteFont, siteMotion, siteRadius } from '@/pages/website/theme/siteTheme'
import { HomepageDestinationCard } from '../../../components/HomepageDestinationCard'
import { destinationCardGridSx } from '../../../components/destinationCardGrid'
import { defaultExploreFilters, applyExploreFilters } from '../../../utils/applyExploreFilters'

/** Two full rows on the desktop 5-column grid. */
const HOMEPAGE_DESTINATION_COUNT = 10

/** Quiet secondary action — hairline, never a second filled button competing with the CTA. */
export function SiteTextLink({
  children,
  onClick,
  href,
}: {
  children: React.ReactNode
  onClick?: () => void
  href?: string
}) {
  return (
    <Box
      component={href ? 'a' : 'button'}
      type={href ? undefined : 'button'}
      href={href}
      onClick={onClick}
      sx={{
        appearance: 'none',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1.5,
        px: 3.5,
        minHeight: 42,
        '@media (pointer: coarse)': { minHeight: 44 },
        borderRadius: siteRadius.control,
        border: `1px solid ${site.hairline}`,
        backgroundColor: 'transparent',
        color: site.ink,
        textDecoration: 'none',
        fontFamily: siteFont.body,
        fontSize: 13.5,
        fontWeight: 600,
        whiteSpace: 'nowrap',
        transition: `border-color 150ms ${siteMotion.easeOut}, background-color 150ms ${siteMotion.easeOut}`,
        '@media (hover: hover) and (pointer: fine)': {
          '&:hover': { borderColor: site.hairlineStrong, backgroundColor: site.canvas },
          '&:hover .linkArrow': { transform: 'translateX(3px)' },
        },
        '&:active': { transform: 'scale(0.98)' },
        '&:focus-visible': {
          outline: 'none',
          borderColor: site.accent,
          boxShadow: `0 0 0 3px ${site.accentRing}`,
        },
      }}
    >
      {children}
      <Box
        component="span"
        className="linkArrow"
        sx={{ display: 'inline-flex', transition: `transform 180ms ${siteMotion.easeOut}` }}
      >
        <ArrowRight size={15} />
      </Box>
    </Box>
  )
}

export function ExploreSection() {
  const navigate = useNavigate()

  const homepageCountries = useMemo(() => {
    const list = applyExploreFilters(getAllCountries(), defaultExploreFilters)
    const ranked = [...list].sort((a, b) => {
      if (a.trending !== b.trending) return a.trending ? -1 : 1
      return b.trendingPercent - a.trendingPercent
    })

    const top = ranked.slice(0, HOMEPAGE_DESTINATION_COUNT)
    const philippines = ranked.find((country) => country.code === 'PH')
    const usa = ranked.find((country) => country.code === 'US')

    if (philippines && !top.some((country) => country.code === 'PH')) {
      top[top.length - 1] = philippines
    }

    if (usa && !top.some((country) => country.code === 'US')) {
      const replaceIndex = top.findIndex((country) => country.code !== 'PH')
      if (replaceIndex >= 0) {
        top[replaceIndex] = usa
      }
    }

    return top
  }, [])

  return (
    <SiteSection id="destinations">
      <SiteSectionHeading
        eyebrow={`Destinations · ${homepageCountries.length} shown`}
        title="Where are you travelling?"
        lead="Real fees and real processing times per destination — the same figures your application is priced against."
        action={
          <SiteTextLink onClick={() => navigate('/countries')}>All destinations</SiteTextLink>
        }
      />

      {homepageCountries.length === 0 ? (
        <Box
          sx={{
            py: 10,
            textAlign: 'center',
            borderRadius: siteRadius.card,
            border: `1px dashed ${site.hairlineStrong}`,
          }}
        >
          <Typography sx={{ fontFamily: siteFont.body, fontWeight: 600, color: site.ink }}>
            No destinations available
          </Typography>
          <Typography sx={{ fontFamily: siteFont.body, fontSize: 13, color: site.inkMuted, mt: 1 }}>
            Try again shortly, or browse the full list.
          </Typography>
        </Box>
      ) : (
        <Box role="list" aria-label="Destination cards" sx={destinationCardGridSx}>
          {homepageCountries.map((country, index) => (
            <Box key={country.id} role="listitem">
              <HomepageDestinationCard country={country} index={index} animate={false} />
            </Box>
          ))}
        </Box>
      )}
    </SiteSection>
  )
}
