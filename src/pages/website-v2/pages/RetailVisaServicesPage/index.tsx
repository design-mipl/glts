import { useMemo } from 'react'
import { Box } from '@mui/material'
import { usePublicBrandColors } from '../../theme/publicSiteTokens'
import { CommonDestinationsSection } from '../../components/CommonDestinationsSection'
import { resolveDestinationCountries } from '../../utils/resolveDestinationCountries'
import { RetailHero } from './components/RetailHero'
import { OurRetailServicesSection } from './components/OurRetailServicesSection'
import { RetailAdvantageSection } from './components/RetailAdvantageSection'
import { RetailFinalCtaSection } from './components/RetailFinalCtaSection'
import { retailDestinations } from './retailPageData'

export function RetailVisaServicesPage() {
  const colors = usePublicBrandColors()
  const retailDestinationCountries = useMemo(
    () => resolveDestinationCountries(retailDestinations),
    [],
  )

  return (
    <Box component="main" sx={{ bgcolor: colors.white }}>
      <RetailHero />

      <CommonDestinationsSection
        subtitle="Frequently requested retail visa destinations supported through GreenLight."
        countries={retailDestinationCountries}
      />

      <OurRetailServicesSection />
      <RetailAdvantageSection />
      <RetailFinalCtaSection />
    </Box>
  )
}
