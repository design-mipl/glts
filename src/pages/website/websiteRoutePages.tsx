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
export const MarineCrewVisaPage = lazyNamed(
  () => import('./pages/MarineCrewVisaPage'),
  'MarineCrewVisaPage',
)
export const CorporateBusinessVisaPage = lazyNamed(
  () => import('./pages/CorporateBusinessVisaPage'),
  'CorporateBusinessVisaPage',
)
export const AboutPage = lazyNamed(() => import('./pages/AboutPage'), 'AboutPage')
export const ServicesPage = lazyNamed(() => import('./pages/ServicesPage'), 'ServicesPage')
export const ExtraServicesPage = lazyNamed(
  () => import('./pages/ExtraServicesPage'),
  'ExtraServicesPage',
)
export const WebsiteApplicationFlowPage = lazyNamed(
  () => import('./pages/WebsiteApplicationFlowPage'),
  'WebsiteApplicationFlowPage',
)
export const ApplicationTrackingPage = lazyNamed(
  () => import('./pages/ApplicationTrackingPage'),
  'ApplicationTrackingPage',
)
