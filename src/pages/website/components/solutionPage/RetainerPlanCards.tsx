import { Box, Grid, Typography } from '@mui/material'
import { Check } from 'lucide-react'
import { publicFonts, usePublicBrandColors, brandPrimaryGreenRgb } from '../../theme/publicSiteTokens'

interface RetainerPlanCardsProps {
  items: readonly string[]
  subheading?: string
}

export function RetainerPlanCards({
  items,
  subheading = 'Retainer plans may include:',
}: RetainerPlanCardsProps) {
  const colors = usePublicBrandColors()

  return (
    <Box>
      <Typography sx={{ fontSize: '15px', fontWeight: 600, color: colors.navy, mb: 2.5 }}>
        {subheading}
      </Typography>

      <Grid container spacing={{ xs: 2, md: 2.5 }}>
        {items.map((item) => (
          <Grid key={item} size={{ xs: 12, sm: 6, lg: 4 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 1.5,
                height: '100%',
                p: { xs: 2.25, md: 2.5 },
                borderRadius: '16px',
                border: `1px solid ${colors.border}`,
                bgcolor: colors.white,
                boxShadow: '0 4px 20px rgba(15, 23, 42, 0.06)',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease',
                '@media (hover: hover)': {
                  '&:hover': {
                    borderColor: `rgba(${brandPrimaryGreenRgb}, 0.35)`,
                    boxShadow: '0 12px 32px rgba(15, 23, 42, 0.1)',
                    transform: 'translateY(-3px)',
                  },
                },
              }}
            >
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  bgcolor: colors.greenMuted,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Check size={14} color={colors.greenBright} strokeWidth={2.75} />
              </Box>

              <Typography
                sx={{
                  fontFamily: publicFonts.heading,
                  fontSize: { xs: '15px', md: '16px' },
                  fontWeight: 700,
                  color: colors.navy,
                  lineHeight: 1.45,
                  pt: 0.25,
                }}
              >
                {item}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
