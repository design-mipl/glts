import { useCallback } from 'react'
import { Box } from '@mui/material'
import { useSearchParams } from 'react-router-dom'
import { usePublicBrandColors } from '../../theme/publicSiteTokens'
import { ExtraServiceProcessSection } from './components/ExtraServiceProcessSection'
import { ExtraServiceRequestSection } from './components/ExtraServiceRequestSection'
import { ExtraServicesHero } from './components/ExtraServicesHero'
import { resolveExtraServiceId, type ExtraServiceId } from './extraServicesPageData'

/**
 * Extra Services — attestation, notary, travel insurance.
 *
 * One selected service drives the whole page (tabs, detail panel, and the form's Service
 * field), and it lives in the URL so a link can open the page pre-set to one service.
 * `?service=` is the single source of truth; nothing below keeps a second copy of it.
 */
export function ExtraServicesPage() {
  const colors = usePublicBrandColors()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeServiceId = resolveExtraServiceId(searchParams.get('service'))

  const handleSelectService = useCallback(
    (service: ExtraServiceId) => {
      const next = new URLSearchParams(searchParams)
      next.set('service', service)
      setSearchParams(next, { replace: true })
    },
    [searchParams, setSearchParams],
  )

  return (
    <Box component="main" sx={{ bgcolor: colors.white }}>
      <ExtraServicesHero />
      <ExtraServiceRequestSection
        activeServiceId={activeServiceId}
        onSelectService={handleSelectService}
      />
      <ExtraServiceProcessSection />
    </Box>
  )
}
