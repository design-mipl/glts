import { Box, Grid, Typography, Button, Stack } from '@mui/material'
import { Anchor, Building2, ArrowRight } from 'lucide-react'
import { PublicContainer } from '../../../components/PublicContainer'
import {
  publicLayout,
  publicTypography,
  publicFonts,
  usePublicBrandColors,
  getMarketingPrimaryButtonSx,
} from '../../../theme/publicSiteTokens'

export function PortalCards() {
  const colors = usePublicBrandColors()
  return (
    <Box>
      <Box sx={{ backgroundColor: colors.navy, py: publicLayout.sectionMedium }}>
        <PublicContainer>
          <Grid container spacing={5} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  backgroundColor: 'rgba(16,185,129,0.15)',
                  border: '1px solid rgba(16,185,129,0.3)',
                  borderRadius: '6px',
                  px: 1.5,
                  py: 0.5,
                  mb: 2.5,
                }}
              >
                <Anchor size={13} color="#10B981" />
                <Typography sx={{ color: '#10B981', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                  MARINE CREW
                </Typography>
              </Box>

              <Typography
                sx={{
                  color: '#fff',
                  fontWeight: 800,
                  fontFamily: publicFonts.heading,
                  fontSize: publicTypography.h2,
                  mb: 2,
                  lineHeight: 1.2,
                }}
              >
                Bulk visas for vessels &amp; seafarers.
              </Typography>

              <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '15px', lineHeight: 1.7, mb: 4, maxWidth: 480 }}>
                Upload a crew manifest. We handle port-of-call clearance, transit visas and seaman
                book validation. A single workspace per vessel — off-signers and on-signers on one timeline.
              </Typography>

              <Button
                variant="contained"
                href="/business"
                endIcon={<ArrowRight size={16} />}
                sx={{ ...getMarketingPrimaryButtonSx(colors), px: 4 }}
              >
                Onboard a fleet
              </Button>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Grid container spacing={2}>
                {[
                  { value: '1,240+', label: 'Crews onboarded' },
                  { value: '5.2 days', label: 'Avg turnaround' },
                  { value: '62', label: 'Port countries' },
                  { value: '8', label: 'Languages supported' },
                ].map(({ value, label }) => (
                  <Grid size={{ xs: 6 }} key={label}>
                    <Box
                      sx={{
                        backgroundColor: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: publicLayout.cardRadius,
                        p: 4,
                      }}
                    >
                      <Typography sx={{ color: '#10B981', fontWeight: 800, fontSize: '28px', lineHeight: 1.1, mb: 0.5 }}>
                        {value}
                      </Typography>
                      <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '12px' }}>
                        {label}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </PublicContainer>
      </Box>

      <Box sx={{ backgroundColor: '#fff', py: publicLayout.sectionMedium, borderBottom: `1px solid ${colors.border}` }}>
        <PublicContainer>
          <Grid container spacing={5} alignItems="center" direction={{ xs: 'column', md: 'row' }}>
            <Grid size={{ xs: 12, md: 6 }} order={{ xs: 2, md: 1 }}>
              <Grid container spacing={2}>
                {[
                  { value: '480', label: 'Teams onboarded' },
                  { value: '38k', label: 'Travelers managed' },
                  { value: '27%', label: 'Avg cost saving' },
                  { value: '14 days', label: 'To first batch' },
                ].map(({ value, label }) => (
                  <Grid size={{ xs: 6 }} key={label}>
                    <Box
                      sx={{
                        backgroundColor: '#F9FAFB',
                        border: '1px solid #F3F4F6',
                        borderRadius: publicLayout.cardRadius,
                        p: 4,
                      }}
                    >
                      <Typography sx={{ color: '#001F3F', fontWeight: 800, fontSize: '28px', lineHeight: 1.1, mb: 0.5 }}>
                        {value}
                      </Typography>
                      <Typography sx={{ color: '#9CA3AF', fontSize: '12px' }}>
                        {label}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }} order={{ xs: 1, md: 2 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  backgroundColor: '#FFFBEB',
                  border: '1px solid #FDE68A',
                  borderRadius: '6px',
                  px: 1.5,
                  py: 0.5,
                  mb: 2.5,
                }}
              >
                <Building2 size={13} color="#D97706" />
                <Typography sx={{ color: '#D97706', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                  CORPORATE
                </Typography>
              </Box>

              <Typography
                sx={{
                  color: colors.navy,
                  fontWeight: 800,
                  fontFamily: publicFonts.heading,
                  fontSize: publicTypography.h2,
                  mb: 2,
                  lineHeight: 1.2,
                }}
              >
                Visa ops for distributed teams.
              </Typography>

              <Typography sx={{ color: '#6B7280', fontSize: '15px', lineHeight: 1.7, mb: 3, maxWidth: 480 }}>
                A control panel for HR &amp; travel managers. SLA dashboards, cost centers, and audit
                logs — built for teams who hate spreadsheets.
              </Typography>

              <Stack spacing={1} sx={{ mb: 4 }}>
                {[
                  'One-click bulk applications via CSV upload',
                  'Audit-grade trail — every action timestamped',
                  'SAML SSO + SCIM provisioning out of the box',
                  'Cost-center billing per department or project',
                ].map(item => (
                  <Box key={item} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <Box sx={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, mt: 0.15 }}>
                      <Typography sx={{ color: '#10B981', fontSize: '9px', fontWeight: 800 }}>✓</Typography>
                    </Box>
                    <Typography sx={{ fontSize: '14px', color: '#374151' }}>{item}</Typography>
                  </Box>
                ))}
              </Stack>

              <Button
                variant="contained"
                href="/business"
                endIcon={<ArrowRight size={16} />}
                sx={{
                  ...getMarketingPrimaryButtonSx(colors),
                  bgcolor: colors.navy,
                  px: 4,
                  '&:hover': { bgcolor: colors.navyMid },
                }}
              >
                Set up your team
              </Button>
            </Grid>
          </Grid>
        </PublicContainer>
      </Box>
    </Box>
  )
}
