import { Navigate, Route, Routes } from 'react-router-dom'
import { LazyRouteBoundary } from '@/shared/routing/lazyRoute'
import { PublicLayout } from './components/PublicLayout'
import { ComingSoonPage } from '@/shared/components/ComingSoonPage'
import {
  AboutPage,
  CorporateBusinessVisaPage,
  TravelAgentsPage,
  DesignSystemPage,
  EnquiryPage,
  ContactPage,
  BlogsPage,
  BlogArticlePage,
  CountryDetailPage,
  CountryListingPage,
  VisaGuidePage,
  LandingPage,
  LegalInformationPage,
  MarineCrewVisaPage,
  ServicesPage,
  VisaServicesPage,
  WebsiteApplicationFlowPage,
} from './websiteRoutePages'

/**
 * Public website (V2). Mounted at the site root; portal routes are handled separately.
 * Public page URLs are root-relative (for example, `/countries`).
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
                <Route path="visa-guide" element={<VisaGuidePage />} />
                <Route path="visa-guide/:countrySlug" element={<VisaGuidePage />} />
                <Route path="retail-visas" element={<Navigate to="/visa-services" replace />} />
                <Route path="marine-crew" element={<MarineCrewVisaPage />} />
                <Route path="corporate" element={<CorporateBusinessVisaPage />} />
                <Route path="travel-agents" element={<TravelAgentsPage />} />
                <Route path="services" element={<ServicesPage />} />
                <Route path="visa-services" element={<VisaServicesPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="enquiry" element={<EnquiryPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="blogs" element={<BlogsPage />} />
                <Route path="blogs/:slug" element={<BlogArticlePage />} />
                <Route path="design-system" element={<DesignSystemPage />} />
                <Route path="legal/terms" element={<LegalInformationPage />} />
                <Route path="legal/privacy" element={<LegalInformationPage />} />
                <Route path="legal/refund-cancellation" element={<LegalInformationPage />} />
                <Route path="legal/security" element={<LegalInformationPage />} />
                <Route path="legal/compliance" element={<LegalInformationPage />} />
                <Route path="legal/disclaimer" element={<LegalInformationPage />} />
                <Route path="legal/site-content-disclaimer" element={<LegalInformationPage />} />
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
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </PublicLayout>
          }
        />
      </Routes>
    </LazyRouteBoundary>
  )
}
