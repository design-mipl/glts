import { Box, Typography, Grid, Card, Button, Stack, Divider, Avatar } from '@mui/material'
import { PublicContainer } from '@/pages/website/components/PublicContainer'
import {
  publicLayout,
  publicTypography,
  publicFonts,
  publicShadows,
  usePublicBrandColors,
  getMarketingPrimaryButtonSx,
  brandPrimaryGreenRgb,
} from '@/shared/theme/publicBrand'
import {
  Building2,
  Users,
  FileText,
  CreditCard,
  Bell,
  User,
  Globe,
  ArrowRight,
} from 'lucide-react'

const features = [
  {
    Icon: Users,
    title: 'One-click bulk apply',
    desc: 'Drop a CSV with 100 travelers. We dedupe, route to the right embassy, and file in parallel.',
  },
  {
    Icon: FileText,
    title: 'Audit-grade trail',
    desc: 'Every action timestamped, exportable. SAML SSO, IP allow-listing, SCIM provisioning.',
  },
  {
    Icon: CreditCard,
    title: 'Cost-center billing',
    desc: 'Tag each visa to a department, project or PO. Monthly statements in your accounting format.',
  },
  {
    Icon: Bell,
    title: 'Automatic escalations',
    desc: 'Auto-page the right desk when applications stall. 24/7 cover across IST, GMT, ET.',
  },
  {
    Icon: User,
    title: 'Traveler self-serve',
    desc: 'Employees upload their own docs through a branded sub-portal. HR only sees aggregate progress.',
  },
  {
    Icon: Globe,
    title: 'Multi-country routing',
    desc: 'Apply once, route to multiple consulates if travel spans regions. Single approved bundle returned.',
  },
]

const onboardingSteps = [
  { day: 'DAY 1', title: 'Discovery & SSO setup', desc: 'Kickoff with CSM · SAML connected · domain verified' },
  { day: 'DAY 3', title: 'Branding & subdomain', desc: 'Your logo, colors, traveler portal live at travel.yourco.com' },
  { day: 'DAY 7', title: 'Pilot batch', desc: '10 travelers in a controlled run · weekly review' },
  { day: 'DAY 14', title: 'Production', desc: 'Full rollout · SLA monitoring · monthly reporting' },
]

const clients = ['DELOITTE', 'HCL', 'ZOMATO', 'ICICI BANK', 'TVS']

