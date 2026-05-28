import { Box, Typography, Stack } from '@mui/material'
import { ArrowRight, Layers } from 'lucide-react'
import { getCountryById } from '@/shared/services/visaService'
import type { Country } from '@/shared/types/visa'
import { publicFonts, publicShadows, publicTypography, usePublicBrandColors } from '@/shared/theme/publicBrand'

/** Destinations commonly bundled with the current application */
const RELATED_COUNTRY_IDS = ['4', '7', '3']

function formatPrice(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`
}

interface OftenAppliedWithSectionProps {
  country: Country
}

export function OftenAppliedWithSection({ country }: OftenAppliedWithSectionProps) {
  const colors = usePublicBrandColors()
  const related = RELATED_COUNTRY_IDS.map(id => getCountryById(id))
    .filter((c): c is Country => c != null && c.id !== country.id)
    .slice(0, 3)

  if (related.length === 0) return null

  return (
    <Box sx={{ mt: 5 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={1.5}
        sx={{ mb: 2.5 }}
      >
        <Box>
          <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 0.5 }}>
            <Layers size={18} color={colors.greenBright} />
            <Typography
              sx={{
                fontFamily: publicFonts.heading,
                fontWeight: 800,
                fontSize: publicTypography.h3,
                color: colors.navy,
              }}
            >
              Often applied with
            </Typography>
          </Stack>
          <Typography sx={{ fontSize: '14px', color: colors.textSecondary, lineHeight: 1.5 }}>
            Travelers frequently bundle these visas with {country.name}.
          </Typography>
        </Box>
        <Typography
          component="a"
          href="/countries"
          sx={{
            fontSize: '14px',
            fontWeight: 600,
            color: colors.greenBright,
            textDecoration: 'none',
            flexShrink: 0,
            '&:hover': { color: colors.greenDark, textDecoration: 'underline' },
          }}
        >
          View all destinations
        </Typography>
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: `repeat(${Math.min(related.length, 3)}, 1fr)`,
          },
          gap: 1.5,
        }}
      >
        {related.map(relatedCountry => (
          <Box
            key={relatedCountry.id}
            component="a"
            href={`/countries/${relatedCountry.id}`}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              p: 2,
              borderRadius: '16px',
              textDecoration: 'none',
              color: 'inherit',
              bgcolor: colors.white,
              border: `1px solid ${colors.border}`,
              boxShadow: publicShadows.card,
              transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.2s',
              '&:hover': {
                borderColor: colors.greenBright,
                boxShadow: publicShadows.cardHover,
                transform: 'translateY(-2px)',
                '& .often-applied-arrow': {
                  bgcolor: colors.greenMuted,
                  color: colors.greenBright,
                },
              },
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '14px',
                bgcolor: colors.surfaceAlt,
                border: `1px solid ${colors.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '26px',
                lineHeight: 1,
                flexShrink: 0,
              }}
            >
              {relatedCountry.flags}
            </Box>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: '15px',
                  color: colors.navy,
                  lineHeight: 1.25,
                  mb: 0.25,
                }}
              >
                {relatedCountry.name}
              </Typography>
              <Typography sx={{ fontSize: '12px', color: colors.textMuted, mb: 0.5 }}>
                {relatedCountry.visaCategory} · {relatedCountry.processingTime}
              </Typography>
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: 800,
                  color: colors.greenDark,
                }}
              >
                From {formatPrice(relatedCountry.price)}
              </Typography>
            </Box>

            <Box
              className="often-applied-arrow"
              sx={{
                width: 32,
                height: 32,
                borderRadius: '10px',
                bgcolor: colors.surfaceAlt,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                color: colors.textMuted,
                transition: 'background-color 0.2s, color 0.2s',
              }}
            >
              <ArrowRight size={16} />
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
