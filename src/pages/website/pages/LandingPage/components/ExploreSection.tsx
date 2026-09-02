import { useMemo } from 'react'
import { Box } from '@mui/material'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getAllCountries } from '@/shared/services/visaService'
import { PaperSection, PaperSectionEmpty, PaperSectionHeading } from '../../../components/PaperSection'
import { PaperDestinationCard } from '../../../components/PaperDestinationCard'
import { Button } from '../../../components/ui'
import { defaultExploreFilters, applyExploreFilters } from '../../../utils/applyExploreFilters'

/**
 * Eight, not ten.
 *
 * Ten cards only divide evenly into a five-column grid, which forced a five-up row that is
 * far too tight below a very wide desktop — and left two orphans at every other width.
 * Eight divides cleanly by both two and four, so the grid is two tiers instead of three
 * and every breakpoint produces full rows. The section's job is to show that coverage
 * exists, not to be the coverage; `/countries` is one click away.
 */
const HOMEPAGE_DESTINATION_COUNT = 8

/** Both are core retail markets and should not fall off the homepage on a ranking wobble. */
const PINNED_CODES = ['PH', 'US'] as const

/**
 * Destinations — second on the page, because "do you cover where I'm going" is the first
 * question a visitor actually has.
 *
 * No filter row and no scrolling rail. A filter here duplicated the destinations page's
 * job on a section whose only purpose is to show coverage, and a rail hid half the answer
 * behind an interaction.
 */
export function ExploreSection() {
  const homepageCountries = useMemo(() => {
    const list = applyExploreFilters(getAllCountries(), defaultExploreFilters)

    const ranked = [...list].sort((a, b) => {
      if (a.trending !== b.trending) return a.trending ? -1 : 1
      return b.trendingPercent - a.trendingPercent
    })

    const top = ranked.slice(0, HOMEPAGE_DESTINATION_COUNT)

    // Ensure the pinned markets are present without displacing each other.
    for (const code of PINNED_CODES) {
      if (top.some((country) => country.code === code)) continue

      const pinned = ranked.find((country) => country.code === code)
      if (!pinned) continue

      const replaceIndex = top.findLastIndex(
        (country) => !PINNED_CODES.includes(country.code as (typeof PINNED_CODES)[number]),
      )
      if (replaceIndex >= 0) top[replaceIndex] = pinned
    }

    return top
  }, [])

  return (
    <PaperSection id="destinations" ground="base" divided>
      <PaperSectionHeading
        eyebrow="Destinations"
        title="Where are you travelling?"
        lead="Real fees and real processing times, shown up front — the same figures your application is priced against."
        action={
          <Button asChild variant="secondary" className="gl-all-destinations">
            <Link to="/countries">
              All destinations
              <Box
                component="span"
                aria-hidden
                sx={{
                  display: 'inline-flex',
                  transition: 'transform 180ms cubic-bezier(0.23, 1, 0.32, 1)',
                  '.gl-all-destinations:hover &': { transform: 'translateX(3px)' },
                  '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
                }}
              >
                <ArrowRight size={16} />
              </Box>
            </Link>
          </Button>
        }
      />

      {homepageCountries.length === 0 ? (
        <PaperSectionEmpty
          title="No destinations available right now"
          hint="Try again shortly, or browse the full list."
        />
      ) : (
        <Box
          role="list"
          aria-label="Destinations"
          sx={{
            display: 'grid',
            // Two tiers only. The inherited grid used `sm`/`lg`, which in this project's
            // remapped scale is 375px and 600px — it put three cards across a phone and
            // five across a tablet.
            gridTemplateColumns: {
              xs: 'repeat(2, minmax(0, 1fr))',
              xl: 'repeat(4, minmax(0, 1fr))',
            },
            gap: { xs: 2, lg: 2.5, xl: 3 },
            alignItems: 'stretch',
          }}
        >
          {homepageCountries.map((country) => (
            <Box key={country.id} role="listitem" sx={{ minWidth: 0 }}>
              <PaperDestinationCard country={country} ground="base" />
            </Box>
          ))}
        </Box>
      )}
    </PaperSection>
  )
}
