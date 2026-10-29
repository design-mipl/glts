import { useEffect, useRef, useState } from 'react'
import { Box, Button, Typography, useMediaQuery } from '@mui/material'
import { ArrowRight, Bell, ClipboardCheck, FileCheck2, Files, Globe2, MessagesSquare, RefreshCw, UsersRound } from 'lucide-react'
import { PublicContainer } from '../../components/PublicContainer'
import { PublicFinalCtaSection } from '../../components/PublicFinalCtaSection'
import { VisaCategoryCardsSection } from '../../components/VisaCategoryCardsSection'
import { ChallengesWeSolveSection } from '../../components/ChallengesWeSolveSection'
import { TrustedCompaniesSection } from '../../components/TrustedCompaniesSection'
import { ServiceHeroContent } from '../../components/ServiceHeroContent'
import { serviceHeroSectionSx } from '../../components/serviceHeroStyles'
import { travelAgentCompanyLogos } from '../../assets/companyLogos'
import type { FAQItem } from '../../components/FAQSection'
import { publicFonts, usePublicBrandColors, getMarketingPrimaryButtonSx } from '../../theme/publicSiteTokens'
import { websiteHeadingSx } from '../../theme/websiteComponentStyles'
import { websiteDesignSystem as ds } from '../../theme/websiteDesignSystem'
import { ProcessTimelineCopy, ProcessTimelineMarker, ResponsiveProcessTimeline } from '../../components/workflowTimeline/ProcessTimeline'
import { LandingFaqSection } from '../LandingPage/components/LandingFaqSection'
import { featureSectionPy, finalCtaSectionMb, landingSectionHeaderMb } from '../LandingPage/landingPageSpacing'

const travelAgentFaqs: FAQItem[] = [
  { q: 'How can travel agents enquire about working with GLTS?', a: 'Click “Enquire About Partnership” and share your agency details and requirements through the enquiry page. This helps GLTS understand the support your agency needs.' },
  { q: 'What visa support can travel agents request?', a: 'Agents can enquire about visa requirements, document preparation, and application coordination for tourist visits, business travel, family visits, and group travel. Available support depends on the destination and visa category.' },
  { q: 'What information should we provide with an enquiry?', a: 'Share the destination, purpose of travel, intended travel dates, number of travellers, and their nationality and country of residence. GLTS can advise on any further details or documents needed.' },
  { q: 'Can we submit enquiries for families or groups?', a: 'Yes, you can share enquiries involving multiple travellers. Each traveller’s requirements may differ, so documents and eligibility need to be reviewed individually.' },
  { q: 'How long does visa processing take?', a: 'Processing times vary by destination, visa category, appointment availability, and the relevant authority. Confirm the applicable timelines before making travel commitments.' },
  { q: 'Does visa assistance guarantee approval?', a: 'No. Visa approval is decided by the relevant embassy, consulate, or immigration authority. Guidance and document support help applicants prepare their applications but cannot guarantee an outcome.' },
]

