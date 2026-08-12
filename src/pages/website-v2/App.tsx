import { Routes, Route, Navigate } from 'react-router-dom'
import { PublicLayout } from './components/PublicLayout'
import { LandingPage } from './pages/LandingPage'
import { CountryListingPage } from './pages/CountryListingPage'
import { CountryDetailPage } from './pages/CountryDetailPage'
import { MarineCrewVisaPage } from './pages/MarineCrewVisaPage'
import { CorporateBusinessVisaPage } from './pages/CorporateBusinessVisaPage'
import { AboutPage } from './pages/AboutPage'
import { ServicesPage } from './pages/ServicesPage'
import { WebsiteApplicationFlowPage } from './pages/WebsiteApplicationFlowPage'
import { ComingSoonPage } from '@/shared/components/ComingSoonPage'

/**
 * Alternate public website (Website 2). Mounted at `/v2/*` beside the current site.
 * In-site links must use `/v2/...` (see `siteBase.ts` / `w2()`).
 */
export function PublicWebsiteV2App() {
  return (
    <Routes>
      <Route path="apply/new" element={<WebsiteApplicationFlowPage />} />
      <Route
        path="*"
        element={
          <PublicLayout>
            <Routes>
              <Route index element={<LandingPage />} />
              <Route path="countries" element={<CountryListingPage />} />
              <Route path="countries/:countryId" element={<CountryDetailPage />} />
              <Route path="retail-visas" element={<Navigate to="/v2" replace />} />
              <Route path="marine-crew" element={<MarineCrewVisaPage />} />
              <Route path="corporate" element={<CorporateBusinessVisaPage />} />
              <Route path="services" element={<ServicesPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route
                path="track"
                element={
                  <ComingSoonPage
                    title="Track Application"
                    returnLink={{ text: 'Open portal', href: '/retail/tracking' }}
                  />
                }
              />
              <Route path="pricing" element={<ComingSoonPage title="Pricing" />} />
            </Routes>
          </PublicLayout>
        }
      />
    </Routes>
  )
}
