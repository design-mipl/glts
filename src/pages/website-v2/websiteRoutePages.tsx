import { lazyNamed } from '@/shared/routing/lazyRoute'

export const LandingPage = lazyNamed(() => import('./pages/LandingPage'), 'LandingPage')
export const CountryListingPage = lazyNamed(
  () => import('./pages/CountryListingPage'),
  'CountryListingPage',
)
export const CountryDetailPage = lazyNamed(
  () => import('./pages/CountryDetailPage'),
  'CountryDetailPage',
)
export const VisaGuidePage = lazyNamed(() => import('./pages/VisaGuidePage'), 'VisaGuidePage')
export const MarineCrewVisaPage = lazyNamed(
  () => import('./pages/MarineCrewVisaPage'),
  'MarineCrewVisaPage',
)
export const CorporateBusinessVisaPage = lazyNamed(
  () => import('./pages/CorporateBusinessVisaPage'),
  'CorporateBusinessVisaPage',
)
export const TravelAgentsPage = lazyNamed(
  () => import('./pages/TravelAgentsPage'),
  'TravelAgentsPage',
)
export const AboutPage = lazyNamed(() => import('./pages/AboutPage'), 'AboutPage')
export const EnquiryPage = lazyNamed(() => import('./pages/EnquiryPage'), 'EnquiryPage')
export const ContactPage = lazyNamed(() => import('./pages/ContactPage'), 'ContactPage')
export const BlogsPage = lazyNamed(() => import('./pages/BlogsPage'), 'BlogsPage')
export const BlogArticlePage = lazyNamed(() => import('./pages/BlogsPage/BlogArticlePage'), 'BlogArticlePage')
export const ServicesPage = lazyNamed(() => import('./pages/ServicesPage'), 'ServicesPage')
export const VisaServicesPage = lazyNamed(
  () => import('./pages/RetailVisaServicesPage'),
  'VisaServicesPage',
)
export const DesignSystemPage = lazyNamed(() => import('./pages/DesignSystemPage'), 'DesignSystemPage')
export const WebsiteApplicationFlowPage = lazyNamed(
  () => import('./pages/WebsiteApplicationFlowPage'),
  'WebsiteApplicationFlowPage',
)
export const LegalInformationPage = lazyNamed(
  () => import('./pages/LegalInformationPage'),
  'LegalInformationPage',
)
