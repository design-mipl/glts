import { Compass } from 'lucide-react'
import { PublicFinalCtaSection } from '../../../components/PublicFinalCtaSection'
import { aboutFinalCta } from '../aboutPageData'

export function AboutFinalCtaSection() {
  return (
    <PublicFinalCtaSection
      id="about-final-cta"
      variant="editorial"
      heading={aboutFinalCta.heading}
      description={aboutFinalCta.description}
      image={aboutFinalCta.image}
      imagePosition={{ xs: '70% 55%', md: 'center 55%' }}
      overlay="linear-gradient(90deg, rgba(0,31,63,0.64) 0%, rgba(0,31,63,0.38) 48%, rgba(0,31,63,0.18) 100%)"
      primaryButton={aboutFinalCta.primaryButton}
      secondaryButton={{ ...aboutFinalCta.secondaryButton, icon: <Compass size={16} /> }}
    />
  )
}
