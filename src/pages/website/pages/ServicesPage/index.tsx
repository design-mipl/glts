import { Box } from '@mui/material'
import { ServicesHero } from './components/ServicesHero'
import { ServiceCategoriesSection } from './components/ServiceCategoriesSection'
import { VisaMasterSection } from '../LandingPage/components/VisaMasterSection'
import { ServicesAdditionalSection } from './components/ServicesAdditionalSection'
import { ServicesFinalCtaSection } from './components/ServicesFinalCtaSection'
import { usePublicBrandColors } from '../../theme/publicSiteTokens'

export function ServicesPage() {
  const colors = usePublicBrandColors()

  return (
    <Box component="main" sx={{ bgcolor: colors.white }}>
      <ServicesHero />
      <ServiceCategoriesSection />
      <VisaMasterSection />
      <ServicesAdditionalSection />
      <ServicesFinalCtaSection />
    </Box>
  )
}
