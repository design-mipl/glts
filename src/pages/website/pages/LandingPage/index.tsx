import { Box } from '@mui/material'
import { HeroSection } from './components/HeroSection'
import { ExploreSection } from './components/ExploreSection'
import { HowItWorks } from './components/HowItWorks'
import { WhyGreenLightWorksSection } from './components/WhyGreenLightWorksSection'
import { VisaServicesSection } from './components/VisaServicesSection'
import { SpecializedSolutionsSection } from './components/SpecializedSolutionsSection'
import { VisaMasterSection } from './components/VisaMasterSection'
import { AdditionalServicesSection } from './components/AdditionalServicesSection'
import { TestimonialSection } from '../../components/TestimonialSection'
import { FinalCtaSection } from './components/FinalCtaSection'
import { FAQSection } from '../../components/FAQSection'
import { landingTestimonials, landingFaqs } from './landingPageContent'
import { usePublicBrandColors } from '../../theme/publicSiteTokens'

/**
 * Homepage.
 *
 * ONE LIGHT SURFACE. The page used to alternate between deep ink bands and light ones —
 * five inversions on the way down. That rhythm was the loudest device available and it was
 * being spent on category lists and testimonials. Every section now sits on one of four
 * steps of warm paper (`sitePaper.ts`); a section boundary is a one-step change plus a
 * hairline, and the two deepest steps are reserved for the two places that genuinely want
 * emphasis: Visa Master and the close.
 *
 * THIRTEEN SECTIONS TO TEN. The page previously answered "what do you offer" six separate
 * times and "why you" twice. `RetailServicesBento` duplicated `VisaServicesSection`'s
 * category list outright, and `RetailAdvantageSection` restated `WhyGreenLightWorksSection`
 * point for point; both are gone rather than restyled. `AdditionalServicesSection` dropped
 * from a full screen of cards to a single strip now that Extra Services has its own page.
 *
 * The order is the argument a visitor actually works through:
 *
 *   base    what this is, and the one action            (hero)
 *   base    do you cover where I am going               (destinations)
 *   canvas  what happens, in order                      (how it works)
 *   base    why trust you with a passport               (why GreenLight)
 *   canvas  what kinds of visa                          (categories)
 *   deep    the premium tier                            (Visa Master)
 *   base    which of these am I                         (who we serve)
 *   canvas  the things that go alongside                (extra services)
 *   canvas  other people's outcomes                     (testimonials)
 *   base    the remaining objections                    (FAQ)
 *   deep    the action again, quietly                   (close)
 *
 * Destinations sits second because "do you cover where I am going" is the first question a
 * visitor has, and it is the only section that answers it with real figures.
 */
export function LandingPage() {
  const colors = usePublicBrandColors()

  return (
    <Box sx={{ width: '100%', bgcolor: colors.white }}>
      <HeroSection />

      {/* Migrated to the Paper surface — paints its own ground, so no band wrapper. */}
      <ExploreSection />

      <HowItWorks />

      <WhyGreenLightWorksSection />

      <VisaServicesSection />

      {/* Paints its own rail ground — it is also mounted on the Services page. */}
      <VisaMasterSection />

      {/*
        `RetailServicesBento` and `RetailAdvantageSection` were removed here, not restyled.
        The bento listed the same visa categories as `VisaServicesSection` directly above
        it, and the advantage list restated `WhyGreenLightWorksSection` point for point.
        Between them the page made its categories argument twice and its quality argument
        twice inside one scroll, which is what made it read as cluttered.
      */}
      <SpecializedSolutionsSection />

      <AdditionalServicesSection />

      <TestimonialSection testimonials={landingTestimonials} />

      <FAQSection faqs={landingFaqs} />

      <FinalCtaSection />
    </Box>
  )
}
