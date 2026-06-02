import { useState } from 'react'
import { Box, Typography, Card, Chip } from '@mui/material'
import type { Country } from '@/shared/types/visa'
import { getCountryHeroImageUrl } from '@/shared/services/visaService'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { isFastVisa } from '@/shared/utils/countryDisplay'

interface CustomerCountryCardProps {
  country: Country
  selected: boolean
  onSelect: () => void
}

export function CustomerCountryCard({ country, selected, onSelect }: CustomerCountryCardProps) {
  const colors = usePublicBrandColors()
  const [imgError, setImgError] = useState(false)
  const fast = isFastVisa(country)

  return (
    <Card
      onClick={onSelect}
      sx={{
        cursor: 'pointer',
        borderRadius: '14px',
        overflow: 'hidden',
        border: `2px solid ${selected ? colors.greenBright : colors.border}`,
        bgcolor: selected ? colors.greenMuted : '#fff',
        boxShadow: selected ? '0 0 0 1px rgba(115, 192, 100, 0.2)' : '0 1px 3px rgba(15,23,42,0.06)',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        '&:hover': { borderColor: colors.greenBright },
      }}
    >
      <Box sx={{ position: 'relative', height: 100, bgcolor: colors.surfaceAlt }}>
        {imgError ? (
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `linear-gradient(145deg, ${colors.navyLight} 0%, ${colors.navy} 100%)`,
            }}
          >
            <Typography sx={{ fontSize: '40px', lineHeight: 1 }}>{country.flags}</Typography>
          </Box>
        ) : (
          <Box
            component="img"
            src={getCountryHeroImageUrl(country, 480)}
            alt={country.name}
            loading="lazy"
            onError={() => setImgError(true)}
            sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        )}
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            width: 28,
            height: 28,
            borderRadius: '50%',
            bgcolor: '#fff',
            border: `1px solid ${colors.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
          }}
        >
          {country.flags}
        </Box>
        {fast && (
          <Chip
            label="Fast"
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              height: 20,
              fontSize: '10px',
              fontWeight: 700,
              bgcolor: '#fff',
              color: colors.greenDark,
            }}
          />
        )}
      </Box>
      <Box sx={{ p: 1.25 }}>
        <Typography sx={{ fontWeight: 700, fontSize: '13px', color: colors.navy }}>{country.name}</Typography>
        <Typography sx={{ fontSize: '11px', color: colors.textMuted, mt: 0.25 }}>
          {country.visaCategory} · Valid till {country.validity}
        </Typography>
      </Box>
    </Card>
  )
}
