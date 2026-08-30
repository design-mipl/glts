import { Box, Typography, Button, Stack } from '@mui/material'
import { Building2, Cog, Ship, Users, ArrowRight, UserRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { GREENLIGHT_LOGO_SRC } from '@/components/brand/GreenlightLogo'
import { publicFonts, usePublicBrandColors } from '@/shared/theme/publicBrand'

const PORTALS = [
  {
    id: 'retail',
    title: 'Retail Customer Login',
    subtitle: 'Individual travellers',
    description: 'Sign in with phone or Google to manage your visas, documents, and applications.',
    icon: UserRound,
    href: '/sign-in/retail',
  },
  {
    id: 'marine',
    title: 'Marine Portal',
    subtitle: 'Crew & vessel customers',
    description: 'Manage crew manifests, vessel assignments, and marine visa applications.',
    icon: Ship,
    href: '/sign-in/business/marine',
  },
  {
    id: 'corporate',
    title: 'Corporate Portal',
    subtitle: 'Enterprise travel customers',
    description: 'Manage corporate travel visas, travelers, bookers, and compliance workflows.',
    icon: Building2,
    href: '/sign-in/business/corporate',
  },
  {
    id: 'b2b',
    title: 'B2B Agent Portal',
    subtitle: 'Travel agents & partners',
    description: 'File multi-client applications, manage bookers, and track bulk submissions.',
    icon: Users,
    href: '/sign-in/business/b2b',
  },
  {
    id: 'operations',
    title: 'GLTS Portal',
    subtitle: 'Admin, operations & processing team',
    description: 'Manage admin modules, process applications, verify documents, and coordinate with embassies.',
    icon: Cog,
    href: '/sign-in/operations',
  },
] as const

export function PortalSelectionPage() {
  const colors = usePublicBrandColors()
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: colors.surface,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: 6,
      }}
    >
      <Button
        component="a"
        href="/"
        sx={{
          position: 'absolute',
          top: 24,
          left: 24,
          textTransform: 'none',
          color: colors.textSecondary,
          fontWeight: 600,
          fontSize: '13px',
        }}
      >
        ← Back to website
      </Button>

      <Box component="img" src={GREENLIGHT_LOGO_SRC} alt="Greenlight" sx={{ height: 48, mb: 3, borderRadius: '10px' }} />

      <Typography
        sx={{
          fontFamily: publicFonts.heading,
          fontWeight: 800,
          fontSize: { xs: '28px', sm: '34px' },
          color: colors.navy,
          textAlign: 'center',
          mb: 1,
        }}
      >
        Choose your workspace
      </Typography>
      <Typography
        sx={{
          fontSize: '15px',
          color: colors.textSecondary,
          textAlign: 'center',
          mb: 5,
          maxWidth: 520,
        }}
      >
        Select the portal that matches your customer type or GLTS internal role. Access is kept separate for security.
      </Typography>

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2.5}
        sx={{ width: '100%', maxWidth: 1100, flexWrap: { md: 'wrap' }, justifyContent: 'center' }}
        useFlexGap
      >
        {PORTALS.map(portal => {
          const Icon = portal.icon
          return (
            <Box
              key={portal.id}
              sx={{
                flex: { xs: '1 1 auto', md: '1 1 240px' },
                maxWidth: { md: 260 },
                p: 3,
                borderRadius: '16px',
                border: `1px solid ${colors.border}`,
                bgcolor: colors.white,
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                '&:hover': {
                  borderColor: colors.greenBright,
                  boxShadow: '0 12px 32px rgba(0, 31, 63, 0.1)',
                  transform: 'translateY(-2px)',
                },
              }}
              onClick={() => navigate(portal.href)}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '12px',
                  bgcolor: `${colors.greenBright}18`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                }}
              >
                <Icon size={24} color={colors.greenBright} />
              </Box>
              <Typography sx={{ fontWeight: 800, fontSize: '18px', color: colors.navy, mb: 0.5 }}>
                {portal.title}
              </Typography>
              <Typography sx={{ fontSize: '13px', fontWeight: 600, color: colors.greenBright, mb: 1.5 }}>
                {portal.subtitle}
              </Typography>
              <Typography sx={{ fontSize: '13px', color: colors.textSecondary, lineHeight: 1.6, mb: 2.5 }}>
                {portal.description}
              </Typography>
              <Button
                variant="contained"
                endIcon={<ArrowRight size={16} />}
                onClick={e => {
                  e.stopPropagation()
                  navigate(portal.href)
                }}
                sx={{
                  borderRadius: '10px',
                  bgcolor: colors.navy,
                  textTransform: 'none',
                  fontWeight: 700,
                  '&:hover': { bgcolor: colors.navyLight },
                }}
              >
                Continue
              </Button>
            </Box>
          )
        })}
      </Stack>
    </Box>
  )
}
