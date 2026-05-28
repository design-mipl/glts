import { Box, Typography, Stack, Chip, Grid } from '@mui/material'
import {
  Upload,
  ScanLine,
  Cpu,
  FileCheck,
  Send,
  Radar,
  CheckCircle2,
} from 'lucide-react'
import { PublicContainer } from '../../../components/PublicContainer'
import { publicFonts, publicLayout, publicTypography, usePublicBrandColors } from '../../../theme/publicSiteTokens'

const workflowSteps = [
  { icon: Upload, label: 'Passport upload', status: 'done' },
  { icon: ScanLine, label: 'OCR extraction', status: 'done' },
  { icon: Cpu, label: 'Visa match', status: 'active' },
  { icon: FileCheck, label: 'Doc validation', status: 'upcoming' },
  { icon: Send, label: 'Embassy submit', status: 'upcoming' },
  { icon: Radar, label: 'Live tracking', status: 'upcoming' },
  { icon: CheckCircle2, label: 'Approval', status: 'upcoming' },
]

export function HowItWorks() {
  const colors = usePublicBrandColors()
  return (
    <Box
      component="section"
      sx={{
        py: publicLayout.sectionMajor,
        background: `linear-gradient(180deg, ${colors.surface} 0%, #fff 100%)`,
      }}
    >
      <PublicContainer>
        <Box sx={{ maxWidth: 720, mb: { xs: 8, md: 10 } }}>
          <Typography
            sx={{
              fontSize: publicTypography.overline,
              fontWeight: 700,
              letterSpacing: '1.2px',
              textTransform: 'uppercase',
              color: colors.greenBright,
              mb: 2,
            }}
          >
            Operational workflow
          </Typography>
          <Typography
            component="h2"
            sx={{
              fontFamily: publicFonts.heading,
              fontSize: publicTypography.h2,
              fontWeight: 800,
              color: colors.navy,
              lineHeight: 1.15,
              mb: 3,
            }}
          >
            From passport photo to stamped approval.
          </Typography>
          <Typography sx={{ fontSize: publicTypography.bodyLg, color: colors.textSecondary, lineHeight: 1.75 }}>
            Automated extraction, intelligent routing, and live embassy telemetry — no manual
            retyping, no blind spots.
          </Typography>
        </Box>

        <Box
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: publicLayout.cardRadius,
            bgcolor: '#fff',
            border: `1px solid ${colors.border}`,
            boxShadow: '0 4px 24px rgba(15, 23, 42, 0.06)',
            overflowX: 'auto',
          }}
        >
          <Stack
            direction="row"
            spacing={{ xs: 2, md: 0 }}
            sx={{
              minWidth: { xs: 720, md: 'auto' },
              justifyContent: { md: 'space-between' },
              alignItems: 'flex-start',
              position: 'relative',
            }}
          >
            <Box
              sx={{
                display: { md: 'block' },
                position: 'absolute',
                top: 28,
                left: '6%',
                right: '6%',
                height: 2,
                bgcolor: colors.surfaceAlt,
                zIndex: 0,
              }}
            />
            {workflowSteps.map((step, i) => {
              const Icon = step.icon
              const isDone = step.status === 'done'
              const isActive = step.status === 'active'
              return (
                <Stack
                  key={step.label}
                  alignItems="center"
                  spacing={2}
                  sx={{
                    flex: { md: 1 },
                    minWidth: 100,
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: isDone
                        ? colors.greenBright
                        : isActive
                          ? colors.navy
                          : colors.surfaceAlt,
                      color: isDone || isActive ? '#fff' : colors.textMuted,
                      boxShadow: isActive ? '0 8px 24px rgba(0,31,63,0.2)' : 'none',
                      border: isActive ? `2px solid ${colors.greenBright}` : 'none',
                    }}
                  >
                    <Icon size={24} strokeWidth={2} />
                  </Box>
                  <Typography
                    sx={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: isActive ? colors.navy : colors.textSecondary,
                      textAlign: 'center',
                      maxWidth: 100,
                    }}
                  >
                    {step.label}
                  </Typography>
                  {isActive && (
                    <Chip
                      label="In progress"
                      size="small"
                      sx={{
                        height: 22,
                        fontSize: '10px',
                        fontWeight: 700,
                        bgcolor: colors.greenMuted,
                        color: colors.greenDark,
                      }}
                    />
                  )}
                  {i < workflowSteps.length - 1 && (
                    <Typography
                      sx={{
                        display: { xs: 'none', md: 'block' },
                        position: 'absolute',
                        top: 26,
                        right: -12,
                        color: colors.textMuted,
                        fontSize: '12px',
                      }}
                    >
                      →
                    </Typography>
                  )}
                </Stack>
              )
            })}
          </Stack>
        </Box>

        <Grid container spacing={4} sx={{ mt: { xs: 6, md: 8 } }}>
          {[
            {
              title: 'Scan your passport',
              body: 'Drop one photo. We extract every field with confidence scores — nothing typed manually.',
            },
            {
              title: 'Greenlight matches a visa',
              body: 'Nationality, purpose, and history cross-checked. Simplest valid path surfaced before you file.',
            },
            {
              title: 'Track to approval',
              body: 'Embassy and VFS status in real time. Interviews, documents, and passport collection in one feed.',
            },
          ].map(item => (
            <Grid size={{ xs: 12, md: 4 }} key={item.title}>
              <Box sx={{ p: 4, borderRadius: '18px', bgcolor: colors.surface, height: '100%' }}>
                <Typography
                  sx={{
                    fontFamily: publicFonts.heading,
                    fontWeight: 700,
                    fontSize: '20px',
                    color: colors.navy,
                    mb: 1.5,
                  }}
                >
                  {item.title}
                </Typography>
                <Typography sx={{ fontSize: publicTypography.body, color: colors.textSecondary, lineHeight: 1.7 }}>
                  {item.body}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </PublicContainer>
    </Box>
  )
}
