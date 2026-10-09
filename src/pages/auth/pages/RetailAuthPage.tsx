import { useState, type ChangeEventHandler, type FormEvent, type ReactNode } from 'react'
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material'
import { ArrowLeft, ArrowRight, Bell, Eye, EyeOff, FileCheck2, FolderOpen, LockKeyhole, Mail, ShieldCheck } from 'lucide-react'
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import { GREENLIGHT_LOGO_SRC } from '@/components/brand/GreenlightLogo'
import { publicFonts, publicLightColors as colors } from '@/shared/theme/publicBrand'
import { websiteDesignSystem as ds } from '@/pages/website-v2/theme/websiteDesignSystem'
import { websiteHeadingSx } from '@/pages/website-v2/theme/websiteComponentStyles'
import { WEBSITE_APPLICATION_FLOW_STORAGE_KEY } from '@/pages/customer/features/applications/context/ApplicationFlowPolicyContext'

type SignInField = 'identifier' | 'password'
type CreateField = 'name' | 'email' | 'mobile' | 'password' | 'confirmPassword' | 'consent'
type SignInValues = Record<SignInField, string>
type CreateValues = Record<Exclude<CreateField, 'consent'>, string> & { consent: boolean }

/** Supply these actions when retail account endpoints and guest-draft claiming are available. */
export interface RetailAuthActions {
  signIn: (values: SignInValues) => Promise<void>
  createAccount: (values: CreateValues) => Promise<void>
  claimGuestApplication: (draft: string) => Promise<void>
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const mobilePattern = /^[+\d\s()-]+$/

function validMobile(value: string) {
  const digits = value.replace(/\D/g, '')
  return mobilePattern.test(value) && digits.length >= 7 && digits.length <= 15
}

function validateSignIn(values: SignInValues): Partial<Record<SignInField, string>> {
  const errors: Partial<Record<SignInField, string>> = {}
  const identifier = values.identifier.trim()
  if (!identifier) errors.identifier = 'Enter your email address or mobile number.'
  else if (!emailPattern.test(identifier) && !validMobile(identifier)) errors.identifier = 'Enter a valid email address or mobile number.'
  if (!values.password) errors.password = 'Enter your password.'
  return errors
}

function validateCreate(values: CreateValues): Partial<Record<CreateField, string>> {
  const errors: Partial<Record<CreateField, string>> = {}
  if (values.name.trim().length < 2) errors.name = 'Enter your full name.'
  if (!emailPattern.test(values.email.trim())) errors.email = 'Enter a valid email address.'
  if (!validMobile(values.mobile.trim())) errors.mobile = 'Enter a valid mobile number.'
  if (values.password.length < 8) errors.password = 'Use at least 8 characters.'
  if (!values.confirmPassword) errors.confirmPassword = 'Confirm your password.'
  else if (values.confirmPassword !== values.password) errors.confirmPassword = 'Passwords do not match.'
  if (!values.consent) errors.consent = 'Please agree to continue.'
  return errors
}

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    minHeight: ds.component.field.auth.minHeight,
    borderRadius: `${ds.component.field.auth.radius}px`,
    bgcolor: colors.white,
    fontFamily: publicFonts.body,
    fontSize: ds.component.field.auth.fontSize,
    '& fieldset': { borderColor: colors.border },
    '&:hover fieldset': { borderColor: colors.greenDark },
    '&.Mui-focused fieldset': { borderColor: colors.greenDark, borderWidth: 2 },
  },
  '& .MuiFormHelperText-root': { mx: 0, mt: 0.65, fontSize: ds.component.field.auth.helperFontSize },
}

interface AuthFieldProps {
  id: string
  label: string
  placeholder: string
  value: string
  onChange: ChangeEventHandler<HTMLInputElement>
  autoComplete: string
  error?: string
  type?: string
  inputMode?: 'email' | 'tel' | 'text'
  icon?: ReactNode
  endAdornment?: ReactNode
}

