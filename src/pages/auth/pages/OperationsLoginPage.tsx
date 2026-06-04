import { SplitAuthLayout } from '../components/SplitAuthLayout'
import { LoginFormPanel } from '../components/LoginFormPanel'
import { saveSession } from '@/shared/auth/session'
import { useAppNavigate } from '@/shared/hooks/useAppNavigate'

export function OperationsLoginPage() {
  const navigate = useAppNavigate()

  const handleLogin = (email: string) => {
    saveSession({
      portal: 'operations',
      email,
    })
    navigate('/admin', { replace: true })
  }

  return (
    <SplitAuthLayout
      variant="operations"
      headline="Process faster. Ship on time."
      subline="Internal tools for document verification, embassy coordination, and application processing across all customer segments."
    >
      <LoginFormPanel
        portalTitle="GLTS Portal"
        portalSubtitle="Internal login for admin and operations teams."
        forgotHref="/sign-in/operations/forgot-password"
        onLogin={handleLogin}
      />
    </SplitAuthLayout>
  )
}
