import { useState } from 'react'
import { Box, Typography, Stack } from '@mui/material'
import { ArrowRight } from 'lucide-react'
import { publicFonts, usePublicBrandColors, brandPrimaryGreenRgb } from '../theme/publicSiteTokens'
import { SOLUTION_CARD_IMAGE_HEIGHT } from '../assets/landingPageImages'
import { SolutionPageSection } from './solutionPage/SolutionPageSection'

const CARD_RADIUS = '20px'
const TRANSITION_MS = '300ms'
const TRANSITION_EASE = 'cubic-bezier(0.4, 0, 0.2, 1)'

export interface VisaCategoryCardItem {
  id: string
  title: string
  description: string
  image: {
    src: string
    fallback: string
    alt: string
  }
  href?: string
}

interface VisaCategoryCardsSectionProps {
  id?: string
  title?: string
  subtitle?: string
  headingAlign?: 'left' | 'center'
  headingSize?: 'default' | 'business'
  items: VisaCategoryCardItem[]
  desktopColumns?: 2 | 3 | 4
  readable?: boolean
  imageHeight?: { mobile: number; tablet: number; desktop: number }
}

function VisaCategoryCard({ title, description, image, href = '/countries', readable = false, imageHeight }: VisaCategoryCardItem & { readable?: boolean; imageHeight?: { mobile: number; tablet: number; desktop: number } }) {
  const colors = usePublicBrandColors()
  const [imgSrc, setImgSrc] = useState(image.src)

  return (
    <Box
      component="a"
      href={href}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        borderRadius: CARD_RADIUS,
        border: `1px solid ${colors.border}`,
        boxShadow: '0 4px 20px rgba(15, 23, 42, 0.06)',
        bgcolor: colors.white,
        textDecoration: 'none',
        color: 'inherit',
        overflow: 'hidden',
        transition: `border-color ${TRANSITION_MS} ease, box-shadow ${TRANSITION_MS} ease, transform ${TRANSITION_MS} ${TRANSITION_EASE}`,
        '@media (hover: hover)': {
          '&:hover': {
            borderColor: `rgba(${brandPrimaryGreenRgb}, 0.4)`,
            boxShadow: '0 16px 40px rgba(15, 23, 42, 0.12)',
            transform: 'translateY(-6px)',
            '& .visa-category-card-image': {
              transform: 'scale(1.06)',
            },
          },
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: imageHeight?.mobile ?? SOLUTION_CARD_IMAGE_HEIGHT,
          ...(imageHeight && {
            '@media (min-width: 600px)': { height: imageHeight.tablet },
            '@media (min-width: 1024px)': { height: imageHeight.desktop },
          }),
          flexShrink: 0,
          overflow: 'hidden',
          bgcolor: colors.surfaceAlt,
          borderTopLeftRadius: CARD_RADIUS,
          borderTopRightRadius: CARD_RADIUS,
        }}
      >
        <Box
          component="img"
          className="visa-category-card-image"
          src={imgSrc}
          alt={image.alt}
          loading="lazy"
          onError={() => setImgSrc(image.fallback)}
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            display: 'block',
            transition: `transform ${TRANSITION_MS} ${TRANSITION_EASE}`,
            willChange: 'transform',
          }}
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          p: { xs: 2.25, md: 2.5 },
        }}
      >
        <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 1 }}>
          <Typography
            sx={{
              fontFamily: publicFonts.heading,
              fontSize: readable ? { xs: '19px', md: '20px' } : '18px',
              fontWeight: 800,
              color: colors.navy,
              lineHeight: 1.25,
            }}
          >
            {title}
          </Typography>
        </Stack>

        <Typography
          sx={{
            fontSize: readable ? '16px' : '14px',
            color: colors.textSecondary,
            lineHeight: 1.65,
            mb: 2,
            flex: 1,
          }}
        >
          {description}
        </Typography>

        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: colors.greenBright }}>
          <Typography sx={{ fontSize: '13px', fontWeight: 700 }}>Learn More</Typography>
          <ArrowRight size={15} strokeWidth={2.5} />
        </Stack>
      </Box>
    </Box>
  )
}

export function VisaCategoryCardsSection({ id = 'visa-categories', title = 'Visa Categories', subtitle, headingAlign, headingSize, items, desktopColumns, readable = false, imageHeight }: VisaCategoryCardsSectionProps) {
  const columnCount = desktopColumns ?? Math.min(items.length, 3)

  return (
    <SolutionPageSection id={id} title={title} subtitle={subtitle} headingAlign={headingAlign} headingSize={headingSize} readable={readable}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, minmax(0, 1fr))',
            md: columnCount === 4 ? 'repeat(2, minmax(0, 1fr))' : `repeat(${columnCount}, minmax(0, 1fr))`,
            ...(columnCount === 4 && {
              '@media (max-width: 599.95px)': { gridTemplateColumns: '1fr' },
              '@media (min-width: 1024px)': { gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' },
            }),
          },
          gap: { xs: 2, md: 2.5 },
          alignItems: 'stretch',
        }}
      >
        {items.map((item) => (
          <VisaCategoryCard key={item.id} {...item} readable={readable} imageHeight={imageHeight} />
        ))}
      </Box>
    </SolutionPageSection>
  )
}
