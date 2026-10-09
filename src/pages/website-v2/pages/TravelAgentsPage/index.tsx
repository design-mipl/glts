import { useEffect, useRef, useState } from 'react'
import { Box, Button, Typography, useMediaQuery } from '@mui/material'
import { ArrowRight, Bell, ClipboardCheck, FileCheck2, Files, Globe2, MessagesSquare, RefreshCw, UsersRound } from 'lucide-react'
import { PublicContainer } from '../../components/PublicContainer'
import { VisaCategoryCardsSection } from '../../components/VisaCategoryCardsSection'
import { TrustedCompaniesSection } from '../../components/TrustedCompaniesSection'
import { travelAgentCompanyLogos } from '../../assets/companyLogos'
import type { FAQItem } from '../../components/FAQSection'
import { publicFonts, usePublicBrandColors, getMarketingPrimaryButtonSx } from '../../theme/publicSiteTokens'
import { LandingFaqSection } from '../LandingPage/components/LandingFaqSection'
import { featureSectionPy, finalCtaSectionMb, finalCtaSectionSx, landingSectionHeaderMb, landingSectionPy } from '../LandingPage/landingPageSpacing'

const travelAgentFaqs: FAQItem[] = [
  { q: 'How can travel agents enquire about working with GLTS?', a: 'Click “Enquire About Partnership” and share your agency details and requirements through the enquiry page. This helps GLTS understand the support your agency needs.' },
  { q: 'What visa support can travel agents request?', a: 'Agents can enquire about visa requirements, document preparation, and application coordination for tourist visits, business travel, family visits, and group travel. Available support depends on the destination and visa category.' },
  { q: 'What information should we provide with an enquiry?', a: 'Share the destination, purpose of travel, intended travel dates, number of travellers, and their nationality and country of residence. GLTS can advise on any further details or documents needed.' },
  { q: 'Can we submit enquiries for families or groups?', a: 'Yes, you can share enquiries involving multiple travellers. Each traveller’s requirements may differ, so documents and eligibility need to be reviewed individually.' },
  { q: 'How long does visa processing take?', a: 'Processing times vary by destination, visa category, appointment availability, and the relevant authority. Confirm the applicable timelines before making travel commitments.' },
  { q: 'Does visa assistance guarantee approval?', a: 'No. Visa approval is decided by the relevant embassy, consulate, or immigration authority. Guidance and document support help applicants prepare their applications but cannot guarantee an outcome.' },
]

