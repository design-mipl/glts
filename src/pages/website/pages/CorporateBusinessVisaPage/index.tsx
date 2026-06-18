import { useMemo } from 'react'
import { Box, Typography } from '@mui/material'
import {
  SolutionPageSection,
  SolutionList,
} from '../../components/solutionPage/SolutionPageSection'
import { CorporateHero } from './components/CorporateHero'
import { WorkflowTimelineSection } from '../../components/workflowTimeline/WorkflowTimelineSection'
import { CommonDestinationsSection } from '../../components/CommonDestinationsSection'
import { VisaCategoryCardsSection } from '../../components/VisaCategoryCardsSection'
import { WhyAccuracySplitSection } from '../../components/WhyAccuracySplitSection'
import { ServiceShowcaseMosaic } from '../../components/ServiceShowcaseMosaic'
import { TestimonialSection } from '../../components/TestimonialSection'
import { FAQSection } from '../../components/FAQSection'
import { SolutionFinalCtaSection } from '../../components/solutionPage/SolutionFinalCtaSection'
import { resolveDestinationCountries } from '../../utils/resolveDestinationCountries'
import { usePublicBrandColors } from '../../theme/publicSiteTokens'
import {
  corporateTestimonials,
  corporateFaqs,
  corporateTrustPoints,
  corporateImpactPoints,
  corporateAccuracyVisuals,
  corporateDestinations,
  corporateVisaCategories,
  corporateAdditionalServiceCards,
} from './corporatePageData'
import { corporateProcessSteps } from './corporateWorkflowContent'

const corporateRetainerPlans = [
  'Dedicated corporate account manager',
  'Priority visa processing',
  'Documentation management',
  'Monthly activity and status reporting',
  'Escalation handling',
]

function SolutionSubheading({ children }: { children: string }) {
  const colors = usePublicBrandColors()
  return (
    <Typography sx={{ fontSize: '15px', fontWeight: 600, color: colors.navy, mb: 1.5 }}>
      {children}
    </Typography>
  )
}

export function CorporateBusinessVisaPage() {
  const colors = usePublicBrandColors()
  const corporateDestinationCountries = useMemo(
    () => resolveDestinationCountries(corporateDestinations),
    [],
  )

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

      <VisaCategoryCardsSection items={corporateVisaCategories} />

      <CommonDestinationsSection
        subtitle="Frequently requested corporate business visa destinations supported through GreenLight."
        countries={corporateDestinationCountries}
      />

      <WorkflowTimelineSection
        id="how-corporate-visa-handling-works"
        sectionLabel="Corporate Workflow"
        heading="How Corporate Business Visa Handling Works"
        subheading="A structured process built for HR teams, travel coordinators, and business travelers."
        steps={corporateProcessSteps}
      />

      <SolutionPageSection id="additional-corporate-visa-services" title="Additional Corporate Visa Services">
        <ServiceShowcaseMosaic items={corporateAdditionalServiceCards} />
      </SolutionPageSection>

      <SolutionPageSection id="corporate-visa-retainer-plans" title="Corporate Visa Retainer Plans">
        <SolutionSubheading>Retainer plans may include:</SolutionSubheading>
        <SolutionList items={corporateRetainerPlans} />
      </SolutionPageSection>

      <TestimonialSection
        testimonials={corporateTestimonials}
        subtitle="HR teams, business travelers, and corporate travel coordinators at multinational companies trust GreenLight for reliable business visa support."
      />

      <SolutionPageSection id="why-teams-trust-greenlight" title="Why teams trust GreenLight">
        <SolutionList items={corporateTrustPoints} />
      </SolutionPageSection>

      <SolutionFinalCtaSection
        variant="corporate"
        heading="Simplify Corporate Visa Management"
        description="Dedicated account management, priority processing, and end-to-end visa support for your employees and business travelers."
        primaryButton={{ label: 'Speak with Our Corporate Team', href: '/track' }}
        secondaryButton={{ label: 'Schedule a Consultation', href: '/track' }}
      />

      <FAQSection faqs={corporateFaqs} />
    </Box>
  )
}
