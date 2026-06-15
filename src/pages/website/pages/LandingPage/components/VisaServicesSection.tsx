import { Box, Typography, Grid, Card } from '@mui/material'
import {
  Palmtree,
  Briefcase,
  GraduationCap,
  HardHat,
  Users,
  AlertCircle,
} from 'lucide-react'
import { PublicContainer } from '../../../components/PublicContainer'
import { landingSectionHeaderMb, landingSectionPy } from '../landingPageSpacing'
import { publicFonts, usePublicBrandColors } from '@/shared/theme/publicBrand'

const visaServices = [
  {
    icon: Palmtree,
    title: 'Tourist Visa',
    description: 'Leisure travel with expert document review and embassy-ready filing.',
    href: '/countries',
  },
  {
    icon: Briefcase,
    title: 'Business Visa',
    description: 'Meetings, conferences, and short-term business visits handled with compliance.',
    href: '/countries',
  },
  {
    icon: GraduationCap,
    title: 'Student Visa',
    description: 'Admission-aligned documentation and category guidance for study abroad.',
    href: '/countries',
  },
  {
    icon: HardHat,
    title: 'Work Visa',
    description: 'Employment visas with employer documentation and eligibility checks.',
    href: '/countries',
  },
  {
    icon: Users,
    title: 'Family Visit Visa',
    description: 'Visit relatives abroad with invitation letters and proof requirements covered.',
    href: '/countries',
  },
  {
    icon: AlertCircle,
    title: 'Visa Refusal Support',
    description: 'Refusal review, gap analysis, and reapplication strategy from specialists.',
    href: '#refusal-support',
  },
]

export function VisaServicesSection() {
  const colors = usePublicBrandColors()

  return (
    <Box
      component="section"
      sx={{
        bgcolor: colors.white,
        py: landingSectionPy,
        borderTop: `1px solid ${colors.borderSoft}`,
      }}
    >
      <PublicContainer variant="hero">
        <Box sx={{ maxWidth: 640, mb: landingSectionHeaderMb }}>
          <Typography
            sx={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: colors.greenBright,
              mb: 1.5,
            }}
          >
            Visa Services
          </Typography>

          <Typography
            component="h2"
            sx={{
              fontFamily: publicFonts.heading,
              fontSize: { xs: '26px', md: '32px' },
              fontWeight: 800,
              color: colors.navy,
              lineHeight: 1.15,
              letterSpacing: '-0.5px',
              mb: 1.25,
            }}
          >
            Every visa category, expertly managed.
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: '15px', md: '16px' },
              color: colors.textSecondary,
              lineHeight: 1.65,
            }}
          >
            From tourist trips to work permits — each service includes pre-submission review and
            live application tracking.
          </Typography>
        </Box>

        <Grid container spacing={2}>
          {visaServices.map(({ icon: Icon, title, description, href }) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={title}>
              <Card
                component="a"
                href={href}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  p: 2.5,
                  borderRadius: '16px',
                  border: `1px solid ${colors.border}`,
                  boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
                  bgcolor: colors.white,
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.2s',
                  '&:hover': {
                    borderColor: `${colors.greenBright}66`,
                    boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: '12px',
                    bgcolor: colors.greenMuted,
                    border: `1px solid ${colors.green}33`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  <Icon size={20} color={colors.greenBright} strokeWidth={2.25} />
                </Box>
                <Typography
                  sx={{
                    fontFamily: publicFonts.heading,
                    fontSize: '17px',
                    fontWeight: 800,
                    color: colors.navy,
                    lineHeight: 1.3,
                    mb: 0.75,
                  }}
                >
                  {title}
                </Typography>
                <Typography sx={{ fontSize: '14px', color: colors.textSecondary, lineHeight: 1.55 }}>
                  {description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </PublicContainer>
    </Box>
  )
}
