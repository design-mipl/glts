import { useState } from 'react'
import { Box, Typography, Stack } from '@mui/material'
import { ArrowRight } from 'lucide-react'
import { publicFonts, usePublicBrandColors, brandPrimaryGreenRgb } from '../theme/publicSiteTokens'
import { SOLUTION_CARD_IMAGE_HEIGHT } from '../assets/landingPageImages'
import { SolutionPageSection } from './solutionPage/SolutionPageSection'
import { websiteDesignSystem as ds } from '../theme/websiteDesignSystem'

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
  const cardTokens = ds.component.card.category

  return (
    <Box
      component="a"
      href={href}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        borderRadius: `${cardTokens.radius}px`,
        border: `1px solid ${colors.border}`,
        boxShadow: '0 4px 20px rgba(15, 23, 42, 0.06)',
        bgcolor: colors.white,
        textDecoration: 'none',
        color: 'inherit',
        overflow: 'hidden',
        transition: `border-color ${ds.component.card.hoverDurationMs}ms ease, box-shadow ${ds.component.card.hoverDurationMs}ms ease, transform ${ds.component.card.hoverDurationMs}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        '&:focus-visible': { outline: `${ds.component.card.focusWidth}px solid ${ds.color.focus}`, outlineOffset: 3 },
        '@media (prefers-reduced-motion: reduce)': { transition: 'none', '& .visa-category-card-image': { transition: 'none' } },
        '@media (hover: hover)': {
          '&:hover': {
            borderColor: `rgba(${brandPrimaryGreenRgb}, 0.4)`,
            boxShadow: '0 16px 40px rgba(15, 23, 42, 0.12)',
            transform: 'translateY(-6px)',
            '& .visa-category-card-image': {
              transform: `scale(${ds.component.card.imageZoomScale})`,
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
          borderTopLeftRadius: `${cardTokens.radius}px`,
          borderTopRightRadius: `${cardTokens.radius}px`,
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
            transition: `transform ${ds.component.card.hoverDurationMs}ms cubic-bezier(0.4, 0, 0.2, 1)`,
            willChange: 'transform',
          }}
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          p: { xs: `${cardTokens.padding.mobile}px`, md: `${cardTokens.padding.desktop}px` },
        }}
      >
        <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 1 }}>
          <Typography
            sx={{
              fontFamily: publicFonts.heading,
              fontSize: readable ? { xs: `${cardTokens.titleSize - 1}px`, md: `${cardTokens.titleSize}px` } : `${cardTokens.titleSize - 2}px`,
              fontWeight: cardTokens.titleWeight,
              color: colors.navy,
              lineHeight: 1.25,
            }}
          >
            {title}
          </Typography>
        </Stack>

        <Typography
          sx={{
            fontSize: readable ? `${cardTokens.readableBodySize}px` : `${cardTokens.bodySize}px`,
            color: colors.textSecondary,
            lineHeight: cardTokens.bodyLineHeight,
            mb: 2,
            flex: 1,
          }}
        >
          {description}
        </Typography>

        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: colors.greenBright }}>
          <Typography sx={{ fontSize: '14px', fontWeight: 700 }}>Learn More</Typography>
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
          gridTemplateColumns: '1fr',
          '@media (min-width: 600px)': { gridTemplateColumns: `repeat(${Math.min(columnCount, 2)}, minmax(0, 1fr))` },
          '@media (min-width: 1024px)': { gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` },
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
