import { Box } from '@mui/material'
import { ServiceHeroContent } from '../../../components/ServiceHeroContent'
import { serviceHeroSectionSx } from '../../../components/serviceHeroStyles'
import { useHeroScrollParallax } from '../../../hooks/useHeroScrollParallax'
import { usePublicBrandColors } from '../../../theme/publicSiteTokens'
import { retailHeroCtas, retailHeroTrustPoints } from '../retailPageData'
import { RetailHeroBackgroundImage } from './RetailHeroBackgroundImage'

const retailHeroItems = retailHeroTrustPoints.map(({ label, icon }) => ({ title: label, icon }))

export function RetailHero() {
  const colors = usePublicBrandColors()
  const { sectionRef, offsetY } = useHeroScrollParallax()

  return (
    <Box
      ref={sectionRef}
      component="section"
      aria-labelledby="visa-services-hero-heading"
      sx={{ ...serviceHeroSectionSx, minHeight: { desktop: 620 }, bgcolor: colors.navy }}
    >
      <RetailHeroBackgroundImage parallaxOffsetY={offsetY} />
      <ServiceHeroContent
        headingId="visa-services-hero-heading"
        eyebrow="VISA SERVICES"
        heading="Visa Services, Guided by Experts."
        description="From tourist and family visits to business, study, and transit travel, get clear requirements, expert document review, and a transparent path to submission."
        primaryAction={retailHeroCtas.primary}
        secondaryAction={retailHeroCtas.secondary}
        items={retailHeroItems}
        itemsLabel="Visa service trust indicators"
        animate
        compactSpacing
        prominentItems
        spacious
        unframedItems
      />
    </Box>
  )
}
