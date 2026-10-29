import { useNavigate } from 'react-router-dom'
import { SplitAuthLayout } from '../components/SplitAuthLayout'
import { RetailLoginFormPanel } from '../components/RetailLoginFormPanel'
import { saveSession } from '@/shared/auth/session'

export function RetailLoginPage() {
  const navigate = useNavigate()

  const finishLogin = (opts: { email: string; phone?: string; contactName: string; authMethod: 'phone_otp' | 'google' }) => {
    saveSession({
      portal: 'retail',
      email: opts.email,
      phone: opts.phone,
      contactName: opts.contactName,
      authMethod: opts.authMethod,
      userRole: 'booker',
    })
    navigate('/retail/account', { replace: true })
  }

  return (
    <SplitAuthLayout
      variant="business"
      headline="Welcome back"
      subline="Sign in to track visas, reuse your documents, and continue applications where you left off."
    >
      <RetailLoginFormPanel
        onPhoneVerified={phone =>
          finishLogin({
            email: `traveller${phone.replace(/\D/g, '').slice(-4)}@glts.customer`,
            phone,
            contactName: 'Retail Traveller',
            authMethod: 'phone_otp',
          })
        }
        onGoogleContinue={() =>
          finishLogin({
            email: 'traveller.google@glts.customer',
            phone: undefined,
            contactName: 'Google Traveller',
            authMethod: 'google',
          })
        }
      />
    </SplitAuthLayout>
  )
}
