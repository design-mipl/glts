import { useState } from 'react'
import { Box, Button, Typography } from '@mui/material'
import { ArrowRight } from 'lucide-react'
import { PublicContainer } from '../../../components/PublicContainer'
import { websiteDesignSystem as ds } from '../../../theme/websiteDesignSystem'
import { websiteHeadingSx } from '../../../theme/websiteComponentStyles'
import { retailServices } from '../retailPageData'
import { landingSectionPy } from '../../LandingPage/landingPageSpacing'

type VisaService = (typeof retailServices)[number]

function VisaServiceCard({ service, featured }: { service: VisaService; featured: boolean }) {
  const [imageSrc, setImageSrc] = useState(service.image.src)
  const Icon = service.icon
  const cardTokens = ds.component.card.service
  return (
    <Box component="article" sx={{
      minWidth: 0, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden',
      bgcolor: ds.color.surface, border: `1px solid ${ds.color.border}`, borderRadius: `${cardTokens.compactRadius}px`,
      boxShadow: '0 12px 30px rgba(17, 40, 65, .07)',
      transition: `transform ${ds.component.card.hoverDurationMs}ms ease, box-shadow ${ds.component.card.hoverDurationMs}ms ease`,
      '&:focus-within': { outline: `${ds.component.card.focusWidth}px solid ${ds.color.focus}`, outlineOffset: 2 },
      '@media (hover: hover)': { '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 18px 38px rgba(17, 40, 65, .14)' }, '&:hover img': { transform: 'scale(1.045)' } },
      '@media (prefers-reduced-motion: reduce)': { transition: 'none', '& img': { transition: 'none' } },
    }}>
      <Box sx={{ height: featured ? { xs: 260, md: 350, desktop: 505 } : { xs: 205, md: 195, desktop: 185 }, overflow: 'hidden', bgcolor: ds.color.surfaceMuted, flexShrink: 0 }}>
        <Box component="img" src={imageSrc} alt={service.image.alt} loading="lazy"
          onError={() => { if (imageSrc !== service.image.fallback) setImageSrc(service.image.fallback) }}
          sx={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover', objectPosition: service.image.objectPosition ?? 'center', transition: `transform ${ds.component.card.hoverDurationMs}ms ease` }} />
      </Box>
      <Box sx={{ px: { xs: `${cardTokens.padding.mobile}px`, desktop: `${cardTokens.padding.desktop}px` }, pt: 2.75, pb: 2.5, display: 'flex', flexDirection: 'column', flex: 1, position: 'relative' }}>
        <Box sx={{ position: 'absolute', top: -22, left: 24, width: 44, height: 44, borderRadius: '50%', bgcolor: '#eaf8e9', border: '4px solid white', display: 'grid', placeItems: 'center', color: ds.color.brandHover, boxShadow: '0 3px 12px rgba(0,0,0,.08)' }}>
          <Icon size={ds.icon.standard} strokeWidth={ds.icon.strokeWidth} aria-hidden="true" />
        </Box>
        <Typography component="h3" sx={{ ...websiteHeadingSx.cardTitle, color: ds.color.navy, mt: 1, mb: 0.7 }}>{service.title}</Typography>
        <Typography sx={{ color: ds.color.textSecondary, fontSize: featured ? cardTokens.featuredBodySize : cardTokens.defaultBodySize, lineHeight: 1.5, flex: 1, mb: 1.2 }}>{service.description}</Typography>
        <Button component="a" href={service.href} endIcon={<ArrowRight size={16} aria-hidden="true" />}
          sx={{ alignSelf: 'flex-start', minHeight: featured ? 36 : 30, px: featured ? 1.5 : 0, border: featured ? '1px solid #b8ddc0' : 'none', borderRadius: featured ? '9px' : 0, color: ds.color.brandHover, bgcolor: featured ? '#edfaee' : 'transparent', fontSize: 14, fontWeight: 700, textTransform: 'none', '&:hover': { bgcolor: featured ? '#ddf3e0' : 'transparent', textDecoration: 'underline' } }}>
          {service.href === '/countries' ? 'Explore requirements' : 'Ask an expert'}
        </Button>
      </Box>
    </Box>
  )
}

export function OurRetailServicesSection() {
  return (
    <Box component="section" id="our-retail-services" aria-labelledby="visa-service-categories-heading" sx={{ bgcolor: '#f4f8fa', py: landingSectionPy, scrollMarginTop: 88 }}>
      <PublicContainer variant="hero">
        <Box sx={{ display: 'flex', alignItems: { xs: 'flex-start', md: 'flex-end' }, justifyContent: 'space-between', gap: 2, mb: 4.5 }}>
          <Box sx={{ maxWidth: 820 }}>
            <Typography sx={{ color: ds.color.brandHover, fontSize: 12, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', mb: 0.75 }}>Visa categories</Typography>
            <Typography id="visa-service-categories-heading" component="h2" sx={{ ...websiteHeadingSx.h2, color: ds.color.navy, mb: 0.8 }}>Visa Services for Every Journey</Typography>
            <Typography sx={{ color: ds.color.textSecondary, fontSize: { xs: 15, desktop: 16 }, lineHeight: 1.55 }}>Explore support for tourists, families, students, business travelers, and transit journeys—from category selection through embassy-ready submission.</Typography>
          </Box>
          <Button href="/countries" endIcon={<ArrowRight size={17} />} sx={{ display: { xs: 'none', md: 'inline-flex' }, flexShrink: 0, color: ds.color.brandHover, fontWeight: 700, textTransform: 'none' }}>View all services</Button>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))', desktop: '1.45fr 1fr 1fr' }, gridTemplateRows: { desktop: 'repeat(2, minmax(0, 1fr))' }, gap: { xs: 2.5, desktop: 2 }, alignItems: 'stretch' }}>
          {retailServices.map((service, index) => (
            <Box key={service.id} sx={{ minWidth: 0, ...(index === 0 ? { gridRow: { desktop: 'span 2' }, gridColumn: { md: 'span 2', desktop: 'auto' } } : {}) }}>
              <VisaServiceCard service={service} featured={index === 0} />
            </Box>
          ))}
        </Box>
      </PublicContainer>
    </Box>
  )
}
