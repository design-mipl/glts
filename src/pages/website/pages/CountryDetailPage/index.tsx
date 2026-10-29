import { Box, Typography, Grid, Button } from '@mui/material'
import { useLocation, useParams } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { CountryFlagVisual } from '@/shared/components/CountryFlagVisual'
import { getCountryHeroImageUrl } from '@/shared/services/visaService'
import {
  countryMasterToPortalCountry,
  getCountryMasterById,
  getVisaOfferings,
} from '@/shared/services/countryMasterService'
import type { CountryVisaType } from '@/shared/types/countryMaster'
import { PricingCard } from './components/PricingCard'
import { TabsNavigation } from './components/TabsNavigation'
import { RequirementsSection } from './components/RequirementsSection'
import { TimelineSection } from './components/TimelineSection'
import { ComingSoonPage } from '@/shared/components/ComingSoonPage'
import { PublicContainer } from '../../components/PublicContainer'
import { CountryTrustBadgeStrip } from '../../components/CountryTrustBadgeStrip'
import { hasCountryTrustProfile } from '../../config/countryTrustBadges'
import { publicFonts, usePublicBrandColors } from '@/shared/theme/publicBrand'
import { accentGoldRgb, getAccentButtonSx } from '../../theme/applyFlowTheme'
import { BORDER_RADIUS } from '@/design-system/tokens'

const visaCategoryOptions = [
  { value: 'tourist', label: 'Tourist Visa' },
  { value: 'business', label: 'Business Visa' },
  { value: 'student', label: 'Student Visa' },
  { value: 'transit', label: 'Transit Visa' },
  { value: 'family', label: 'Visit & Family' },
  { value: 'group', label: 'Group Applications' },
  { value: 'other', label: 'Other Visa Types' },
] as const

type VisaCategoryValue = (typeof visaCategoryOptions)[number]['value']

function resolveVisaCategory(value: string | null): VisaCategoryValue {
  return visaCategoryOptions.some(option => option.value === value)
    ? (value as VisaCategoryValue)
    : 'tourist'
}

