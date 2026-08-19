import { Routes, Route } from 'react-router-dom'
import { LazyRouteBoundary } from '@/shared/routing/lazyRoute'
import { PublicLayout } from './components/PublicLayout'
import { ComingSoonPage } from '@/shared/components/ComingSoonPage'
import {
  AboutPage,
  CorporateBusinessVisaPage,
  CountryDetailPage,
  CountryListingPage,
  LandingPage,
  MarineCrewVisaPage,
  RetailVisaServicesPage,
  ServicesPage,
  WebsiteApplicationFlowPage,
} from './websiteRoutePages'

export function PublicWebsiteApp() {
  return (
    <LazyRouteBoundary label="Loading page…">
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
                <Route path="/retail-visas" element={<RetailVisaServicesPage />} />
                <Route path="/marine-crew" element={<MarineCrewVisaPage />} />
                <Route path="/corporate" element={<CorporateBusinessVisaPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/about" element={<AboutPage />} />
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
    </LazyRouteBoundary>
  )
}
