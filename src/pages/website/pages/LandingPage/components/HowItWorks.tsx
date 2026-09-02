import { Box, Typography } from '@mui/material'
import { PaperSection, PaperSectionHeading } from '../../../components/PaperSection'
import { accent, ink, paper, paperFont } from '../../../theme/sitePaper'
import { howItWorksSteps } from '../landingWorkflowContent'

/** Half the node's size — the connector line is drawn through the nodes' centres. */
const NODE = 44
const NODE_HALF = NODE / 2

/**
 * How it works.
 *
 * Numbering is kept here and nowhere else on the page. This content genuinely is a
 * sequence — the order is the information — whereas the `01 / 02 / 03` markers that ran on
 * three other sections were numbering unordered lists, which is decoration.
 *
 * Two things were removed from the previous version.
 *
 * THE HOVER STATE MACHINE. Each stage was a button that, on hover or focus, advanced a
 * gold progress bar along a spine and tinted the active card. It looked considered and did
 * nothing: all five descriptions are on screen at all times, so the interaction revealed
 * no information. Motion on a section every visitor scrolls past needs a purpose beyond
 * looking alive, and this had none. What replaced it is a static connector, which says
 * "these happen in order" — the one thing the graphic is actually for.
 *
 * THE FIVE-COLUMN PHONE LAYOUT. The grid was `{ xs: '1fr', sm: repeat(5, 1fr) }`, and `sm`
 * in this project is 375px — so every phone wider than an iPhone SE rendered five 77px
 * columns, which is where the site's horizontal scrollbar came from. It is one column
 * until 900px now, and the connector rotates with it.
 */
export function HowItWorks() {
  return (
    <PaperSection id="how-it-works" ground="canvas">
      <PaperSectionHeading
        eyebrow="How it works"
        title="Five stages, and you can see all of them"
        lead="Every application runs the same route: check what is required, file it correctly, and clear each stage with a specialist watching. Nothing is left to guesswork."
      />

      <Box sx={{ position: 'relative' }}>
        {/* Connector. Horizontal across the row on wide screens, vertical down the gutter
            on narrow ones — first node centre to last node centre in both cases. */}
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            backgroundColor: paper.hairlineStrong,
            zIndex: 0,
            // Narrow: a vertical rule down the node gutter.
            left: `${NODE_HALF}px`,
            top: `${NODE_HALF}px`,
            bottom: `${NODE_HALF}px`,
            width: '1px',
            // Wide: a horizontal rule through the row of nodes. With five equal columns
            // and left-aligned nodes, the last node's centre sits one fifth from the right.
            '@media (min-width: 900px)': {
              left: `${NODE_HALF}px`,
              right: `calc(20% - ${NODE_HALF}px)`,
              top: `${NODE_HALF}px`,
              bottom: 'auto',
              width: 'auto',
              height: '1px',
            },
          }}
        />

        <Box
          component="ol"
          sx={{
            position: 'relative',
            zIndex: 1,
            listStyle: 'none',
            m: 0,
            p: 0,
            display: 'grid',
            // One column until there is genuinely room for five.
            gridTemplateColumns: { xs: 'minmax(0, 1fr)', xl: 'repeat(5, minmax(0, 1fr))' },
            gap: { xs: 4, xl: 3 },
          }}
        >
          {howItWorksSteps.map((step) => {
            const Icon = step.icon

            return (
              <Box
                component="li"
                key={step.id}
                sx={{
                  display: 'flex',
                  // Narrow: node beside the text. Wide: node above it.
                  flexDirection: { xs: 'row', xl: 'column' },
                  alignItems: 'flex-start',
                  gap: { xs: 2.5, xl: 2.5 },
                  minWidth: 0,
                  pr: { xl: 2.5 },
                }}
              >
                <Box
                  aria-hidden
                  sx={{
                    flex: '0 0 auto',
                    width: NODE,
                    height: NODE,
                    display: 'grid',
                    placeItems: 'center',
                    borderRadius: '50%',
                    // Opaque, so the connector reads as passing behind rather than through.
                    backgroundColor: paper.white,
                    border: `1px solid ${accent.border}`,
                    color: accent.ink,
                  }}
                >
                  <Icon size={19} strokeWidth={1.9} />
                </Box>

                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    component="span"
                    sx={{
                      display: 'block',
                      mb: 1,
                      fontFamily: paperFont.mono,
                      fontVariantNumeric: 'tabular-nums',
                      fontSize: 12,
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      lineHeight: 1,
                      color: accent.ink,
                    }}
                  >
                    Stage {step.number}
                  </Typography>

                  <Typography
                    component="h3"
                    sx={{
                      m: 0,
                      mb: 1,
                      fontFamily: paperFont.display,
                      fontSize: { xs: 16.5, xl: 17 },
                      fontWeight: 700,
                      letterSpacing: '-0.018em',
                      lineHeight: 1.25,
                      color: ink.strong,
                    }}
                  >
                    {step.title}
                  </Typography>

                  <Typography
                    sx={{
                      fontFamily: paperFont.body,
                      fontSize: 14,
                      lineHeight: 1.6,
                      color: ink.muted,
                    }}
                  >
                    {step.description}
                  </Typography>
                </Box>
              </Box>
            )
          })}
        </Box>
      </Box>
    </PaperSection>
  )
}
