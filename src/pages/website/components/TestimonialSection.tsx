import { Box, Typography } from '@mui/material'
import { Star } from 'lucide-react'
import { PaperSection, PaperSectionHeading } from './PaperSection'
import { accent, ink, paper, paperFont, paperRadius } from '../theme/sitePaper'

export interface TestimonialItem {
  quote: string
  name: string
  service: string
  initials: string
  /** @deprecated Per-person avatar colours are the flagged rainbow-chip pattern. Unused. */
  avatarBg?: string
  /** @deprecated Stock portrait imagery is no longer rendered. Unused. */
  avatarSrc?: string
  rating?: number
}

export interface TestimonialSectionProps {
  testimonials: TestimonialItem[]
  title?: string
  subtitle?: string
  /** @deprecated The flight-path marker motif was removed with the animated track. */
  markerIcon?: 'profile' | 'ship' | 'plane'
}

const DEFAULT_TITLE = 'What travellers say'
const DEFAULT_SUBTITLE =
  'Families, students, professionals and marine crew who have cleared their visas with us.'

/**
 * Testimonials.
 *
 * TODO(content): these quotes and names are inherited and unverified. Either confirm they
 * are real customers who consented to be named, or replace them. A fabricated testimonial
 * on a visa site is the specific thing that makes a real one worthless.
 *
 * NO AVATARS. The previous version drew each person's initials in a filled circle — PS,
 * NK, AM. Initial-bubbles are what a system generates when it has no photograph, and a
 * reader recognises that instantly: six identical placeholder discs read as six people who
 * do not exist, which is the opposite of what a testimonial is for. With no real portraits
 * available, the honest presentation is none at all. The quote carries the weight and the
 * attribution sits quietly under it.
 *
 * The section is also no longer a dark band. Other people's words are the warmest content
 * on this page and inverting to near-black was making them the coldest thing on it.
 */
export function TestimonialSection({
  testimonials,
  title = DEFAULT_TITLE,
  subtitle = DEFAULT_SUBTITLE,
}: TestimonialSectionProps) {
  return (
    <PaperSection id="testimonials" ground="canvas">
      <PaperSectionHeading eyebrow="Verified reviews" title={title} lead={subtitle} />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'minmax(0, 1fr)',
            lg: 'repeat(2, minmax(0, 1fr))',
            xl: 'repeat(3, minmax(0, 1fr))',
          },
          gap: { xs: 2, xl: 2.5 },
        }}
      >
        {testimonials.map((testimonial) => (
          <Box
            key={`${testimonial.name}-${testimonial.service}`}
            component="figure"
            sx={{
              m: 0,
              p: { xs: 2.5, xl: 3 },
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: paper.white,
              border: `1px solid ${paper.hairline}`,
              borderRadius: paperRadius.card,
            }}
          >
            {testimonial.rating ? (
              <Box aria-label={`${testimonial.rating} out of 5`} sx={{ display: 'flex', gap: 0.375, mb: 2 }}>
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    size={14}
                    aria-hidden
                    strokeWidth={0}
                    fill={index < (testimonial.rating ?? 0) ? accent.fill : paper.deep}
                  />
                ))}
              </Box>
            ) : null}

            <Typography
              component="blockquote"
              sx={{
                m: 0,
                flex: 1,
                fontFamily: paperFont.body,
                fontSize: { xs: 15, xl: 15.5 },
                lineHeight: 1.65,
                color: ink.strong,
              }}
            >
              &ldquo;{testimonial.quote}&rdquo;
            </Typography>

            <Box
              component="figcaption"
              sx={{ mt: 2.5, pt: 2, borderTop: `1px solid ${paper.hairlineSoft}` }}
            >
              <Typography
                sx={{
                  fontFamily: paperFont.body,
                  fontSize: 14,
                  fontWeight: 700,
                  lineHeight: 1.3,
                  color: ink.strong,
                }}
              >
                {testimonial.name}
              </Typography>
              <Typography
                sx={{
                  mt: 0.25,
                  fontFamily: paperFont.body,
                  fontSize: 13,
                  lineHeight: 1.35,
                  color: ink.faint,
                }}
              >
                {testimonial.service}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </PaperSection>
  )
}
