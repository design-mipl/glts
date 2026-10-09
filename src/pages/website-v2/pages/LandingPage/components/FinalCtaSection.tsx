import { CalendarDays } from 'lucide-react'
import { PublicFinalCtaSection } from '../../../components/PublicFinalCtaSection'
import { finalCtaBackgroundImage } from '../../../assets/landingPageImages'

export function FinalCtaSection() {
  return (
    <PublicFinalCtaSection
      id="final-cta"
      variant="editorial"
      heading="Ready to Submit With Confidence?"
      description="Get expert-reviewed visa assistance with real-time tracking, compliance checks, and dedicated support from start to finish."
      image={finalCtaBackgroundImage}
      imagePosition={{ xs: '70% 55%', md: 'center 55%' }}
      overlay="linear-gradient(90deg, rgba(0,31,63,0.64) 0%, rgba(0,31,63,0.38) 48%, rgba(0,31,63,0.18) 100%)"
      primaryButton={{ label: 'Check Visa Requirements', href: '/countries' }}
      secondaryButton={{ label: 'Talk to a Visa Expert', href: '/track', icon: <CalendarDays size={16} /> }}
    />
  )
}
