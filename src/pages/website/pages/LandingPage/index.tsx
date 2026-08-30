import { Box } from '@mui/material'
import { HeroSection } from './components/HeroSection'
import { ExploreSection } from './components/ExploreSection'
import { HowItWorks } from './components/HowItWorks'
import { WhyGreenLightWorksSection } from './components/WhyGreenLightWorksSection'
import { VisaServicesSection } from './components/VisaServicesSection'
import { SpecializedSolutionsSection } from './components/SpecializedSolutionsSection'
import { VisaMasterSection } from './components/VisaMasterSection'
import { AdditionalServicesSection } from './components/AdditionalServicesSection'
import { TestimonialSection } from '../../components/TestimonialSection'
import { FinalCtaSection } from './components/FinalCtaSection'
import { FAQSection } from '../../components/FAQSection'
import { OurRetailServicesSection } from '../RetailVisaServicesPage/components/OurRetailServicesSection'
import { RetailAdvantageSection } from '../RetailVisaServicesPage/components/RetailAdvantageSection'
import { landingTestimonials, landingFaqs } from './landingPageContent'
import { usePublicBrandColors } from '../../theme/publicSiteTokens'

export function LandingPage() {
  const colors = usePublicBrandColors()

  return (
    <Box sx={{ width: '100%', bgcolor: colors.white }}>
      <HeroSection />
      <ExploreSection />
      <HowItWorks />
      <VisaServicesSection />
      <OurRetailServicesSection />
      <RetailAdvantageSection />
      <WhyGreenLightWorksSection />
      <VisaMasterSection />
      <SpecializedSolutionsSection />
      <AdditionalServicesSection />
      <TestimonialSection testimonials={landingTestimonials} markerIcon="plane" />
      <FinalCtaSection />
      <FAQSection faqs={landingFaqs} />
    </Box>
  )
}
