import { Box } from '@mui/material'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { publicLayout, usePublicBrandColors } from '../../theme/publicSiteTokens'
import { RetailHero } from './components/RetailHero'
import { VisaServicesJourney } from './components/VisaServicesJourney'
import { OurRetailServicesSection } from './components/OurRetailServicesSection'
import { RetailAdvantageSection } from './components/RetailAdvantageSection'
import { VisaMasterSection } from '../LandingPage/components/VisaMasterSection'
import { SpecializedSolutionsSection } from '../LandingPage/components/SpecializedSolutionsSection'
import { RetailFinalCtaSection } from './components/RetailFinalCtaSection'
import { finalCtaSectionMb } from '../LandingPage/landingPageSpacing'
import './visaServicesPage.css'

export function VisaServicesPage() {
  const colors = usePublicBrandColors()
  const { hash } = useLocation()

  useEffect(() => {
    if (!hash) return

    const frame = requestAnimationFrame(() => {
      const target = document.getElementById(hash.slice(1))
      if (!target) return

      const top = target.getBoundingClientRect().top + window.scrollY - publicLayout.navHeight - 16
      window.scrollTo({ top: Math.max(0, top), behavior: 'auto' })
    })

    return () => cancelAnimationFrame(frame)
  }, [hash])

  return (
    <Box id="visa-services-page" sx={{ bgcolor: colors.white, pb: finalCtaSectionMb }}>
      <RetailHero />

      <VisaServicesJourney />
      <OurRetailServicesSection />
      <RetailAdvantageSection />
      <VisaMasterSection visaServices />
      <SpecializedSolutionsSection visaServices />
      <RetailFinalCtaSection />
    </Box>
  )
}
