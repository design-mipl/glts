import { Box, Typography } from '@mui/material'
import { ArrowRight, Radar, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PaperSection } from '../../../components/PaperSection'
import { Button } from '../../../components/ui'
import { accent, ink, paperFont, paperType , verified } from '../../../theme/sitePaper'

/**
 * The close.
 *
 * Deliberately the quietest section on the page, not the loudest. The old version was a
 * full-bleed near-black band with a gold headline — the highest-contrast object on the
 * site, spent on the third restatement of an offer the reader has already scrolled past
 * eight sections of. Someone who has read this far does not need to be shouted at; they
 * need the button to be obvious and the risk to feel low.
 *
 * So it sits on `paper.deep` — one step down, the same emphasis Visa Master gets — with a
 * centred column, two actions, and a line of reassurance under them. The second action
 * matters more than it looks: a good share of the people who reach the bottom of this page
 * are returning customers looking for their application status, not new applicants.
 *
 * NOTE: mounted on About, Services, Corporate, Marine and Retail pages too.
 */
export function FinalCtaSection() {
  return (
    <PaperSection id="final-cta" ground="deep" divided>
      <Box sx={{ maxWidth: 700, mx: 'auto', textAlign: 'center' }}>
        <Typography component="p" sx={{ ...paperType.eyebrow, m: 0, mb: 2 }}>
          Start an application
        </Typography>

        <Typography
          component="h2"
          sx={{
            ...paperType.section,
            fontSize: { xs: 27, lg: 33, xl: 40 },
          }}
        >
          Know it is right
          <Box component="span" sx={{ color: accent.ink }}> before you submit.</Box>
        </Typography>

        <Typography sx={{ ...paperType.lead, mt: 2.5, mx: 'auto', maxWidth: 540 }}>
          Requirements resolved for your exact destination and residence, documents checked
          by a specialist before filing, and a status you can read at any hour.
        </Typography>

        <Box
          sx={{
            mt: { xs: 4, xl: 5 },
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
            justifyContent: 'center',
            gap: 1.75,
          }}
        >
          <Button asChild size="lg" className="gl-close-primary">
            <Link to="/countries">
              Check your requirements
              <Box
                component="span"
                aria-hidden
                sx={{
                  display: 'inline-flex',
                  transition: 'transform 180ms cubic-bezier(0.23, 1, 0.32, 1)',
                  '.gl-close-primary:hover &': { transform: 'translateX(3px)' },
                  '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
                }}
              >
                <ArrowRight size={17} />
              </Box>
            </Link>
          </Button>

          <Button asChild size="lg" variant="secondary">
            <Link to="/track">
              <Radar size={16} strokeWidth={1.9} aria-hidden />
              Track an application
            </Link>
          </Button>
        </Box>

        <Box
          sx={{
            mt: 3.5,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            color: ink.faint,
          }}
        >
          <ShieldCheck size={15} color={verified.ink} strokeWidth={2} aria-hidden />
          <Typography
            sx={{ fontFamily: paperFont.body, fontSize: 13.5, lineHeight: 1.4, color: ink.faint }}
          >
            A specialist reviews every application before it is filed.
          </Typography>
        </Box>
      </Box>
    </PaperSection>
  )
}
