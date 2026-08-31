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
import { SiteSection, SiteSectionHeading } from '../../../components/SiteSection'
import { site, siteFont, siteMotion, siteRadius } from '@/pages/website/theme/siteTheme'

const FEATURES: {
  title: string
  description: string
  icon: LucideIcon
}[] = [
  {
    title: 'Expert document review',
    description:
      'Every document is checked against the destination checklist before filing, so a missing page is caught here and not at the counter.',
    icon: FileCheck2,
  },
  {
    title: 'Requirements, resolved',
    description:
      'What you need is derived from your destination, visa type and residence — not a generic list you have to interpret.',
    icon: ListChecks,
  },
  {
    title: 'Secure handling',
    description:
      'Passports and supporting documents move through a tracked digital workflow with a receipt at every handover.',
    icon: ShieldCheck,
  },
  {
    title: 'Status you can read',
    description:
      'A live stage view with timestamps, so you always know where the application sits and what happens next.',
    icon: Activity,
  },
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
]

/**
 * Capability grid.
 *
 * Presented as a spec sheet: cells divided by hairlines on a shared surface, rather than
 * six individually bordered, drop-shadowed cards that lift on hover. The previous version
 * also numbered each cell 01–06, which implied a sequence — these are parallel
 * capabilities and the order carries no information, so the numbering is gone. Icons keep
 * one neutral treatment throughout; per-item colour is the flagged rainbow-chip pattern.
 *
 * The large stock photograph that sat beside this grid is dropped. It was decorative,
 * cost a full-width image on the critical path, and squeezed the content it accompanied.
 */
export function WhyGreenLightWorksSection() {
  return (
    <SiteSection id="why-greenlight-works">
      <SiteSectionHeading
        eyebrow="Why GreenLight"
        title="More than visa processing."
        lead="Experienced specialists working behind a process that is precise about what it needs from you — and explicit about what it is doing with it."
      />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, minmax(0, 1fr))',
            md: 'repeat(3, minmax(0, 1fr))',
          },
          // 1px gaps on a hairline ground draw the dividing rules — no per-cell borders.
          gap: '1px',
          backgroundColor: site.hairline,
          border: `1px solid ${site.hairline}`,
          borderRadius: siteRadius.card,
          overflow: 'hidden',
        }}
      >
        {FEATURES.map((feature) => {
          const Icon = feature.icon
          return (
            <Box
              key={feature.title}
              sx={{
                backgroundColor: site.surface,
                p: { xs: 3.5, md: 4 },
                display: 'flex',
                flexDirection: 'column',
                gap: 2.25,
                transition: `background-color 200ms ${siteMotion.easeOut}`,
                '@media (hover: hover) and (pointer: fine)': {
                  '&:hover': { backgroundColor: site.canvas },
                },
              }}
            >
              <Box
                aria-hidden
                sx={{
                  width: 32,
                  height: 32,
                  display: 'grid',
                  placeItems: 'center',
                  borderRadius: siteRadius.chip,
                  border: `1px solid ${site.hairline}`,
                  backgroundColor: site.canvas,
                  color: site.inkMuted,
                }}
              >
                <Icon size={15} strokeWidth={1.9} />
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontFamily: siteFont.display,
                    fontSize: 15.5,
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    color: site.ink,
                    lineHeight: 1.25,
                    mb: 1.25,
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: siteFont.body,
                    fontSize: 13,
                    color: site.inkMuted,
                    lineHeight: 1.55,
                  }}
                >
                  {feature.description}
                </Typography>
              </Box>
            </Box>
          )
        })}
      </Box>
    </SiteSection>
  )
}
