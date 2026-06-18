import { Box, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { PublicContainer } from '../PublicContainer'
import { publicFonts, usePublicBrandColors } from '../../theme/publicSiteTokens'
import { landingSectionHeaderMb, landingSectionPy } from '../../pages/LandingPage/landingPageSpacing'

interface SolutionPageSectionProps {
  id?: string
  title: string
  subtitle?: string
  children: ReactNode
}

export function SolutionPageSection({ id, title, subtitle, children }: SolutionPageSectionProps) {
  const colors = usePublicBrandColors()

  return (
    <Box
      component="section"
      id={id}
      sx={{
        py: landingSectionPy,
        borderTop: `1px solid ${colors.borderSoft}`,
      }}
    >
      <PublicContainer>
        <Box sx={{ mb: landingSectionHeaderMb, maxWidth: 720 }}>
          <Typography
            component="h2"
            sx={{
              fontFamily: publicFonts.heading,
              fontSize: { xs: '22px', md: '28px' },
              fontWeight: 700,
              color: colors.navy,
              lineHeight: 1.25,
              mb: subtitle ? 1.25 : 0,
            }}
          >
            {title}
          </Typography>
          {subtitle ? (
            <Typography sx={{ fontSize: '15px', color: colors.textSecondary, lineHeight: 1.65 }}>
              {subtitle}
            </Typography>
          ) : null}
        </Box>
        {children}
      </PublicContainer>
    </Box>
  )
}

interface SolutionListProps {
  items: string[]
}

export function SolutionList({ items }: SolutionListProps) {
  const colors = usePublicBrandColors()

  return (
    <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
      {items.map((item) => (
        <Typography
          component="li"
          key={item}
          sx={{ fontSize: '15px', color: colors.text, lineHeight: 1.7, mb: 1 }}
        >
          {item}
        </Typography>
      ))}
    </Box>
  )
}

interface SolutionStepsProps {
  steps: { title: string; description: string }[]
}

export function SolutionSteps({ steps }: SolutionStepsProps) {
  const colors = usePublicBrandColors()

  return (
    <Box component="ol" sx={{ m: 0, pl: 2.5 }}>
      {steps.map((step, index) => (
        <Box component="li" key={step.title} sx={{ mb: 3 }}>
          <Typography
            sx={{
              fontSize: '15px',
              fontWeight: 600,
              color: colors.navy,
              mb: 0.5,
            }}
          >
            Step {index + 1}: {step.title}
          </Typography>
          <Typography sx={{ fontSize: '15px', color: colors.textSecondary, lineHeight: 1.65 }}>
            {step.description}
          </Typography>
        </Box>
      ))}
    </Box>
  )
}
