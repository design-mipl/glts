import type { ElementType } from 'react'
import { Box, Typography } from '@mui/material'
import { PublicContainer } from './PublicContainer'
import { publicFonts } from '../theme/publicSiteTokens'
import { websiteHeadingSx } from '../theme/websiteComponentStyles'
import { featureSectionPy } from '../pages/LandingPage/landingPageSpacing'
import { ProcessTimelineCopy, ProcessTimelineMarker, ResponsiveProcessTimeline } from './workflowTimeline/ProcessTimeline'
import { websiteDesignSystem as ds } from '../theme/websiteDesignSystem'

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
            ...websiteHeadingSx.h2,
            color: '#10264A',
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

        <ResponsiveProcessTimeline
          steps={steps}
          ariaLabel={`${heading} steps`}
          variant="illustrated"
          horizontalAt={ds.breakpoint.tablet}
          desktopColumns={Math.min(steps.length, 4)}
          tabletColumns={2}
          listSx={{ columnGap: { xs: 0, sm: 3, lg: 4 }, rowGap: { xs: 5, sm: 6 }, mt: { xs: 5, lg: 4 } }}
          itemSx={{ position: 'relative', minWidth: 0, px: { xs: 1, sm: 2 }, textAlign: 'center' }}
          renderStep={({ title, description, icon }, index) => (
            <>
              <Box sx={{ position: 'relative', width: 136, pt: '30px', mx: 'auto' }}>
                <ProcessTimelineMarker
                  icon={icon}
                  containerSize={136}
                  iconSize={54}
                  number={index + 1}
                  numberSize={44}
                  numberPlacement="topCenter"
                  background="#EAF8EC"
                  borderColor="#EAF8EC"
                  color={iconGreen}
                  numberBackground={green}
                  strokeWidth={1.7}
                />
              </Box>
              {index < steps.length - 1 && (
                <Box aria-hidden="true" sx={{ display: { xs: 'none', lg: 'flex' }, position: 'absolute', top: 83, left: '100%', width: 32, height: 30, alignItems: 'center', justifyContent: 'center', color: '#6E819D' }}>
                  <svg width="32" height="30" viewBox="0 0 32 30" fill="none"><path d="M1 15h27M20 4l11 11-11 11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </Box>
              )}
              <ProcessTimelineCopy
                title={title}
                description={description}
                titleSx={{ color: '#10264A', fontFamily: publicFonts.display, fontSize: { xs: '20px', lg: '22px' }, lineHeight: 1.3, mt: 1, mb: 1 }}
                descriptionSx={{ color: '#5F6D83', fontFamily: publicFonts.body, fontSize: { xs: '16px', lg: '18px' }, lineHeight: 1.48, maxWidth: 260, mx: 'auto' }}
              />
            </>
          )}
        />
      </PublicContainer>
    </Box>
  )
}
