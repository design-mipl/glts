import { Box } from '@mui/material'
import { HeroSection } from './components/HeroSection'
import { FeaturesSection } from './components/FeaturesSection'
import { TrendingDestinations } from './components/TrendingDestinations'
import { HowItWorks } from './components/HowItWorks'
import { PortalCards } from './components/PortalCards'
import { TestimonialSection } from './components/TestimonialSection'
import { FAQSection } from './components/FAQSection'
import { ProductShowcase } from './components/ProductShowcase'

export function LandingPage() {
  return (
    <Box sx={{ width: '100%' }}>
      <HeroSection />
      <FeaturesSection />
      <TrendingDestinations />
      <HowItWorks />
      <ProductShowcase />
      <PortalCards />
      <TestimonialSection />
      <FAQSection />
    </Box>
  )
}
