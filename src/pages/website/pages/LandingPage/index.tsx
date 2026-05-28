import { Box } from '@mui/material'
import { HeroSection } from './components/HeroSection'
import { ExploreSection } from './components/ExploreSection'
import { FeaturesSection } from './components/FeaturesSection'
import { HowItWorks } from './components/HowItWorks'
import { PortalCards } from './components/PortalCards'
import { TestimonialSection } from './components/TestimonialSection'
import { FAQSection } from './components/FAQSection'
import { usePublicBrandColors } from '../../theme/publicSiteTokens'

export function LandingPage() {
  const colors = usePublicBrandColors()
  return (
    <Box sx={{ width: '100%', bgcolor: colors.white }}>
      <HeroSection />
      <ExploreSection />
      <FeaturesSection />
      <HowItWorks />
      <PortalCards />
      <TestimonialSection />
      <FAQSection />
    </Box>
  )
}
