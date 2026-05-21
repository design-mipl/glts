import { Box, Card, Typography, Chip, Button, LinearProgress } from '@mui/material'
import type { Country } from '../../../../../shared/types/visa'
import {
  publicColors,
  publicLayout,
  publicShadows,
  publicFonts,
} from '../../../theme/publicSiteTokens'

interface CountryCardProps {
  country: Country
}

export function CountryCard({ country }: CountryCardProps) {
  const scoreColor =
    country.rating >= 90 ? publicColors.greenBright : country.rating >= 75 ? '#F59E0B' : '#EF4444'

  return (
    <Card
      component="a"
      href={`/countries/${country.id}`}
      sx={{
        p: 4,
        height: '100%',
        borderRadius: publicLayout.cardRadius,
        border: `1px solid ${publicColors.border}`,
        boxShadow: publicShadows.card,
        textDecoration: 'none',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.35s ease',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: publicShadows.cardHover,
          borderColor: publicColors.greenBright,
        },
      }}
    >
      <Typography sx={{ fontSize: '52px', lineHeight: 1, mb: 3 }}>{country.flags}</Typography>

      <Typography
        sx={{
          fontFamily: publicFonts.heading,
          fontWeight: 700,
          fontSize: '22px',
          color: publicColors.navy,
          mb: 0.5,
        }}
      >
        {country.name}
      </Typography>
      <Typography sx={{ fontSize: '15px', color: publicColors.textSecondary, mb: 3 }}>
        {country.region}
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography sx={{ fontSize: '12px', fontWeight: 700, color: publicColors.textMuted }}>
            APPROVAL
          </Typography>
          <Typography sx={{ fontWeight: 700, color: publicColors.navy }}>{country.rating}%</Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={country.rating}
          sx={{
            height: 6,
            borderRadius: 3,
            bgcolor: publicColors.surfaceAlt,
            '& .MuiLinearProgress-bar': { bgcolor: scoreColor, borderRadius: 3 },
          }}
        />
      </Box>

      <Box sx={{ flex: 1, mb: 4, pb: 4, borderBottom: `1px solid ${publicColors.border}` }}>
        <Box sx={{ mb: 2.5 }}>
          <Typography sx={{ fontSize: '11px', fontWeight: 700, color: publicColors.textMuted, mb: 0.5 }}>
            ETA
          </Typography>
          <Typography sx={{ fontWeight: 700, fontSize: '17px', color: publicColors.navy }}>
            {country.processingTime}
          </Typography>
        </Box>
        <Box>
          <Typography sx={{ fontSize: '11px', fontWeight: 700, color: publicColors.textMuted, mb: 0.5 }}>
            FROM
          </Typography>
          <Typography sx={{ fontWeight: 700, fontSize: '17px', color: publicColors.navy }}>
            ₹{country.price.toLocaleString('en-IN')}
          </Typography>
        </Box>
      </Box>

      {country.trending && (
        <Chip
          label="Trending"
          size="small"
          sx={{ alignSelf: 'flex-start', mb: 2, bgcolor: '#FEF3C7', color: '#92400E', fontWeight: 700 }}
        />
      )}

      <Button
        variant="contained"
        fullWidth
        sx={{
          py: 1.5,
          borderRadius: '12px',
          fontWeight: 700,
          textTransform: 'none',
          bgcolor: publicColors.greenBright,
          pointerEvents: 'none',
          '&:hover': { bgcolor: publicColors.greenDark },
        }}
      >
        View details
      </Button>
    </Card>
  )
}
