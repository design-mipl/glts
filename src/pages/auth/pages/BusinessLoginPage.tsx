import { useNavigate } from 'react-router-dom'
import { SplitAuthLayout } from '../components/SplitAuthLayout'
import { LoginFormPanel } from '../components/LoginFormPanel'
import {
  BUSINESS_WORKSPACE_ID,
  contactNameFromEmail,
  inferCustomerType,
  inferUserRole,
  saveSession,
} from '@/shared/auth/session'

export function BusinessLoginPage() {
  const navigate = useNavigate()

  const handleLogin = (email: string, _password: string) => {
    const customerType = inferCustomerType(email)
    saveSession({
      portal: 'business',
      email,
      customerType,
      companyName: BUSINESS_WORKSPACE_ID,
      contactName: contactNameFromEmail(email),
      userRole: inferUserRole(email),
    })
    navigate('/business/app/dashboard', { replace: true })
  }

  return (
    <SplitAuthLayout
      variant="business"
      headline="Visa workflows built for global teams."
      subline="Corporate travel, marine crew, and B2B agents — one secure portal for applications, tracking, and compliance."
    >
      <LoginFormPanel
        portalTitle="Business Portal"
        portalSubtitle="Log in to manage applications and travelers."
        forgotHref="/sign-in/business/forgot-password"
        onLogin={handleLogin}
        showOtpHint
        defaultEmail="admin@glts.com"
        emailPlaceholder="you@glts.com"
      />
    </SplitAuthLayout>
  )
}
