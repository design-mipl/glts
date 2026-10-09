import { Box } from '@mui/material'
import { HeroSection } from './components/HeroSection'
import { ExploreSection } from './components/ExploreSection'
import { WhyGreenLightWorksSection } from './components/WhyGreenLightWorksSection'
import { HowItWorks } from './components/HowItWorks'
import { VisaServicesPreviewSection } from './components/VisaServicesPreviewSection'
import { TestimonialSection } from '../../components/TestimonialSection'
import { FinalCtaSection } from './components/FinalCtaSection'
import { LandingFaqSection } from './components/LandingFaqSection'
import { landingTestimonials, landingFaqs } from './landingPageContent'
import { usePublicBrandColors } from '../../theme/publicSiteTokens'

export function LandingPage() {
  const colors = usePublicBrandColors()

  return (
    <Box sx={{ width: '100%', bgcolor: colors.white }}>
      <HeroSection />
      <ExploreSection />
      <WhyGreenLightWorksSection />
      <HowItWorks />
      <VisaServicesPreviewSection />
      <TestimonialSection
        testimonials={landingTestimonials}
        markerIcon="plane"
        title="Trusted by Travellers and Businesses"
        subtitle="Real experiences from customers and partners who rely on GreenLight for their visa needs."
      />
      <FinalCtaSection />
      <LandingFaqSection faqs={landingFaqs} displayOrder={[0, 2, 3, 4, 1, 5]} />
    </Box>
  )
}
