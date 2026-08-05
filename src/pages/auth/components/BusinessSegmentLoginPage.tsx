import { useNavigate } from 'react-router-dom'
import { SplitAuthLayout } from '../components/SplitAuthLayout'
import { LoginFormPanel } from '../components/LoginFormPanel'
import { businessAppBase } from '@/shared/auth/customerSegment'
import {
  BUSINESS_WORKSPACE_ID,
  contactNameFromEmail,
  inferUserRole,
  saveSession,
  type CustomerType,
} from '@/shared/auth/session'

export interface BusinessSegmentLoginCopy {
  portalTitle: string
  portalSubtitle: string
  headline: string
  subline: string
  defaultEmail: string
  emailPlaceholder?: string
  forgotHref: string
}

interface BusinessSegmentLoginPageProps {
  customerType: CustomerType
  copy: BusinessSegmentLoginCopy
}

export function BusinessSegmentLoginPage({ customerType, copy }: BusinessSegmentLoginPageProps) {
  const navigate = useNavigate()

  const handleLogin = (email: string, _password: string) => {
    saveSession({
      portal: 'business',
      email,
      customerType,
      companyName: BUSINESS_WORKSPACE_ID,
      contactName: contactNameFromEmail(email),
      userRole: inferUserRole(email),
    })
    navigate(`${businessAppBase(customerType)}/dashboard`, { replace: true })
  }

  return (
    <SplitAuthLayout variant="business" headline={copy.headline} subline={copy.subline}>
      <LoginFormPanel
        portalTitle={copy.portalTitle}
        portalSubtitle={copy.portalSubtitle}
        forgotHref={copy.forgotHref}
        onLogin={handleLogin}
        showOtpHint
        defaultEmail={copy.defaultEmail}
        emailPlaceholder={copy.emailPlaceholder ?? 'you@glts.com'}
      />
    </SplitAuthLayout>
  )
}
