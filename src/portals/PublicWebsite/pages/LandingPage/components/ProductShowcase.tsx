import { Box, Typography, Grid, Card, Stack, Chip } from '@mui/material'
import { LayoutDashboard, Users, FileStack, Activity } from 'lucide-react'
import { PublicContainer } from '../../../components/PublicContainer'
import {
  publicColors,
  publicFonts,
  publicLayout,
  publicShadows,
  publicTypography,
} from '../../../theme/publicSiteTokens'

const previews = [
  {
    icon: LayoutDashboard,
    title: 'Application command center',
    description: 'Every traveler on one timeline — status, documents, embassy events, and SLA risk.',
    chips: ['Live embassy feed', 'SLA alerts', 'Doc gaps'],
  },
  {
    icon: Users,
    title: 'Bulk crew onboarding',
    description: 'Upload manifests, validate seaman books, and clear port-of-call in parallel batches.',
    chips: ['CSV import', 'Vessel view', 'Port tracking'],
  },
  {
    icon: FileStack,
    title: 'Document verification',
    description: 'OCR confidence, mandatory checks, and embassy-specific requirements before submission.',
    chips: ['Auto-validate', 'Version history', 'Embassy rules'],
  },
  {
    icon: Activity,
    title: 'Approval pipeline',
    description: 'Stage-by-stage visibility from intake to passport collection with audit-ready logs.',
    chips: ['Pipeline view', 'Audit log', 'Notifications'],
  },
]

export function ProductShowcase() {
  return (
    <Box
      component="section"
      sx={{
        py: publicLayout.sectionMajor,
        bgcolor: publicColors.navy,
        color: '#fff',
      }}
    >
      <PublicContainer>
        <Grid container spacing={{ xs: 6, lg: 10 }} alignItems="center">
          <Grid size={{ xs: 12, lg: 5 }}>
            <Typography
              sx={{
                fontSize: publicTypography.overline,
                fontWeight: 700,
                letterSpacing: '1.2px',
                textTransform: 'uppercase',
                color: publicColors.green,
                mb: 2,
              }}
            >
              Product depth
            </Typography>
            <Typography
              component="h2"
              sx={{
                fontFamily: publicFonts.heading,
                fontSize: publicTypography.h2,
                fontWeight: 800,
                lineHeight: 1.15,
                mb: 3,
              }}
            >
              Operational UI built for real visa teams.
            </Typography>
            <Typography
              sx={{
                fontSize: publicTypography.bodyLg,
                color: 'rgba(255,255,255,0.72)',
                lineHeight: 1.75,
                mb: 4,
              }}
            >
              Dashboards, bulk tools, and tracking surfaces your team actually uses — not marketing
              mockups.
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, lg: 7 }}>
            <Grid container spacing={3}>
              {previews.map(({ icon: Icon, title, description, chips }) => (
                <Grid size={{ xs: 12, sm: 6 }} key={title}>
                  <Card
                    sx={{
                      p: 3.5,
                      height: '100%',
                      borderRadius: '20px',
                      bgcolor: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      boxShadow: 'none',
                      transition: 'all 0.3s',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.1)',
                        transform: 'translateY(-4px)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '12px',
                        bgcolor: 'rgba(118, 199, 107, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2.5,
                      }}
                    >
                      <Icon size={22} color={publicColors.green} />
                    </Box>
                    <Typography sx={{ fontWeight: 700, fontSize: '18px', mb: 1.5 }}>{title}</Typography>
                    <Typography
                      sx={{
                        fontSize: '15px',
                        color: 'rgba(255,255,255,0.65)',
                        lineHeight: 1.65,
                        mb: 2.5,
                      }}
                    >
                      {description}
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {chips.map(c => (
                        <Chip
                          key={c}
                          label={c}
                          size="small"
                          sx={{
                            fontSize: '11px',
                            fontWeight: 600,
                            bgcolor: 'rgba(255,255,255,0.08)',
                            color: 'rgba(255,255,255,0.85)',
                            border: '1px solid rgba(255,255,255,0.12)',
                          }}
                        />
                      ))}
                    </Stack>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>

        {/* Mock dashboard strip */}
        <Card
          sx={{
            mt: { xs: 8, md: 12 },
            p: { xs: 2, md: 3 },
            borderRadius: publicLayout.cardRadius,
            bgcolor: '#fff',
            boxShadow: publicShadows.float,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              mb: 2,
              px: 1,
            }}
          >
            {['#EF4444', '#F59E0B', '#10B981'].map(c => (
              <Box key={c} sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: c }} />
            ))}
          </Box>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '240px 1fr 200px' },
              gap: 2,
              minHeight: 220,
            }}
          >
            <Box sx={{ bgcolor: publicColors.surface, borderRadius: '12px', p: 2 }}>
              {['Applications', 'Crew', 'Documents', 'Reports'].map((item, i) => (
                <Typography
                  key={item}
                  sx={{
                    py: 1.25,
                    px: 1.5,
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: i === 0 ? 700 : 500,
                    bgcolor: i === 0 ? publicColors.greenMuted : 'transparent',
                    color: publicColors.navy,
                  }}
                >
                  {item}
                </Typography>
              ))}
            </Box>
            <Box sx={{ bgcolor: publicColors.surface, borderRadius: '12px', p: 2.5 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '15px', color: publicColors.navy, mb: 2 }}>
                Active applications
              </Typography>
              {[
                { name: 'Schengen · Priya M.', status: 'Embassy review', pct: 72 },
                { name: 'UAE · Crew batch #12', status: 'Docs validated', pct: 45 },
                { name: 'Japan · Acme Corp', status: 'Submitted', pct: 88 },
              ].map(row => (
                <Stack key={row.name} spacing={0.75} sx={{ mb: 2 }}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>{row.name}</Typography>
                    <Typography sx={{ fontSize: '12px', color: publicColors.greenBright }}>{row.status}</Typography>
                  </Stack>
                  <Box sx={{ height: 4, borderRadius: 2, bgcolor: publicColors.border }}>
                    <Box
                      sx={{
                        width: `${row.pct}%`,
                        height: '100%',
                        borderRadius: 2,
                        bgcolor: publicColors.greenBright,
                      }}
                    />
                  </Box>
                </Stack>
              ))}
            </Box>
            <Box sx={{ bgcolor: publicColors.greenMuted, borderRadius: '12px', p: 2.5 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '14px', color: '#047857', mb: 1 }}>
                Today
              </Typography>
              <Typography sx={{ fontSize: '32px', fontWeight: 800, color: publicColors.navy }}>24</Typography>
              <Typography sx={{ fontSize: '13px', color: publicColors.textSecondary }}>approvals</Typography>
            </Box>
          </Box>
        </Card>
      </PublicContainer>
    </Box>
  )
}
