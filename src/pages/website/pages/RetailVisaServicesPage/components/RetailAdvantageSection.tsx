import { Box, Typography } from '@mui/material'
import { SiteSection, SiteSectionHeading } from '../../../components/SiteSection'
import { site, siteFont, siteMotion, siteRadius, mrzSx } from '../../../theme/siteTheme'
import { useSiteTone } from '../../../components/siteTone'
import { retailAdvantages } from '../retailPageData'
import { retailAdvantageImages } from '../../../assets/retailAdvantageImages'

/** Each advantage's own photograph, authored for this section. */
const ADVANTAGE_IMAGES: Record<string, (typeof retailAdvantageImages)[keyof typeof retailAdvantageImages]> = {
  'category-selection': retailAdvantageImages.categorySelection,
  'document-lists': retailAdvantageImages.documentLists,
  'fewer-surprises': retailAdvantageImages.fewerSurprises,
  'transparent-steps': retailAdvantageImages.transparentSteps,
  'defined-workflow': retailAdvantageImages.definedWorkflow,
}

/**
 * Six-column bed so five cards land as 3 + 2 without a ragged tail: the first three span
 * two columns each, the last two span three. Five equal columns was the layout that made
 * these photographs ~200px wide and unreadable — the images are back, so the cells have
 * to be wide enough to earn them.
 */
const CARD_SPANS = [2, 2, 2, 3, 3] as const

/**
 * Retail advantage.
 *
 * Five cards that each carried a 16:10 cropped photograph, a shadow, a 5px hover lift and
 * a 1.04 image zoom. At five-across the images were roughly 200px wide — too small to read
 * as anything but texture, while still costing five lazy image requests, so a previous
 * pass stripped them and left a numbered hairline strip.
 *
 * The photographs are back, because the page they sit on had drifted to type-on-flat-grey
 * for a 1,400px stretch. What is *not* back is the layout that made them unreadable: the
 * bed is 3 + 2 rather than 5 across, so each image gets roughly twice the width, and the
 * shadow, lift and zoom stay gone.
 *
 * The numbering is kept because these read as a progression through the journey
 * (choose → prepare → submit → track), which is the one case where an index informs.
 */
export function RetailAdvantageSection() {
  const t = useSiteTone()

  return (
    <SiteSection id="retail-advantage">
      <SiteSectionHeading
        eyebrow="Retail advantage"
        title="A clearer path to an embassy-ready file."
        lead="Built for individual travellers: know what is required, prepare it once, and submit knowing it has been checked."
      />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, minmax(0, 1fr))',
            md: 'repeat(2, minmax(0, 1fr))',
            lg: 'repeat(6, minmax(0, 1fr))',
          },
          gap: '1px',
          backgroundColor: site.hairline,
          border: `1px solid ${site.hairline}`,
          borderRadius: siteRadius.card,
          overflow: 'hidden',
        }}
      >
        {retailAdvantages.map((item, index) => {
          const Icon = item.icon
          const image = ADVANTAGE_IMAGES[item.id]
          return (
            <Box
              key={item.id}
              sx={{
                gridColumn: { lg: `span ${CARD_SPANS[index] ?? 2}` },
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: site.surface,
                transition: `background-color 200ms ${siteMotion.easeOut}`,
                '@media (hover: hover) and (pointer: fine)': {
                  '&:hover': { backgroundColor: site.canvas },
                },
              }}
            >
              {image ? (
                <Box
                  component="img"
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  sx={{
                    display: 'block',
                    width: '100%',
                    height: { xs: 176, md: 168 },
                    objectFit: 'cover',
                    objectPosition: image.objectPosition ?? 'center',
                    borderBottom: `1px solid ${site.hairline}`,
                  }}
                />
              ) : null}

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2.25,
                  p: { xs: 3.5, md: 3.5 },
                }}
              >
              <Box
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <Box
                  aria-hidden
                  sx={{
                    width: 30,
                    height: 30,
                    display: 'grid',
                    placeItems: 'center',
                    borderRadius: siteRadius.chip,
                    border: `1px solid ${t.brandBorder}`,
                    backgroundColor: t.brandSoft,
                    color: t.brandText,
                  }}
                >
                  <Icon size={14} strokeWidth={1.9} />
                </Box>
                <Typography sx={{ ...mrzSx, fontSize: 9.5 }}>
                  {String(index + 1).padStart(2, '0')}
                </Typography>
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontFamily: siteFont.display,
                    fontSize: 15,
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    color: site.ink,
                    lineHeight: 1.25,
                    mb: 1.25,
                  }}
                >
                  {item.title}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: siteFont.body,
                    fontSize: 13,
                    color: site.inkMuted,
                    lineHeight: 1.55,
                  }}
                >
                  {item.description}
                </Typography>
              </Box>
              </Box>
            </Box>
          )
        })}
      </Box>
    </SiteSection>
  )
}
