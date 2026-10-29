import { Box, Button, Stack, Typography } from '@mui/material'
import { ArrowDown } from 'lucide-react'
import { PublicContainer } from '../../../components/PublicContainer'
import {
  applyFlow,
  applyMotion,
  getQuietButtonSx,
} from '@/pages/website/theme/applyFlowTheme'
import { mrzSx, site, siteCanvasSx, siteFont, siteType } from '@/pages/website/theme/siteTheme'

/**
 * Page opener for Extra Services.
 *
 * Deliberately copy-led on the site's technical ground rather than a stock-photo band:
 * the three service photographs each appear exactly once, at full size, inside the
 * request panel below. Repeating them here would spend the page's image budget twice.
 *
 * The assurance row is mono because each item is a fact about the record, not a claim —
 * same device the rest of the site uses for anything a machine would read.
 */

const assurances = [
  'Every enquiry gets a reference',
  'Tracked collection and return',
  'Scope and price confirmed first',
] as const

export function ExtraServicesHero() {
  const scrollToRequest = () => {
    const target = document.getElementById('extra-service-request')
    if (!target) return
    target.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
      block: 'start',
    })
  }

  return (
    <Box
      component="section"
      sx={{
        ...siteCanvasSx,
        borderBottom: `1px solid ${site.hairline}`,
        pt: { xs: 7, md: 10 },
        pb: { xs: 7, md: 10 },
      }}
    >
      <PublicContainer variant="hero">
        <Box sx={{ maxWidth: 780 }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
            <Box
              aria-hidden
              sx={{ width: 22, height: '1px', backgroundColor: site.accent, flex: '0 0 auto' }}
            />
            <Typography sx={mrzSx}>Additional services</Typography>
          </Stack>

          <Typography
            component="h1"
            sx={{ ...siteType.hero, fontSize: { xs: 32, sm: 40, md: 48, lg: 52 } }}
          >
            The rest of the file, handled.
          </Typography>

          <Typography sx={{ ...siteType.lead, mt: 3, maxWidth: 640 }}>
            Attestation, notary, and travel insurance run through the same desk, the same
            checks, and the same tracking as a visa application. Send one enquiry and a
            specialist comes back with the documents needed, the turnaround, and the price.
          </Typography>

          <Button
            onClick={scrollToRequest}
            endIcon={<ArrowDown size={15} strokeWidth={2} />}
            sx={{
              ...getQuietButtonSx(),
              mt: 4,
              backgroundColor: site.surface,
              '& .MuiButton-endIcon': {
                transition: `transform 180ms ${applyMotion.easeOut}`,
              },
              '@media (hover: hover) and (pointer: fine)': {
                '&:hover .MuiButton-endIcon': { transform: 'translateY(2px)' },
              },
              '@media (prefers-reduced-motion: reduce)': {
                '& .MuiButton-endIcon': { transition: 'none' },
              },
            }}
          >
            Start an enquiry
          </Button>
        </Box>

        <Stack
          direction={{ xs: 'column', xl: 'row' }}
          divider={
            <Box
              aria-hidden
              sx={{
                display: { xs: 'none', xl: 'block' },
                width: '1px',
                alignSelf: 'stretch',
                backgroundColor: site.hairline,
              }}
            />
          }
          spacing={{ xs: 1.25, xl: 3.5 }}
          sx={{
            mt: { xs: 5, md: 7 },
            pt: { xs: 3, md: 3.5 },
            borderTop: `1px solid ${site.hairline}`,
          }}
        >
          {assurances.map((item) => (
            <Typography
              key={item}
              sx={{
                fontFamily: siteFont.mono,
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: applyFlow.inkMuted,
              }}
            >
              {item}
            </Typography>
          ))}
        </Stack>
      </PublicContainer>
    </Box>
  )
}
