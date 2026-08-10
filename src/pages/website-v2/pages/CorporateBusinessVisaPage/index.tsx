import { useMemo } from 'react'
import { Box } from '@mui/material'
import { CorporateHero } from './components/CorporateHero'
import { CorporateRetainerPlansSection } from './components/CorporateRetainerPlansSection'
import { WorkflowTimelineSection } from '../../components/workflowTimeline/WorkflowTimelineSection'
import { CommonDestinationsSection } from '../../components/CommonDestinationsSection'
import { VisaCategoryCardsSection } from '../../components/VisaCategoryCardsSection'
import { WhyAccuracySplitSection } from '../../components/WhyAccuracySplitSection'
import { AdditionalServicesSection } from '../../components/AdditionalServicesSection'
import { TestimonialSection } from '../../components/TestimonialSection'
import { FAQSection } from '../../components/FAQSection'
import { SolutionFinalCtaSection } from '../../components/solutionPage/SolutionFinalCtaSection'
import { resolveDestinationCountries } from '../../utils/resolveDestinationCountries'
import { usePublicBrandColors } from '../../theme/publicSiteTokens'
import {
  corporateTestimonials,
  corporateFaqs,
  corporateImpactPoints,
  corporateAccuracyVisuals,
  corporateDestinations,
  corporateVisaCategories,
  corporateAdditionalServices,
} from './corporatePageData'
import { corporateProcessSteps } from './corporateWorkflowContent'

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

      <AdditionalServicesSection
        id="additional-corporate-visa-services"
        sectionLabel="Additional Services"
        heading="Everything Your Teams Need Beyond Visas"
        description="Documentation, compliance, insurance, and travel support built for HR teams, business travelers, and corporate mobility programs."
        services={corporateAdditionalServices}
      />

      <CorporateRetainerPlansSection />

      <TestimonialSection
        testimonials={corporateTestimonials}
        subtitle="HR teams, business travelers, and corporate travel coordinators at multinational companies trust GreenLight for reliable business visa support."
      />

      <SolutionFinalCtaSection
        variant="corporate"
        heading="Simplify Corporate Visa Management"
        description="Dedicated account management, priority processing, and end-to-end visa support for your employees and business travelers."
        primaryButton={{ label: 'Speak with Our Corporate Team', href: '/v2/track' }}
        secondaryButton={{ label: 'Schedule a Consultation', href: '/v2/track' }}
      />

      <FAQSection faqs={corporateFaqs} />
    </Box>
  )
}
