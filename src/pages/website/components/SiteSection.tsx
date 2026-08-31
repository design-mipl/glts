import type { ReactNode } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { PublicContainer } from './PublicContainer'
import { site, siteType, mrzSx } from '@/pages/website/theme/siteTheme'

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
}: {
  eyebrow?: string
  title: ReactNode
  lead?: ReactNode
  align?: 'left' | 'center'
  /** Optional control on the heading line — e.g. a "View all" link. */
  action?: ReactNode
  maxWidth?: number
}) {
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
              sx={{ width: 22, height: '1px', backgroundColor: site.accent, flex: '0 0 auto' }}
            />
            <Typography sx={mrzSx}>{eyebrow}</Typography>
          </Stack>
        ) : null}

        <Typography component="h2" sx={siteType.section}>
          {title}
        </Typography>

        {lead ? (
          <Typography sx={{ ...siteType.lead, mt: 2.5, maxWidth: 560, mx: centered ? 'auto' : undefined }}>
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
 * the light structural grey used to separate adjacent sections without drawing a border.
 */
export function SiteSection({
  children,
  id,
  tone = 'surface',
  sx,
}: {
  children: ReactNode
  id?: string
  tone?: 'surface' | 'canvas'
  sx?: object
}) {
  return (
    <Box
      component="section"
      id={id}
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: tone === 'canvas' ? site.canvas : site.surface,
        ...sx,
      }}
    >
      <PublicContainer variant="hero">{children}</PublicContainer>
    </Box>
  )
}
