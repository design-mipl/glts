import { useMemo } from 'react'
import { Box } from '@mui/material'
import { SolutionPageSection } from '../../components/solutionPage/SolutionPageSection'
import { RetainerPlanCards } from '../../components/solutionPage/RetainerPlanCards'
import { CommonDestinationsSection } from '../../components/CommonDestinationsSection'
import { VisaCategoryCardsSection } from '../../components/VisaCategoryCardsSection'
import { WhyAccuracySplitSection } from '../../components/WhyAccuracySplitSection'
import { ServiceShowcaseMosaic } from '../../components/ServiceShowcaseMosaic'
import { TestimonialSection } from '../../components/TestimonialSection'
import { FAQSection } from '../../components/FAQSection'
import { SolutionFinalCtaSection } from '../../components/solutionPage/SolutionFinalCtaSection'
import { WorkflowTimelineSection } from '../../components/workflowTimeline/WorkflowTimelineSection'
import { resolveDestinationCountries } from '../../utils/resolveDestinationCountries'
import { usePublicBrandColors } from '../../theme/publicSiteTokens'
import { MarineHero } from './components/MarineHero'
import { CompaniesWeWorkWithSection } from './components/CompaniesWeWorkWithSection'
import {
  marineImpactPoints,
  marineAccuracyVisuals,
  marineVisaCategories,
  marineDestinations,
  marineAdditionalServiceCards,
  marineRetainerPlans,
  marineTestimonials,
  marineFaqs,
  marineProcessSteps,
} from './marinePageData'

export function MarineCrewVisaPage() {
  const colors = usePublicBrandColors()
  const marineDestinationCountries = useMemo(
    () => resolveDestinationCountries(marineDestinations),
    [],
  )

  return (
    <Box component="main" sx={{ bgcolor: colors.white }}>
      <MarineHero />

      <WhyAccuracySplitSection
        id="why-marine-visa-accuracy"
        title="Why Marine Visa Accuracy Matters"
        description="In marine operations, visa delays affect vessel schedules, crew rotations, port operations, and contractual commitments."
        badgeLabel={marineAccuracyVisuals.badgeLabel}
        images={{
          primary: marineAccuracyVisuals.primary,
          secondaryTop: marineAccuracyVisuals.secondaryTop,
          secondaryBottom: marineAccuracyVisuals.secondaryBottom,
        }}
        impacts={marineImpactPoints}
      />

      <VisaCategoryCardsSection items={marineVisaCategories} />

      <CommonDestinationsSection
        subtitle="Frequently requested marine crew visa destinations supported through GreenLight."
        countries={marineDestinationCountries}
      />

      <WorkflowTimelineSection
        id="how-marine-visa-handling-works"
        sectionLabel="Marine Workflow"
        heading="How Marine Crew Visa Handling Works"
        subheading="A transparent workflow designed for vessel operators, crew managers, and maritime coordinators."
        steps={marineProcessSteps}
      />

      <CompaniesWeWorkWithSection />

      <SolutionPageSection id="additional-marine-services" title="Additional Marine Services">
        <ServiceShowcaseMosaic items={marineAdditionalServiceCards} />
      </SolutionPageSection>

      <SolutionPageSection id="marine-retainer-plans" title="Marine Retainer Plans">
        <RetainerPlanCards items={marineRetainerPlans} />
      </SolutionPageSection>

      <TestimonialSection
        testimonials={marineTestimonials}
        subtitle="Shipping companies, offshore operators, and crew managers rely on GreenLight for seafarer visas, urgent port calls, and compliant crew rotations."
        markerIcon="ship"
      />

      <SolutionFinalCtaSection
        variant="marine"
        heading="Need Reliable Marine Crew Visa Support?"
        description="From crew changes to urgent travel documentation, our specialists ensure your seafarers move seamlessly across international borders."
        primaryButton={{ label: 'Talk to a Marine Visa Specialist', href: '/track' }}
        secondaryButton={{ label: 'Request a Consultation', href: '/track' }}
      />

      <FAQSection faqs={marineFaqs} />
    </Box>
  )
}
