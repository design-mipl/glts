import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import {
  publicFonts,
  usePublicBrandColors,
  brandPrimaryGreenRgb,
} from '../../../theme/publicSiteTokens'
import { SolutionPageSection } from '../../../components/solutionPage/SolutionPageSection'
import { retailAdvantages } from '../retailPageData'

const CARD_RADIUS = '18px'
const TRANSITION_MS = '280ms'
/** Shared crop frame so every advantage card image is the same height. */
const IMAGE_ASPECT_RATIO = '16 / 10'

function AdvantageCard({
  title,
  description,
  icon: Icon,
  image,
}: (typeof retailAdvantages)[number]) {
  const colors = usePublicBrandColors()
  const [imgSrc, setImgSrc] = useState(image.src)

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderRadius: CARD_RADIUS,
        border: `1px solid ${colors.border}`,
        boxShadow: '0 6px 20px rgba(15, 23, 42, 0.06)',
        bgcolor: colors.white,
        overflow: 'hidden',
        transition: `transform ${TRANSITION_MS} ease, box-shadow ${TRANSITION_MS} ease, border-color ${TRANSITION_MS} ease`,
        '@media (hover: hover)': {
          '&:hover': {
            transform: 'translateY(-5px)',
            borderColor: `rgba(${brandPrimaryGreenRgb}, 0.4)`,
            boxShadow: '0 16px 36px rgba(15, 23, 42, 0.12)',
          },
          '&:hover .retail-advantage-image': {
            transform: 'scale(1.04)',
          },
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          aspectRatio: IMAGE_ASPECT_RATIO,
          flexShrink: 0,
          overflow: 'hidden',
          bgcolor: colors.surfaceAlt,
          borderTopLeftRadius: CARD_RADIUS,
          borderTopRightRadius: CARD_RADIUS,
        }}
      >
        <Box
          component="img"
          className="retail-advantage-image"
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
            objectPosition: image.objectPosition,
            display: 'block',
            transition: `transform ${TRANSITION_MS} ease`,
          }}
        />
      </Box>

      <Box
        sx={{
          p: { xs: 2.25, md: 2.5 },
          display: 'flex',
          flexDirection: 'column',
          gap: 1.25,
          flex: 1,
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '12px',
            bgcolor: `rgba(${brandPrimaryGreenRgb}, 0.12)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon size={20} color={colors.greenBright} strokeWidth={2} aria-hidden />
        </Box>

        <Typography
          sx={{
            fontFamily: publicFonts.heading,
            fontSize: { xs: '16px', md: '17px' },
            fontWeight: 700,
            color: colors.navy,
            letterSpacing: '-0.02em',
            lineHeight: 1.3,
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            fontSize: '14px',
            color: colors.textSecondary,
            lineHeight: 1.6,
          }}
        >
          {description}
        </Typography>
      </Box>
    </Box>
  )
}

export function RetailAdvantageSection() {
  return (
    <SolutionPageSection
      id="retail-advantage"
      title="Retail Advantage"
      subtitle="A clearer path from destination choice to embassy-ready submission — built for individual travelers."
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, minmax(0, 1fr))',
            md: 'repeat(3, minmax(0, 1fr))',
            lg: 'repeat(5, minmax(0, 1fr))',
          },
          gap: { xs: 2, md: 2.5 },
          alignItems: 'stretch',
        }}
      >
        {retailAdvantages.map((item) => (
          <AdvantageCard key={item.id} {...item} />
        ))}
      </Box>
    </SolutionPageSection>
  )
}
