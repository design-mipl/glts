import { useEffect, useRef, useState } from 'react'
import { Box, Button, Typography, useMediaQuery } from '@mui/material'
import { ArrowRight, Bell, ClipboardCheck, FileCheck2, Files, Globe2, MessagesSquare, RefreshCw, UsersRound } from 'lucide-react'
import { PublicContainer } from '../../components/PublicContainer'
import { PublicFinalCtaSection } from '../../components/PublicFinalCtaSection'
import { VisaCategoryCardsSection } from '../../components/VisaCategoryCardsSection'
import { ChallengesWeSolveSection } from '../../components/ChallengesWeSolveSection'
import { TrustedCompaniesSection } from '../../components/TrustedCompaniesSection'
import { travelAgentCompanyLogos } from '../../assets/companyLogos'
import type { FAQItem } from '../../components/FAQSection'
import { publicFonts, usePublicBrandColors, getMarketingPrimaryButtonSx, brandPrimaryGreenRgb } from '../../theme/publicSiteTokens'
import { websiteHeadingSx } from '../../theme/websiteComponentStyles'
import { websiteDesignSystem as ds } from '../../theme/websiteDesignSystem'
import { ProcessTimelineCopy, ProcessTimelineMarker, ResponsiveProcessTimeline } from '../../components/workflowTimeline/ProcessTimeline'
import { LandingFaqSection } from '../LandingPage/components/LandingFaqSection'
import { featureSectionPy, finalCtaSectionMb, landingSectionHeaderMb, landingSectionPy } from '../LandingPage/landingPageSpacing'

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
  { title: 'Visa Guidance', description: 'Share the destination and trip purpose for relevant guidance.', icon: Globe2 },
  { title: 'Document Support', description: 'Understand which supporting records may be needed.', icon: FileCheck2 },
  { title: 'Group Enquiries', description: 'Send trip information for multiple travellers in one request.', icon: UsersRound },
  { title: 'Application Updates', description: 'Receive progress information you can pass to customers.', icon: Bell },
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
    <Box component="section" aria-labelledby="travel-agents-heading" sx={{ position: 'relative', overflow: 'hidden', bgcolor: colors.navy, minHeight: { xs: 720, md: 680, lg: 720 }, boxSizing: 'border-box', display: 'flex', alignItems: 'center', pt: { xs: '92px', md: '100px', lg: '108px' }, pb: { xs: '60px', md: '70px', lg: '80px' } }}>
      <Box component="img" src="/images/travel-agents/agent-assisting-customer.png" alt="" aria-hidden="true" fetchPriority="high" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: { xs: '69% center', md: 'center 48%' } }} />
      <Box aria-hidden="true" sx={{ position: 'absolute', inset: 0, background: { xs: 'linear-gradient(90deg, rgba(0,31,63,.92) 0%, rgba(0,31,63,.83) 58%, rgba(0,31,63,.64) 100%)', md: 'linear-gradient(90deg, rgba(0,31,63,.94) 0%, rgba(0,31,63,.82) 34%, rgba(0,31,63,.48) 58%, rgba(0,31,63,.24) 100%)' } }} />
      <PublicContainer variant="hero" sx={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', rowGap: { xs: '64px', md: '96px', lg: '112px' }, width: '100%' }}>
        <Box sx={{ maxWidth: 690 }}>
          <Eyebrow mb={4}>Partner with confidence</Eyebrow>
          <Typography id="travel-agents-heading" component="h1" sx={{ ...websiteHeadingSx.display, color: colors.white, maxWidth: 680, mb: { xs: 3, md: 3.5 } }}>Visa Support for Travel Agents</Typography>
          <Typography sx={{ maxWidth: 570, color: 'rgba(255,255,255,.91)', fontSize: { xs: 16, md: 17 }, lineHeight: 1.6, mb: { xs: 4.5, md: 5 } }}>Help your customers navigate visa requirements with clear guidance, document support, and a coordinated application process.</Typography>
          <Button variant="contained" href="/enquiry" endIcon={<ArrowRight size={18} />} sx={{ ...getMarketingPrimaryButtonSx(colors), minHeight: 48, px: 3, alignSelf: { xs: 'stretch', sm: 'flex-start' } }}>Enquire About Partnership</Button>
        </Box>
        <Box component="ul" aria-label="Travel agent support benefits" sx={{ display: 'flex', flexDirection: { xs: 'column', desktop: 'row' }, alignItems: 'stretch', gap: 0, width: '100%', maxWidth: 1100, listStyle: 'none', m: 0, p: { xs: 1.5, desktop: 0 }, borderRadius: { xs: '16px', desktop: 0 }, bgcolor: { xs: 'rgba(255, 255, 255, 0.06)', desktop: 'transparent' }, border: { xs: '1px solid rgba(255, 255, 255, 0.12)', desktop: 'none' }, backdropFilter: { xs: 'blur(12px)', desktop: 'none' } }}>
          {heroBenefits.map(({ title, description, icon: Icon }, index) => (
            <Box component="li" key={title} sx={{ flex: { desktop: '1 1 0' }, minWidth: 0, minHeight: { desktop: 64 }, display: 'flex', alignItems: 'center', gap: 2.25, py: { xs: 2, desktop: 1.25 }, px: { xs: 1, desktop: 1.75 }, borderBottom: { xs: index < heroBenefits.length - 1 ? '1px solid rgba(255,255,255,0.14)' : 'none', desktop: 'none' }, borderRight: { xs: 'none', desktop: index < heroBenefits.length - 1 ? '1px solid rgba(255,255,255,0.22)' : 'none' }, borderRadius: { xs: '10px', desktop: 0 }, transition: 'background-color 0.2s ease, transform 0.2s ease', '@media (hover: hover)': { '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.06)', transform: 'translateY(-1px)' } } }}>
              <Box sx={{ width: 48, height: 48, borderRadius: '14px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: `rgba(${brandPrimaryGreenRgb}, 0.14)`, border: `1px solid rgba(${brandPrimaryGreenRgb}, 0.28)` }}><Icon size={26} color={colors.greenBright} strokeWidth={1.85} aria-hidden="true" /></Box>
              <Box sx={{ minWidth: 0 }}><Typography component="h2" sx={{ fontFamily: publicFonts.heading, color: colors.greenBright, fontSize: { xs: '18px', desktop: '19px' }, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.15, mb: 0.4 }}>{title}</Typography><Typography sx={{ color: 'rgba(255, 255, 255, 0.82)', fontSize: { xs: '12px', desktop: '12.5px' }, fontWeight: 500, lineHeight: 1.35 }}>{description}</Typography></Box>
            </Box>
          ))}
        </Box>
      </PublicContainer>
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
            <Typography id="travel-agent-support-heading" component="h2" sx={{ ...headingSx, color: colors.navy, maxWidth: 620, mb: 1.25 }}>Support Your Customers with a Visa Partner</Typography>
            <Typography sx={{ color: colors.textSecondary, fontFamily: publicFonts.body, fontSize: { xs: '16px', desktopLg: '18px' }, lineHeight: 1.5, maxWidth: 640 }}>Your agency can share traveller and trip details with GLTS, receive guidance on the applicable process, and coordinate documentation and updates through GLTS.</Typography>
            <Box component="ul" sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', xl: 'repeat(2, minmax(0, 1fr))', desktop: '1fr', desktopMd: 'repeat(2, minmax(0, 1fr))' }, columnGap: 2.5, rowGap: { xs: 3, desktop: 5.5 }, m: 0, mt: { xs: 4, desktop: 4.5 }, p: 0, flexGrow: { desktop: 1 }, alignContent: { desktop: 'space-between' }, listStyle: 'none' }}>
              {supportBenefits.map(({ title, description, icon: Icon }) => (
                <Box component="li" key={title} sx={{ display: 'grid', gridTemplateColumns: { xs: '80px minmax(0, 1fr)', desktopLg: '88px minmax(0, 1fr)' }, gap: 1.5, alignItems: 'start', minWidth: 0 }}>
                  <Box sx={{ width: { xs: 80, desktopLg: 88 }, height: { xs: 80, desktopLg: 88 }, borderRadius: '50%', bgcolor: '#EAF8EC', display: 'grid', placeItems: 'center' }}><Icon size={46} color={colors.greenDark} strokeWidth={1.8} aria-hidden="true" /></Box>
                  <Box sx={{ minWidth: 0, pt: 0.25 }}><Typography component="h3" sx={{ color: colors.navy, fontFamily: publicFonts.heading, fontSize: { xs: '18px', desktopLg: '19px' }, fontWeight: 700, lineHeight: 1.35, mb: 0.75 }}>{title}</Typography><Typography sx={{ color: colors.textSecondary, fontFamily: publicFonts.body, fontSize: { xs: '16px', desktopLg: '17px' }, lineHeight: 1.5 }}>{description}</Typography></Box>
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
      variant="travelAgents"
      eyebrow="Common challenges"
      heading="Challenges Travel Agents Face"
      description="Visa requirements vary by destination and can create challenges for travel agents. Here’s how we help address common concerns."
      desktopColumns={2}
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
    <Box component="section" id="how-travel-agent-partnership-works" aria-labelledby="travel-agent-partnership-heading" sx={{ bgcolor: '#f1f8f3', py: featureSectionPy }}>
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
    <Box component="section" id="why-travel-agents-work-with-glts" aria-labelledby="why-travel-agents-heading" sx={{ bgcolor: colors.white, py: landingSectionPy }}>
      <PublicContainer variant="hero">
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'minmax(0,.9fr) minmax(220px,.72fr) minmax(0,1.2fr)' }, gap: { xs: 4, lg: 3 }, alignItems: 'center' }}>
          <Box>
            <Eyebrow>Why partner with GLTS</Eyebrow>
            <Typography id="why-travel-agents-heading" component="h2" sx={{ ...headingSx, color: colors.navy, mb: 1.25 }}>Why Travel Agents Work With GLTS</Typography>
            <Typography sx={{ color: colors.textSecondary, fontSize: 15, lineHeight: 1.55, mb: 2.25 }}>We provide reliable guidance, organised documentation and ongoing communication, so you can support your customers with confidence.</Typography>
            <Button variant="contained" href="/enquiry" endIcon={<ArrowRight size={ds.component.button.marketing.iconSize} />} sx={getMarketingPrimaryButtonSx(colors)}>Enquire About Partnership</Button>
          </Box>
          <Box component="img" src="/images/visa-master/passport.png" alt="Navy passport ready for an international journey" loading="lazy" sx={{ width: '100%', height: { xs: 280, lg: 350 }, objectFit: 'cover', objectPosition: 'center 52%', borderRadius: '14px', boxShadow: '0 12px 28px rgba(15,35,55,.1)' }} />
          <Box component="ul" sx={{ display: 'grid', gap: 1.25, listStyle: 'none', p: 0, m: 0 }}>
            {partnershipBenefits.map(({ title, description, icon: Icon }) => (
              <Box component="li" key={title} sx={{ display: 'grid', gridTemplateColumns: `${ds.icon.featureContainer}px minmax(0,1fr)`, gap: 1.4, alignItems: 'center', minHeight: 72, p: 1.25, bgcolor: '#f8fbf9', border: '1px solid #eef3ef', borderRadius: '12px' }}>
                <Box sx={{ width: ds.icon.featureContainer, height: ds.icon.featureContainer, display: 'grid', placeItems: 'center', borderRadius: '50%', bgcolor: '#e8f6eb', color: colors.greenDark }}><Icon size={ds.icon.standard} strokeWidth={ds.icon.strokeWidth} aria-hidden="true" /></Box>
                <Box><Typography component="h3" sx={{ color: colors.navy, fontSize: 15, fontWeight: 800, lineHeight: 1.25, mb: .25 }}>{title}</Typography><Typography sx={{ color: colors.textSecondary, fontSize: 14, lineHeight: 1.45 }}>{description}</Typography></Box>
              </Box>
            ))}
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
        previewOnly
        logos={travelAgentCompanyLogos}
      />
      <LandingFaqSection heading="Frequently Asked Questions" faqs={travelAgentFaqs} />
      <TravelAgentsFinalCta />
    </Box>
  )
}
