import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import { PublicContainer } from './PublicContainer'
import { FAQAccordionList } from './FAQAccordionList'
import type { FAQItem } from './FAQAccordionList'
import { websiteHeadingSx } from '../theme/websiteComponentStyles'
import {
  usePublicBrandColors,
} from '../theme/publicSiteTokens'
import {
  landingSectionHeaderMb,
  landingSectionPy,
} from '../pages/LandingPage/landingPageSpacing'
import { faqSupportCardImage } from '../assets/landingPageImages'

export type { FAQItem } from './FAQAccordionList'

export interface FAQSectionProps {
  faqs: FAQItem[]
  title?: string
  headingAlign?: 'left' | 'center'
}

const DEFAULT_TITLE = "FAQ's"

export function FAQSection({ faqs, title = DEFAULT_TITLE, headingAlign = 'left' }: FAQSectionProps) {
  const colors = usePublicBrandColors()
  const [imgSrc, setImgSrc] = useState(faqSupportCardImage.src)

  return (
    <Box component="section" sx={{ py: landingSectionPy, backgroundColor: colors.white }}>
      <PublicContainer variant="hero">
        <Box sx={{ maxWidth: 640, mb: landingSectionHeaderMb, textAlign: headingAlign, mx: headingAlign === 'center' ? 'auto' : 0 }}>
          <Typography
            component="h2"
            sx={{
              ...websiteHeadingSx.h2,
              color: colors.navy,
              mb: 1.5,
            }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: '15px', md: '16px' },
              lineHeight: 1.65,
              color: colors.textSecondary,
            }}
          >
            Quick answers to common visa questions — or reach our specialists for personalized
            guidance.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              xl: 'minmax(0, 1.15fr) minmax(0, 1.2fr)',
            },
            gap: { xs: 3, xl: 3.5, desktop: 4 },
            alignItems: { xs: 'start', xl: 'stretch' },
          }}
        >
          {/* Left — premium support image (height tracks accordion) */}
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              minHeight: { xs: 360, sm: 400 },
              height: { xs: 'auto', xl: '100%' },
              aspectRatio: { xs: '4 / 5', xl: 'unset' },
            }}
          >
            <Box
              component="img"
              src={imgSrc}
              alt={faqSupportCardImage.alt}
              loading="lazy"
              onError={() => setImgSrc(faqSupportCardImage.fallback)}
              sx={{
                display: 'block',
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                objectPosition: 'center center',
                borderRadius: '20px',
              }}
            />
          </Box>

          {/* Right — FAQ accordion list */}
          <FAQAccordionList faqs={faqs} ariaLabel={`${title} questions`} />
        </Box>
      </PublicContainer>
    </Box>
  )
}