export function CorporateLandingPage() {
  const colors = usePublicBrandColors()
  return (
    <Box>
      {/* Hero */}
      <Box
        sx={{
          background: colors.heroGradient,
          mt: `-${publicLayout.navHeight}px`,
          pt: `${publicLayout.navHeight + 64}px`,
          pb: { xs: 10, md: 14 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `radial-gradient(circle at 80% 30%, rgba(${brandPrimaryGreenRgb}, 0.1) 0%, transparent 55%)`,
            pointerEvents: 'none',
          }}
        />
        <PublicContainer variant="hero" sx={{ position: 'relative' }}>
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  backgroundColor: `rgba(${brandPrimaryGreenRgb}, 0.15)`,
                  border: `1px solid rgba(${brandPrimaryGreenRgb}, 0.3)`,
                  borderRadius: '6px',
                  px: 1.5,
                  py: 0.5,
                  mb: 3,
                }}
              >
                <Building2 size={12} color={colors.greenBright} />
                <Typography sx={{ color: colors.greenBright, fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                  GREENLIGHT FOR TEAMS
                </Typography>
              </Box>

              <Typography
                component="h1"
                sx={{
                  fontWeight: 800,
                  color: '#fff',
                  fontFamily: publicFonts.heading,
                  fontSize: publicTypography.h2,
                  lineHeight: 1.1,
                  letterSpacing: '-1px',
                  mb: 2.5,
                }}
              >
                Visa operations,
                <Box component="span" sx={{ color: colors.greenBright, display: 'block' }}>
                  finally orchestrated.
                </Box>
              </Typography>

              <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '16px', lineHeight: 1.7, mb: 4, maxWidth: 500 }}>
                One workspace for your travel desk, HR and traveling employees. Bulk applications,
                audit trails, cost-center billing and a live SLA dashboard — built for travel managers
                who hate spreadsheets.
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button variant="contained" size="large" sx={{ ...getMarketingPrimaryButtonSx(colors), px: 4, py: 1.5 }}>
                  Book a demo
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  href="/business/login"
                  sx={{
                    borderColor: 'rgba(255,255,255,0.3)',
                    color: '#fff',
                    fontWeight: 600,
                    px: 4,
                    textTransform: 'none',
                    fontSize: '15px',
                    borderRadius: '8px',
                    '&:hover': { borderColor: '#fff', backgroundColor: 'rgba(255,255,255,0.05)' },
                  }}
                >
                  Sign in to portal
                </Button>
              </Stack>
            </Grid>

            {/* Dashboard Preview Card */}
            <Grid size={{ xs: 12, md: 6 }} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box
                sx={{
                  backgroundColor: '#fff',
                  borderRadius: '16px',
                  p: 3,
                  boxShadow: '0 30px 80px rgba(0,0,0,0.3)',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                  <Typography sx={{ fontWeight: 800, color: '#001F3F', fontSize: '15px' }}>
                    Q1 Travel program
                  </Typography>
                  <Typography sx={{ fontSize: '12px', color: '#9CA3AF' }}>38 travelers · 12 destinations</Typography>
                </Box>

                <Grid container spacing={1.5} sx={{ mb: 2.5 }}>
                  {[
                    { label: 'In progress', value: '24', color: '#EEF2FF', text: '#4F46E5' },
                    { label: 'Approved', value: '12', color: '#D1FAE5', text: '#065F46' },
                    { label: 'Awaiting docs', value: '2', color: '#FEF3C7', text: '#92400E' },
                    { label: 'Spend', value: '₹3.2L', color: '#F3F4F6', text: '#374151' },
                  ].map(({ label, value, color, text }) => (
                    <Grid size={{ xs: 6 }} key={label}>
                      <Box sx={{ backgroundColor: color, borderRadius: '8px', p: 1.5 }}>
                        <Typography sx={{ fontSize: '18px', fontWeight: 800, color: text }}>{value}</Typography>
                        <Typography sx={{ fontSize: '11px', color: '#9CA3AF' }}>{label}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                <Divider sx={{ mb: 2 }} />

                <Stack spacing={1.25}>
                  {[
                    { name: 'Kavya R.', dest: 'Schengen', status: 'Embassy', score: 92, color: '#EEF2FF', textColor: '#4F46E5' },
                    { name: 'Sanjay M.', dest: 'Japan', status: 'Approved', score: 96, color: '#D1FAE5', textColor: '#065F46' },
                    { name: 'Priya W.', dest: 'UAE', status: 'Filed', score: 94, color: '#DBEAFE', textColor: '#1D4ED8' },
                    { name: 'Olu A.', dest: 'USA', status: 'Interview', score: 71, color: '#FEF3C7', textColor: '#92400E' },
                  ].map(({ name, dest, status, score, color, textColor }) => (
                    <Box
                      key={name}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        py: 0.75,
                        px: 1.25,
                        borderRadius: '8px',
                        '&:hover': { backgroundColor: '#F9FAFB' },
                      }}
                    >
                      <Avatar sx={{ width: 28, height: 28, fontSize: '11px', backgroundColor: '#001F3F', fontWeight: 700 }}>
                        {name.split(' ').map(p => p[0]).join('')}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontWeight: 600, fontSize: '13px', color: '#001F3F' }}>{name}</Typography>
                        <Typography sx={{ fontSize: '11px', color: '#9CA3AF' }}>{dest}</Typography>
                      </Box>
                      <Box
                        sx={{
                          backgroundColor: color,
                          color: textColor,
                          fontSize: '11px',
                          fontWeight: 700,
                          px: 1,
                          py: 0.25,
                          borderRadius: '4px',
                        }}
                      >
                        {status}
                      </Box>
                      <Typography sx={{ fontWeight: 800, fontSize: '13px', color: '#001F3F' }}>{score}</Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Grid>
          </Grid>

          {/* Trusted by */}
          <Box sx={{ mt: 6, pt: 4, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', mb: 2 }}>
              TRUSTED BY OPS TEAMS AT
            </Typography>
            <Stack direction="row" spacing={4} sx={{ flexWrap: 'wrap', gap: 3 }}>
              {clients.map(c => (
                <Typography key={c} sx={{ fontWeight: 800, color: 'rgba(255,255,255,0.35)', fontSize: '14px', letterSpacing: '1px' }}>
                  {c}
                </Typography>
              ))}
            </Stack>
          </Box>
        </PublicContainer>
      </Box>

      <Box sx={{ py: publicLayout.sectionMajor, backgroundColor: colors.surface }}>
        <PublicContainer>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography sx={{ fontWeight: 800, fontFamily: publicFonts.heading, color: colors.navy, fontSize: publicTypography.h2, mb: 1 }}>
              Everything your travel desk needs.
            </Typography>
            <Typography sx={{ color: '#6B7280', fontSize: '15px', maxWidth: 520, mx: 'auto' }}>
              From first CSV upload to final passport collection — in one workspace.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {features.map(({ Icon, title, desc }) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={title}>
                <Card
                  sx={{
                    p: 3.5,
                    backgroundColor: '#fff',
                    border: `1px solid ${colors.border}`,
                    borderRadius: publicLayout.cardRadius,
                    boxShadow: publicShadows.card,
                    height: '100%',
                    transition: 'all 0.3s',
                    '&:hover': { boxShadow: publicShadows.cardHover, borderColor: colors.greenBright },
                  }}
                >
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: '10px',
                      backgroundColor: '#EEF2FF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                    }}
                  >
                    <Icon size={20} color="#4F46E5" />
                  </Box>
                  <Typography sx={{ fontWeight: 700, color: '#001F3F', fontSize: '15px', mb: 1 }}>{title}</Typography>
                  <Typography sx={{ color: '#6B7280', fontSize: '13.5px', lineHeight: 1.65 }}>{desc}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </PublicContainer>
      </Box>

      <Box sx={{ py: publicLayout.sectionMajor, backgroundColor: '#fff' }}>
        <PublicContainer>
          <Box sx={{ mb: 5 }}>
            <Typography sx={{ color: '#9CA3AF', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', mb: 0.5 }}>
              YOUR 14-DAY ONBOARDING
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, color: '#001F3F', fontSize: { xs: '24px', md: '30px' } }}>
              From kickoff to first batch — in two weeks.
            </Typography>
          </Box>

          <Box sx={{ position: 'relative' }}>
            {/* Connector line */}
            <Box
              sx={{
                position: 'absolute',
                top: 20,
                left: 20,
                right: 20,
                height: 2,
                backgroundColor: '#F3F4F6',
                display: { xs: 'none', md: 'block' },
              }}
            />
            <Grid container spacing={3}>
              {onboardingSteps.map(({ day, title, desc }, i) => (
                <Grid size={{ xs: 12, md: 3 }} key={day}>
                  <Box sx={{ position: 'relative' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          backgroundColor: '#001F3F',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '11px',
                          fontWeight: 800,
                          flexShrink: 0,
                          position: 'relative',
                          zIndex: 1,
                        }}
                      >
                        {i + 1}
                      </Box>
                      <Typography sx={{ fontSize: '11px', fontWeight: 700, color: colors.greenBright, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {day}
                      </Typography>
                    </Box>
                    <Typography sx={{ fontWeight: 700, color: '#001F3F', fontSize: '15px', mb: 0.75 }}>{title}</Typography>
                    <Typography sx={{ color: '#6B7280', fontSize: '13px', lineHeight: 1.6 }}>{desc}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </PublicContainer>
      </Box>

      <Box sx={{ py: publicLayout.sectionMajor, backgroundColor: colors.navy }}>
        <PublicContainer>
          <Grid container spacing={5} alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <Typography sx={{ color: colors.greenBright, fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', mb: 1.5 }}>
                MARINE MODULE
              </Typography>
              <Typography variant="h3" sx={{ color: '#fff', fontWeight: 800, fontSize: { xs: '26px', md: '34px' }, mb: 2 }}>
                For shipping lines &amp; crewing agents.
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '15px', lineHeight: 1.7, mb: 3, maxWidth: 520 }}>
                Built around vessel rotations: a single workspace per ship, off-signers and on-signers
                on one timeline, port-of-call clearance, and seaman book validation in 8 languages.
              </Typography>
              <Button
                variant="outlined"
                endIcon={<ArrowRight size={15} />}
                sx={{
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: '#fff',
                  fontWeight: 600,
                  px: 3,
                  textTransform: 'none',
                  fontSize: '14px',
                  '&:hover': { borderColor: '#fff', backgroundColor: 'rgba(255,255,255,0.05)' },
                }}
              >
                Marine plans
              </Button>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <Grid container spacing={2}>
                {[
                  { value: '164', label: 'Vessels onboarded' },
                  { value: '3,200', label: 'Crews moved / month' },
                  { value: '3.4d', label: 'Avg port clearance' },
                  { value: '12', label: 'Languages supported' },
                ].map(({ value, label }) => (
                  <Grid size={{ xs: 6 }} key={label}>
                    <Box sx={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', p: 2.5 }}>
                      <Typography sx={{ color: colors.greenBright, fontWeight: 800, fontSize: '26px', mb: 0.5 }}>{value}</Typography>
                      <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>{label}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </PublicContainer>
      </Box>

      <Box sx={{ py: publicLayout.sectionMajor, backgroundColor: colors.surface }}>
        <PublicContainer sx={{ textAlign: 'center', maxWidth: 720 }}>
          <Typography sx={{ fontWeight: 800, color: '#001F3F', fontSize: { xs: '28px', md: '38px' }, mb: 2 }}>
            Ready to streamline your travel ops?
          </Typography>
          <Typography sx={{ color: '#6B7280', fontSize: '16px', mb: 4, lineHeight: 1.7 }}>
            Book a 30-minute demo. We'll map your current workflow and show you exactly how Greenlight fits in.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button variant="contained" size="large" sx={{ ...getMarketingPrimaryButtonSx(colors), px: 5, py: 1.75 }}>
              Book a demo
            </Button>
            <Button
              variant="outlined"
              size="large"
              href="/"
              sx={{
                borderColor: '#E5E7EB',
                color: '#374151',
                fontWeight: 600,
                px: 5,
                textTransform: 'none',
                fontSize: '15px',
                borderRadius: '8px',
              }}
            >
              Explore destinations
            </Button>
          </Stack>
        </PublicContainer>
      </Box>
    </Box>
  )
}