function AuthField({ id, label, placeholder, value, onChange, autoComplete, error, type = 'text', inputMode, icon, endAdornment }: AuthFieldProps) {
  return (
    <Box>
      <Typography component="label" htmlFor={id} sx={{ display: 'block', mb: 0.75, fontFamily: publicFonts.body, color: colors.navy, fontSize: 13, fontWeight: 700 }}>
        {label}
      </Typography>
      <TextField
        id={id}
        fullWidth
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        error={Boolean(error)}
        helperText={error}
        slotProps={{
          htmlInput: { autoComplete, inputMode, 'aria-invalid': Boolean(error) },
          input: {
            startAdornment: icon ? <InputAdornment position="start" sx={{ color: colors.textSecondary }}>{icon}</InputAdornment> : undefined,
            endAdornment: endAdornment ? <InputAdornment position="end">{endAdornment}</InputAdornment> : undefined,
          },
        }}
        sx={fieldSx}
      />
    </Box>
  )
}

function PasswordField({ id, label, placeholder, value, onChange, autoComplete, error }: Omit<AuthFieldProps, 'type' | 'icon' | 'endAdornment'>) {
  const [shown, setShown] = useState(false)
  return (
    <AuthField
      id={id}
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
      error={error}
      type={shown ? 'text' : 'password'}
      icon={<LockKeyhole size={18} aria-hidden="true" />}
      endAdornment={
        <IconButton
          type="button"
          aria-label={shown ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          aria-pressed={shown}
          onClick={() => setShown((current) => !current)}
          onMouseDown={(event) => event.preventDefault()}
          edge="end"
          sx={{ color: colors.textSecondary, width: 42, height: 42, '&:focus-visible': { outline: `2px solid ${colors.greenDark}`, outlineOffset: 2 } }}
        >
          {shown ? <EyeOff size={19} /> : <Eye size={19} />}
        </IconButton>
      }
    />
  )
}

const benefits = [
  { icon: FileCheck2, title: 'Track your applications', description: 'Real-time status updates.' },
  { icon: FolderOpen, title: 'Manage your documents', description: 'Keep everything organized.' },
  { icon: Bell, title: 'Get expert support', description: 'Dedicated assistance at every step.' },
] as const

function TravelPanel() {
  return (
    <Box
      component="aside"
      aria-label="GreenLight travel services"
      sx={{
        display: 'none',
        position: 'relative',
        minWidth: 0,
        minHeight: '100dvh',
        overflow: 'hidden',
        '@media (min-width: 820px)': { display: 'flex', flexDirection: 'column' },
      }}
    >
      <Box component="img" src="/images/retail-visa-hero.png" alt="" aria-hidden="true" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '60% center' }} />
      <Box aria-hidden="true" sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.88) 35%, rgba(255,255,255,0.44) 58%, rgba(255,255,255,0.04) 100%)' }} />
      <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: 1, px: { xs: 4, desktop: 6 }, py: { xs: 3, desktop: 4 } }}>
        <Box component={RouterLink} to="/" aria-label="GreenLight Travel Solutions, home" sx={{ display: 'inline-flex', alignSelf: 'flex-start', borderRadius: 1, '&:focus-visible': { outline: `3px solid ${colors.greenDark}`, outlineOffset: 4 } }}>
          <Box component="img" src={GREENLIGHT_LOGO_SRC} alt="" sx={{ width: 166, maxWidth: '100%', height: 'auto', display: 'block' }} />
        </Box>
        <Box sx={{ mt: { xs: 7, desktop: 9 }, maxWidth: 360 }}>
          <Typography component="h1" sx={{ ...websiteHeadingSx.authTitle, color: colors.navy }}>
            Your Visa Journey,<br />Simpler.
          </Typography>
          <Box aria-hidden="true" sx={{ width: 48, height: 4, borderRadius: 4, bgcolor: colors.greenDark, my: 2.5 }} />
          <Typography sx={{ fontFamily: publicFonts.body, color: colors.navyMid, fontSize: { xs: 14, desktop: 16 }, lineHeight: 1.6, maxWidth: 315 }}>
            Manage your applications, track progress, access your documents, and get expert support — all in one place.
          </Typography>
          <Box sx={{ display: 'grid', gap: { xs: 2, desktop: 2.5 }, mt: { xs: 4, desktop: 5 } }}>
            {benefits.map(({ icon: Icon, title, description }) => (
              <Box key={title} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ width: 44, height: 44, display: 'grid', placeItems: 'center', flexShrink: 0, borderRadius: '50%', bgcolor: 'rgba(115, 194, 101, 0.14)', color: colors.greenDark }}>
                  <Icon size={21} strokeWidth={1.9} aria-hidden="true" />
                </Box>
                <Box>
                  <Typography sx={{ fontFamily: publicFonts.body, fontSize: 13, fontWeight: 700, color: colors.navy }}>{title}</Typography>
                  <Typography sx={{ fontFamily: publicFonts.body, fontSize: 12, lineHeight: 1.45, color: colors.navyMid }}>{description}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
        <Paper elevation={0} sx={{ mt: 'auto', alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 1.5, maxWidth: 295, px: 2, py: 1.5, border: `1px solid ${colors.border}`, borderRadius: '14px', bgcolor: 'rgba(255,255,255,0.94)', boxShadow: '0 10px 28px rgba(0,31,63,0.09)' }}>
          <ShieldCheck size={28} color={colors.greenDark} aria-hidden="true" />
          <Box>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: colors.navy }}>Trusted by travellers</Typography>
            <Typography sx={{ fontSize: 11, color: colors.textSecondary }}>Secure. Compliant. Reliable.</Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}

