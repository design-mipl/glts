import { Box } from '@mui/material'
import { Clock3, Eye, FileText, Globe2 } from 'lucide-react'
import { CorporateHero } from './components/CorporateHero'
import { CorporateRetainerPlansSection } from './components/CorporateRetainerPlansSection'
import { ProcessStepsSection } from '../../components/ProcessStepsSection'
import { VisaCategoryCardsSection } from '../../components/VisaCategoryCardsSection'
import { WhyAccuracySplitSection } from '../../components/WhyAccuracySplitSection'
import { ChallengesWeSolveSection } from '../../components/ChallengesWeSolveSection'
import { TrustedCompaniesSection } from '../../components/TrustedCompaniesSection'
import { corporateCompanyLogos } from '../../assets/companyLogos'
import { LandingFaqSection } from '../LandingPage/components/LandingFaqSection'
import { SolutionFinalCtaSection } from '../../components/solutionPage/SolutionFinalCtaSection'
import { usePublicBrandColors } from '../../theme/publicSiteTokens'
import {
  corporateFaqs,
  corporateImpactPoints,
  corporateAccuracyVisuals,
  corporateVisaCategories,
} from './corporatePageData'
import { corporateProcessSteps } from './corporateWorkflowContent'

export function CorporateBusinessVisaPage() {
  const colors = usePublicBrandColors()
  return (
    <Box component="main" sx={{ bgcolor: colors.white }}>
      <CorporateHero />

      <WhyAccuracySplitSection
        id="why-corporate-visa-accuracy"
        title="Why Corporate Visa Accuracy Matters"
        description="For corporate travel programs, visa delays affect meetings, projects, assignments, and business continuity."
        badgeLabel={corporateAccuracyVisuals.badgeLabel}
        images={{
          primary: corporateAccuracyVisuals.primary,
          secondaryTop: corporateAccuracyVisuals.secondaryTop,
          secondaryBottom: corporateAccuracyVisuals.secondaryBottom,
        }}
        impacts={corporateImpactPoints}
      />

      <ChallengesWeSolveSection
        id="corporate-travel-challenges"
        variant="corporate"
        eyebrow="Corporate solutions"
        heading="Common Corporate Travel Challenges"
        description="We understand the complexities of managing visas for a global workforce."
        desktopColumns={4}
        challenges={[
          {
            title: 'Multiple Destinations and Visa Types',
            description: 'Coordinate different visa rules and application types across every destination.',
            icon: Globe2,
          },
          {
            title: 'Tight Travel Timelines',
            description: 'Keep business trips on schedule when approvals and appointments have limited lead time.',
            icon: Clock3,
          },
          {
            title: 'Complex Documentation',
            description: 'Manage country-specific paperwork, supporting evidence, and compliance requirements.',
            icon: FileText,
          },
          {
            title: 'Limited Application Visibility',
            description: 'Track each application’s status and next steps in one clear view.',
            icon: Eye,
          },
        ]}
      />

      <VisaCategoryCardsSection items={corporateVisaCategories} />

      <ProcessStepsSection
        id="how-corporate-visa-handling-works"
        sectionLabel="Corporate Workflow"
        heading="How Corporate Business Visa Handling Works"
        subheading="A structured process built for HR teams, travel coordinators, and business travelers."
        steps={corporateProcessSteps}
      />

      <CorporateRetainerPlansSection />

      <TrustedCompaniesSection
        id="trusted-corporate-companies"
        heading="Trusted by Companies"
        logos={corporateCompanyLogos}
      />

      <SolutionFinalCtaSection
        variant="corporate"
        heading="Simplify Corporate Visa Management"
        description="Dedicated account management, priority processing, and end-to-end visa support for your employees and business travelers."
        primaryButton={{ label: 'Speak with Our Corporate Team', href: '/track' }}
        secondaryButton={{ label: 'Schedule a Consultation', href: '/track' }}
      />

      <LandingFaqSection faqs={corporateFaqs} />
    </Box>
  )
}
