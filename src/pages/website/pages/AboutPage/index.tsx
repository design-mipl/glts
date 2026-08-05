import { Box } from '@mui/material'
import { AboutHero } from './components/AboutHero'
import { WhoWeAreSection } from './components/WhoWeAreSection'
import { WhyGreenLightSection } from './components/WhyGreenLightSection'
import { IndustriesWeServeSection } from './components/IndustriesWeServeSection'
import { AboutFinalCtaSection } from './components/AboutFinalCtaSection'
import { usePublicBrandColors } from '../../theme/publicSiteTokens'

export function AboutPage() {
  const colors = usePublicBrandColors()

  return (
    <Box component="main" sx={{ bgcolor: colors.white }}>
      <AboutHero />
      <WhoWeAreSection />
      <WhyGreenLightSection />
      <IndustriesWeServeSection />
      <AboutFinalCtaSection />
    </Box>
  )
}
