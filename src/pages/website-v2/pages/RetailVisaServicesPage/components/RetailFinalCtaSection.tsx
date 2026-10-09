import { Box } from '@mui/material'
import { CalendarDays, Check } from 'lucide-react'
import { PublicFinalCtaSection } from '../../../components/PublicFinalCtaSection'
import { usePublicBrandColors } from '../../../theme/publicSiteTokens'
import { retailFinalCta } from '../retailPageData'

export function RetailFinalCtaSection() {
  const colors = usePublicBrandColors()
  return (
    <PublicFinalCtaSection
      id="final-cta"
      variant="retail"
      heading={retailFinalCta.heading}
      description={retailFinalCta.description}
      image={retailFinalCta.image}
      imagePosition={{ xs: '65% center', sm: '63% 30%', md: 'center 20%' }}
      overlay={{
        xs: 'linear-gradient(90deg, rgba(0,31,63,0.9) 0%, rgba(0,31,63,0.74) 58%, rgba(0,31,63,0.58) 100%)',
        md: 'linear-gradient(90deg, rgba(0,31,63,0.9) 0%, rgba(0,31,63,0.72) 36%, rgba(0,31,63,0.28) 76%, rgba(0,31,63,0.16) 100%)',
      }}
      removeLastChildMargin
      eyebrow="Get started today"
      eyebrowRule
      primaryButton={retailFinalCta.primaryButton}
      secondaryButton={{ ...retailFinalCta.secondaryButton, icon: <CalendarDays size={16} /> }}
      trustPoints={retailFinalCta.trustPoints}
      trustPointIcon={
        <Box sx={{ width: 22, height: 22, borderRadius: '50%', display: 'grid', placeItems: 'center', bgcolor: 'rgba(85,199,104,.22)', border: '1px solid rgba(85,199,104,.4)', flex: '0 0 auto' }}>
          <Check size={12} color={colors.greenBright} strokeWidth={3} aria-hidden="true" />
        </Box>
      }
    />
  )
}