const headingSx = { fontFamily: publicFonts.display, fontSize: { xs: '30px', md: '36px', lg: '40px' }, fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.025em' } as const
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

function Eyebrow({ children }: { children: string }) {
  const colors = usePublicBrandColors()
  return <Typography sx={{ color: colors.greenBright, fontFamily: publicFonts.heading, fontSize: 12, fontWeight: 800, letterSpacing: '.11em', lineHeight: 1.4, textTransform: 'uppercase', mb: 1 }}>{children}</Typography>
}

function TravelAgentsHero() {
  const colors = usePublicBrandColors()
  return (
    <Box component="section" aria-labelledby="travel-agents-heading" sx={{ position: 'relative', overflow: 'hidden', bgcolor: colors.navy, minHeight: { xs: 720, md: 610, lg: 620 }, boxSizing: 'border-box', display: 'flex', alignItems: 'center', py: { xs: '96px', md: '88px', lg: '92px' } }}>
      <Box component="img" src="/images/travel-agents/agent-assisting-customer.png" alt="" aria-hidden="true" fetchPriority="high" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: { xs: '69% center', md: 'center 48%' } }} />
      <Box aria-hidden="true" sx={{ position: 'absolute', inset: 0, background: { xs: 'linear-gradient(90deg, rgba(0,31,63,.92) 0%, rgba(0,31,63,.83) 58%, rgba(0,31,63,.64) 100%)', md: 'linear-gradient(90deg, rgba(0,31,63,.94) 0%, rgba(0,31,63,.82) 34%, rgba(0,31,63,.48) 58%, rgba(0,31,63,.24) 100%)' } }} />
      <PublicContainer variant="hero" sx={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
        <Box sx={{ maxWidth: 690, mb: { xs: 4.5, md: 6 } }}>
          <Eyebrow>Partner with confidence</Eyebrow>
          <Typography id="travel-agents-heading" component="h1" sx={{ color: colors.white, fontFamily: publicFonts.display, fontSize: { xs: 40, sm: 48, md: 56 }, fontWeight: 700, lineHeight: 1.08, letterSpacing: '-.03em', maxWidth: 680, mb: 2 }}>Visa Support for Travel Agents</Typography>
          <Typography sx={{ maxWidth: 570, color: 'rgba(255,255,255,.91)', fontSize: { xs: 16, md: 17 }, lineHeight: 1.6, mb: 3 }}>Help your customers navigate visa requirements with clear guidance, document support, and a coordinated application process.</Typography>
          <Button variant="contained" href="/enquiry" endIcon={<ArrowRight size={18} />} sx={{ ...getMarketingPrimaryButtonSx(colors), minHeight: 48, px: 3, alignSelf: { xs: 'stretch', sm: 'flex-start' } }}>Enquire About Partnership</Button>
        </Box>
        <Box component="ul" aria-label="Travel agent support benefits" sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, minmax(0, 1fr))' }, listStyle: 'none', p: 0, m: 0, borderTop: '1px solid rgba(255,255,255,.23)', pt: 2.25, gap: { xs: 1.5, md: 0 } }}>
          {heroBenefits.map(({ title, description, icon: Icon }, index) => (
            <Box component="li" key={title} sx={{ display: 'grid', gridTemplateColumns: { xs: '34px 1fr', md: '40px minmax(0,1fr)' }, alignItems: 'start', gap: 1.25, minWidth: 0, px: { xs: 0, md: 2 }, borderRight: { md: index < heroBenefits.length - 1 ? '1px solid rgba(255,255,255,.2)' : 'none' } }}>
              <Box sx={{ width: 34, height: 34, borderRadius: '50%', bgcolor: 'rgba(85,199,104,.18)', border: '1px solid rgba(109,231,128,.65)', color: colors.greenBright, display: 'grid', placeItems: 'center' }}><Icon size={18} strokeWidth={2} aria-hidden="true" /></Box>
              <Box><Typography component="h2" sx={{ color: colors.white, fontSize: 14, fontWeight: 800, lineHeight: 1.25, mb: .35 }}>{title}</Typography><Typography sx={{ color: 'rgba(255,255,255,.78)', fontSize: 12.5, lineHeight: 1.4 }}>{description}</Typography></Box>
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
    <Box component="section" aria-labelledby="travel-agent-support-heading" sx={{ bgcolor: colors.white, py: featureSectionPy }}>
      <PublicContainer variant="hero">
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'minmax(0,1.02fr) minmax(0,1fr)' }, gap: { xs: 4, lg: 6 }, alignItems: 'center' }}>
          <Box component="img" src="/images/about-industries/corporate-businesses.png" alt="Travel professionals coordinating customer travel details in an airport lounge" loading="lazy" sx={{ width: '100%', height: { xs: 280, md: 350, lg: 380 }, display: 'block', objectFit: 'cover', objectPosition: 'center 48%', borderRadius: '14px', boxShadow: '0 10px 26px rgba(15,35,55,.08)' }} />
          <Box>
            <Eyebrow>Travel agent support</Eyebrow>
            <Typography id="travel-agent-support-heading" component="h2" sx={{ ...headingSx, color: colors.navy, maxWidth: 620, mb: 1.25 }}>Support Your Customers with a Visa Partner</Typography>
            <Typography sx={{ color: colors.textSecondary, fontSize: 16, lineHeight: 1.55, mb: 2.5 }}>Your agency can share traveller and trip details with GLTS, receive guidance on the applicable process, and coordinate documentation and updates through GLTS.</Typography>
            <Box component="ul" sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, columnGap: 2.5, rowGap: 2, listStyle: 'none', m: 0, p: 0 }}>
              {supportBenefits.map(({ title, description, icon: Icon }) => (
                <Box component="li" key={title} sx={{ display: 'grid', gridTemplateColumns: '42px minmax(0,1fr)', gap: 1.25, alignItems: 'center' }}>
                  <Box sx={{ width: 42, height: 42, borderRadius: '50%', bgcolor: '#eaf7ef', color: colors.greenDark, display: 'grid', placeItems: 'center' }}><Icon size={20} strokeWidth={2} aria-hidden="true" /></Box>
                  <Box><Typography component="h3" sx={{ color: colors.navy, fontSize: 15, fontWeight: 800, lineHeight: 1.25, mb: .25 }}>{title}</Typography><Typography sx={{ color: colors.textSecondary, fontSize: 13, lineHeight: 1.4 }}>{description}</Typography></Box>
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
  const colors = usePublicBrandColors()
  return (
    <Box component="section" id="travel-agent-challenges" aria-labelledby="travel-agent-challenges-heading" sx={{ bgcolor: '#f1f8f3', py: landingSectionPy }}>
      <PublicContainer variant="hero">
        <Box sx={{ maxWidth: 850, mx: 'auto', textAlign: 'center', mb: landingSectionHeaderMb }}>
          <Eyebrow>Common challenges</Eyebrow>
          <Typography id="travel-agent-challenges-heading" component="h2" sx={{ ...headingSx, color: colors.navy, mb: .85 }}>Challenges Travel Agents Face</Typography>
          <Typography sx={{ color: colors.textSecondary, fontSize: 16, lineHeight: 1.55 }}>Visa requirements vary by destination and can create challenges for travel agents. Here’s how we help address common concerns.</Typography>
        </Box>
        <Box component="ul" sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, listStyle: 'none', m: 0, p: 0 }}>
          {travelAgentChallenges.map(({ title, description, icon: Icon }) => (
            <Box component="li" key={title} sx={{ display: 'grid', gridTemplateColumns: '64px minmax(0,1fr)', gap: 2, alignItems: 'center', minHeight: 138, p: { xs: 2, md: 2.5 }, bgcolor: colors.white, border: '1px solid #edf3ef', borderRadius: '13px', boxShadow: '0 8px 24px rgba(27,65,48,.055)' }}>
              <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: '#eaf7ef', color: colors.greenDark, display: 'grid', placeItems: 'center' }}><Icon size={28} strokeWidth={2} aria-hidden="true" /></Box>
              <Box><Typography component="h3" sx={{ color: colors.navy, fontFamily: publicFonts.heading, fontSize: 18, fontWeight: 800, lineHeight: 1.25, mb: .5 }}>{title}</Typography><Typography sx={{ color: colors.textSecondary, fontSize: 15, lineHeight: 1.45 }}>{description}</Typography></Box>
            </Box>
          ))}
        </Box>
      </PublicContainer>
    </Box>
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
          <Box aria-hidden="true" sx={{ display: { xs: 'block', lg: 'none' }, position: 'absolute', top: 42, bottom: 42, left: 36, width: 2, bgcolor: '#cbd8d4', '&::after': { content: '""', display: 'block', width: '100%', height: '100%', bgcolor: colors.greenBright, transformOrigin: 'top', transform: active ? 'scaleY(1)' : 'scaleY(0)', transition: reducedMotion ? 'none' : 'transform 900ms ease-out' } }} />
          <Box aria-hidden="true" sx={{ display: { xs: 'none', lg: 'block' }, position: 'absolute', top: 32, left: '12.5%', right: '12.5%', height: 2, bgcolor: '#cbd8d4', '&::after': { content: '""', display: 'block', width: '100%', height: '100%', bgcolor: colors.greenBright, transformOrigin: 'left', transform: active ? 'scaleX(1)' : 'scaleX(0)', transition: reducedMotion ? 'none' : 'transform 900ms ease-out' } }} />
          <Box aria-hidden="true" sx={{ display: { xs: 'none', lg: 'block' }, position: 'absolute', zIndex: 2, top: 21, left: 0, right: 0, height: 24, pointerEvents: 'none' }}>
            {['25%', '50%', '75%'].map((position) => <Box key={position} sx={{ position: 'absolute', left: position, transform: 'translateX(-50%)', width: 24, height: 24, display: 'grid', placeItems: 'center', bgcolor: '#f1f8f3', color: '#77899b' }}><ArrowRight size={18} aria-hidden="true" /></Box>)}
          </Box>
          <Box component="ol" aria-label="Travel agent partnership steps" sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(4,minmax(0,1fr))' }, gap: { xs: 2.5, lg: 3 }, listStyle: 'none', m: 0, p: 0 }}>
            {partnershipSteps.map(({ title, description, icon: Icon }, index) => (
              <Box component="li" key={title} sx={{ display: 'grid', gridTemplateColumns: { xs: '74px minmax(0,1fr)', lg: '1fr' }, alignItems: { xs: 'center', lg: 'start' }, gap: { xs: 2, lg: 0 }, textAlign: { xs: 'left', lg: 'center' }, opacity: active ? 1 : 0, transform: active ? 'translateY(0)' : 'translateY(10px)', transition: reducedMotion ? 'none' : 'opacity 360ms ease ' + (index * 140) + 'ms, transform 360ms ease ' + (index * 140) + 'ms' }}>
                <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: { xs: 92, lg: 68 } }}>
                  <Box component="span" sx={{ display: 'grid', placeItems: 'center', width: 24, height: 24, borderRadius: '50%', bgcolor: active ? colors.greenDark : '#dfe8e3', color: colors.white, fontSize: 12, fontWeight: 800, position: 'absolute', top: { xs: 0, lg: -6 }, zIndex: 2, transition: reducedMotion ? 'none' : 'background-color 250ms ease ' + (index * 140) + 'ms' }}>{index + 1}</Box>
                  <Box sx={{ width: { xs: 64, lg: 68 }, height: { xs: 64, lg: 68 }, mt: { xs: 2, lg: 0 }, display: 'grid', placeItems: 'center', borderRadius: '50%', bgcolor: active ? '#e4f5e8' : '#fff', border: '2px solid ' + (active ? '#a6dcb0' : '#dce8e0'), color: active ? colors.greenDark : colors.navy, transition: reducedMotion ? 'none' : 'background-color 300ms ease ' + (index * 140) + 'ms, color 300ms ease ' + (index * 140) + 'ms' }}><Icon size={28} strokeWidth={1.9} aria-hidden="true" /></Box>
                </Box>
                <Box sx={{ pt: { lg: 1.5 } }}><Typography component="h3" sx={{ color: colors.navy, fontFamily: publicFonts.heading, fontSize: 18, fontWeight: 800, lineHeight: 1.3, mb: .65 }}>{title}</Typography><Typography sx={{ color: colors.textSecondary, fontSize: 15, lineHeight: 1.5, maxWidth: 270, mx: { lg: 'auto' } }}>{description}</Typography></Box>
              </Box>
            ))}
          </Box>
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
            <Button variant="contained" href="/enquiry" endIcon={<ArrowRight size={17} />} sx={{ ...getMarketingPrimaryButtonSx(colors), minHeight: 46, px: 2.5 }}>Enquire About Partnership</Button>
          </Box>
          <Box component="img" src="/images/visa-master/passport.png" alt="Navy passport ready for an international journey" loading="lazy" sx={{ width: '100%', height: { xs: 280, lg: 350 }, objectFit: 'cover', objectPosition: 'center 52%', borderRadius: '14px', boxShadow: '0 12px 28px rgba(15,35,55,.1)' }} />
          <Box component="ul" sx={{ display: 'grid', gap: 1.25, listStyle: 'none', p: 0, m: 0 }}>
            {partnershipBenefits.map(({ title, description, icon: Icon }) => (
              <Box component="li" key={title} sx={{ display: 'grid', gridTemplateColumns: '44px minmax(0,1fr)', gap: 1.4, alignItems: 'center', minHeight: 72, p: 1.25, bgcolor: '#f8fbf9', border: '1px solid #eef3ef', borderRadius: '12px' }}>
                <Box sx={{ width: 42, height: 42, display: 'grid', placeItems: 'center', borderRadius: '50%', bgcolor: '#e8f6eb', color: colors.greenDark }}><Icon size={20} strokeWidth={2} aria-hidden="true" /></Box>
                <Box><Typography component="h3" sx={{ color: colors.navy, fontSize: 15, fontWeight: 800, lineHeight: 1.25, mb: .25 }}>{title}</Typography><Typography sx={{ color: colors.textSecondary, fontSize: 13, lineHeight: 1.35 }}>{description}</Typography></Box>
              </Box>
            ))}
          </Box>
        </Box>
      </PublicContainer>
    </Box>
  )
}

