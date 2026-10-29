import { Box } from '@mui/material'
import { Anchor, ClipboardCheck, Globe2, Ship, type LucideIcon } from 'lucide-react'
import { ServiceHeroContent } from '../../../components/ServiceHeroContent'
import { serviceHeroSectionSx } from '../../../components/serviceHeroStyles'
import { usePublicBrandColors } from '../../../theme/publicSiteTokens'
import { marineHeroCtas } from '../marinePageData'
import { MarineHeroBackgroundVideo } from './MarineHeroBackgroundVideo'

const marineHeroStats: {
  value: string
  label: string
  icon: LucideIcon
}[] = [
  { value: '50K+', label: 'Seafarers Served', icon: ClipboardCheck },
  { value: '120+', label: 'Countries Covered', icon: Globe2 },
  { value: '300+', label: 'Global Partners', icon: Anchor },
  { value: '98%', label: 'On-Time Delivery', icon: Ship },
]

export function MarineHero() {
  const colors = usePublicBrandColors()

  return (
    <Box component="section" aria-labelledby="marine-hero-heading" sx={{ ...serviceHeroSectionSx, minHeight: { desktop: 620 }, bgcolor: colors.navy }}>
      <MarineHeroBackgroundVideo />
      <ServiceHeroContent
        headingId="marine-hero-heading"
        eyebrow="MARINE CREW VISA SERVICES"
        heading="Marine Crew Visa Services"
        description="Visa handling built for seafarers, offshore crew, superintendents, and marine operations teams — with accuracy, speed, and regulatory compliance at every stage."
        primaryAction={marineHeroCtas.primary}
        secondaryAction={marineHeroCtas.secondary}
        items={marineHeroStats}
        itemsLabel="Marine service statistics"
        animate
        compactSpacing
        prominentItems
      />
    </Box>
  )
}
