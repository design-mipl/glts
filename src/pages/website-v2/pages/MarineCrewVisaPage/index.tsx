import { Box } from '@mui/material'
import { Anchor, FileCheck2, Globe2, RefreshCw } from 'lucide-react'
import { VisaCategoryCardsSection } from '../../components/VisaCategoryCardsSection'
import { ChallengesWeSolveSection } from '../../components/ChallengesWeSolveSection'
import { TrustedCompaniesSection } from '../../components/TrustedCompaniesSection'
import { marineCompanyLogos } from '../../assets/companyLogos'
import { LandingFaqSection } from '../LandingPage/components/LandingFaqSection'
import { SolutionFinalCtaSection } from '../../components/solutionPage/SolutionFinalCtaSection'
import { usePublicBrandColors } from '../../theme/publicSiteTokens'
import { MarineHero } from './components/MarineHero'
import { MarineAccuracySection } from './components/MarineAccuracySection'
import { MarineWorkflowSection } from './components/MarineWorkflowSection'
import { CompaniesWeWorkWithSection } from './components/CompaniesWeWorkWithSection'
import { MarineRetainerPlansSection } from './components/MarineRetainerPlansSection'
import {
  marineVisaCategories,
  marineFaqs,
} from './marinePageData'

export function MarineCrewVisaPage() {
  const colors = usePublicBrandColors()
  return (
    <Box component="main" sx={{ bgcolor: colors.white }}>
      <MarineHero />

      <MarineAccuracySection />

      <ChallengesWeSolveSection
        id="marine-industry-challenges"
        variant="marine"
        eyebrow="Industry insights"
        heading="Industry Challenges We Solve"
        description="We understand the unique needs of the marine and offshore industry."
        desktopColumns={4}
        challenges={[
          {
            title: 'Urgent Crew Movements',
            description: 'Coordinate last-minute crew changes around vessel departure and port schedules.',
            icon: Anchor,
          },
          {
            title: 'Multiple Port and Destination Rules',
            description: 'Navigate different visa requirements across ports, routes, and transit countries.',
            icon: Globe2,
          },
          {
            title: 'Seafarer Documentation',
            description: 'Prepare seaman books, contracts, joining letters, and supporting records correctly.',
            icon: FileCheck2,
          },
          {
            title: 'Changing Visa Requirements',
            description: 'Respond quickly when embassy rules or entry requirements change.',
            icon: RefreshCw,
          },
        ]}
      />

      <VisaCategoryCardsSection items={marineVisaCategories} />

      <MarineWorkflowSection />

      <CompaniesWeWorkWithSection />

      <MarineRetainerPlansSection />

      <TrustedCompaniesSection
        id="trusted-maritime-companies"
        heading="Trusted by Maritime Companies"
        previewOnly
        logos={marineCompanyLogos}
      />

      <SolutionFinalCtaSection
        variant="marine"
        heading="Need Reliable Marine Crew Visa Support?"
        description="From crew changes to urgent travel documentation, our specialists ensure your seafarers move seamlessly across international borders."
        primaryButton={{ label: 'Talk to a Marine Visa Specialist', href: '/track' }}
        secondaryButton={{ label: 'Request a Consultation', href: '/track' }}
      />

      <LandingFaqSection faqs={marineFaqs} />
    </Box>
  )
}
