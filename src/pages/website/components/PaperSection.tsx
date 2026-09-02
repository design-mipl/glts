import type { ReactNode } from 'react'
import { Box, Typography } from '@mui/material'
import { PublicContainer } from './PublicContainer'
import { accent, ink, paper, paperRadius, paperType, type PaperGround } from '../theme/sitePaper'

/**
 * Section chrome for the Paper surface.
 *
 * Replaces `SiteSection` / `SiteSectionHeading` for redesigned sections. Two differences
 * carry the change of thesis:
 *
 *   1. The eyebrow is sentence case in the body face, not tracked-out MRZ mono. Mono on
 *      every section heading was the single largest source of the site's cold, machine
 *      register — and it appeared so often it had stopped signalling anything.
 *
 *   2. There is no ink tone. Grounds are four steps of warm paper; separation between
 *      sections comes from a one-step change plus an optional hairline, never from
 *      inverting to a dark band.
 *
 * `SiteSection` stays in place for sections not yet migrated. Both can coexist on the
 * page during the rebuild — they simply paint different grounds.
 */
export function PaperSection({
  children,
  id,
  ground = 'base',
  /** Hairline along the top edge. Use when two adjacent sections share a ground. */
  divided = false,
  sx,
}: {
  children: ReactNode
  id?: string
  ground?: PaperGround
  divided?: boolean
  sx?: object
}) {
  return (
    <Box
      component="section"
      id={id}
      sx={{
        // `xl` is 900px here, not 1536 — see the breakpoint note in `sitePaper.ts`.
        py: { xs: 7, lg: 9, xl: 12 },
        backgroundColor: paper[ground],
        borderTop: divided ? `1px solid ${paper.hairline}` : undefined,
        ...sx,
      }}
    >
      <PublicContainer variant="hero">{children}</PublicContainer>
    </Box>
  )
}

export function PaperSectionHeading({
  eyebrow,
  title,
  lead,
  action,
  maxWidth = 620,
}: {
  eyebrow?: string
  title: ReactNode
  lead?: ReactNode
  /** Optional control on the heading line — e.g. an "All destinations" link. */
  action?: ReactNode
  maxWidth?: number
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        // The action only moves onto the heading line once there is room for it — `xl`
        // (900px), not `md` (428px, which would put it beside the title on a phone).
        flexDirection: { xs: 'column', xl: action ? 'row' : 'column' },
        alignItems: { xs: 'flex-start', xl: action ? 'flex-end' : 'flex-start' },
        justifyContent: action ? 'space-between' : undefined,
        gap: { xs: 2.5, xl: 4 },
        mb: { xs: 4.5, xl: 6 },
      }}
    >
      <Box sx={{ maxWidth }}>
        {eyebrow ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75, mb: 2 }}>
            <Box
              aria-hidden
              sx={{ width: 22, height: '2px', backgroundColor: accent.ink, flex: '0 0 auto' }}
            />
            <Typography component="p" sx={{ ...paperType.eyebrow, m: 0 }}>
              {eyebrow}
            </Typography>
          </Box>
        ) : null}

        <Typography component="h2" sx={paperType.section}>
          {title}
        </Typography>

        {lead ? (
          <Typography sx={{ ...paperType.lead, mt: 2, maxWidth: 560 }}>{lead}</Typography>
        ) : null}
      </Box>

      {action ? <Box sx={{ flex: '0 0 auto' }}>{action}</Box> : null}
    </Box>
  )
}

/** Empty state for a section whose data failed to load. Plain, not apologetic. */
export function PaperSectionEmpty({ title, hint }: { title: string; hint?: string }) {
  return (
    <Box
      sx={{
        py: 9,
        textAlign: 'center',
        borderRadius: paperRadius.card,
        border: `1px dashed ${paper.hairlineStrong}`,
        backgroundColor: paper.white,
      }}
    >
      <Typography sx={{ ...paperType.block, m: 0 }}>{title}</Typography>
      {hint ? (
        <Typography sx={{ mt: 1, fontSize: 14, lineHeight: 1.6, color: ink.muted }}>
          {hint}
        </Typography>
      ) : null}
    </Box>
  )
}
