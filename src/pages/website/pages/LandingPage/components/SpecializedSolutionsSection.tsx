import { Box, Typography, Grid, Card, Stack } from '@mui/material'
import { Anchor, Building2, User, Users, ArrowRight } from 'lucide-react'
import { PublicContainer } from '../../../components/PublicContainer'
import { landingSectionHeaderMb, landingSectionPy } from '../landingPageSpacing'
import { publicFonts, usePublicBrandColors } from '../../../theme/publicSiteTokens'

const solutions = [
  {
    id: 'marine',
    icon: Anchor,
    title: 'Marine Crew Travel',
    description: 'Crew visa handling for vessels, offshore teams, and port-of-call deployments.',
    href: '/business',
  },
  {
    id: 'corporate',
    icon: Building2,
    title: 'Corporate Travel Management',
    description: 'Business visa ops with compliance dashboards, bulk filing, and account support.',
    href: '/business',
  },
  {
    id: 'retail',
    icon: User,
    title: 'Retail Travelers',
    description: 'Individual visa assistance for tourists, students, families, and professionals.',
    href: '/countries',
  },
  {
    id: 'group',
    icon: Users,
    title: 'Group Travel Services',
    description: 'Coordinated visa processing for delegations, tours, and multi-traveler batches.',
    href: '/business',
  },
]

function SolutionCard({
  icon: Icon,
  title,
  description,
  href,
}: (typeof solutions)[number]) {
  const colors = usePublicBrandColors()

  return (
    <Card
      component="a"
      href={href}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        p: 3,
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
          width: 48,
          height: 48,
          borderRadius: '14px',
          bgcolor: colors.greenMuted,
          border: `1px solid ${colors.green}33`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
        }}
      >
        <Icon size={22} color={colors.greenBright} strokeWidth={2.25} />
      </Box>

      <Typography
        sx={{
          fontFamily: publicFonts.heading,
          fontSize: '18px',
          fontWeight: 800,
          color: colors.navy,
          lineHeight: 1.25,
          mb: 1,
        }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          fontSize: '14px',
          color: colors.textSecondary,
          lineHeight: 1.6,
          mb: 2,
          flex: 1,
        }}
      >
        {description}
      </Typography>

      <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: colors.greenBright }}>
        <Typography sx={{ fontSize: '13px', fontWeight: 700 }}>Learn more</Typography>
        <ArrowRight size={15} strokeWidth={2.5} />
      </Stack>
    </Card>
  )
}

export function SpecializedSolutionsSection() {
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
            Specialized Solutions
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
            Travel solutions for every need.
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: '15px', md: '16px' },
              color: colors.textSecondary,
              lineHeight: 1.65,
            }}
          >
            Purpose-built workflows for marine crews, corporate teams, retail travelers, and group
            movements — each linking to a dedicated experience.
          </Typography>
        </Box>

        <Grid container spacing={2.5}>
          {solutions.map(solution => (
            <Grid size={{ xs: 12, sm: 6 }} key={solution.id}>
              <SolutionCard {...solution} />
            </Grid>
          ))}
        </Grid>
      </PublicContainer>
    </Box>
  )
}
