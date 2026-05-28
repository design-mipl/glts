import { useState } from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  IconButton,
  InputAdornment,
} from '@mui/material'
import { ArrowLeft, Eye, EyeOff, CheckCircle } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { SplitAuthLayout } from '../components/SplitAuthLayout'
import { publicFonts, usePublicBrandColors } from '@/shared/theme/publicBrand'

type Step = 'request' | 'verify' | 'reset' | 'success'

export function ForgotPasswordPage() {
  const colors = usePublicBrandColors()
  const location = useLocation()
  const isOps = location.pathname.includes('/operations/')
  const navigate = useNavigate()
  const loginPath = isOps ? '/sign-in/operations' : '/sign-in/business'

  const [step, setStep] = useState<Step>('request')
  const [contact, setContact] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNew, setShowNew] = useState(false)

  const variant = isOps ? 'operations' : 'business'
  const portalLabel = isOps ? 'GLTS Portal' : 'Business Portal'

  const handleSendOtp = () => {
    if (!contact.trim()) return
    setStep('verify')
  }

  const handleVerify = () => {
    if (otp.length < 4) return
    setStep('reset')
  }

  const handleReset = () => {
    if (newPassword !== confirmPassword || newPassword.length < 6) return
    setStep('success')
  }

  const formCard = (
    <Box
      sx={{
        bgcolor: colors.white,
        borderRadius: '20px',
        p: { xs: 3, sm: 4 },
        boxShadow: '0 4px 24px rgba(15, 23, 42, 0.08)',
      }}
    >
      <Button
        startIcon={<ArrowLeft size={16} />}
        onClick={() => (step === 'request' ? navigate(loginPath) : setStep('request'))}
        sx={{
          mb: 2,
          textTransform: 'none',
          color: colors.textSecondary,
          fontSize: '13px',
          fontWeight: 600,
          p: 0,
          minWidth: 0,
        }}
      >
        {step === 'request' ? 'Back to login' : 'Back'}
      </Button>

      {step === 'success' ? (
        <Stack alignItems="center" spacing={2} sx={{ py: 2 }}>
          <CheckCircle size={48} color={colors.greenBright} />
          <Typography sx={{ fontFamily: publicFonts.heading, fontWeight: 800, fontSize: '22px', color: colors.navy }}>
            Password updated
          </Typography>
          <Typography sx={{ fontSize: '14px', color: colors.textSecondary, textAlign: 'center' }}>
            Your password has been reset. You can sign in with your new credentials.
          </Typography>
          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate(loginPath)}
            sx={{
              mt: 1,
              borderRadius: '10px',
              bgcolor: colors.navy,
              textTransform: 'none',
              fontWeight: 700,
            }}
          >
            Go to login
          </Button>
        </Stack>
      ) : (
        <>
          <Typography sx={{ fontFamily: publicFonts.heading, fontWeight: 800, fontSize: '24px', color: colors.navy, mb: 0.5 }}>
            Reset password
          </Typography>
          <Typography sx={{ fontSize: '13px', color: colors.greenBright, fontWeight: 700, mb: 0.5 }}>
            {portalLabel}
          </Typography>
          <Typography sx={{ fontSize: '14px', color: colors.textSecondary, mb: 3 }}>
            {step === 'request' && 'Enter your email or mobile to receive a one-time code.'}
            {step === 'verify' && 'Enter the OTP sent to your registered contact.'}
            {step === 'reset' && 'Choose a new password for your account.'}
          </Typography>

          <Stack spacing={2}>
            {(step === 'request' || step === 'verify') && (
              <TextField
                label="Email or mobile"
                value={contact}
                onChange={e => setContact(e.target.value)}
                disabled={step !== 'request'}
                fullWidth
                size="small"
              />
            )}
            {(step === 'verify' || step === 'reset') && step !== 'reset' && (
              <TextField
                label="OTP"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                fullWidth
                size="small"
                placeholder="6-digit code"
              />
            )}
            {step === 'reset' && (
              <>
                <TextField
                  label="New password"
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  fullWidth
                  size="small"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setShowNew(v => !v)}>
                          {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Confirm password"
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  fullWidth
                  size="small"
                />
              </>
            )}

            {step === 'request' && (
              <Button
                variant="contained"
                fullWidth
                onClick={handleSendOtp}
                sx={{ borderRadius: '10px', bgcolor: colors.navy, textTransform: 'none', fontWeight: 700 }}
              >
                Send OTP
              </Button>
            )}
            {step === 'verify' && (
              <Button
                variant="contained"
                fullWidth
                onClick={handleVerify}
                sx={{ borderRadius: '10px', bgcolor: colors.navy, textTransform: 'none', fontWeight: 700 }}
              >
                Verify
              </Button>
            )}
            {step === 'reset' && (
              <Button
                variant="contained"
                fullWidth
                onClick={handleReset}
                sx={{ borderRadius: '10px', bgcolor: colors.navy, textTransform: 'none', fontWeight: 700 }}
              >
                Reset password
              </Button>
            )}
          </Stack>
        </>
      )}
    </Box>
  )

  return (
    <SplitAuthLayout
      variant={variant}
      headline="Account recovery"
      subline="Secure password reset with OTP verification for your workspace."
    >
      {formCard}
    </SplitAuthLayout>
  )
}
