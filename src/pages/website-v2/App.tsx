import { Navigate, Route, Routes } from 'react-router-dom'
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
  ServicesPage,
  WebsiteApplicationFlowPage,
} from './websiteRoutePages'

/**
 * Alternate public website (Website 2). Mounted at `/v2/*` beside the current site.
 * In-site links must use `/v2/...` (see `siteBase.ts` / `w2()`).
 */
export function PublicWebsiteV2App() {
  return (
    <LazyRouteBoundary label="Loading page…">
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
    </LazyRouteBoundary>
  )
}
