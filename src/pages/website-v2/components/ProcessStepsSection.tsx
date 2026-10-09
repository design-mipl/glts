import type { ElementType } from 'react'
import { Box, Typography } from '@mui/material'
import { PublicContainer } from './PublicContainer'
import { publicFonts } from '../theme/publicSiteTokens'
import { featureSectionPy } from '../pages/LandingPage/landingPageSpacing'

export interface ProcessStep {
  title: string
  description: string
  icon: ElementType
}

interface ProcessStepsSectionProps {
  id: string
  sectionLabel: string
  heading: string
  subheading: string
  steps: readonly ProcessStep[]
}

export function ProcessStepsSection({ id, sectionLabel, heading, subheading, steps }: ProcessStepsSectionProps) {
  const green = '#2FA34F'
  const iconGreen = '#168D3F'

  return (
    <Box
      component="section"
      id={id}
      sx={{
        background: 'radial-gradient(ellipse at center, #FFFFFF 0%, #F8FAFB 100%)',
        py: featureSectionPy,
      }}
    >
      <PublicContainer variant="hero" sx={{ textAlign: 'center' }}>
        <Typography
          sx={{
            color: green,
            fontFamily: publicFonts.heading,
            fontSize: '16px',
            fontWeight: 700,
            lineHeight: 1.5,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            mb: 1,
          }}
        >
          {sectionLabel}
        </Typography>
        <Typography
          component="h2"
          sx={{
            color: '#10264A',
            fontFamily: publicFonts.display,
            fontSize: { xs: '30px', sm: '36px', lg: '42px' },
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: '-0.025em',
            mb: 1,
          }}
        >
          {heading}
        </Typography>
        <Typography
          sx={{
            color: '#627088',
            fontFamily: publicFonts.body,
            fontSize: { xs: '16px', md: '20px' },
            lineHeight: 1.5,
          }}
        >
          {subheading}
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))' },
            columnGap: { xs: 0, sm: 3, lg: 4 },
            rowGap: { xs: 5, sm: 6 },
            mt: { xs: 5, lg: 4 },
          }}
        >
          {steps.map(({ title, description, icon: Icon }, index) => (
            <Box key={title} sx={{ position: 'relative', minWidth: 0, px: { xs: 1, sm: 2 } }}>
              <Box sx={{ position: 'relative', width: 136, pt: '30px', mx: 'auto' }}>
                <Box
                  sx={{
                    width: 136,
                    height: 136,
                    borderRadius: '50%',
                    bgcolor: '#EAF8EC',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: iconGreen,
                  }}
                >
                  <Icon size={54} color={iconGreen} strokeWidth={1.7} aria-hidden="true" />
                </Box>
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    bgcolor: green,
                    color: '#FFFFFF',
                    border: '2px solid #FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: publicFonts.heading,
                    fontSize: '20px',
                    fontWeight: 700,
                  }}
                >
                  {index + 1}
                </Box>
              </Box>

              {index < steps.length - 1 && (
                <Box
                  aria-hidden="true"
                  sx={{
                    display: { xs: 'none', lg: 'flex' },
                    position: 'absolute',
                    top: 83,
                    left: '100%',
                    width: 32,
                    height: 30,
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#6E819D',
                  }}
                >
                  <svg width="32" height="30" viewBox="0 0 32 30" fill="none">
                    <path d="M1 15h27M20 4l11 11-11 11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Box>
              )}

              <Typography
                component="h3"
                sx={{
                  color: '#10264A',
                  fontFamily: publicFonts.display,
                  fontSize: { xs: '20px', lg: '22px' },
                  fontWeight: 700,
                  lineHeight: 1.3,
                  mt: 1,
                  mb: 1,
                }}
              >
                {title}
              </Typography>
              <Typography
                sx={{
                  color: '#5F6D83',
                  fontFamily: publicFonts.body,
                  fontSize: { xs: '16px', lg: '18px' },
                  lineHeight: 1.48,
                  maxWidth: 260,
                  mx: 'auto',
                }}
              >
                {description}
              </Typography>
            </Box>
          ))}
        </Box>
      </PublicContainer>
    </Box>
  )
}
