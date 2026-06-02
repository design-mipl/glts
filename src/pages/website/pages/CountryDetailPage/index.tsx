import { Box, Typography, Grid, Chip, Button, Breadcrumbs, Link, Card } from '@mui/material'
import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { CountryFlagVisual } from '@/shared/components/CountryFlagVisual'
import { getCountryById, getCountryHeroImageUrl } from '@/shared/services/visaService'
import { PricingCard } from './components/PricingCard'
import { TabsNavigation } from './components/TabsNavigation'
import { RequirementsSection } from './components/RequirementsSection'
import { OftenAppliedWithSection } from './components/OftenAppliedWithSection'
import { ComingSoonPage } from '@/shared/components/ComingSoonPage'
import { PublicContainer } from '../../components/PublicContainer'
import { publicLayout, publicFonts, usePublicBrandColors, getMarketingPrimaryButtonSx } from '@/shared/theme/publicBrand'
import { ChevronRight, Clock, MapPin } from 'lucide-react'

const timelineSteps = [
  { step: 1, title: 'Submit', desc: 'Documents reviewed in 4h', icon: '📄' },
  { step: 2, title: 'Appointment', desc: 'VFS biometrics booked', icon: '📅' },
  { step: 3, title: 'Embassy', desc: 'Decision in 10–14 days', icon: '🏛' },
  { step: 4, title: 'Collection', desc: 'Courier or pickup', icon: '✈️' },
]

export function CountryDetailPage() {
  const colors = usePublicBrandColors()
  const { countryId } = useParams<{ countryId: string }>()
  const country = countryId ? getCountryById(countryId) : undefined
  const [activeTab, setActiveTab] = useState(0)
  const [heroImgError, setHeroImgError] = useState(false)

  if (!country) {
    return <ComingSoonPage title="Country not found" returnLink={{ text: 'Browse destinations', href: '/countries' }} />
  }

  return (
    <Box>
      {/* Breadcrumb */}
      <Box sx={{ backgroundColor: colors.surface, borderBottom: `1px solid ${colors.border}`, py: 2 }}>
        <PublicContainer>
          <Breadcrumbs separator={<ChevronRight size={12} color="#9CA3AF" />}>
            <Link href="/" sx={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '13px', '&:hover': { color: colors.greenBright } }}>
              Home
            </Link>
            <Link href="/countries" sx={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '13px', '&:hover': { color: colors.greenBright } }}>
              Destinations
            </Link>
            <Link href="/countries" sx={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '13px', '&:hover': { color: colors.greenBright } }}>
              Europe
            </Link>
            <Typography sx={{ fontSize: '13px', color: '#001F3F', fontWeight: 600 }}>
              {country.name}
            </Typography>
          </Breadcrumbs>
        </PublicContainer>
      </Box>

      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: 320, md: 400 },
          display: 'flex',
          alignItems: 'flex-end',
          overflow: 'hidden',
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
            background: 'linear-gradient(to top, rgba(0,31,63,0.85) 0%, rgba(0,31,63,0.4) 50%, transparent 100%)',
          }}
        />
        <PublicContainer variant="hero" sx={{ position: 'relative', py: { xs: 6, md: 8 }, width: '100%' }}>
          <Grid container spacing={4} alignItems="flex-end">
            <Grid size={{ xs: 12, md: 7 }}>
              {/* Trend badge */}
              {country.trending && (
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
                  {country.name} Visa for Indians
                </Typography>
                {country.fastMinutes && (
                  <Typography sx={{ color: colors.green, fontWeight: 700, fontSize: '18px' }}>
                    in {country.fastMinutes} minutes
                  </Typography>
                )}
                {country.id === 'schengen' && (
                  <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', mt: 0.75 }}>
                    26 countries · 1 application · up to 90 days in any 180-day window
                  </Typography>
                )}
              </Box>

              {/* Meta chips */}
              <Box sx={{ display: 'flex', gap: 1.5, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '999px',
                    px: 2,
                    py: 0.75,
                  }}
                >
                  {/* Greenlight Score */}
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      backgroundColor: colors.greenBright,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '12px',
                      color: '#fff',
                    }}
                  >
                    {country.rating}
                  </Box>
                  <Typography sx={{ color: '#fff', fontSize: '13px', fontWeight: 600 }}>
                    Greenlight Score
                  </Typography>
                </Box>

                <Chip
                  label={`⏱ ${country.processingTime}`}
                  sx={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', fontWeight: 600 }}
                />
                <Chip
                  label={`${country.rating}% approval`}
                  sx={{ backgroundColor: '#D1FAE5', color: '#065F46', fontWeight: 700 }}
                />
              </Box>

              {/* Quick stats row */}
              <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {[
                  { label: 'Processing', value: '12–18 days' },
                  { label: 'Stay', value: '90 days' },
                  { label: 'Entries', value: 'Multiple' },
                  { label: 'Validity', value: '180 days' },
                ].map(({ label, value }) => (
                  <Box key={label}>
                    <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, mb: 0.25 }}>
                      {label}
                    </Typography>
                    <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '15px' }}>{value}</Typography>
                  </Box>
                ))}
              </Box>
            </Grid>

          </Grid>
        </PublicContainer>
      </Box>

      <PublicContainer sx={{ py: { xs: 4, md: 6 } }}>
        <Box sx={{ display: { xs: 'block', lg: 'none' }, mb: 3 }}>
          <PricingCard country={country} />
        </Box>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, lg: 8 }}>
        <TabsNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        <Box sx={{ mt: 3 }}>
          {activeTab === 0 && <RequirementsSection country={country} />}

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
            <Typography sx={{ color: '#6B7280' }}>Pricing details coming soon.</Typography>
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
                  <Clock size={13} color={colors.greenBright} />
                  <Typography sx={{ fontSize: '13px', color: colors.greenBright, fontWeight: 600 }}>
                    Next slot · Mar 14 · 3 slots left
                  </Typography>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Box>

        <OftenAppliedWithSection country={country} />

        {/* CTA Banner */}
        <Box
          sx={{
            mt: 6,
            p: { xs: 3, md: 4 },
            background: 'linear-gradient(135deg, #001F3F 0%, #003366 100%)',
            borderRadius: publicLayout.cardRadius,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 3,
          }}
        >
          <Box>
            <Typography sx={{ fontWeight: 800, color: '#fff', fontSize: { xs: '20px', md: '24px' }, mb: 0.75 }}>
              Ready to apply for {country.name}?
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '14px' }}>
              Expert team · Full document review · Real-time tracking
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="large"
            href="/retail/applications/new"
            sx={{ ...getMarketingPrimaryButtonSx(colors), px: 5, py: 1.75 }}
          >
            Start Application
          </Button>
        </Box>
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }} sx={{ display: { xs: 'none', lg: 'block' } }}>
            <Box sx={{ position: 'sticky', top: 96 }}>
              <PricingCard country={country} />
            </Box>
          </Grid>
        </Grid>
      </PublicContainer>
    </Box>
  )
}
