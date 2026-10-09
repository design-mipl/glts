import { CalendarDays } from 'lucide-react'
import { PublicFinalCtaSection } from '../PublicFinalCtaSection'
import { solutionCtaBackgroundImages } from '../../assets/solutionCtaImages'
import { MarineCtaBackgroundPattern } from './finalCta/MarineCtaBackgroundPattern'
import { CorporateCtaBackgroundPattern } from './finalCta/CorporateCtaBackgroundPattern'

export type SolutionFinalCtaVariant = 'marine' | 'corporate'

interface SolutionFinalCtaSectionProps {
  id?: string
  variant: SolutionFinalCtaVariant
  heading: string
  description: string
  primaryButton: { label: string; href: string }
  secondaryButton?: { label: string; href: string }
}

export function SolutionFinalCtaSection({
  id = 'final-cta',
  variant,
  heading,
  description,
  primaryButton,
  secondaryButton,
}: SolutionFinalCtaSectionProps) {
  const backgroundAsset = solutionCtaBackgroundImages[variant]
  const marine = variant === 'marine'

  return (
    <PublicFinalCtaSection
      id={id}
      variant="b2b"
      heading={heading}
      description={description}
      image={backgroundAsset}
      imagePosition={{
        xs: marine ? 'center 62%' : 'center 66%',
        md: marine ? 'center 58%' : 'center 65%',
      }}
      overlay={marine
        ? 'linear-gradient(90deg, rgba(0,31,63,0.78) 0%, rgba(0,31,63,0.58) 42%, rgba(0,31,63,0.36) 100%)'
        : 'linear-gradient(90deg, rgba(0,31,63,0.80) 0%, rgba(0,31,63,0.62) 42%, rgba(0,31,63,0.38) 100%)'}
      decoration={marine ? <MarineCtaBackgroundPattern /> : <CorporateCtaBackgroundPattern />}
      primaryButton={primaryButton}
      secondaryButton={secondaryButton ? { ...secondaryButton, icon: <CalendarDays size={16} /> } : undefined}
    />
  )
}