const headingSx = websiteHeadingSx.h2
const heroBenefits = [
  { title: 'Visa Guidance', description: 'Destination guidance', icon: Globe2 },
  { title: 'Document Support', description: 'Document requirements', icon: FileCheck2 },
  { title: 'Group Enquiries', description: 'Multiple travellers', icon: UsersRound },
  { title: 'Application Updates', description: 'Progress updates', icon: Bell },
] as const
const supportBenefits = [
  { title: 'Reliable Guidance', description: 'Clear information based on each traveller’s destination and purpose.', icon: Globe2 },
  { title: 'End-to-End Coordination', description: 'Help with documentation and the applicable application steps.', icon: Files },
  { title: 'Flexible Support', description: 'Assistance for individual travellers, families, and groups.', icon: ClipboardCheck },
  { title: 'Ongoing Updates', description: 'Progress information you can share with your customers.', icon: Bell },
] as const
const travelAgentChallenges = [
  { title: 'Changing Destination Requirements', description: 'Visa requirements vary by destination and can change over time.', icon: RefreshCw },
  { title: 'Incomplete Customer Documents', description: 'Missing or outdated documents can make an application harder to prepare.', icon: Files },
  { title: 'Coordinating Multiple Travellers', description: 'Collecting consistent details and documents takes extra coordination for groups.', icon: UsersRound },
  { title: 'Keeping Customers Updated', description: 'Customers need clear information while their application is in progress.', icon: MessagesSquare },
] as const
const visaServices = [
  { id: 'tourist-visits', title: 'Tourist Visits', description: 'Guidance for leisure travel based on the destination and purpose of the visit.', image: { src: '/images/visa-services/tourist.png', fallback: '/images/visa-services/tourist.png', alt: 'Travellers enjoying a leisure destination' }, href: '/countries' },
  { id: 'business-travel', title: 'Business Travel', description: 'Support for business trips, subject to destination requirements and eligibility.', image: { src: '/images/visa-services/business.png', fallback: '/images/visa-services/business.png', alt: 'Business traveller preparing for an international trip' }, href: '/countries' },
  { id: 'family-visits', title: 'Family Visits', description: 'Guidance for visiting relatives, with requirements that vary by destination.', image: { src: '/images/travel-agents/family-visits.png', fallback: '/images/travel-agents/family-visits.png', alt: 'Family travelling together through an airport' }, href: '/countries' },
  { id: 'group-travel', title: 'Group Travel', description: 'Coordination for multiple travellers, with individual requirements reviewed.', image: { src: '/images/travel-agents/group-travel.png', fallback: '/images/travel-agents/group-travel.png', alt: 'Group of friends travelling together through an airport' }, href: '/countries' },
]
const partnershipSteps = [
  { title: 'Share the Enquiry', description: 'Share the destination, travel purpose, and available traveller details.', icon: MessagesSquare },
  { title: 'Review Requirements', description: 'We review the trip information and outline the applicable process.', icon: ClipboardCheck },
  { title: 'Prepare and Coordinate', description: 'Organise supporting documents and coordinate the next application steps.', icon: Files },
  { title: 'Receive Updates', description: 'Receive progress updates to help keep travellers informed.', icon: Bell },
]
const partnershipBenefits = [
  { title: 'Clear Guidance', description: 'Ask which process applies after destination and purpose are reviewed.', icon: Globe2 },
  { title: 'Organised Documentation', description: 'See which traveller details or supporting papers are still needed.', icon: FileCheck2 },
  { title: 'Individual and Group Enquiries', description: 'Raise an enquiry for one traveller or a group itinerary.', icon: UsersRound },
  { title: 'Communication Throughout', description: 'Keep follow-up questions connected to the active enquiry.', icon: MessagesSquare },
] as const

function Eyebrow({ children, mb = 1 }: { children: string; mb?: number }) {
  const colors = usePublicBrandColors()
  return <Typography sx={{ color: colors.greenBright, fontFamily: publicFonts.heading, fontSize: 12, fontWeight: 800, letterSpacing: '.11em', lineHeight: 1.4, textTransform: 'uppercase', mb }}>{children}</Typography>
}

function TravelAgentsHero() {
  const colors = usePublicBrandColors()
  return (
    <Box component="section" aria-labelledby="travel-agents-heading" sx={{ ...serviceHeroSectionSx, minHeight: { desktop: 620 }, bgcolor: colors.navy }}>
      <Box component="img" src="/images/travel-agents/agent-assisting-customer.png" alt="" aria-hidden="true" fetchPriority="high" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: { xs: '69% center', md: 'center 48%' } }} />
      <Box aria-hidden="true" sx={{ position: 'absolute', inset: 0, background: { xs: 'linear-gradient(90deg, rgba(0,31,63,.92) 0%, rgba(0,31,63,.83) 58%, rgba(0,31,63,.72) 100%)', desktop: 'linear-gradient(105deg, rgba(0,31,63,.92) 0%, rgba(0,31,63,.82) 38%, rgba(0,31,63,.48) 62%, rgba(0,31,63,.58) 100%)' } }} />
      <ServiceHeroContent
        headingId="travel-agents-heading"
        eyebrow="Partner with confidence"
        heading="Visa Support for Travel Agents"
        description="Help your customers navigate visa requirements with clear guidance, document support, and a coordinated application process."
        primaryAction={{ label: 'Enquire About Partnership', href: '/enquiry?service=travel-agents' }}
        secondaryAction={{ label: 'Contact Our Team', href: '/contact' }}
        items={heroBenefits}
        itemsLabel="Travel agent support benefits"
        animate
        compactSpacing
        prominentItems
      />
    </Box>
  )
}