function TravelAgentsFinalCta() {
  const colors = usePublicBrandColors()
  return (
    <Box component="section" id="travel-agents-final-cta" aria-labelledby="travel-agents-final-cta-heading" sx={{ ...finalCtaSectionSx, minHeight: { xs: 440, sm: 360, md: 360 }, '&:last-child': { mb: 0 } }}>
      <Box component="img" src="/images/travel-agents/agent-assisting-customer.png" alt="" aria-hidden="true" loading="lazy" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: { xs: '68% center', md: 'center 28%' } }} />
      <Box aria-hidden="true" sx={{ position: 'absolute', inset: 0, background: { xs: 'linear-gradient(90deg, rgba(0,31,63,.9) 0%, rgba(0,31,63,.76) 62%, rgba(0,31,63,.55) 100%)', md: 'linear-gradient(90deg, rgba(0,31,63,.91) 0%, rgba(0,31,63,.76) 38%, rgba(0,31,63,.34) 72%, rgba(0,31,63,.18) 100%)' } }} />
      <PublicContainer variant="hero" sx={{ position: 'relative', zIndex: 1, width: '100%' }}>
        <Box sx={{ maxWidth: 720 }}>
          <Eyebrow>Travel agent partnership</Eyebrow>
          <Typography id="travel-agents-final-cta-heading" component="h2" sx={{ ...headingSx, color: colors.white, fontSize: { xs: 30, md: 38, lg: 40 }, mb: 1.1 }}>Support Your Customers with a Reliable Visa Partner.</Typography>
          <Typography sx={{ maxWidth: 620, color: 'rgba(255,255,255,.9)', fontSize: 16, lineHeight: 1.55, mb: 2.25 }}>Visa guidance, document support, and coordinated application updates for your customers.</Typography>
          <Button variant="contained" href="/enquiry" endIcon={<ArrowRight size={18} />} sx={{ ...getMarketingPrimaryButtonSx(colors), minHeight: 48, px: 3 }}>Enquire About Partnership</Button>
        </Box>
      </PublicContainer>
    </Box>
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
