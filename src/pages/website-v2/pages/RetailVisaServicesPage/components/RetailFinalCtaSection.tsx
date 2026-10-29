import { CalendarDays } from 'lucide-react'
import { PublicFinalCtaSection } from '../../../components/PublicFinalCtaSection'
import { retailFinalCta } from '../retailPageData'

export function RetailFinalCtaSection() {
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
    />
  )
}