function TravelAgentIntroduction() {
  const colors = usePublicBrandColors()
  return (
    <Box component="section" aria-labelledby="travel-agent-support-heading" sx={{ bgcolor: '#FDFEFE', py: featureSectionPy }}>
      <PublicContainer variant="hero">
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', desktop: 'minmax(0, 0.82fr) minmax(0, 1fr)' }, gap: { xs: 5, desktop: '42px' }, alignItems: { xs: 'start', desktop: 'stretch' } }}>
          <Box sx={{ position: 'relative', width: '100%', height: { xs: 360, sm: 440, desktop: 'auto' }, minHeight: { desktop: 454 }, borderRadius: '14px', overflow: 'hidden' }}>
            <Box component="img" src="/images/about-industries/corporate-businesses.png" alt="Travel professionals coordinating customer travel details in an airport lounge" loading="lazy" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', objectFit: 'cover', objectPosition: 'center 48%' }} />
          </Box>
          <Box sx={{ alignSelf: 'stretch', display: 'flex', flexDirection: 'column' }}>
            <Typography sx={{ color: colors.greenDark, fontFamily: publicFonts.heading, fontSize: '16px', fontWeight: 700, lineHeight: 1.5, letterSpacing: '0.08em', textTransform: 'uppercase', mb: 1 }}>Travel agent support</Typography>
            <Typography id="travel-agent-support-heading" component="h2" sx={{ ...headingSx, color: colors.navy, maxWidth: 560, mb: 1.25 }}>Support Your Customers with a Visa Partner</Typography>
            <Typography sx={{ color: colors.textSecondary, fontFamily: publicFonts.body, fontSize: { xs: '16px', lg: '18px' }, lineHeight: 1.5, maxWidth: 640 }}>Your agency can share traveller and trip details with GLTS, receive guidance on the applicable process, and coordinate documentation and updates through GLTS.</Typography>
            <Box component="ul" sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', xl: 'repeat(2, minmax(0, 1fr))' }, gap: 2, gridAutoRows: '1fr', m: 0, mt: { xs: 4, desktop: 4.5 }, p: 0, flexGrow: { desktop: 1 }, listStyle: 'none' }}>
              {supportBenefits.map(({ title, description, icon: Icon }) => (
                <Box component="li" key={title} sx={{ display: 'grid', gridTemplateColumns: { xs: '80px minmax(0, 1fr)', lg: '88px minmax(0, 1fr)' }, gap: 1.5, alignItems: 'start', minWidth: 0, p: { xs: 2, desktopMd: 2.25 }, bgcolor: ds.color.white, border: `1px solid ${ds.color.border}`, borderRadius: `${ds.component.card.benefit.radius}px`, boxShadow: '0 6px 20px rgba(15, 35, 55, 0.055)' }}>
                  <Box sx={{ width: { xs: 80, lg: 88 }, height: { xs: 80, lg: 88 }, borderRadius: '50%', bgcolor: '#EAF8EC', display: 'grid', placeItems: 'center' }}><Icon size={46} color={colors.greenDark} strokeWidth={1.8} aria-hidden="true" /></Box>
                  <Box sx={{ minWidth: 0, pt: 0.25 }}><Typography component="h3" sx={{ color: colors.navy, fontFamily: publicFonts.heading, fontSize: { xs: '18px', lg: '19px' }, fontWeight: 700, lineHeight: 1.35, mb: 0.75 }}>{title}</Typography><Typography sx={{ color: colors.textSecondary, fontFamily: publicFonts.body, fontSize: { xs: '16px', lg: '17px' }, lineHeight: 1.5 }}>{description}</Typography></Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </PublicContainer>
    </Box>
  )
}

function TravelAgentChallenges() {
  return (
    <ChallengesWeSolveSection
      id="travel-agent-challenges"
      eyebrow="Common challenges"
      heading="Challenges Travel Agents Face"
      description="Visa requirements vary by destination and can create challenges for travel agents. Here’s how we help address common concerns."
      challenges={travelAgentChallenges}
    />
  )
}

function TravelAgentPartnershipWorkflow() {
  const colors = usePublicBrandColors()
  const timelineRef = useRef<HTMLDivElement>(null)
  const [entered, setEntered] = useState(() => typeof IntersectionObserver === 'undefined')
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const active = entered || reducedMotion
  useEffect(() => {
    const timeline = timelineRef.current
    if (!timeline || active || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setEntered(true); observer.disconnect() }
    }, { threshold: 0.2 })
    observer.observe(timeline)
    return () => observer.disconnect()
  }, [active])

  return (
    <Box component="section" id="how-travel-agent-partnership-works" aria-labelledby="travel-agent-partnership-heading" sx={{ bgcolor: '#f1f8f3', py: featureSectionPy, my: { xs: '24px', lg: '32px', desktopMd: '48px' } }}>
      <PublicContainer variant="hero">
        <Box sx={{ textAlign: 'center', maxWidth: 860, mx: 'auto', mb: landingSectionHeaderMb }}>
          <Eyebrow>Partnership steps</Eyebrow>
          <Typography id="travel-agent-partnership-heading" component="h2" sx={{ ...headingSx, color: colors.navy, mb: .85 }}>How Partnership Works</Typography>
          <Typography sx={{ color: colors.textSecondary, fontSize: 16, lineHeight: 1.55 }}>Four steps to share trip details, prepare documents, and coordinate updates.</Typography>
        </Box>
        <Box ref={timelineRef} sx={{ position: 'relative' }}>
          <Box aria-hidden="true" sx={{ display: { xs: 'block', desktop: 'none' }, position: 'absolute', top: 42, bottom: 42, left: 36, width: 2, bgcolor: '#cbd8d4', '&::after': { content: '""', display: 'block', width: '100%', height: '100%', bgcolor: colors.greenBright, transformOrigin: 'top', transform: active ? 'scaleY(1)' : 'scaleY(0)', transition: reducedMotion ? 'none' : 'transform 900ms ease-out' } }} />
          <Box aria-hidden="true" sx={{ display: { xs: 'none', desktop: 'block' }, position: 'absolute', top: 32, left: '12.5%', right: '12.5%', height: 2, bgcolor: '#cbd8d4', '&::after': { content: '""', display: 'block', width: '100%', height: '100%', bgcolor: colors.greenBright, transformOrigin: 'left', transform: active ? 'scaleX(1)' : 'scaleX(0)', transition: reducedMotion ? 'none' : 'transform 900ms ease-out' } }} />
          <Box aria-hidden="true" sx={{ display: { xs: 'none', desktop: 'block' }, position: 'absolute', zIndex: 2, top: 21, left: 0, right: 0, height: 24, pointerEvents: 'none' }}>
            {['25%', '50%', '75%'].map((position) => <Box key={position} sx={{ position: 'absolute', left: position, transform: 'translateX(-50%)', width: 24, height: 24, display: 'grid', placeItems: 'center', bgcolor: '#f1f8f3', color: '#77899b' }}><ArrowRight size={18} aria-hidden="true" /></Box>)}
          </Box>
          <ResponsiveProcessTimeline
            steps={partnershipSteps}
            ariaLabel="Travel agent partnership steps"
            variant="partnership"
            horizontalAt={ds.breakpoint.laptop}
            listSx={{ gap: { xs: 2.5, desktop: 3 } }}
            getItemSx={(_, index) => ({ minWidth: 0, opacity: active ? 1 : 0, transform: active ? 'translateY(0)' : 'translateY(10px)', transition: reducedMotion ? 'none' : `opacity 360ms ease ${index * 140}ms, transform 360ms ease ${index * 140}ms` })}
            renderStep={({ title, description, icon }, index) => (
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '74px minmax(0,1fr)', desktop: '1fr' }, alignItems: { xs: 'center', desktop: 'start' }, gap: { xs: 2, desktop: 0 }, textAlign: { xs: 'left', desktop: 'center' } }}>
                <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: { xs: 92, desktop: ds.icon.processContainer } }}>
                  <ProcessTimelineMarker icon={icon} number={index + 1} iconSize={ds.icon.process} containerSize={{ xs: 64, desktop: ds.icon.processContainer }} numberSize={24} background={active ? '#e4f5e8' : '#fff'} borderColor={active ? '#a6dcb0' : '#dce8e0'} color={active ? colors.greenDark : colors.navy} numberBackground={active ? colors.greenDark : '#dfe8e3'} strokeWidth={ds.icon.strokeWidth} containerSx={{ transition: reducedMotion ? 'none' : `background-color 300ms ease ${index * 140}ms, color 300ms ease ${index * 140}ms` }} numberSx={{ transition: reducedMotion ? 'none' : `background-color 250ms ease ${index * 140}ms` }} sx={{ mt: { xs: 2, desktop: 0 } }} />
                </Box>
                <ProcessTimelineCopy
                  title={title}
                  description={description}
                  titleSx={{ color: colors.navy, mb: .65 }}
                  descriptionSx={{ color: colors.textSecondary, maxWidth: 270, mx: { desktop: 'auto' } }}
                  sx={{ pt: { desktop: 1.5 } }}
                />
              </Box>
            )}
          />
        </Box>
      </PublicContainer>
    </Box>
  )
}

