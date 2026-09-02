import { useState, type ReactNode } from 'react'
import { Box, Typography } from '@mui/material'
import { ArrowRight } from 'lucide-react'
import { SiteSection } from './SiteSection'
import { useSiteTone } from './siteTone'
import { siteFont, siteMotion, siteRadius, clippedCorner } from '@/pages/website/theme/siteTheme'

export interface ServiceBentoItem {
  id: string
  title: string
  description: string
  href: string
  image: {
    src: string
    fallback: string
    alt: string
    objectPosition?: string
  }
}

/**
 * Service bento.
 *
 * The section heading lives *inside* the grid as its first cell rather than sitting above
 * it. That is the whole idea: the heading is one of the tiles, so the eye reads the grid
 * as a single object instead of a title followed by unrelated cards, and the row stays
 * balanced without an empty column.
 *
 * Replaces the expanding-slider treatment on the homepage. The slider is a good component
 * for a page whose subject *is* the service list — it still runs the Retail page — but on
 * the homepage it appeared twice in a row, and an accordion that hides four of five items
 * behind an interaction is the wrong shape for a section a visitor scrolls past.
 */

const TILE_HEIGHT = { xs: 200, sm: 224, md: 252 }

function BentoTile({ item, index }: { item: ServiceBentoItem; index: number }) {
  const t = useSiteTone()
  const [src, setSrc] = useState(item.image.src)

  return (
    <Box
      component="a"
      href={item.href}
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        minHeight: TILE_HEIGHT,
        p: { xs: 2.5, md: 3 },
        overflow: 'hidden',
        textDecoration: 'none',
        borderRadius: siteRadius.card,
        /** The travel-document corner cut — the same motif as the apply flow's card. */
        clipPath: clippedCorner(22),
        backgroundColor: t.surfaceRaised,
        '@media (hover: hover) and (pointer: fine)': {
          '&:hover .bentoImage': { transform: 'scale(1.045)' },
          '&:hover .bentoArrow': { transform: 'translateX(3px)' },
        },
        '&:focus-visible': {
          outline: 'none',
          boxShadow: `inset 0 0 0 2px ${t.accent}`,
        },
      }}
    >
      <Box
        component="img"
        src={src}
        alt=""
        loading="lazy"
        onError={() => setSrc(item.image.fallback)}
        className="bentoImage"
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: item.image.objectPosition ?? 'center',
          transition: `transform 500ms ${siteMotion.easeOut}`,
          '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
        }}
      />

      {/* One scrim, bottom-weighted — enough for AA on the label, not a full-tile wash. */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to top, rgba(6, 16, 28, 0.92) 0%, rgba(6, 16, 28, 0.72) 34%, rgba(6, 16, 28, 0.12) 72%, rgba(6, 16, 28, 0.04) 100%)',
        }}
      />

      <Box sx={{ position: 'relative' }}>
        <Typography
          sx={{
            fontFamily: siteFont.mono,
            fontSize: 9.5,
            fontWeight: 600,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            fontVariantNumeric: 'tabular-nums',
            color: 'rgba(255, 255, 255, 0.62)',
            mb: 1.25,
          }}
        >
          {String(index + 1).padStart(2, '0')}
        </Typography>

        <Typography
          sx={{
            fontFamily: siteFont.display,
            fontSize: { xs: 16, md: 17.5 },
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
            color: '#FFFFFF',
          }}
        >
          {item.title}
        </Typography>

        <Typography
          sx={{
            fontFamily: siteFont.body,
            fontSize: 12.5,
            lineHeight: 1.5,
            color: 'rgba(255, 255, 255, 0.78)',
            mt: 1,
          }}
        >
          {item.description}
        </Typography>

        <Box
          aria-hidden
          className="bentoArrow"
          sx={{
            display: 'inline-flex',
            mt: 1.75,
            color: '#FEC107',
            transition: `transform 180ms ${siteMotion.easeOut}`,
            '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
          }}
        >
          <ArrowRight size={16} />
        </Box>
      </Box>
    </Box>
  )
}

/** A text cell in the grid — same footprint as a tile, no image. */
function BentoTextCell({
  eyebrow,
  children,
  sx,
}: {
  eyebrow?: string
  children: ReactNode
  sx?: object
}) {
  const t = useSiteTone()

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: TILE_HEIGHT,
        py: { xs: 1, md: 2 },
        pr: { md: 3 },
        ...sx,
      }}
    >
      {eyebrow ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5 }}>
          <Box
            aria-hidden
            sx={{ width: 22, height: '1px', backgroundColor: t.accent, flex: '0 0 auto' }}
          />
          <Typography sx={t.mrz}>{eyebrow}</Typography>
        </Box>
      ) : null}
      {children}
    </Box>
  )
}

export function ServiceBentoSection({
  id,
  eyebrow,
  title,
  lead,
  items,
  footnote,
  action,
}: {
  id?: string
  eyebrow: string
  title: string
  lead: string
  items: readonly ServiceBentoItem[]
  /** Copy for the second text cell, sitting inside the grid on the lower row. */
  footnote: string
  action?: ReactNode
}) {
  const t = useSiteTone()

  return (
    <SiteSection id={id}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, minmax(0, 1fr))',
            lg: 'repeat(4, minmax(0, 1fr))',
          },
          gap: { xs: 2, md: 2.5 },
        }}
      >
        <BentoTextCell eyebrow={eyebrow}>
          <Typography component="h2" sx={t.type.section}>
            {title}
          </Typography>
          <Typography sx={{ ...t.type.lead, mt: 2.5 }}>{lead}</Typography>
        </BentoTextCell>

        {items.slice(0, 3).map((item, index) => (
          <BentoTile key={item.id} item={item} index={index} />
        ))}

        {items.slice(3).map((item, index) => (
          <BentoTile key={item.id} item={item} index={index + 3} />
        ))}

        <BentoTextCell sx={{ gridColumn: { lg: 'span 2' }, pl: { lg: 1 } }}>
          <Typography sx={{ ...t.type.block, fontSize: { xs: 18, md: 21 } }}>{footnote}</Typography>
          {action ? <Box sx={{ mt: 3 }}>{action}</Box> : null}
        </BentoTextCell>
      </Box>
    </SiteSection>
  )
}