const submitButtonSx = {
  minHeight: ds.component.button.auth.minHeight,
  borderRadius: `${ds.component.button.auth.radius}px`,
  bgcolor: colors.greenDark,
  color: colors.navy,
  fontFamily: publicFonts.body,
  fontSize: ds.component.button.auth.fontSize,
  fontWeight: ds.component.button.auth.fontWeight,
  textTransform: 'none',
  boxShadow: 'none',
  '&:hover': { bgcolor: '#477F3D', color: colors.white, boxShadow: '0 8px 20px rgba(0,31,63,0.12)' },
  '&:focus-visible': { outline: `3px solid ${colors.navy}`, outlineOffset: 3 },
}

function authErrorMessage(error: unknown) {
  return error instanceof Error && error.message ? error.message : 'We could not complete your request. Please try again.'
}

export function RetailAuthPage({ authActions }: { authActions?: RetailAuthActions }) {
  const location = useLocation()
  const navigate = useNavigate()
  const isCreateAccount = location.pathname === '/sign-up'
  const [signIn, setSignIn] = useState<SignInValues>({ identifier: '', password: '' })
  const [create, setCreate] = useState<CreateValues>({ name: '', email: '', mobile: '', password: '', confirmPassword: '', consent: false })
  const [signInErrors, setSignInErrors] = useState<Partial<Record<SignInField, string>>>({})
  const [createErrors, setCreateErrors] = useState<Partial<Record<CreateField, string>>>({})
  const [submitError, setSubmitError] = useState('')
  const [recoveryNotice, setRecoveryNotice] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const updateSignIn = (field: SignInField, value: string) => {
    setSignIn((current) => ({ ...current, [field]: value }))
    setSignInErrors((current) => ({ ...current, [field]: undefined }))
    setSubmitError('')
  }

  const updateCreate = (field: CreateField, value: string | boolean) => {
    setCreate((current) => ({ ...current, [field]: value }))
    setCreateErrors((current) => ({ ...current, [field]: undefined }))
    setSubmitError('')
  }

  const handleSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const errors = validateSignIn(signIn)
    setSignInErrors(errors)
    if (Object.keys(errors).length) return
    if (!authActions) {
      setSubmitError('Online account sign-in is not available yet. Please contact GreenLight support.')
      return
    }
    setSubmitting(true)
    setSubmitError('')
    try {
      await authActions.signIn({ identifier: signIn.identifier.trim(), password: signIn.password })
      const guestDraft = localStorage.getItem(WEBSITE_APPLICATION_FLOW_STORAGE_KEY)
      if (guestDraft) await authActions.claimGuestApplication(guestDraft)
      navigate(guestDraft ? '/apply/new' : '/retail/dashboard')
    } catch (error) {
      setSubmitError(authErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const errors = validateCreate(create)
    setCreateErrors(errors)
    if (Object.keys(errors).length) return
    if (!authActions) {
      setSubmitError('Online account creation is not available yet. Please contact GreenLight support.')
      return
    }
    setSubmitting(true)
    setSubmitError('')
    try {
      await authActions.createAccount({ ...create, name: create.name.trim(), email: create.email.trim(), mobile: create.mobile.trim() })
      const guestDraft = localStorage.getItem(WEBSITE_APPLICATION_FLOW_STORAGE_KEY)
      if (guestDraft) await authActions.claimGuestApplication(guestDraft)
      navigate(guestDraft ? '/apply/new' : '/retail/dashboard')
    } catch (error) {
      setSubmitError(authErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Box component="main" sx={{ display: 'grid', minHeight: '100dvh', minWidth: 0, gridTemplateColumns: 'minmax(0, 1fr)', bgcolor: colors.surface, fontFamily: publicFonts.body, '@media (min-width: 820px)': { gridTemplateColumns: '45% minmax(0, 55%)' }, '@media (min-width: 1200px)': { gridTemplateColumns: '50% minmax(0, 50%)' } }}>
      <TravelPanel />
      <Box sx={{ display: 'flex', minWidth: 0, flexDirection: 'column', px: { xs: 2, sm: 3, desktop: 5 }, py: { xs: 2, desktop: 3 }, background: 'radial-gradient(circle at 85% 35%, #ffffff 0%, #f8fafc 62%, #f3f7f8 100%)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 38 }}>
          <Box component={RouterLink} to="/" aria-label="GreenLight Travel Solutions, home" sx={{ display: 'inline-flex', '@media (min-width: 820px)': { display: 'none' }, '&:focus-visible': { outline: `3px solid ${colors.greenDark}`, outlineOffset: 3 } }}>
            <Box component="img" src={GREENLIGHT_LOGO_SRC} alt="" sx={{ width: 145, height: 'auto', display: 'block' }} />
          </Box>
          <Button component={RouterLink} to="/" startIcon={<ArrowLeft size={16} />} sx={{ ml: 'auto', p: 0.5, minWidth: 0, color: colors.textSecondary, fontFamily: publicFonts.body, fontSize: 13, fontWeight: 600, textTransform: 'none', '&:focus-visible': { outline: `3px solid ${colors.greenDark}`, outlineOffset: 3 } }}>
            Back to Home
          </Button>
        </Box>

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', py: { xs: 2, desktop: 3 }, '@media (min-width: 820px)': { justifyContent: 'center' } }}>
          <Paper component="section" aria-label="GreenLight account access" elevation={0} sx={{ width: '100%', maxWidth: 492, px: { xs: 2.5, sm: 4, desktop: 5 }, pt: { xs: 2, desktop: 2.5 }, pb: { xs: 2.5, desktop: 3 }, border: `1px solid ${colors.borderSoft}`, borderRadius: '18px', bgcolor: colors.white, boxShadow: '0 20px 60px rgba(0,31,63,0.08)' }}>
            <Tabs value={isCreateAccount ? 'create' : 'sign-in'} onChange={(_event, value: 'create' | 'sign-in') => { setSubmitError(''); setRecoveryNotice(false); navigate(value === 'create' ? '/sign-up' : '/sign-in') }} variant="fullWidth" aria-label="Account access" sx={{ minHeight: 42, mb: { xs: 2.5, desktop: 3 }, borderBottom: `1px solid ${colors.border}`, '& .MuiTabs-indicator': { height: 2, bgcolor: colors.greenDark, borderRadius: 2 }, '& .MuiTab-root': { minHeight: 42, textTransform: 'none', fontFamily: publicFonts.body, fontSize: 13, fontWeight: 700, color: colors.textSecondary }, '& .Mui-selected': { color: `${colors.navy} !important` }, '& .MuiTab-root:focus-visible': { outline: `2px solid ${colors.greenDark}`, outlineOffset: -2 } }}>
              <Tab value="sign-in" label="Sign In" id="retail-sign-in-tab" aria-controls="retail-sign-in-panel" />
              <Tab value="create" label="Create Account" id="retail-create-tab" aria-controls="retail-create-panel" />
            </Tabs>

            {isCreateAccount ? (
              <Box role="tabpanel" id="retail-create-panel" aria-labelledby="retail-create-tab">
                <Typography component="h2" sx={{ ...websiteHeadingSx.authPanelTitle, color: colors.navy }}>
                  Create your GreenLight account
                </Typography>
                <Typography sx={{ mt: 0.75, mb: 2.5, color: colors.textSecondary, fontSize: 14, lineHeight: 1.5 }}>
                  Create an account to manage your visa journey in one place.
                </Typography>
                <Box component="form" noValidate onSubmit={handleCreate} sx={{ display: 'grid', gap: 2 }}>
                  <AuthField id="retail-create-name" label="Full name" placeholder="Enter your full name" value={create.name} onChange={(event) => updateCreate('name', event.target.value)} autoComplete="name" error={createErrors.name} />
                  <AuthField id="retail-create-email" label="Email address" placeholder="Enter your email address" value={create.email} onChange={(event) => updateCreate('email', event.target.value)} autoComplete="email" type="email" inputMode="email" error={createErrors.email} icon={<Mail size={18} aria-hidden="true" />} />
                  <AuthField id="retail-create-mobile" label="Mobile number" placeholder="Enter your mobile number" value={create.mobile} onChange={(event) => updateCreate('mobile', event.target.value)} autoComplete="tel" type="tel" inputMode="tel" error={createErrors.mobile} />
                  <PasswordField id="retail-create-password" label="Password" placeholder="Create a password" value={create.password} onChange={(event) => updateCreate('password', event.target.value)} autoComplete="new-password" error={createErrors.password} />
                  <PasswordField id="retail-create-confirm" label="Confirm password" placeholder="Confirm your password" value={create.confirmPassword} onChange={(event) => updateCreate('confirmPassword', event.target.value)} autoComplete="new-password" error={createErrors.confirmPassword} />
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', ml: -1 }}>
                      <Checkbox id="retail-create-consent" checked={create.consent} onChange={(event) => updateCreate('consent', event.target.checked)} inputProps={{ 'aria-describedby': createErrors.consent ? 'retail-create-consent-error' : undefined }} sx={{ p: 1, color: colors.textSecondary, '&.Mui-checked': { color: colors.greenDark } }} />
                      <Typography component="label" htmlFor="retail-create-consent" sx={{ pt: 1, color: colors.navy, fontSize: 12.5, lineHeight: 1.5 }}>
                        I agree to the <Link component={RouterLink} to="/legal/terms" onClick={(event) => event.stopPropagation()} sx={{ color: colors.greenDark, fontWeight: 700 }}>Terms &amp; Conditions</Link> and <Link component={RouterLink} to="/legal/privacy" onClick={(event) => event.stopPropagation()} sx={{ color: colors.greenDark, fontWeight: 700 }}>Privacy Policy</Link>.
                      </Typography>
                    </Box>
                    {createErrors.consent && <Typography id="retail-create-consent-error" role="alert" sx={{ ml: 0.5, color: '#B42318', fontSize: 12 }}>{createErrors.consent}</Typography>}
                  </Box>
                  {submitError && <Alert severity="error" role="alert" sx={{ fontSize: 13 }}>{submitError} <Link component={RouterLink} to="/contact" sx={{ fontWeight: 700 }}>Contact us</Link></Alert>}
                  <Button type="submit" fullWidth variant="contained" disabled={submitting} endIcon={submitting ? <CircularProgress size={16} color="inherit" /> : <ArrowRight size={18} />} aria-busy={submitting} sx={submitButtonSx}>
                    {submitting ? 'Creating account…' : 'Create account'}
                  </Button>
                </Box>
                <Typography sx={{ mt: 2.5, textAlign: 'center', color: colors.textSecondary, fontSize: 13 }}>
                  Already have an account? <Link component={RouterLink} to="/sign-in" sx={{ color: colors.greenDark, fontWeight: 700 }}>Sign in <ArrowRight size={14} style={{ verticalAlign: 'middle' }} /></Link>
                </Typography>
              </Box>
            ) : (
              <Box role="tabpanel" id="retail-sign-in-panel" aria-labelledby="retail-sign-in-tab">
                <Typography component="h2" sx={{ ...websiteHeadingSx.authPanelTitle, color: colors.navy }}>
                  Welcome back
                </Typography>
                <Typography sx={{ mt: 0.75, mb: 3, color: colors.textSecondary, fontSize: 14, lineHeight: 1.55 }}>
                  Sign in to your GreenLight account to continue your visa journey.
                </Typography>
                <Box component="form" noValidate onSubmit={handleSignIn} sx={{ display: 'grid', gap: 2.25 }}>
                  <AuthField id="retail-sign-in-identifier" label="Email address or mobile number" placeholder="Enter your email or mobile number" value={signIn.identifier} onChange={(event) => updateSignIn('identifier', event.target.value)} autoComplete="username" error={signInErrors.identifier} icon={<Mail size={18} aria-hidden="true" />} />
                  <PasswordField id="retail-sign-in-password" label="Password" placeholder="Enter your password" value={signIn.password} onChange={(event) => updateSignIn('password', event.target.value)} autoComplete="current-password" error={signInErrors.password} />
                  <Box sx={{ textAlign: 'right', mt: -1.25 }}>
                    <Button type="button" onClick={() => setRecoveryNotice(true)} sx={{ p: 0, minWidth: 0, color: colors.greenDark, fontFamily: publicFonts.body, fontSize: 13, fontWeight: 700, textTransform: 'none', '&:focus-visible': { outline: `2px solid ${colors.greenDark}`, outlineOffset: 3 } }}>Forgot password?</Button>
                  </Box>
                  {recoveryNotice && <Alert severity="info" role="status" sx={{ fontSize: 13 }}>Online password reset is not available yet. Please <Link component={RouterLink} to="/contact" sx={{ fontWeight: 700 }}>contact support</Link>.</Alert>}
                  {submitError && <Alert severity="error" role="alert" sx={{ fontSize: 13 }}>{submitError} <Link component={RouterLink} to="/contact" sx={{ fontWeight: 700 }}>Contact us</Link></Alert>}
                  <Button type="submit" fullWidth variant="contained" disabled={submitting} endIcon={submitting ? <CircularProgress size={16} color="inherit" /> : <ArrowRight size={18} />} aria-busy={submitting} sx={submitButtonSx}>
                    {submitting ? 'Signing in…' : 'Sign in'}
                  </Button>
                </Box>
                <Box sx={{ mt: 4, p: 2.25, borderRadius: '12px', bgcolor: '#EFF8F1', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ flex: '1 1 190px' }}>
                    <Typography sx={{ fontFamily: publicFonts.display, color: colors.navy, fontSize: 16, fontWeight: 700 }}>New to GreenLight?</Typography>
                    <Typography sx={{ color: colors.textSecondary, fontSize: 12, lineHeight: 1.55, mt: 0.4 }}>Create an account to start your visa application, track progress and access your documents.</Typography>
                  </Box>
                  <Button component={RouterLink} to="/sign-up" variant="outlined" endIcon={<ArrowRight size={16} />} sx={{ minHeight: ds.component.button.authSecondary.minHeight, borderColor: colors.greenDark, color: colors.greenDark, fontFamily: publicFonts.body, fontSize: ds.component.button.authSecondary.fontSize, fontWeight: ds.component.button.authSecondary.fontWeight, textTransform: 'none', borderRadius: `${ds.component.button.authSecondary.radius}px`, whiteSpace: 'nowrap', '&:focus-visible': { outline: `2px solid ${colors.greenDark}`, outlineOffset: 2 } }}>
                    Create an account
                  </Button>
                </Box>
              </Box>
            )}
          </Paper>
          <Link component={RouterLink} to="/sign-in/portals" sx={{ mt: 2, color: colors.textSecondary, fontSize: 12, fontWeight: 600, '&:focus-visible': { outline: `2px solid ${colors.greenDark}`, outlineOffset: 3 } }}>
            Access another GLTS workspace
          </Link>
        </Box>
      </Box>
    </Box>
  )
}
