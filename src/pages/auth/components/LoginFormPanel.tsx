import { useState } from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
} from '@mui/material'
import { Eye, EyeOff } from 'lucide-react'
import { publicFonts, usePublicBrandColors } from '@/shared/theme/publicBrand'

interface LoginFormPanelProps {
  portalTitle: string
  portalSubtitle: string
  forgotHref: string
  onLogin: (email: string, password: string) => void
  showOtpHint?: boolean
  defaultEmail?: string
  emailPlaceholder?: string
}

export function LoginFormPanel({
  portalTitle,
  portalSubtitle,
  forgotHref,
  onLogin,
  showOtpHint,
  defaultEmail = '',
  emailPlaceholder = 'you@company.com',
}: LoginFormPanelProps) {
  const colors = usePublicBrandColors()
  const [email, setEmail] = useState(defaultEmail)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onLogin(email, password)
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        bgcolor: colors.white,
        borderRadius: '20px',
        p: { xs: 3, sm: 4 },
        boxShadow: '0 4px 24px rgba(15, 23, 42, 0.08)',
      }}
    >
      <Box
        component="img"
        src="/greenlight_logo.jpg"
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
        Welcome back!
      </Typography>
      <Typography sx={{ fontSize: '14px', color: colors.textSecondary, mb: 0.5 }}>
        {portalSubtitle}
      </Typography>
      <Typography
        sx={{
          fontSize: '13px',
          fontWeight: 700,
          color: colors.greenBright,
          mb: 3,
        }}
      >
        {portalTitle}
      </Typography>

      <Stack spacing={2}>
        <Box>
          <Typography sx={{ fontSize: '13px', fontWeight: 700, color: colors.navy, mb: 0.75 }}>
            Email
          </Typography>
          <TextField
            type="email"
            placeholder={emailPlaceholder}
            value={email}
            onChange={e => setEmail(e.target.value)}
            fullWidth
            required
            size="small"
            sx={{ '& .MuiOutlinedInput-root': { bgcolor: colors.surface } }}
          />
        </Box>

        <Box>
          <Typography sx={{ fontSize: '13px', fontWeight: 700, color: colors.navy, mb: 0.75 }}>
            Password
          </Typography>
          <TextField
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            fullWidth
            required
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={() => setShowPassword(v => !v)}
                    aria-label="Toggle password"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ '& .MuiOutlinedInput-root': { bgcolor: colors.surface } }}
          />
        </Box>

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                sx={{ color: colors.greenBright, '&.Mui-checked': { color: colors.greenBright } }}
              />
            }
            label={<Typography sx={{ fontSize: '13px' }}>Remember me</Typography>}
          />
          <Button
            component="a"
            href={forgotHref}
            sx={{
              textTransform: 'none',
              fontSize: '13px',
              fontWeight: 600,
              color: colors.greenBright,
              minWidth: 0,
              p: 0,
            }}
          >
            Forgot password?
          </Button>
        </Stack>

        {showOtpHint && (
          <Typography sx={{ fontSize: '12px', color: colors.textMuted }}>
            OTP verification may be required for high-security accounts.
          </Typography>
        )}

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            py: 1.35,
            borderRadius: '10px',
            bgcolor: colors.navy,
            fontWeight: 700,
            fontSize: '15px',
            textTransform: 'none',
            '&:hover': { bgcolor: colors.navyLight },
          }}
        >
          Login
        </Button>

        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box sx={{ flex: 1, height: 1, bgcolor: colors.border }} />
          <Typography sx={{ fontSize: '12px', color: colors.textMuted }}>Or continue with</Typography>
          <Box sx={{ flex: 1, height: 1, bgcolor: colors.border }} />
        </Stack>

        <Button
          variant="outlined"
          fullWidth
          sx={{
            py: 1.2,
            borderRadius: '10px',
            borderColor: colors.border,
            color: colors.navy,
            fontWeight: 600,
            fontSize: '14px',
            textTransform: 'none',
          }}
        >
          SSO · Single sign-on
        </Button>

        <Button
          variant="text"
          sx={{ textTransform: 'none', fontSize: '13px', color: colors.textSecondary }}
        >
          Contact support
        </Button>
      </Stack>

      <Typography sx={{ fontSize: '11px', color: colors.textMuted, textAlign: 'center', mt: 3, lineHeight: 1.5 }}>
        <Link href="/pricing" sx={{ color: colors.textMuted }}>Terms</Link>
        {' · '}
        <Link href="/track" sx={{ color: colors.textMuted }}>Privacy</Link>
        {' · '}
        <Link href="#" sx={{ color: colors.textMuted }}>Help</Link>
      </Typography>
    </Box>
  )
}
