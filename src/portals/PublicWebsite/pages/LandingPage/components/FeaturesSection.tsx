import { Box, Typography, Grid, Card, Button, Stack, Chip } from '@mui/material'
import { User, Anchor, Building2, ArrowRight, Upload, Ship, BarChart3 } from 'lucide-react'
import { PublicContainer } from '../../../components/PublicContainer'
import {
  publicColors,
  publicFonts,
  publicLayout,
  publicShadows,
  publicTypography,
} from '../../../theme/publicSiteTokens'

const verticals = [
  {
    id: 'retail',
    Icon: User,
    tag: 'Retail travelers',
    title: 'For my own trip',
    description:
      'Guided onboarding in minutes. Upload once, get matched to the right visa, track every embassy milestone to stamp.',
    href: '/retail',
    accent: publicColors.greenBright,
    surface: '#F0FDF4',
    metrics: ['5 min apply', 'Live tracking', 'Doc checklist'],
    visual: Upload,
  },
  {
    id: 'marine',
    Icon: Anchor,
    tag: 'Marine / Seafarers',
    title: 'Crew, vessels, ports',
    description:
      'Bulk manifests, CDC validation, port-of-call clearance, and vessel timelines — built for crewing agents at scale.',
    href: '/business',
    accent: '#3B82F6',
    surface: '#EFF6FF',
    metrics: ['Bulk CSV', '62 ports', '8 languages'],
    visual: Ship,
  },
  {
    id: 'corporate',
    Icon: Building2,
    tag: 'Corporate teams',
    title: 'Manage 100+ travelers',
    description:
      'HR control panel with approvals, cost centers, SLA dashboards, and audit-ready logs from 10 to 10,000 employees.',
    href: '/business',
    accent: '#F59E0B',
    surface: '#FFFBEB',
    metrics: ['SSO · SCIM', 'Bulk apply', 'SLA reports'],
    visual: BarChart3,
  },
]

export function FeaturesSection() {
  return (
    <Box
      component="section"
      sx={{
        py: publicLayout.sectionMajor,
        backgroundColor: publicColors.surface,
      }}
    >
      <PublicContainer>
        <Box sx={{ maxWidth: 720, mb: { xs: 8, md: 12 } }}>
          <Typography
            sx={{
              fontSize: publicTypography.overline,
              fontWeight: 700,
              letterSpacing: '1.2px',
              textTransform: 'uppercase',
              color: publicColors.greenBright,
              mb: 2,
              fontFamily: publicFonts.body,
            }}
          >
            Who we serve
          </Typography>
          <Typography
            component="h2"
            sx={{
              fontFamily: publicFonts.heading,
              fontSize: publicTypography.h2,
              fontWeight: 800,
              color: publicColors.navy,
              lineHeight: 1.15,
              letterSpacing: '-0.5px',
              mb: 3,
            }}
          >
            One engine. Three operational journeys.
          </Typography>
          <Typography
            sx={{
              fontFamily: publicFonts.body,
              fontSize: publicTypography.bodyLg,
              color: publicColors.textSecondary,
              lineHeight: 1.75,
            }}
          >
            Each vertical gets its own workflow — same intelligence underneath, tuned for how
            you actually move people across borders.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {verticals.map(
            ({ id, Icon, tag, title, description, href, accent, surface, metrics, visual: Visual }) => (
              <Grid size={{ xs: 12, md: 4 }} key={id}>
                <Card
                  sx={{
                    height: '100%',
                    p: publicLayout.cardPadding,
                    borderRadius: publicLayout.cardRadius,
                    border: `1px solid ${publicColors.border}`,
                    boxShadow: publicShadows.card,
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: publicShadows.cardHover,
                      borderColor: accent,
                    },
                  }}
                >
                  <Box
                    sx={{
                      height: 140,
                      mb: 3,
                      borderRadius: '16px',
                      background: `linear-gradient(135deg, ${surface} 0%, #fff 100%)`,
                      border: `1px solid ${publicColors.borderSoft}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                    }}
                  >
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: '16px',
                        bgcolor: accent,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 12px 28px ${accent}44`,
                      }}
                    >
                      <Visual size={28} color="#fff" strokeWidth={2} />
                    </Box>
                    <Icon
                      size={20}
                      color={accent}
                      style={{ position: 'absolute', top: 16, left: 16, opacity: 0.5 }}
                    />
                  </Box>

                  <Chip
                    label={tag}
                    size="small"
                    sx={{
                      alignSelf: 'flex-start',
                      mb: 2,
                      fontWeight: 700,
                      fontSize: '11px',
                      letterSpacing: '0.5px',
                      bgcolor: surface,
                      color: accent,
                      border: 'none',
                    }}
                  />

                  <Typography
                    sx={{
                      fontFamily: publicFonts.heading,
                      fontSize: publicTypography.h3,
                      fontWeight: 700,
                      color: publicColors.navy,
                      mb: 2,
                    }}
                  >
                    {title}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: publicTypography.body,
                      color: publicColors.textSecondary,
                      lineHeight: 1.75,
                      flex: 1,
                      mb: 3,
                    }}
                  >
                    {description}
                  </Typography>

                  <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, mb: 3 }}>
                    {metrics.map(m => (
                      <Chip
                        key={m}
                        label={m}
                        size="small"
                        sx={{
                          fontSize: '12px',
                          fontWeight: 600,
                          bgcolor: publicColors.surfaceAlt,
                          color: publicColors.textSecondary,
                        }}
                      />
                    ))}
                  </Stack>

                  <Button
                    href={href}
                    endIcon={<ArrowRight size={16} />}
                    sx={{
                      alignSelf: 'flex-start',
                      color: accent,
                      fontWeight: 700,
                      fontSize: '15px',
                      textTransform: 'none',
                      px: 0,
                      '&:hover': { bgcolor: 'transparent', opacity: 0.85 },
                    }}
                  >
                    Explore workflow
                  </Button>
                </Card>
              </Grid>
            ),
          )}
        </Grid>
      </PublicContainer>
    </Box>
  )
}
