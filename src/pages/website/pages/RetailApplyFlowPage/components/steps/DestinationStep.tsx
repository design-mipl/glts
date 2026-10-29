import { useMemo, useState } from 'react'
import { Box, IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material'
import { Check, Search, Star } from 'lucide-react'
import { listPortalCountries } from '@/shared/services/countryMasterService'
import type { Country } from '@/shared/types/visa'
import { CountryFlagVisual } from '@/shared/components/CountryFlagVisual'
import { getCountryHeroImageUrl } from '@/shared/services/visaService'
import { useFavoriteCountries } from '@/pages/customer/features/applications/hooks/useFavoriteCountries'
import { orderCountriesForDisplay } from '@/pages/customer/features/applications/utils/orderCountriesForDisplay'
import {
  accentGoldRgb,
  applyFlow,
  applyFont,
  applyMotion,
  applyRadius,
  getSelectableSx,
} from '@/pages/website/theme/applyFlowTheme'
import { StepShell } from '../StepShell'

interface DestinationStepProps {
  countryId: string
  onSelect: (countryId: string) => void
  onBack: () => void
  onContinue: () => void
}

const destinationGridSx = {
  display: 'grid',
  gridTemplateColumns: {
    xs: 'repeat(2, minmax(0, 1fr))',
    sm: 'repeat(3, minmax(0, 1fr))',
    md: 'repeat(4, minmax(0, 1fr))',
    lg: 'repeat(5, minmax(0, 1fr))',
  },
  gap: 1.5,
  width: '100%',
} as const

function SectionLabel({ children }: { children: string }) {
  return (
    <Typography
      sx={{
        fontFamily: applyFont.mono,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.09em',
        textTransform: 'uppercase',
        color: applyFlow.inkFaint,
        mb: 1,
      }}
    >
      {children}
    </Typography>
  )
}

function CompactDestinationCard({
  country,
  selected,
  onSelect,
  isFavorite,
  onToggleFavorite,
}: {
  country: Country
  selected: boolean
  onSelect: () => void
  isFavorite: boolean
  onToggleFavorite: (countryId: string) => void
}) {
  const imageUrl = getCountryHeroImageUrl(country)
  const [imgError, setImgError] = useState(!imageUrl)
  const showFallback = imgError || !imageUrl

  return (
    <Box
      role="radio"
      aria-checked={selected}
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelect()
        }
      }}
      sx={{
        ...getSelectableSx(selected),
        textAlign: 'left',
        width: '100%',
        p: 0,
        overflow: 'hidden',
        borderRadius: applyRadius.control,
        position: 'relative',
        cursor: 'pointer',
      }}
    >
      <Box
        sx={{
          height: 72,
          bgcolor: applyFlow.canvas,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {showFallback ? (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `linear-gradient(145deg, ${applyFlow.railBgTop} 0%, ${applyFlow.railBg} 100%)`,
            }}
          >
            <CountryFlagVisual flag={country.flags} countryCode={country.code} size={28} />
          </Box>
        ) : (
          <Box
            component="img"
            src={imageUrl}
            alt=""
            loading="lazy"
            onError={() => setImgError(true)}
            sx={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
        <IconButton
          size="small"
          aria-label={isFavorite ? 'Remove from favourites' : 'Add to favourites'}
          onClick={(event) => {
            event.stopPropagation()
            event.preventDefault()
            onToggleFavorite(country.id)
          }}
          sx={{
            position: 'absolute',
            top: 4,
            left: 4,
            width: 26,
            height: 26,
            bgcolor: 'rgba(255, 255, 255, 0.94)',
            border: `1px solid ${applyFlow.hairline}`,
            zIndex: 2,
            '&:hover': { bgcolor: applyFlow.surface },
          }}
        >
          <Star
            size={13}
            fill={isFavorite ? applyFlow.accent : 'transparent'}
            color={isFavorite ? applyFlow.accentInk : applyFlow.inkFaint}
          />
        </IconButton>
        {selected ? (
          <Box
            aria-hidden
            sx={{
              position: 'absolute',
              top: 6,
              right: 6,
              width: 20,
              height: 20,
              borderRadius: '50%',
              bgcolor: applyFlow.accent,
              color: applyFlow.onAccent,
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <Check size={12} strokeWidth={3} />
          </Box>
        ) : null}
      </Box>
      <Box sx={{ px: 1.25, py: 1.1, display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
        <CountryFlagVisual flag={country.flags} countryCode={country.code} size={16} />
        <Typography
          sx={{
            fontFamily: applyFont.body,
            fontSize: 13,
            fontWeight: 600,
            color: applyFlow.ink,
            lineHeight: 1.25,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            minWidth: 0,
          }}
        >
          {country.name}
        </Typography>
      </Box>
    </Box>
  )
}

function DestinationGrid({
  countries,
  countryId,
  onSelect,
  isFavorite,
  onToggleFavorite,
}: {
  countries: Country[]
  countryId: string
  onSelect: (countryId: string) => void
  isFavorite: (id: string) => boolean
  onToggleFavorite: (id: string) => void
}) {
  return (
    <Box role="radiogroup" aria-label="Destination" sx={destinationGridSx}>
      {countries.map((country) => (
        <CompactDestinationCard
          key={country.id}
          country={country}
          selected={countryId === country.id}
          onSelect={() => onSelect(country.id)}
          isFavorite={isFavorite(country.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </Box>
  )
}

/**
 * Pre-purpose destination pick — full-width compact cards + search.
 * Favourites reuse the same portal storage as Marine / B2B / Corporate create.
 */
export function DestinationStep({
  countryId,
  onSelect,
  onBack,
  onContinue,
}: DestinationStepProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const { favoriteIds, isFavorite, toggleFavorite } = useFavoriteCountries()
  const countries = useMemo(() => listPortalCountries({ segment: 'retail', activeOnly: true }), [])

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase()
    if (!q) return countries
    return countries.filter(
      (country) =>
        country.name.toLowerCase().includes(q) ||
        country.code.toLowerCase().includes(q) ||
        (country.region ?? '').toLowerCase().includes(q),
    )
  }, [countries, searchTerm])

  const { favorites, others } = useMemo(
    () => orderCountriesForDisplay(filtered, favoriteIds, 'default'),
    [filtered, favoriteIds],
  )

  const hasFavorites = favorites.length > 0
  const totalCount = favorites.length + others.length

  return (
    <StepShell
      title="Where are you travelling?"
      helperText="Choose a destination to start this application. Star favourites to pin them at the top."
      onBack={onBack}
      backLabel="Cancel"
      onContinue={onContinue}
      continueDisabled={!countryId}
      contentMaxWidth="none"
    >
      <Stack spacing={2.5} sx={{ width: '100%' }}>
        <TextField
          placeholder="Search destinations…"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={16} color={applyFlow.inkFaint} />
              </InputAdornment>
            ),
          }}
          sx={{
            maxWidth: 420,
            '& .MuiOutlinedInput-root': {
              borderRadius: applyRadius.control,
              bgcolor: applyFlow.surface,
              fontSize: 13,
              fontFamily: applyFont.body,
              transition: `box-shadow 180ms ${applyMotion.easeOut}`,
              '& fieldset': { borderColor: applyFlow.hairline },
              '&:hover fieldset': { borderColor: applyFlow.accent },
              '&.Mui-focused fieldset': { borderColor: applyFlow.accent, borderWidth: 1.5 },
              '&.Mui-focused': { boxShadow: `0 0 0 3px rgba(${accentGoldRgb}, 0.12)` },
            },
          }}
        />

        {totalCount === 0 ? (
          <Typography sx={{ fontFamily: applyFont.body, fontSize: 14, color: applyFlow.inkMuted }}>
            No destinations match “{searchTerm.trim()}”. Try another search.
          </Typography>
        ) : hasFavorites ? (
          <Stack spacing={2.5}>
            <Box>
              <SectionLabel>Favourites</SectionLabel>
              <DestinationGrid
                countries={favorites}
                countryId={countryId}
                onSelect={onSelect}
                isFavorite={isFavorite}
                onToggleFavorite={toggleFavorite}
              />
            </Box>
            {others.length > 0 ? (
              <Box>
                <SectionLabel>All destinations</SectionLabel>
                <DestinationGrid
                  countries={others}
                  countryId={countryId}
                  onSelect={onSelect}
                  isFavorite={isFavorite}
                  onToggleFavorite={toggleFavorite}
                />
              </Box>
            ) : null}
          </Stack>
        ) : (
          <DestinationGrid
            countries={others}
            countryId={countryId}
            onSelect={onSelect}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
          />
        )}
      </Stack>
    </StepShell>
  )
}
