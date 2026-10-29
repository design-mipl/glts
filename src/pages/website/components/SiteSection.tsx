import { useContext, type ReactNode } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { PublicContainer } from './PublicContainer'
import { siteInk, siteInkCanvasSx, siteTokensFor, type SiteTone } from '@/pages/website/theme/siteTheme'
import { SiteToneContext, useSiteTone } from './siteTone'

/**
 * Marketing section chrome.
 *
 * Every landing section previously re-declared its own heading block with slightly
 * different sizes, colours and margins, which is why the page read as a stack of
 * separately-built pages. One component now owns the eyebrow / headline / lead rhythm.
 *
 * The eyebrow is the site's MRZ device — tracked mono behind a short gold rule. It earns
 * its place by naming the section in the product's own machine voice rather than
 * decorating it.
 */

export function SiteSectionHeading({
  eyebrow,
  title,
  lead,
  align = 'left',
  action,
  maxWidth = 620,
  tone,
}: {
  eyebrow?: string
  title: ReactNode
  lead?: ReactNode
  align?: 'left' | 'center'
  /** Optional control on the heading line — e.g. a "View all" link. */
  action?: ReactNode
  maxWidth?: number
  /** Defaults to the enclosing band's tone — only pass this to override it. */
  tone?: SiteTone
}) {
  const inherited = useSiteTone()
  const t = tone ? siteTokensFor(tone) : inherited
  const centered = align === 'center'

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: action ? 'row' : 'column' },
        alignItems: { xs: 'flex-start', md: action ? 'flex-end' : centered ? 'center' : 'flex-start' },
        justifyContent: action ? 'space-between' : undefined,
        gap: { xs: 3, md: 4 },
        mb: { xs: 5, md: 6 },
        textAlign: centered ? 'center' : 'left',
        mx: centered ? 'auto' : undefined,
      }}
    >
      <Box sx={{ maxWidth, mx: centered ? 'auto' : undefined }}>
        {eyebrow ? (
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{ mb: 2.5, justifyContent: centered ? 'center' : 'flex-start' }}
          >
            <Box
              aria-hidden
              /* Brand green, not gold: gold means "press this", and a section mark is not an action. */
              sx={{ width: 22, height: '2px', backgroundColor: t.brand, flex: '0 0 auto' }}
            />
            <Typography sx={t.mrz}>{eyebrow}</Typography>
          </Stack>
        ) : null}

        <Typography component="h2" sx={t.type.section}>
          {title}
        </Typography>

        {lead ? (
          <Typography sx={{ ...t.type.lead, mt: 2.5, maxWidth: 560, mx: centered ? 'auto' : undefined }}>
            {lead}
          </Typography>
        ) : null}
      </Box>

      {action ? <Box sx={{ flex: '0 0 auto' }}>{action}</Box> : null}
    </Box>
  )
}

/**
 * Section wrapper. `tone` picks the ground: `surface` is the default white, `canvas` is
 * the light structural grey used to separate adjacent sections without drawing a border,
 * and `ink` is the deep inverted band.
 *
 * Ink bands carry the grid ground rather than a flat fill, so two adjacent ink sections
 * read as one continuous band instead of two stacked panels — which is why the landing
 * page groups sections into a few long bands rather than alternating every section.
 */
export function SiteSection({
  children,
  id,
  tone,
  sx,
}: {
  children: ReactNode
  id?: string
  /** Omit inside a `SiteInkBand` — the band's tone is inherited and the ground is its own. */
  tone?: SiteTone
  sx?: object
}) {
  const inheritedTone = useContext(SiteToneContext)
  const resolvedTone = tone ?? inheritedTone
  /** Inside a band, the band already paints the ground — repainting it doubles the bloom. */
  const paintsOwnGround = tone !== undefined || inheritedTone === 'surface'

  return (
    <SiteToneContext.Provider value={resolvedTone}>
      <Box
        component="section"
        id={id}
        sx={{
          py: { xs: 8, md: 12 },
          ...(paintsOwnGround ? siteTokensFor(resolvedTone).ground : null),
          ...sx,
        }}
      >
        <PublicContainer variant="hero">{children}</PublicContainer>
      </Box>
    </SiteToneContext.Provider>
  )
}

/**
 * Continuous ink band — wraps several sections on one uninterrupted ground.
 *
 * The grid and the gold bloom are painted once here, so the sections inside must be
 * transparent. Without this, each section repeats the bloom and the band reads as a
 * stack of near-identical dark cards.
 */
export function SiteInkBand({
  children,
  id,
  sx,
}: {
  children: ReactNode
  id?: string
  sx?: object
}) {
  return (
    <SiteToneContext.Provider value="ink">
      <Box
        id={id}
        sx={{
          position: 'relative',
          color: siteInk.textMuted,
          ...siteInkCanvasSx,
          ...sx,
        }}
      >
        {children}
      </Box>
    </SiteToneContext.Provider>
  )
}

/**
 * Continuous light band — the counterpart to `SiteInkBand`.
 *
 * `canvas` is the structural grey. Sections inside stay transparent so two adjacent
 * light sections read as one band rather than as two panels with a seam between them.
 */
export function SiteLightBand({
  children,
  id,
  tone = 'canvas',
  sx,
}: {
  children: ReactNode
  id?: string
  tone?: 'surface' | 'canvas'
  sx?: object
}) {
  return (
    <SiteToneContext.Provider value={tone}>
      <Box id={id} sx={{ position: 'relative', ...siteTokensFor(tone).ground, ...sx }}>
        {children}
      </Box>
    </SiteToneContext.Provider>
  )
}
