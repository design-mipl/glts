import { Box, Typography, Grid, Card, Stack, Chip } from '@mui/material'
import { User, Anchor, Building2, ArrowRight, Upload, Ship, BarChart3 } from 'lucide-react'
import { PublicContainer } from '../../../components/PublicContainer'
import { publicFonts, publicLightColors, usePublicBrandColors } from '../../../theme/publicSiteTokens'

const verticals = [
  {
    id: 'retail',
    Icon: User,
    tag: 'Retail travelers',
    title: 'For my own trip',
    description:
      'Upload once, get matched to the right visa, track every embassy milestone.',
    href: '/retail',
    accent: publicLightColors.greenBright,
    surface: '#F0FDF4',
    metrics: ['5 min apply', 'Live tracking', 'Doc checklist'],
    visual: Upload,
  },
  {
    id: 'marine',
    Icon: Anchor,
    tag: 'Marine / Seafarers',
    title: 'Crew, vessels, ports',
    description: 'Bulk manifests, CDC validation, and port-of-call clearance at scale.',
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
    description: 'Approvals, cost centers, SLA dashboards, and audit-ready logs.',
    href: '/business',
    accent: '#F59E0B',
    surface: '#FFFBEB',
    metrics: ['SSO · SCIM', 'Bulk apply', 'SLA reports'],
    visual: BarChart3,
  },
]

export function FeaturesSection() {
  const colors = usePublicBrandColors()
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 5, md: 7 },
        backgroundColor: colors.white,
        borderTop: `1px solid ${colors.border}`,
      }}
    >
      <PublicContainer>
        <Box sx={{ mb: { xs: 3, md: 4 } }}>
          <Typography
            sx={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: colors.greenBright,
              mb: 1,
            }}
          >
            Who we serve
          </Typography>
          <Typography
            component="h2"
            sx={{
              fontFamily: publicFonts.heading,
              fontSize: { xs: '22px', md: '28px' },
              fontWeight: 800,
              color: colors.navy,
              lineHeight: 1.2,
              mb: 1,
            }}
          >
            One engine. Three operational journeys.
          </Typography>
          <Typography sx={{ fontSize: '14px', color: colors.textSecondary, lineHeight: 1.55, maxWidth: 560 }}>
            Same intelligence underneath — tuned for retail, marine, and corporate workflows.
          </Typography>
        </Box>

        <Grid container spacing={2}>
          {verticals.map(
            ({ id, Icon, tag, title, description, href, accent, surface, metrics, visual: Visual }) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={id}>
                <Card
                  component="a"
                  href={href}
                  sx={{
                    height: '100%',
                    p: 2,
                    borderRadius: '12px',
                    border: `1px solid ${colors.border}`,
                    boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    textDecoration: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      borderColor: accent,
                      boxShadow: '0 4px 16px rgba(15, 23, 42, 0.08)',
                    },
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '10px',
                        bgcolor: accent,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Visual size={18} color="#fff" strokeWidth={2.5} />
                    </Box>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Chip
                        label={tag}
                        size="small"
                        sx={{
                          height: 22,
                          fontWeight: 700,
                          fontSize: '10px',
                          letterSpacing: '0.03em',
                          bgcolor: surface,
                          color: accent,
                          mb: 0.5,
                          '& .MuiChip-label': { px: 1 },
                        }}
                      />
                      <Typography
                        sx={{
                          fontFamily: publicFonts.heading,
                          fontSize: '16px',
                          fontWeight: 700,
                          color: colors.navy,
                          lineHeight: 1.25,
                        }}
                      >
                        {title}
                      </Typography>
                    </Box>
                    <Icon size={16} color={accent} style={{ opacity: 0.35, flexShrink: 0 }} />
                  </Stack>

                  <Typography
                    sx={{
                      fontSize: '13px',
                      color: colors.textSecondary,
                      lineHeight: 1.5,
                      mb: 1.5,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {description}
                  </Typography>

                  <Stack direction="row" spacing={0.75} sx={{ flexWrap: 'wrap', gap: 0.75, mb: 1.5 }}>
                    {metrics.map(m => (
                      <Chip
                        key={m}
                        label={m}
                        size="small"
                        sx={{
                          height: 22,
                          fontSize: '10px',
                          fontWeight: 600,
                          bgcolor: colors.surface,
                          color: colors.textSecondary,
                          '& .MuiChip-label': { px: 0.75 },
                        }}
                      />
                    ))}
                  </Stack>

                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={0.5}
                    sx={{ mt: 'auto', color: accent, fontWeight: 700, fontSize: '13px' }}
                  >
                    <span>Explore workflow</span>
                    <ArrowRight size={14} />
                  </Stack>
                </Card>
              </Grid>
            ),
          )}
        </Grid>
      </PublicContainer>
    </Box>
  )
}
