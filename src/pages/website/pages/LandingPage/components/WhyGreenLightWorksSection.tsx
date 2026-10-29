import { Box, Typography } from '@mui/material'
import {
  Activity,
  BadgeCheck,
  FileCheck2,
  Headphones,
  ListChecks,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'
import { PaperSection, PaperSectionHeading } from '../../../components/PaperSection'
import { accent, ink, paper, paperFont, paperRadius } from '../../../theme/sitePaper'

type Assurance = { title: string; description: string; icon: LucideIcon }

/**
 * Grouped by WHEN, not by feature.
 *
 * The previous version was a flat six-cell grid — the generic features grid every software
 * marketing page ships, which asks the reader to hold six unrelated claims at once and
 * gives them no reason to prefer any of them.
 *
 * These are the same six claims arranged along the customer's own timeline. That does two
 * things a flat grid cannot. It turns a list into a narrative — *before you file, while we
 * hold it, when it goes wrong* — and it puts the middle pair where a nervous reader is
 * actually looking, because the question underneath "why you" on a visa site is always
 * *where will my passport be and who is holding it*.
 *
 * A second section, `RetailAdvantageSection`, made this same argument again five bullets
 * later ("defined document lists", "transparent steps", "fewer last-minute surprises").
 * Every one of its points is already covered below, so it has been dropped rather than
 * restyled — the page previously stated its quality argument twice within one scroll.
 */
const PHASES: { phase: string; caption: string; items: readonly Assurance[] }[] = [
  {
    phase: 'Before you file',
    caption: 'Getting the application right the first time.',
    items: [
      {
        title: 'Requirements, resolved',
        description:
          'What you need is derived from your destination, visa type and residence — not a generic list you have to interpret.',
        icon: ListChecks,
      },
      {
        title: 'Expert document review',
        description:
          'Every document is checked against the destination checklist before filing, so a missing page is caught here and not at the counter.',
        icon: FileCheck2,
      },
    ],
  },
  {
    phase: 'While we hold it',
    caption: 'Where your passport is, and who has it.',
    items: [
      {
        title: 'Secure handling',
        description:
          'Passports and supporting documents move through a tracked digital workflow, with a receipt at every handover.',
        icon: ShieldCheck,
      },
      {
        title: 'Status you can read',
        description:
          'A live stage view with timestamps, so you always know where the application sits and what happens next.',
        icon: Activity,
      },
    ],
  },
  {
    phase: 'When it gets difficult',
    caption: 'The cases a checklist cannot answer.',
    items: [
      {
        title: 'People, when it matters',
        description:
          'The process is automated where automation helps. A visa specialist picks up anything that needs judgement.',
        icon: Headphones,
      },
      {
        title: 'Deep destination knowledge',
        description:
          'Specialist coverage across categories and the awkward cases — prior refusals, minors, self-employment.',
        icon: BadgeCheck,
      },
    ],
  },
]

export function WhyGreenLightWorksSection() {
  return (
    <PaperSection id="why-greenlight" ground="base" divided>
      <PaperSectionHeading
        eyebrow="Why GreenLight"
        title="More than visa processing."
        lead="Experienced specialists working behind a process that is precise about what it needs from you — and explicit about what it is doing with it."
      />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'minmax(0, 1fr)', xl: 'repeat(3, minmax(0, 1fr))' },
          gap: { xs: 5, xl: 4 },
        }}
      >
        {PHASES.map((group) => (
          <Box key={group.phase} sx={{ minWidth: 0 }}>
            <Box sx={{ pb: 2, mb: 3, borderBottom: `1px solid ${paper.hairline}` }}>
              <Typography
                component="h3"
                sx={{
                  m: 0,
                  fontFamily: paperFont.display,
                  fontSize: { xs: 17, xl: 18 },
                  fontWeight: 700,
                  letterSpacing: '-0.018em',
                  lineHeight: 1.25,
                  color: ink.strong,
                }}
              >
                {group.phase}
              </Typography>
              <Typography
                sx={{
                  mt: 0.75,
                  fontFamily: paperFont.body,
                  fontSize: 13.5,
                  lineHeight: 1.45,
                  color: ink.faint,
                }}
              >
                {group.caption}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
              {group.items.map((item) => {
                const Icon = item.icon

                return (
                  <Box key={item.title} sx={{ display: 'flex', gap: 2, minWidth: 0 }}>
                    {/* One neutral icon treatment across the whole set, per the locked
                        "no rainbow icon chips" rule — differentiate by glyph, never by
                        giving each item its own pastel background. */}
                    <Box
                      aria-hidden
                      sx={{
                        flex: '0 0 auto',
                        width: 34,
                        height: 34,
                        display: 'grid',
                        placeItems: 'center',
                        borderRadius: paperRadius.control,
                        border: `1px solid ${accent.border}`,
                        backgroundColor: accent.softer,
                        color: accent.ink,
                      }}
                    >
                      <Icon size={17} strokeWidth={1.9} />
                    </Box>

                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        component="h4"
                        sx={{
                          m: 0,
                          mb: 0.75,
                          fontFamily: paperFont.body,
                          fontSize: 15,
                          fontWeight: 700,
                          letterSpacing: '-0.01em',
                          lineHeight: 1.3,
                          color: ink.strong,
                        }}
                      >
                        {item.title}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: paperFont.body,
                          fontSize: 14,
                          lineHeight: 1.6,
                          color: ink.muted,
                        }}
                      >
                        {item.description}
                      </Typography>
                    </Box>
                  </Box>
                )
              })}
            </Box>
          </Box>
        ))}
      </Box>
    </PaperSection>
  )
}