function TravelAgentBenefitsSection() {
  const colors = usePublicBrandColors()
  return (
    <Box component="section" id="why-travel-agents-work-with-glts" aria-labelledby="why-travel-agents-heading" sx={{ position: 'relative', isolation: 'isolate', overflow: 'hidden', bgcolor: '#fff', pt: { xs: '48px', lg: '56px', desktopMd: '72px' }, pb: { xs: '48px', lg: '64px', desktopMd: '80px' } }}>
      <Box aria-hidden="true" sx={{ position: 'absolute', zIndex: 0, inset: '0 0 auto', height: { xs: 180, lg: 240, desktopMd: 300 }, backgroundImage: 'url(/images/travel-agents/partnership-sky.svg)', backgroundRepeat: 'no-repeat', backgroundPosition: 'center top', backgroundSize: { xs: 'auto 180px', lg: 'auto 240px', desktopMd: '100% 300px' }, pointerEvents: 'none' }} />
      <PublicContainer variant="hero" sx={{ position: 'relative', zIndex: 1, maxWidth: { desktopLg: '1774px' }, pl: { desktopMd: 'clamp(48px, 4.45vw, 80px)' }, pr: { desktopMd: 'clamp(24px, 2.15vw, 40px)' } }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'repeat(2, minmax(0, 1fr))', desktopMd: 'minmax(0, 1.14fr) minmax(0, 1fr) minmax(0, 1.29fr)' }, gridTemplateAreas: { xs: '"intro" "image" "benefits"', lg: '"intro image" "benefits benefits"', desktopMd: '"intro image benefits"' }, gap: { xs: '28px', lg: '28px', desktopMd: '24px' }, alignItems: { xs: 'start', desktopMd: 'stretch' } }}>
          <Box sx={{ gridArea: 'intro', alignSelf: 'center', minWidth: 0 }}>
            <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: colors.greenDark, fontFamily: publicFonts.heading, fontSize: { xs: 12, lg: 13 }, fontWeight: 800, letterSpacing: '.13em', lineHeight: 1.4, textTransform: 'uppercase', mb: 2, '&::before': { content: '""', width: 38, height: 2, flexShrink: 0, bgcolor: colors.greenDark } }}>Why partner with GLTS</Typography>
            <Typography id="why-travel-agents-heading" component="h2" sx={{ ...headingSx, color: colors.navy, fontSize: { xs: 36, sm: 40, lg: 34, xl: 42, desktopMd: 48, desktopLg: 'clamp(48px, 3.3vw, 58px)' }, lineHeight: 1.12, letterSpacing: '-.035em', mb: 2 }}>Why Travel Agents Work With GLTS</Typography>
            <Typography sx={{ color: colors.textSecondary, fontFamily: publicFonts.body, fontSize: { xs: 16, xl: 18, desktopLg: 'clamp(18px, 1.24vw, 22px)' }, lineHeight: 1.48, maxWidth: { desktopLg: 520 } }}>We provide reliable guidance, organised documentation and ongoing communication, so you can support your customers with confidence.</Typography>
            <Button variant="contained" href="/enquiry?service=travel-agents" endIcon={<ArrowRight size={ds.component.button.marketing.iconSize} />} sx={{ ...getMarketingPrimaryButtonSx(colors), mt: { xs: 3, lg: 4 }, minHeight: 48, px: { xs: 2, lg: 3.5 }, fontSize: { xs: 14, lg: 16 }, width: { xs: '100%', lg: 'auto' }, whiteSpace: 'normal', lineHeight: 1.3 }}>Enquire About Partnership</Button>
          </Box>
          <Box sx={{ gridArea: 'image', position: 'relative', minWidth: 0, width: '100%', maxWidth: { xs: 560, lg: 'none' }, mx: { xs: 'auto', lg: 0 }, aspectRatio: '3 / 4', borderRadius: '20px' }}>
            <Box aria-hidden="true" sx={{ position: 'absolute', inset: '-28px auto auto -28px', width: '42%', height: '26%', borderRadius: '30px', bgcolor: 'rgba(115, 194, 101, .09)' }} />
            <Box aria-hidden="true" sx={{ position: 'absolute', inset: 'auto -28px -16px auto', width: '38%', height: '25%', borderRadius: '30px', bgcolor: 'rgba(115, 194, 101, .09)' }} />
            <Box component="img" src="/images/visa-master/passport.png" alt="Navy passport ready for an international journey" loading="lazy" sx={{ position: 'absolute', inset: 0, display: 'block', width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 52%', borderRadius: '20px', boxShadow: '0 12px 28px rgba(15,35,55,.1)' }} />
          </Box>
          <Box sx={{ gridArea: 'benefits', minWidth: 0, alignSelf: 'stretch' }}>
            <Box component="ul" sx={{ display: 'grid', height: '100%', gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'repeat(2, minmax(0, 1fr))' }, gridTemplateRows: { lg: 'repeat(2, minmax(0, 1fr))' }, gridAutoRows: '1fr', gap: '12px', listStyle: 'none', p: 0, m: 0 }}>
              {partnershipBenefits.map(({ title, description, icon: Icon }) => (
                <Box component="li" key={title} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 0, p: { xs: '20px', desktopMd: '22px', desktopLg: '24px' }, bgcolor: '#F9FCFA', border: '1px solid #DDEAE4', borderRadius: '18px' }}>
                  <Box sx={{ width: { xs: 62, desktopLg: 'clamp(62px, 4.05vw, 72px)' }, height: { xs: 62, desktopLg: 'clamp(62px, 4.05vw, 72px)' }, display: 'grid', placeItems: 'center', borderRadius: '50%', bgcolor: '#E5F4E9', color: colors.greenDark, mb: '16px' }}><Icon size={29} strokeWidth={ds.icon.strokeWidth} aria-hidden="true" /></Box>
                  <Typography component="h3" sx={{ color: colors.navy, fontFamily: publicFonts.heading, fontSize: { xs: 17, desktopMd: 18, desktopLg: 'clamp(18px, 1.13vw, 20px)' }, fontWeight: 800, lineHeight: 1.35, mb: '8px' }}>{title}</Typography>
                  <Typography sx={{ color: colors.textSecondary, fontFamily: publicFonts.body, fontSize: { xs: 15, desktopMd: 16, desktopLg: 'clamp(16px, 1.08vw, 19px)' }, lineHeight: 1.5 }}>{description}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </PublicContainer>
    </Box>
  )
}