/** Match a retail visa type on country master to the selected category chip. */
function resolveRetailVisaType(
  visaTypes: CountryVisaType[],
  category: VisaCategoryValue,
): CountryVisaType | undefined {
  const active = visaTypes.filter((visaType) => visaType.status === 'active')
  if (active.length === 0) return undefined

  const matched = active.find((visaType) => {
    const haystack = [
      visaType.visaCategory,
      visaType.purposeLabel,
      visaType.purposeId,
      visaType.name,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    return haystack.includes(category)
  })

  return matched ?? active[0]
}

export function CountryDetailPage() {
  const colors = usePublicBrandColors()
  const { countryId } = useParams<{ countryId: string }>()
  const { search } = useLocation()
  const master = countryId ? getCountryMasterById(countryId) : undefined
  const [activeTab, setActiveTab] = useState(0)
  const [heroImgError, setHeroImgError] = useState(false)
  const [selectedVisaCategory, setSelectedVisaCategory] = useState<VisaCategoryValue>(() =>
    resolveVisaCategory(new URLSearchParams(search).get('visaType')),
  )
  const selectedVisaCategoryLabel =
    visaCategoryOptions.find(option => option.value === selectedVisaCategory)?.label ?? 'Tourist Visa'

  const retailVisaTypes = useMemo(() => {
    if (!master) return [] as CountryVisaType[]
    const retail = master.segments.find((segment) => segment.segment === 'retail' && segment.enabled)
    return retail?.visaTypes ?? []
  }, [master])

  const selectedVisaType = useMemo(
    () => resolveRetailVisaType(retailVisaTypes, selectedVisaCategory),
    [retailVisaTypes, selectedVisaCategory],
  )

  const country = useMemo(() => {
    if (!master) return undefined
    const portal = countryMasterToPortalCountry(master, { segment: 'retail' })
    return {
      ...portal,
      processingTime: selectedVisaType?.processingTime || master.processingTime || portal.processingTime,
      validity: selectedVisaType?.validity || master.validity || portal.validity,
      price: selectedVisaType?.pricing ?? master.price ?? portal.price,
    }
  }, [master, selectedVisaType])

  const heroStats = useMemo(
    () => [
      {
        label: 'Processing Days',
        value: selectedVisaType?.processingTime || master?.processingTime || 'TBD',
      },
      {
        label: 'Stay',
        value: selectedVisaType?.stayDuration || 'As per visa type',
      },
      {
        label: 'Validity',
        value: selectedVisaType?.validity || master?.validity || 'As per embassy',
      },
    ],
    [master, selectedVisaType],
  )

  const applyHref = useMemo(() => {
    const params = new URLSearchParams(search)
    params.delete('search')
    if (countryId) params.set('country', countryId)
    params.set('visaType', selectedVisaCategory)

    if (countryId && selectedVisaType) {
      const offering =
        getVisaOfferings(countryId, true, 'retail').find(
          (entry) => entry.id === selectedVisaType.id || entry.visaTypeLabel === selectedVisaType.name,
        ) ?? getVisaOfferings(countryId, true, 'retail')[0]
      if (offering) params.set('visa', offering.id)
    }

    return `/apply/new?${params.toString()}`
  }, [countryId, search, selectedVisaCategory, selectedVisaType])

  if (!master || !country) {
    return <ComingSoonPage title="Country not found" returnLink={{ text: 'Browse destinations', href: '/countries' }} />
  }

  const heroSrc = getCountryHeroImageUrl(country, 1400)
  const showHeroFallback = heroImgError || !heroSrc

  return (
    <Box>
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: 320, md: 400 },
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          mx: { xs: 2, sm: 3, md: 4, lg: 5 },
          mt: { xs: 2, sm: 3, md: 4 },
          borderRadius: BORDER_RADIUS.xl,
          boxShadow: '0 1px 2px rgba(15,27,43,0.04), 0 8px 24px -4px rgba(15,27,43,0.10)',
        }}
      >
        {showHeroFallback ? (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `linear-gradient(145deg, ${colors.navyLight} 0%, ${colors.navy} 100%)`,
            }}
          >
            <CountryFlagVisual flag={country.flags} size={96} />
          </Box>
        ) : (
          <Box
            component="img"
            src={heroSrc}
            alt=""
            onError={() => setHeroImgError(true)}
            sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,31,63,0.82) 0%, rgba(0,31,63,0.62) 45%, rgba(0,31,63,0.48) 100%)',
          }}
        />
        <PublicContainer variant="hero" sx={{ position: 'relative', py: { xs: 6, md: 8 }, width: '100%' }}>
          <Box sx={{ maxWidth: 720, mx: 'auto', textAlign: 'center' }}>
              {/* Trend badge */}
              {master.trending && (
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.75,
                    backgroundColor: `rgba(${accentGoldRgb}, 0.16)`,
                    border: `1px solid rgba(${accentGoldRgb}, 0.38)`,
                    borderRadius: '6px',
                    px: 1.5,
                    py: 0.5,
                    mb: 2,
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: publicFonts.mono,
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.02em',
                      color: '#FEC107',
                    }}
                  >
                    Trending · +{master.trendingPercent ?? 18}% this month
                  </Typography>
                </Box>
              )}

              {/* Title */}
              <Box sx={{ mb: 2.5 }}>
                <Typography
                  sx={{
                    fontFamily: publicFonts.mono,
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.18em',
                    color: 'rgba(255,255,255,0.55)',
                    mb: 1,
                  }}
                >
                  {country.code} · VISA APPLICATION
                </Typography>
                <Typography
                  component="h1"
                  sx={{
                    fontWeight: 800,
                    color: '#fff',
                    fontSize: { xs: '32px', md: '46px' },
                    lineHeight: 1.1,
                    mb: 0.5,
                    fontFamily: publicFonts.display,
                  }}
                >
                  {master.name} Visa for Indians
                </Typography>
                {master.fastMinutes && (
                  <Typography sx={{ color: colors.green, fontWeight: 700, fontSize: '18px' }}>
                    in {master.fastMinutes} minutes
                  </Typography>
                )}
                {master.id === 'schengen' && (
                  <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', mt: 0.75 }}>
                    26 countries · 1 application · up to 90 days in any 180-day window
                  </Typography>
                )}
              </Box>

              {hasCountryTrustProfile(master.id) ? (
                <Box sx={{ mb: 3 }}>
                  <CountryTrustBadgeStrip countryId={master.id} variant="onDark" />
                </Box>
              ) : null}

              {/* Visa facts + CTA — guaranteed vertical stack, never inline-wrapped */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: { xs: 2.5, md: 3 },
                }}
              >
                {/* Departure-board readout */}
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'stretch',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: 0,
                    border: '1px solid rgba(255,255,255,0.18)',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    bgcolor: 'rgba(255,255,255,0.04)',
                  }}
                >
                  {heroStats.map(({ label, value }, index) => (
                    <Box
                      key={label}
                      sx={{
                        textAlign: 'center',
                        px: { xs: 2, md: 3 },
                        py: 1.25,
                        borderLeft: index > 0 ? '1px solid rgba(255,255,255,0.14)' : 'none',
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: publicFonts.mono,
                          color: 'rgba(255,255,255,0.5)',
                          fontSize: '9px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          fontWeight: 700,
                          mb: 0.5,
                        }}
                      >
                        {label}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: publicFonts.mono,
                          fontVariantNumeric: 'tabular-nums',
                          color: '#FEC107',
                          fontWeight: 700,
                          fontSize: '15px',
                        }}
                      >
                        {value}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Button
                  variant="contained"
                  size="large"
                  href={applyHref}
                  sx={{
                    ...getAccentButtonSx(),
                    px: { xs: 5, md: 6 },
                    py: { xs: 2.5, md: 3 },
                    minWidth: { xs: 220, md: 260 },
                    fontSize: '15px',
                    fontWeight: 700,
                  }}
                >
                  Start Application
                </Button>
              </Box>
          </Box>
        </PublicContainer>
      </Box>

      <PublicContainer sx={{ py: { xs: 4, md: 6 } }}>
        <Box sx={{ display: { xs: 'block', lg: 'none' }, mb: 3 }}>
          <PricingCard
            country={country}
            visaCategoryOptions={visaCategoryOptions}
            selectedVisaCategory={selectedVisaCategory}
            onVisaCategoryChange={(value) => setSelectedVisaCategory(value as VisaCategoryValue)}
            applyHref={applyHref}
          />
        </Box>
        <Grid container spacing={4}>
            <Grid size={{ xs: 12, lg: 8 }}>
        <TabsNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        <Box sx={{ mt: 3 }}>
          {activeTab === 0 && (
            <RequirementsSection
              country={country}
              selectedVisaCategoryLabel={selectedVisaCategoryLabel}
            />
          )}

          {activeTab === 1 && <TimelineSection />}

          {activeTab === 2 && (
            <Typography sx={{ color: colors.textSecondary }}>FAQs coming soon.</Typography>
          )}
        </Box>
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }} sx={{ display: { xs: 'none', lg: 'block' } }}>
            <Box sx={{ position: 'sticky', top: 96 }}>
              <PricingCard
                country={country}
                visaCategoryOptions={visaCategoryOptions}
                selectedVisaCategory={selectedVisaCategory}
                onVisaCategoryChange={(value) => setSelectedVisaCategory(value as VisaCategoryValue)}
                applyHref={applyHref}
              />
            </Box>
          </Grid>
        </Grid>
      </PublicContainer>
    </Box>
  )
}
