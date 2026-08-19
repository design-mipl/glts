import { lazyNamed } from '@/shared/routing/lazyRoute'

export const PortalSelectionPage = lazyNamed(
  () => import('./pages/PortalSelectionPage'),
  'PortalSelectionPage',
)
export const BusinessLoginHubPage = lazyNamed(
  () => import('./pages/BusinessLoginHubPage'),
  'BusinessLoginHubPage',
)
export const MarineLoginPage = lazyNamed(() => import('./pages/MarineLoginPage'), 'MarineLoginPage')
export const CorporateLoginPage = lazyNamed(
  () => import('./pages/CorporateLoginPage'),
  'CorporateLoginPage',
)
export const B2bAgentLoginPage = lazyNamed(
  () => import('./pages/B2bAgentLoginPage'),
  'B2bAgentLoginPage',
)
export const OperationsLoginPage = lazyNamed(
  () => import('./pages/OperationsLoginPage'),
  'OperationsLoginPage',
)
export const ForgotPasswordPage = lazyNamed(
  () => import('./pages/ForgotPasswordPage'),
  'ForgotPasswordPage',
)
