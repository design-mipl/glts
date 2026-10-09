import { Box, Typography } from '@mui/material'
import { PublicContainer } from '../../../components/PublicContainer'
import { websiteDesignSystem as ds } from '../../../theme/websiteDesignSystem'
import { websiteHeadingSx } from '../../../theme/websiteComponentStyles'
import { retailAdvantages } from '../retailPageData'
import { landingSectionPy } from '../../LandingPage/landingPageSpacing'

export function RetailAdvantageSection() {
  return (
    <Box component="section" id="retail-advantage" aria-labelledby="retail-advantage-heading"
      sx={{ bgcolor: '#f6faf8', py: landingSectionPy, scrollMarginTop: 88 }}>
      <PublicContainer variant="hero">
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'minmax(0, .95fr) minmax(0, 1fr)' }, gap: { xs: 4, md: 6, desktop: 8 }, alignItems: 'center' }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ color: ds.color.brandHover, fontSize: 12, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', mb: 1 }}>Why choose GreenLight</Typography>
            <Typography id="retail-advantage-heading" component="h2" sx={{ ...websiteHeadingSx.h2, color: ds.color.navy, mb: 1.25, maxWidth: 430 }}>Why GreenLight for Visa Services</Typography>
            <Typography sx={{ color: ds.color.textSecondary, fontSize: { xs: 15, desktop: 16 }, lineHeight: 1.6, maxWidth: 470, mb: 3.25 }}>A clearer path from destination choice to embassy-ready submission, with expert review at every step.</Typography>
            <Box component="img" src="/images/how-it-works/step-01-check-requirements.png" alt="Visa consultant reviewing an application with a traveler" loading="lazy"
              sx={{ width: '100%', height: { xs: 275, md: 340, desktop: 360 }, display: 'block', borderRadius: '16px', objectFit: 'cover', objectPosition: 'center', boxShadow: '0 14px 30px rgba(15,35,55,.1)' }} />
          </Box>
          <Box component="ul" sx={{ display: 'grid', gap: 1.6, listStyle: 'none', p: 0, m: 0 }}>
            {retailAdvantages.map(({ id, title, description, icon: Icon }) => (
              <Box component="li" key={id} sx={{ display: 'flex', alignItems: 'center', gap: 2.25, minHeight: 86, px: { xs: 2, desktop: 2.5 }, py: 1.5, borderRadius: '13px', bgcolor: '#fff', boxShadow: '0 7px 24px rgba(23,63,66,.045)', border: '1px solid #f0f4f1' }}>
                <Box sx={{ width: 48, height: 48, flexShrink: 0, display: 'grid', placeItems: 'center', borderRadius: '50%', bgcolor: '#e8f9ec', color: ds.color.brandHover }}>
                  <Icon size={22} strokeWidth={2} aria-hidden="true" />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography component="h3" sx={{ color: ds.color.navy, fontSize: { xs: 16, desktop: 17 }, fontWeight: 800, lineHeight: 1.3, mb: 0.25 }}>{title}</Typography>
                  <Typography sx={{ color: ds.color.textSecondary, fontSize: { xs: 14, desktop: 15 }, lineHeight: 1.45 }}>{description}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </PublicContainer>
    </Box>
  )
}
