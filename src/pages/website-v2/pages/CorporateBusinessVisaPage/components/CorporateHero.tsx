import { Box } from '@mui/material'
import { ServiceHeroContent } from '../../../components/ServiceHeroContent'
import { serviceHeroSectionSx } from '../../../components/serviceHeroStyles'
import { useHeroScrollParallax } from '../../../hooks/useHeroScrollParallax'
import { usePublicBrandColors } from '../../../theme/publicSiteTokens'
import { corporateHeroCtas, corporateHeroStats } from '../corporatePageData'
import { CorporateHeroBackgroundImage } from './CorporateHeroBackgroundImage'

export function CorporateHero() {
  const colors = usePublicBrandColors()
  const { sectionRef, offsetY } = useHeroScrollParallax()

  return (
    <Box ref={sectionRef} component="section" aria-labelledby="corporate-hero-heading" sx={{ ...serviceHeroSectionSx, minHeight: { desktop: 620 }, bgcolor: colors.navy }}>
      <CorporateHeroBackgroundImage parallaxOffsetY={offsetY} />
      <ServiceHeroContent
        headingId="corporate-hero-heading"
        eyebrow="CORPORATE VISA SERVICES"
        heading="Business Travel Visa Services"
        description="Corporate visa handling for business travel, project assignments, and enterprise mobility teams — with dedicated account management and embassy-ready documentation."
        primaryAction={corporateHeroCtas.primary}
        secondaryAction={corporateHeroCtas.secondary}
        items={corporateHeroStats}
        itemsLabel="Corporate trust metrics"
        animate
        compactSpacing
      />
    </Box>
  )
}
