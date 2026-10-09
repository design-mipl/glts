import { CalendarDays } from 'lucide-react'
import { PublicFinalCtaSection } from '../../../components/PublicFinalCtaSection'
import { servicesFinalCta } from '../servicesPageData'

export function ServicesFinalCtaSection() {
  return (
    <PublicFinalCtaSection
      id="services-final-cta"
      variant="editorial"
      heading={servicesFinalCta.heading}
      description={servicesFinalCta.description}
      image={servicesFinalCta.image}
      imagePosition={{ xs: '70% 55%', md: 'center 55%' }}
      overlay="linear-gradient(90deg, rgba(0,31,63,0.64) 0%, rgba(0,31,63,0.38) 48%, rgba(0,31,63,0.18) 100%)"
      primaryButton={servicesFinalCta.primaryButton}
      secondaryButton={{ ...servicesFinalCta.secondaryButton, icon: <CalendarDays size={16} /> }}
    />
  )
}
