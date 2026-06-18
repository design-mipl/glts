import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import { publicShadows, usePublicBrandColors } from '../theme/publicSiteTokens'

export interface ServiceShowcaseItem {
  id: string
  title: string
  points: readonly string[]
  image: string
  fallback: string
  href?: string
}

function ServiceShowcaseCard({
  title,
  points,
  image,
  fallback,
  href = '/countries',
  minHeight,
}: {
  title: string
  points: readonly string[]
  image: string
  fallback: string
  href?: string
  minHeight: { xs: number; sm: number; md: number }
}) {
  const colors = usePublicBrandColors()
  const [imgSrc, setImgSrc] = useState(image)

  return (
    <Box
      component="a"
      href={href}
      sx={{
        position: 'relative',
        display: 'block',
        minHeight,
        borderRadius: '20px',
        overflow: 'hidden',
        textDecoration: 'none',
        border: `1px solid ${colors.border}`,
        boxShadow: publicShadows.card,
        transition: 'transform 320ms ease, box-shadow 320ms ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: publicShadows.cardHover,
        },
        '&:hover .service-showcase-image': {
          transform: 'scale(1.06)',
        },
      }}
    >
      <Box
        component="img"
        src={imgSrc}
        alt={title}
        loading="lazy"
        onError={() => setImgSrc(fallback)}
        className="service-showcase-image"
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'transform 500ms ease',
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(0, 20, 40, 0.15) 8%, rgba(0, 20, 40, 0.5) 56%, rgba(0, 20, 40, 0.86) 100%)',
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          p: { xs: 2, md: 2.5 },
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: '18px', md: '20px' },
            fontWeight: 700,
            color: colors.white,
            lineHeight: 1.2,
            mb: 1,
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.35)',
          }}
        >
          {title}
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 2.2 }}>
          {points.map((point) => (
            <Typography
              component="li"
              key={point}
              sx={{
                fontSize: '13px',
                color: 'rgba(255, 255, 255, 0.92)',
                lineHeight: 1.45,
                textShadow: '0 1px 6px rgba(0, 0, 0, 0.3)',
              }}
            >
              {point}
            </Typography>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

interface ServiceShowcaseMosaicProps {
  items: readonly ServiceShowcaseItem[]
}

export function ServiceShowcaseMosaic({ items }: ServiceShowcaseMosaicProps) {
  if (items.length < 4) return null

  return (
    <Box
      sx={{
        display: 'grid',
        gap: { xs: 2, md: 2.5 },
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, minmax(0, 1fr))',
          md: '1.15fr 1fr',
        },
      }}
    >
      <ServiceShowcaseCard
        title={items[0].title}
        points={items[0].points}
        image={items[0].image}
        fallback={items[0].fallback}
        href={items[0].href}
        minHeight={{ xs: 260, sm: 320, md: 460 }}
      />

      <Box sx={{ display: 'grid', gap: { xs: 2, md: 2.5 }, gridTemplateRows: { md: '1fr auto' } }}>
        <ServiceShowcaseCard
          title={items[1].title}
          points={items[1].points}
          image={items[1].image}
          fallback={items[1].fallback}
          href={items[1].href}
          minHeight={{ xs: 220, sm: 250, md: 220 }}
        />

        <Box sx={{ display: 'grid', gap: { xs: 2, md: 2.5 }, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' } }}>
          <ServiceShowcaseCard
            title={items[2].title}
            points={items[2].points}
            image={items[2].image}
            fallback={items[2].fallback}
            href={items[2].href}
            minHeight={{ xs: 220, sm: 220, md: 220 }}
          />
          <ServiceShowcaseCard
            title={items[3].title}
            points={items[3].points}
            image={items[3].image}
            fallback={items[3].fallback}
            href={items[3].href}
            minHeight={{ xs: 220, sm: 220, md: 220 }}
          />
        </Box>
      </Box>
    </Box>
  )
}
