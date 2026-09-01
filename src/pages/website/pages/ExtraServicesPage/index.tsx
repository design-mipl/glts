import { Box } from '@mui/material'
import { useSearchParams } from 'react-router-dom'
import { usePublicBrandColors } from '../../theme/publicSiteTokens'
import { ExtraServiceRequestSection } from './components/ExtraServiceRequestSection'
import { ExtraServicesCapabilitySection } from './components/ExtraServicesCapabilitySection'
import { extraServices, resolveExtraServiceId } from './extraServicesPageData'

export function ExtraServicesPage() {
  const colors = usePublicBrandColors()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeServiceId = resolveExtraServiceId(searchParams.get('service'))

  const handleSelectService = (index: number) => {
    const service = extraServices[index]?.id
    if (!service) return
    setSearchParams({ service }, { replace: true })
    document.getElementById('extra-service-request')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <Box component="main" sx={{ bgcolor: colors.white }}>
      <ExtraServiceRequestSection />
      <ExtraServicesCapabilitySection
        activeServiceId={activeServiceId}
        onSelectService={handleSelectService}
      />
    </Box>
  )
}
