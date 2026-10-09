import { useId } from 'react'
import { Box, Typography } from '@mui/material'
import { ArrowRight } from 'lucide-react'
import { PublicContainer } from '../../../components/PublicContainer'
import { FAQAccordionList } from '../../../components/FAQAccordionList'
import { websiteHeadingSx } from '../../../theme/websiteComponentStyles'
import type { FAQItem } from '../../../components/FAQAccordionList'
import { websiteDesignSystem as ds } from '../../../theme/websiteDesignSystem'
import { landingSectionPy, landingSectionHeaderMb } from '../landingPageSpacing'

interface LandingFaqSectionProps {
  faqs: FAQItem[]
  displayOrder?: readonly number[]
  heading?: string
  headingAlign?: 'left' | 'center'
}

export function LandingFaqSection({ faqs, displayOrder, heading = 'Questions, answered.', headingAlign = 'left' }: LandingFaqSectionProps) {
  const idPrefix = useId().replace(/:/g, '')

  return (
    <Box
      component="section"
      aria-labelledby={`${idPrefix}-heading`}
      sx={{
        bgcolor: ds.color.surface,
        py: landingSectionPy,
      }}
    >
      <PublicContainer variant="hero">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: headingAlign === 'center' ? 'column' : 'row' },
            alignItems: headingAlign === 'center' ? 'center' : { xs: 'flex-start', md: 'flex-start' },
            justifyContent: 'space-between',
            gap: { xs: 3, md: headingAlign === 'center' ? 3 : 5 },
            mb: landingSectionHeaderMb,
          }}
        >
          <Box sx={{ maxWidth: 900, textAlign: headingAlign, mx: headingAlign === 'center' ? 'auto' : 0 }}>
            <Typography
              component="p"
              sx={{
                color: ds.color.brandHover,
                fontSize: ds.type.eyebrow.size,
                fontWeight: ds.type.eyebrow.weight,
                lineHeight: ds.type.eyebrow.lineHeight,
                letterSpacing: ds.type.eyebrow.tracking,
                mb: 1.5,
              }}
            >
              FAQS
            </Typography>
            <Typography
              id={`${idPrefix}-heading`}
              component="h2"
              sx={{
                ...websiteHeadingSx.h2,
                color: ds.color.navy,
                mb: 2,
              }}
            >
              {heading}
            </Typography>
            <Typography
              component="p"
              sx={{
                color: ds.color.textSecondary,
                fontSize: { xs: ds.type.body.mobile, md: ds.type.body.size },
                lineHeight: ds.type.body.lineHeight,
              }}
            >
              Quick answers to common visa questions — or reach our specialists for personalized guidance.
            </Typography>
          </Box>

          <Box
            component="a"
            href="/enquiry"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              gap: 1,
              minHeight: 44,
              px: 2.5,
              color: ds.color.brandHover,
              bgcolor: ds.color.surface,
              border: `1px solid ${ds.color.brand}`,
              borderRadius: `${ds.radius.medium}px`,
              boxShadow: ds.shadow.subtle,
              textDecoration: 'none',
              fontFamily: ds.fonts.ui,
              fontSize: ds.type.button.size,
              fontWeight: ds.type.button.weight,
              lineHeight: ds.type.button.lineHeight,
              transition: 'background-color 180ms ease, color 180ms ease, border-color 180ms ease',
              '&:hover': {
                color: ds.color.navy,
                bgcolor: ds.color.successSurface,
                borderColor: ds.color.brandHover,
              },
              '&:focus-visible': { outline: `3px solid ${ds.color.focus}`, outlineOffset: 3 },
            }}
          >
            Talk to an Expert <ArrowRight size={18} aria-hidden="true" />
          </Box>
        </Box>

        <FAQAccordionList
          faqs={faqs}
          displayOrder={displayOrder}
          columns={2}
          columnsAt={ds.breakpoint.mobileLarge}
          ariaLabel={`${heading} questions`}
        />
      </PublicContainer>
    </Box>
  )
}
