import { useState } from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Divider,
  InputAdornment,
  MenuItem,
} from '@mui/material'
import { Smartphone } from 'lucide-react'
import { GREENLIGHT_LOGO_SRC } from '@/components/brand/GreenlightLogo'
import { publicFonts, usePublicBrandColors } from '@/shared/theme/publicBrand'

const COUNTRY_CODES = [
  { code: '+91', label: 'IN +91' },
  { code: '+1', label: 'US +1' },
  { code: '+44', label: 'UK +44' },
  { code: '+971', label: 'AE +971' },
] as const

const DEMO_OTP = '123456'

export interface RetailLoginFormPanelProps {
  onPhoneVerified: (phone: string) => void
  onGoogleContinue: () => void
}

export function RetailLoginFormPanel({ onPhoneVerified, onGoogleContinue }: RetailLoginFormPanelProps) {
  const colors = usePublicBrandColors()
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [countryCode, setCountryCode] = useState('+91')
  const [phoneLocal, setPhoneLocal] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)

  const fullPhone = `${countryCode} ${phoneLocal.replace(/\s+/g, '')}`.trim()

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const digits = phoneLocal.replace(/\D/g, '')
    if (digits.length < 8) {
      setError('Enter a valid phone number.')
      return
    }
    setSending(true)
    window.setTimeout(() => {
      setSending(false)
      setStep('otp')
    }, 400)
  }

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (otp.trim() !== DEMO_OTP) {
      setError(`Invalid code. Use ${DEMO_OTP} for this prototype.`)
      return
    }
    onPhoneVerified(fullPhone)
  }

  return (
    <Box
      sx={{
        bgcolor: colors.white,
        borderRadius: '20px',
        p: { xs: 3, sm: 4 },
        boxShadow: '0 4px 24px rgba(15, 23, 42, 0.08)',
      }}
    >
      <Box
        component="img"
        src={GREENLIGHT_LOGO_SRC}
        alt="Greenlight"
        sx={{
          height: 40,
          width: 'auto',
          maxWidth: 140,
          objectFit: 'contain',
          borderRadius: '8px',
          display: 'block',
          mb: 3,
        }}
      />

      <Typography
        sx={{
          fontFamily: publicFonts.heading,
          fontWeight: 800,
          fontSize: '26px',
          color: colors.navy,
          mb: 0.5,
        }}
      >
        Retail Login
      </Typography>
      <Typography sx={{ fontSize: '14px', color: colors.textSecondary, mb: 3, lineHeight: 1.5 }}>
        Continue your visa journey — track applications and reuse saved documents.
      </Typography>

      {step === 'phone' ? (
        <Box component="form" onSubmit={handleSendOtp}>
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: colors.navy, mb: 0.75 }}>
            Phone number
          </Typography>
          <Typography sx={{ fontSize: 12, color: colors.textSecondary, mb: 1.5 }}>
            We&apos;ll send a one-time code to verify it&apos;s you.
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <TextField
              select
              size="small"
              value={countryCode}
              onChange={e => setCountryCode(e.target.value)}
              sx={{ width: 120 }}
            >
              {COUNTRY_CODES.map(c => (
                <MenuItem key={c.code} value={c.code}>
                  {c.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              size="small"
              fullWidth
              placeholder="98765 43210"
              value={phoneLocal}
              onChange={e => setPhoneLocal(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Smartphone size={16} color={colors.textMuted} />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
          {error ? (
            <Typography sx={{ fontSize: 12, color: 'error.main', mb: 1.5 }}>{error}</Typography>
          ) : null}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={sending}
            sx={{
              height: 40,
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 700,
              fontSize: 13,
              bgcolor: colors.navy,
              '&:hover': { bgcolor: colors.navyLight },
            }}
          >
            {sending ? 'Sending…' : 'Receive OTP'}
          </Button>
        </Box>
      ) : (
        <Box component="form" onSubmit={handleVerifyOtp}>
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: colors.navy, mb: 0.75 }}>
            Enter OTP
          </Typography>
          <Typography sx={{ fontSize: 12, color: colors.textSecondary, mb: 1.5 }}>
            Code sent to {fullPhone}. Prototype code: {DEMO_OTP}
          </Typography>
          <TextField
            size="small"
            fullWidth
            placeholder="6-digit code"
            value={otp}
            onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            inputProps={{ inputMode: 'numeric', autoComplete: 'one-time-code' }}
            sx={{ mb: 2 }}
          />
          {error ? (
            <Typography sx={{ fontSize: 12, color: 'error.main', mb: 1.5 }}>{error}</Typography>
          ) : null}
          <Stack spacing={1}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                height: 40,
                borderRadius: '10px',
                textTransform: 'none',
                fontWeight: 700,
                fontSize: 13,
                bgcolor: colors.navy,
                '&:hover': { bgcolor: colors.navyLight },
              }}
            >
              Verify & continue
            </Button>
            <Button
              type="button"
              fullWidth
              variant="text"
              onClick={() => {
                setStep('phone')
                setOtp('')
                setError('')
              }}
              sx={{ textTransform: 'none', fontSize: 13, fontWeight: 600, color: colors.textSecondary }}
            >
              Change phone number
            </Button>
          </Stack>
        </Box>
      )}

      <Divider sx={{ my: 2.5 }}>
        <Typography sx={{ fontSize: 12, color: colors.textMuted, fontWeight: 600 }}>OR</Typography>
      </Divider>

      <Button
        fullWidth
        variant="outlined"
        onClick={onGoogleContinue}
        sx={{
          height: 40,
          borderRadius: '10px',
          textTransform: 'none',
          fontWeight: 600,
          fontSize: 13,
          borderColor: colors.border,
          color: colors.navy,
          bgcolor: colors.white,
          '&:hover': { borderColor: colors.navy, bgcolor: colors.surface },
        }}
        startIcon={
          <Box
            component="span"
            sx={{
              width: 18,
              height: 18,
              borderRadius: '4px',
              bgcolor: '#fff',
              border: '1px solid #dadce0',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 700,
              color: '#4285F4',
              fontFamily: 'Arial, sans-serif',
            }}
          >
            G
          </Box>
        }
      >
        Continue with Google
      </Button>
    </Box>
  )
}
