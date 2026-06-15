import { useMemo, useState } from 'react'
import {
  Box,
  Typography,
  Button,
  Stack,
  Grid,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getAllCountries } from '@/shared/services/visaService'
import { publicFonts, usePublicBrandColors } from '../../../theme/publicSiteTokens'
import { PublicContainer } from '../../../components/PublicContainer'
import { defaultExploreFilters, applyExploreFilters } from '../../../utils/applyExploreFilters'
import { DestinationListingCard } from '../../../components/DestinationListingCard'
import { landingSectionHeaderMb, landingSectionPy } from '../landingPageSpacing'

const HOMEPAGE_PAGE_SIZE = 8
const HOMEPAGE_MAX_VISIBLE = 12

export function ExploreSection() {
  const colors = usePublicBrandColors()
  const navigate = useNavigate()
  const [page, setPage] = useState(0)

  const countries = useMemo(() => {
    const list = applyExploreFilters(getAllCountries(), defaultExploreFilters)
    return [...list].sort((a, b) => {
      if (a.trending !== b.trending) return a.trending ? -1 : 1
      return b.trendingPercent - a.trendingPercent
    })
  }, [])

  const homepageCountries = useMemo(
    () => countries.slice(0, HOMEPAGE_MAX_VISIBLE),
    [countries],
  )
  const totalPages = Math.max(1, Math.ceil(homepageCountries.length / HOMEPAGE_PAGE_SIZE))
  const visibleCountries = homepageCountries.slice(
    page * HOMEPAGE_PAGE_SIZE,
    (page + 1) * HOMEPAGE_PAGE_SIZE,
  )
  const hasMultiplePages = homepageCountries.length > HOMEPAGE_PAGE_SIZE
  const hasMoreOnFullListing =
    countries.length > homepageCountries.length || getAllCountries().length > HOMEPAGE_MAX_VISIBLE

  return (
    <Box
      component="section"
      sx={{
        bgcolor: colors.surface,
        py: landingSectionPy,
        borderTop: `1px solid ${colors.borderSoft}`,
      }}
    >
      <PublicContainer variant="hero">
        <Box sx={{ mb: landingSectionHeaderMb }}>
          <Typography
            sx={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: colors.greenBright,
              mb: 1.5,
            }}
          >
            Destination Explorer
          </Typography>
          <Typography
            component="h2"
            sx={{
              fontFamily: publicFonts.heading,
              fontWeight: 800,
              fontSize: { xs: '28px', md: '36px' },
              color: colors.navy,
              lineHeight: 1.15,
              mb: 0.75,
            }}
          >
            Where are you travelling?
          </Typography>
          <Typography sx={{ fontSize: '15px', color: colors.textSecondary, maxWidth: 520 }}>
            {getAllCountries().length} destinations · Indian passport · Pick a country to start
          </Typography>
        </Box>

        {countries.length === 0 ? (
          <Box
            sx={{
              py: 8,
              textAlign: 'center',
              bgcolor: colors.white,
              borderRadius: '16px',
              border: `1px dashed ${colors.border}`,
            }}
          >
            <Typography sx={{ fontWeight: 600, color: colors.navy }}>
              No destinations available
            </Typography>
          </Box>
        ) : (
          <>
            <Grid container spacing={2}>
              {visibleCountries.map(country => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={country.id}>
                  <DestinationListingCard country={country} />
                </Grid>
              ))}
            </Grid>

            {(hasMultiplePages || hasMoreOnFullListing) && (
              <Box
                sx={{
                  mt: { xs: 4, md: 5 },
                  mx: 'auto',
                  maxWidth: 520,
                  p: { xs: 1.25, sm: 1.5 },
                  borderRadius: '16px',
                  bgcolor: alpha(colors.white, 0.72),
                  backdropFilter: 'blur(14px)',
                  WebkitBackdropFilter: 'blur(14px)',
                  border: `1px solid ${alpha(colors.border, 0.9)}`,
                  boxShadow: '0 4px 24px rgba(15, 23, 42, 0.05)',
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="center"
                  spacing={1}
                  sx={{ flexWrap: 'wrap', gap: 1 }}
                >
                  {hasMultiplePages && (
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<ArrowLeft size={16} />}
                      disabled={page === 0}
                      onClick={() => setPage(p => Math.max(0, p - 1))}
                      sx={{
                        textTransform: 'none',
                        borderColor: colors.border,
                        color: colors.navy,
                        borderRadius: '10px',
                        bgcolor: alpha(colors.white, 0.8),
                        fontWeight: 600,
                        minWidth: { xs: '100%', sm: 110 },
                      }}
                    >
                      Previous
                    </Button>
                  )}

                  <Button
                    variant="contained"
                    size="small"
                    endIcon={<ArrowRight size={16} />}
                    onClick={() => navigate('/countries')}
                    sx={{
                      textTransform: 'none',
                      borderRadius: '10px',
                      bgcolor: colors.greenBright,
                      fontWeight: 700,
                      px: 2.5,
                      flex: { xs: '1 1 100%', sm: '0 1 auto' },
                      minWidth: { sm: 180 },
                      '&:hover': { bgcolor: colors.greenDark },
                    }}
                  >
                    More destinations
                  </Button>

                  {hasMultiplePages && (
                    <Button
                      variant="outlined"
                      size="small"
                      endIcon={<ArrowRight size={16} />}
                      disabled={page >= totalPages - 1}
                      onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                      sx={{
                        textTransform: 'none',
                        borderColor: colors.border,
                        color: colors.navy,
                        borderRadius: '10px',
                        bgcolor: alpha(colors.white, 0.8),
                        fontWeight: 600,
                        minWidth: { xs: '100%', sm: 110 },
                      }}
                    >
                      Next
                    </Button>
                  )}
                </Stack>
              </Box>
            )}
          </>
        )}
      </PublicContainer>
    </Box>
  )
}
