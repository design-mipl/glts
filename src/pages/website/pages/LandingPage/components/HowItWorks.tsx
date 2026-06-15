import { Box, Typography, Grid, Stack } from '@mui/material'
import { FileUp, ShieldCheck, Cog, BadgeCheck } from 'lucide-react'
import { PublicContainer } from '../../../components/PublicContainer'
import { landingSectionHeaderMb, landingSectionPy } from '../landingPageSpacing'
import { publicFonts, usePublicBrandColors } from '../../../theme/publicSiteTokens'

const workflowSteps = [
  {
    number: '01',
    title: 'Submit Requirement',
    description: 'Share your travel details, visa category, and documents through the portal.',
    icon: FileUp,
  },
  {
    number: '02',
    title: 'Expert Review',
    description:
      'Specialists review documents, identify gaps, and guide corrections before submission.',
    icon: ShieldCheck,
  },
  {
    number: '03',
    title: 'Application Processing',
    description:
      'Your application is prepared, submitted, and monitored through embassy processing.',
    icon: Cog,
  },
  {
    number: '04',
    title: 'Visa Delivered',
    description:
      'Receive your approved visa with full status history and post-decision support.',
    icon: BadgeCheck,
  },
]

function WorkflowStep({
  number,
  title,
  description,
  icon: Icon,
  isLast,
}: (typeof workflowSteps)[number] & { isLast: boolean }) {
  const colors = usePublicBrandColors()

  return (
    <Box
      sx={{
        position: 'relative',
        height: '100%',
        pl: { xs: 5, md: 0 },
        pb: { xs: isLast ? 0 : 5, md: 0 },
      }}
    >
      {/* Mobile timeline connector */}
      {!isLast && (
        <Box
          sx={{
            display: { xs: 'block', md: 'none' },
            position: 'absolute',
            left: 21,
            top: 52,
            bottom: 0,
            width: 2,
            bgcolor: colors.border,
            borderRadius: 1,
          }}
        />
      )}

      <Stack
        spacing={2.5}
        alignItems={{ xs: 'flex-start', md: 'center' }}
        sx={{
          position: 'relative',
          zIndex: 1,
          textAlign: { xs: 'left', md: 'center' },
          px: { md: 2 },
          py: { xs: 0, md: 3 },
          borderRadius: '18px',
          transition: 'background-color 0.2s, transform 0.2s',
          '&:hover': {
            bgcolor: { md: `${colors.surface}80` },
            transform: { md: 'translateY(-2px)' },
          },
          '&:hover .workflow-step-icon': {
            borderColor: `${colors.greenBright}55`,
            boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)',
          },
        }}
      >
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          {/* Mobile timeline node */}
          <Box
            sx={{
              display: { xs: 'flex', md: 'none' },
              position: 'absolute',
              left: -40,
              top: 10,
              width: 42,
              height: 42,
              borderRadius: '50%',
              bgcolor: colors.white,
              border: `2px solid ${colors.border}`,
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.06)',
            }}
          >
            <Icon size={18} color={colors.greenBright} strokeWidth={2.25} />
          </Box>

          <Typography
            sx={{
              display: { xs: 'none', md: 'block' },
              fontFamily: publicFonts.heading,
              fontSize: '13px',
              fontWeight: 800,
              letterSpacing: '0.12em',
              color: colors.textMuted,
              mb: -0.5,
            }}
          >
            {number}
          </Typography>

          <Box
            className="workflow-step-icon"
            sx={{
              display: { xs: 'none', md: 'flex' },
              width: 72,
              height: 72,
              borderRadius: '20px',
              bgcolor: colors.white,
              border: `1.5px solid ${colors.border}`,
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(15, 23, 42, 0.05)',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
          >
            <Icon size={28} color={colors.greenBright} strokeWidth={1.75} />
          </Box>
        </Box>

        <Box sx={{ maxWidth: { md: 300 } }}>
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            sx={{ mb: 1, justifyContent: { xs: 'flex-start', md: 'center' } }}
          >
            <Typography
              sx={{
                display: { xs: 'block', md: 'none' },
                fontFamily: publicFonts.heading,
                fontSize: '12px',
                fontWeight: 800,
                letterSpacing: '0.1em',
                color: colors.greenBright,
              }}
            >
              {number}
            </Typography>
            <Typography
              sx={{
                fontFamily: publicFonts.heading,
                fontSize: { xs: '18px', md: '20px' },
                fontWeight: 800,
                color: colors.navy,
                lineHeight: 1.25,
              }}
            >
              {title}
            </Typography>
          </Stack>

          <Typography
            sx={{
              fontSize: { xs: '14px', md: '15px' },
              color: colors.textSecondary,
              lineHeight: 1.65,
            }}
          >
            {description}
          </Typography>
        </Box>
      </Stack>
    </Box>
  )
}

export function HowItWorks() {
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
            Operational Workflow
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
            How GreenLight Works
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: '15px', md: '16px' },
              color: colors.textSecondary,
              lineHeight: 1.65,
            }}
          >
            From application to decision, every step is reviewed, tracked, and visible.
          </Typography>
        </Box>

        <Box sx={{ position: 'relative' }}>
          <Box
            sx={{
              display: { xs: 'none', md: 'block' },
              position: 'absolute',
              top: 51,
              left: '12.5%',
              right: '12.5%',
              height: 2,
              bgcolor: colors.border,
              zIndex: 0,
              borderRadius: 1,
            }}
          />

          <Grid container spacing={{ xs: 0, md: 2 }} sx={{ position: 'relative', zIndex: 1 }}>
            {workflowSteps.map((step, index) => (
              <Grid size={{ xs: 12, md: 3 }} key={step.number}>
                <WorkflowStep {...step} isLast={index === workflowSteps.length - 1} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </PublicContainer>
    </Box>
  )
}
