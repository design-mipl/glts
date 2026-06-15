import { Box } from '@mui/material'
import { HeroSection } from './components/HeroSection'
import { TrustIndicatorsSection } from './components/TrustIndicatorsSection'
import { VisaServicesSection } from './components/VisaServicesSection'
import { HowItWorks } from './components/HowItWorks'
import { ExploreSection } from './components/ExploreSection'
import { SpecializedSolutionsSection } from './components/SpecializedSolutionsSection'
import { VisaMasterSection } from './components/VisaMasterSection'
import { AdditionalServicesSection } from './components/AdditionalServicesSection'
import { VisaRefusalSupportSection } from './components/VisaRefusalSupportSection'
import { TestimonialSection } from './components/TestimonialSection'
import { FAQSection } from './components/FAQSection'
import { usePublicBrandColors } from '../../theme/publicSiteTokens'

export function LandingPage() {
  const colors = usePublicBrandColors()
  return (
    <Box sx={{ width: '100%', bgcolor: colors.white }}>
      <HeroSection />
      <TrustIndicatorsSection />
      <VisaServicesSection />
      <HowItWorks />
      <ExploreSection />
      <SpecializedSolutionsSection />
      <VisaMasterSection />
      <AdditionalServicesSection />
      <VisaRefusalSupportSection />
      <TestimonialSection />
      <FAQSection />
    </Box>
  )
}
