import { Routes, Route } from 'react-router-dom'
import { PublicLayout } from './components/PublicLayout'
import { LandingPage } from './pages/LandingPage'
import { CountryListingPage } from './pages/CountryListingPage'
import { CountryDetailPage } from './pages/CountryDetailPage'
import { MarineCrewVisaPage } from './pages/MarineCrewVisaPage'
import { CorporateBusinessVisaPage } from './pages/CorporateBusinessVisaPage'
import { WebsiteApplicationFlowPage } from './pages/WebsiteApplicationFlowPage'
import { ComingSoonPage } from '@/shared/components/ComingSoonPage'

export function PublicWebsiteApp() {
  return (
    <Routes>
      <Route path="/apply/new" element={<WebsiteApplicationFlowPage />} />
      <Route
        path="/*"
        element={
          <PublicLayout>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/countries" element={<CountryListingPage />} />
              <Route path="/countries/:countryId" element={<CountryDetailPage />} />
              <Route path="/marine-crew" element={<MarineCrewVisaPage />} />
              <Route path="/corporate" element={<CorporateBusinessVisaPage />} />
              <Route
                path="/track"
                element={
                  <ComingSoonPage
                    title="Track Application"
                    returnLink={{ text: 'Open portal', href: '/retail/tracking' }}
                  />
                }
              />
              <Route path="/pricing" element={<ComingSoonPage title="Pricing" />} />
            </Routes>
          </PublicLayout>
        }
      />
    </Routes>
  )
}