function TravelAgentsFinalCta() {
  return (
    <PublicFinalCtaSection
      id="travel-agents-final-cta"
      variant="b2b"
      heading="Support Your Customers with a Reliable Visa Partner."
      description="Visa guidance, document support, and coordinated application updates for your customers."
      image={{ src: '/images/travel-agents/agent-assisting-customer.png', fallback: '/images/travel-agents/agent-assisting-customer.png' }}
      imagePosition={{ xs: '68% center', md: 'center 28%' }}
      overlay={{
        xs: 'linear-gradient(90deg, rgba(0,31,63,.9) 0%, rgba(0,31,63,.76) 62%, rgba(0,31,63,.55) 100%)',
        md: 'linear-gradient(90deg, rgba(0,31,63,.91) 0%, rgba(0,31,63,.76) 38%, rgba(0,31,63,.34) 72%, rgba(0,31,63,.18) 100%)',
      }}
      sectionMinHeight={{ xs: 440, sm: 360, md: 360 }}
      removeLastChildMargin
      eyebrow="Travel agent partnership"
      primaryButton={{ label: 'Enquire About Partnership', href: '/enquiry' }}
    />
  )
}

export function TravelAgentsPage() {
  const colors = usePublicBrandColors()
  return (
    <Box sx={{ bgcolor: colors.white, pb: finalCtaSectionMb }}>
      <TravelAgentsHero />
      <TravelAgentIntroduction />
      <TravelAgentChallenges />
      <VisaCategoryCardsSection id="travel-agent-visa-services" title="Visa Services for Your Customers" subtitle="Visa guidance is based on each traveller’s destination, purpose, and individual circumstances." headingAlign="center" headingSize="business" items={visaServices} desktopColumns={4} readable imageHeight={{ mobile: 220, tablet: 260, desktop: 210 }} />
      <TravelAgentPartnershipWorkflow />
      <TravelAgentBenefitsSection />
      <TrustedCompaniesSection
        id="trusted-travel-partners"
        heading="Trusted by Travel Agents"
        logos={travelAgentCompanyLogos}
      />
      <LandingFaqSection heading="Frequently Asked Questions" faqs={travelAgentFaqs} />
      <TravelAgentsFinalCta />
    </Box>
  )
}
