import { Navigate, Route, Routes } from 'react-router-dom'
import { LazyRouteBoundary } from '@/shared/routing/lazyRoute'
import { PublicLayout } from './components/PublicLayout'
import { ComingSoonPage } from '@/shared/components/ComingSoonPage'
import ComponentPreviewPage from './pages/_preview/ComponentPreviewPage'
import {
  AboutPage,
  ApplicationTrackingPage,
  CorporateBusinessVisaPage,
  CountryDetailPage,
  CountryListingPage,
  LandingPage,
  MarineCrewVisaPage,
  ServicesPage,
  WebsiteApplicationFlowPage,
} from './websiteRoutePages'

/**
 * Main public website (website-v2). Mounted at `/*`.
 * In-site links use root paths (`/countries`, `/apply/new`, …) — see `siteBase.ts` / `w2()`.
 */
export function PublicWebsiteV2App() {
  return (
    <LazyRouteBoundary label="Loading page…">
      <Routes>
        <Route path="/apply/new" element={<WebsiteApplicationFlowPage />} />
        {/* Temporary — isolated sanity-check for new upload components. Safe to remove. */}
        <Route path="/_preview/uploads" element={<ComponentPreviewPage />} />
        <Route
          path="/*"
          element={
            <PublicLayout>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/countries" element={<CountryListingPage />} />
                <Route path="/countries/:countryId" element={<CountryDetailPage />} />
                <Route path="/retail-visas" element={<Navigate to="/" replace />} />
                <Route path="/marine-crew" element={<MarineCrewVisaPage />} />
                <Route path="/corporate" element={<CorporateBusinessVisaPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/track" element={<Navigate to="/track/GLTS-2026-0842" replace />} />
                <Route path="/track/:applicationId" element={<ApplicationTrackingPage />} />
                <Route path="/pricing" element={<ComingSoonPage title="Pricing" />} />
              </Routes>
            </PublicLayout>
          }
        />
      </Routes>
    </LazyRouteBoundary>
  )
}
