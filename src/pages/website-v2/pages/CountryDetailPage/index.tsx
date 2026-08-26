import { Box, Typography, Grid, Chip, Card, Stack, Button } from '@mui/material'
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
import { ComingSoonPage } from '@/shared/components/ComingSoonPage'
import { PublicContainer } from '../../components/PublicContainer'
import { publicFonts, usePublicBrandColors, getMarketingPrimaryButtonSx } from '@/shared/theme/publicBrand'
import { BORDER_RADIUS } from '@/design-system/tokens'
import { Clock, MapPin } from 'lucide-react'

const timelineSteps = [
  { step: 1, title: 'Submit', desc: 'Documents reviewed in 4h', icon: '📄' },
  { step: 2, title: 'Appointment', desc: 'VFS biometrics booked', icon: '📅' },
  { step: 3, title: 'Embassy', desc: 'Decision in 10–14 days', icon: '🏛' },
  { step: 4, title: 'Collection', desc: 'Courier or pickup', icon: '✈️' },
]

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

    return `/v2/apply/new?${params.toString()}`
  }, [countryId, search, selectedVisaCategory, selectedVisaType])

  if (!master || !country) {
    return <ComingSoonPage title="Country not found" returnLink={{ text: 'Browse destinations', href: '/v2/countries' }} />
  }

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
        }}
      >
        {heroImgError ? (
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
            src={getCountryHeroImageUrl(country, 1400)}
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
                    backgroundColor: 'rgba(251,191,36,0.15)',
                    border: '1px solid rgba(251,191,36,0.3)',
                    borderRadius: '6px',
                    px: 1.5,
                    py: 0.5,
                    mb: 2,
                  }}
                >
                  <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#FCD34D' }}>
                    🔥 Trending · +18% this month
                  </Typography>
                </Box>
              )}

              {/* Title */}
              <Box sx={{ mb: 2.5 }}>
                <Typography
                  component="h1"
                  sx={{
                    fontWeight: 800,
                    color: '#fff',
                    fontSize: { xs: '28px', md: '40px' },
                    lineHeight: 1.15,
                    mb: 0.5,
                    fontFamily: publicFonts.heading,
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

              {/* Visa facts from country master + selected retail type */}
              <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', mb: 3.5, justifyContent: 'center' }}>
                {heroStats.map(({ label, value }) => (
                  <Box key={label} sx={{ textAlign: 'center' }}>
                    <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, mb: 0.25 }}>
                      {label}
                    </Typography>
                    <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '15px' }}>{value}</Typography>
                  </Box>
                ))}
              </Box>

              <Button
                variant="contained"
                size="large"
                href={applyHref}
                sx={{
                  ...getMarketingPrimaryButtonSx(colors),
                  px: { xs: 5, md: 6 },
                  py: 1.5,
                  minWidth: { xs: 220, md: 260 },
                  fontSize: '15px',
                  fontWeight: 700,
                }}
              >
                Start Application
              </Button>
          </Box>
        </PublicContainer>
      </Box>

      <PublicContainer sx={{ py: { xs: 4, md: 6 } }}>
        <Box sx={{ display: { xs: 'block', lg: 'none' }, mb: 3 }}>
          <PricingCard
            country={country}
            selectedVisaCategoryLabel={selectedVisaCategoryLabel}
            applyHref={applyHref}
          />
        </Box>
        <Grid container spacing={4}>
            <Grid size={{ xs: 12, lg: 8 }}>
        <Box
          sx={{
            mb: 3,
            p: { xs: 2, md: 2.5 },
            borderRadius: '16px',
            bgcolor: colors.white,
            border: `1px solid ${colors.border}`,
          }}
        >
          <Typography sx={{ fontSize: '12px', fontWeight: 700, color: colors.textMuted, mb: 1.5 }}>
            SELECTED VISA CATEGORY
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={1} useFlexGap>
            {visaCategoryOptions.map(option => {
              const selected = option.value === selectedVisaCategory
              return (
                <Chip
                  key={option.value}
                  label={option.label}
                  clickable
                  onClick={() => setSelectedVisaCategory(option.value)}
                  sx={{
                    height: 32,
                    fontWeight: selected ? 800 : 600,
                    bgcolor: selected ? colors.greenBright : colors.surfaceAlt,
                    color: selected ? colors.white : colors.navy,
                    border: `1px solid ${selected ? colors.greenBright : colors.border}`,
                    '&:hover': {
                      bgcolor: selected ? colors.greenDark : colors.greenMuted,
                    },
                  }}
                />
              )
            })}
          </Stack>
        </Box>

        <TabsNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        <Box sx={{ mt: 3 }}>
          {activeTab === 0 && (
            <RequirementsSection
              country={country}
              selectedVisaCategoryLabel={selectedVisaCategoryLabel}
            />
          )}

          {activeTab === 1 && (
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: '18px', color: '#001F3F', mb: 3 }}>
                How your application moves
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 0 }}>
                {timelineSteps.map((step, i) => (
                  <Box key={step.step} sx={{ display: 'flex', flexDirection: { xs: 'row', md: 'column' }, alignItems: { xs: 'flex-start', md: 'center' }, flex: 1, gap: { xs: 2, md: 0 } }}>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', width: { md: '100%' }, mb: { md: 1.5 } }}>
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: '50%',
                          backgroundColor: '#001F3F',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '16px',
                          flexShrink: 0,
                        }}
                      >
                        {step.step}
                      </Box>
                      {i < timelineSteps.length - 1 && (
                        <Box sx={{ flex: 1, height: { xs: '100%', md: 2 }, width: { xs: 2, md: '100%' }, backgroundColor: '#E5E7EB', display: { xs: 'none', md: 'block' } }} />
                      )}
                    </Box>
                    <Box sx={{ textAlign: { md: 'center' }, px: { md: 1 } }}>
                      <Typography sx={{ fontWeight: 700, color: '#001F3F', fontSize: '14px' }}>{step.title}</Typography>
                      <Typography sx={{ color: '#6B7280', fontSize: '12.5px', mt: 0.25 }}>{step.desc}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {activeTab === 2 && (
            <Typography sx={{ color: '#6B7280' }}>
              Review the fee estimate card for Embassy Fee, GreenLight Fee and indicative total.
            </Typography>
          )}
          {activeTab === 3 && (
            <Typography sx={{ color: '#6B7280' }}>FAQs coming soon.</Typography>
          )}
        </Box>

        {/* Embassy Info */}
        <Box sx={{ mt: 6 }}>
          <Typography sx={{ fontWeight: 800, fontSize: '20px', color: '#001F3F', mb: 3 }}>
            Embassy &amp; VFS Center
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ p: 3, border: '1px solid #F3F4F6', boxShadow: 'none', borderRadius: '12px' }}>
                <Typography sx={{ fontSize: '10px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.6px', mb: 2 }}>
                  EMBASSY
                </Typography>
                <Typography sx={{ fontWeight: 700, color: '#001F3F', fontSize: '15px', mb: 1 }}>
                  Consulate of {country.name}, Mumbai
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                  <MapPin size={13} color="#9CA3AF" style={{ marginTop: 2, flexShrink: 0 }} />
                  <Typography sx={{ fontSize: '13px', color: '#6B7280' }}>
                    Wankhede House, 1st Floor, D Road, Mumbai 400020
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Clock size={13} color="#9CA3AF" />
                  <Typography sx={{ fontSize: '13px', color: '#6B7280' }}>Open · Mon–Fri 8:30–12:00</Typography>
                </Box>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ p: 3, border: '1px solid #F3F4F6', boxShadow: 'none', borderRadius: '12px' }}>
                <Typography sx={{ fontSize: '10px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.6px', mb: 2 }}>
                  VFS CENTER
                </Typography>
                <Typography sx={{ fontWeight: 700, color: '#001F3F', fontSize: '15px', mb: 1 }}>
                  VFS Global · Trade Centre, BKC
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                  <MapPin size={13} color="#9CA3AF" style={{ marginTop: 2, flexShrink: 0 }} />
                  <Typography sx={{ fontSize: '13px', color: '#6B7280' }}>
                    Biometrics required · slots open daily 9am
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Clock size={13} color="#9CA3AF" />
                  <Typography sx={{ fontSize: '13px', color: '#6B7280', fontWeight: 600 }}>
                    Appointment timing confirmed during application review
                  </Typography>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Box>
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }} sx={{ display: { xs: 'none', lg: 'block' } }}>
            <Box sx={{ position: 'sticky', top: 96 }}>
              <PricingCard
                country={country}
                selectedVisaCategoryLabel={selectedVisaCategoryLabel}
                applyHref={applyHref}
              />
            </Box>
          </Grid>
        </Grid>
      </PublicContainer>
    </Box>
  )
}
