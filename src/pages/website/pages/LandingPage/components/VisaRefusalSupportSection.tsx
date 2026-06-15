import { Box, Typography, Button, Stack } from '@mui/material'
import { AlertCircle, ArrowRight } from 'lucide-react'
import { PublicContainer } from '../../../components/PublicContainer'
import { landingSectionPy } from '../landingPageSpacing'
import { publicFonts, usePublicBrandColors, getMarketingPrimaryButtonSx } from '@/shared/theme/publicBrand'

export function VisaRefusalSupportSection() {
  const colors = usePublicBrandColors()

  return (
    <Box
      id="refusal-support"
      component="section"
      sx={{
        bgcolor: colors.navy,
        py: landingSectionPy,
        borderTop: `1px solid rgba(255, 255, 255, 0.08)`,
      }}
    >
      <PublicContainer variant="hero">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'flex-start', md: 'center' },
            justifyContent: 'space-between',
            gap: 3,
            p: { xs: 3, md: 4 },
            borderRadius: '20px',
            bgcolor: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
          }}
        >
          <Stack direction="row" spacing={2.5} alignItems="flex-start" sx={{ flex: 1 }}>
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: '14px',
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <AlertCircle size={24} color={colors.greenBright} strokeWidth={2.25} />
            </Box>
            <Box>
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
                Visa Refusal Support
              </Typography>
              <Typography
                component="h2"
                sx={{
                  fontFamily: publicFonts.heading,
                  fontSize: { xs: '22px', md: '28px' },
                  fontWeight: 800,
                  color: '#fff',
                  lineHeight: 1.2,
                  mb: 1.25,
                }}
              >
                Visa rejected?
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: '15px', md: '16px' },
                  color: 'rgba(255, 255, 255, 0.7)',
                  lineHeight: 1.65,
                  maxWidth: 560,
                }}
              >
                We help identify refusal reasons, strengthen documentation, and improve reapplication
                success — so your next submission is embassy-ready.
              </Typography>
            </Box>
          </Stack>

          <Button
            variant="contained"
            href="/track"
            endIcon={<ArrowRight size={16} />}
            sx={{
              ...getMarketingPrimaryButtonSx(colors),
              flexShrink: 0,
              alignSelf: { xs: 'stretch', md: 'center' },
              px: 3.5,
            }}
          >
            Get Refusal Assessment
          </Button>
        </Box>
      </PublicContainer>
    </Box>
  )
}
