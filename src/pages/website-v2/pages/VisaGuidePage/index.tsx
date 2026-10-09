import { useState, type FormEvent, type KeyboardEvent } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
  Anchor, ArrowLeft, ArrowRight, BriefcaseBusiness, Camera, Check, ChevronDown,
  ClipboardList, Clock3, FileText, Globe2, Headphones, HeartPulse, Image,
  Mail, MapPin, Phone, Plane, Search, ShieldCheck, ShipWheel, Ticket,
  UserRound, Wallet,
} from 'lucide-react'
import { PublicContainer } from '../../components/PublicContainer'
import { publicFonts } from '../../theme/publicSiteTokens'
import {
  getVisaGuideCountry, toggleVisaGuideRequirement, visaGuideCategories,
  type ExpandedVisaGuideRequirements, type VisaGuideCategoryId, type VisaGuideRequirement,
} from './visaGuideData'
import './visaGuide.css'

const categoryIcons = {
  business: BriefcaseBusiness,
  transit: Plane,
  employment: UserRound,
  seamen: Anchor,
  tourist: Camera,
} satisfies Record<VisaGuideCategoryId, typeof BriefcaseBusiness>

const requirementIcons = {
  passport: Globe2,
  'application-form': ClipboardList,
  photo: Image,
  'covering-letter': FileText,
  'invitation-letter': Mail,
  ticket: Ticket,
  financials: Wallet,
  occupation: BriefcaseBusiness,
  'medical-insurance': HeartPulse,
  disclaimer: ShieldCheck,
  'financial-proof': Wallet,
  'valid-visa': ShieldCheck,
  insurance: HeartPulse,
  'self-employed': BriefcaseBusiness,
  'employment-proof': BriefcaseBusiness,
  certificates: FileText,
  'aged-over-75': HeartPulse,
  medical: HeartPulse,
  'original-cdc': FileText,
  'mcv-copy': FileText,
  'government-id': UserRound,
  'documents-required': ClipboardList,
  accommodation: MapPin,
  'minor-travelling-alone': UserRound,
  'priority-service': Clock3,
} as const

function resolveCategory(value: string | null): VisaGuideCategoryId {
  return visaGuideCategories.find(category => category.id === value)?.id ?? 'business'
}

function RequirementRow({ requirement, number, categoryId, expanded, onToggle }: {
  requirement: VisaGuideRequirement
  number: number
  categoryId: VisaGuideCategoryId
  expanded: boolean
  onToggle: () => void
}) {
  const Icon = requirementIcons[requirement.id as keyof typeof requirementIcons] ?? FileText
  const detailsId = `visa-guide-${categoryId}-${requirement.id}-details`

  return (
    <li className={`visa-guide-requirement${expanded ? ' is-open' : ''}`}>
      <button
        type="button"
        className="visa-guide-requirement-button"
        aria-expanded={expanded}
        aria-controls={detailsId}
        onClick={onToggle}
      >
        <span className="visa-guide-requirement-number">{number}</span>
        <Icon size={20} strokeWidth={1.9} className="visa-guide-requirement-icon" aria-hidden="true" />
        <span className="visa-guide-requirement-title">{requirement.title}</span>
        <span className="visa-guide-requirement-summary">{requirement.summary}</span>
        <ChevronDown size={18} className="visa-guide-requirement-chevron" aria-hidden="true" />
      </button>
      <div id={detailsId} className="visa-guide-requirement-details" aria-hidden={!expanded}>
        <div className="visa-guide-requirement-details-inner">
          {requirement.details.map(detail => <p key={detail}>{detail}</p>)}
        </div>
      </div>
    </li>
  )
}

function VisaGuideLanding() {
  const navigate = useNavigate()
  const [selectedCountry, setSelectedCountry] = useState('')

  const checkRequirements = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedCountry) return
    navigate(`/visa-guide/${selectedCountry}`)
  }

  return (
    <div className="visa-guide-page visa-guide-landing" style={{ fontFamily: publicFonts.body }}>
      <section className="visa-guide-hero" aria-labelledby="visa-guide-title">
        <PublicContainer>
          <div className="visa-guide-hero-copy">
            <h1 id="visa-guide-title">Visa Guide</h1>
            <p>Check visa requirements and required documents for your destination.</p>
          </div>
          <form className="visa-guide-search-panel visa-guide-landing-panel" onSubmit={checkRequirements} aria-label="Select a country for visa requirements">
            <label className="visa-guide-field">
              <Globe2 size={21} aria-hidden="true" />
              <span>
                <strong>Select Country</strong>
                <select value={selectedCountry} onChange={event => setSelectedCountry(event.target.value)} aria-label="Select Country" required>
                  <option value="" disabled>Choose a country</option>
                  <option value="australia">Australia</option>
                  <option value="singapore">Singapore</option>
                </select>
              </span>
              <ChevronDown size={17} aria-hidden="true" />
            </label>
            <div className="visa-guide-search-actions">
              <button className="visa-guide-primary-button" type="submit"><Search size={18} aria-hidden="true" /> Check Requirements</button>
              <Link className="visa-guide-outline-button" to="/enquiry"><Mail size={17} aria-hidden="true" /> Enquire Now</Link>
            </div>
            <p className="visa-guide-search-note"><ShieldCheck size={15} aria-hidden="true" /> Australia guidance is available. Singapore requirements are coming soon.</p>
          </form>
        </PublicContainer>
      </section>
    </div>
  )
}

function VisaGuideCountryPage({ countrySlug }: { countrySlug: string }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const country = getVisaGuideCountry(countrySlug)
  const activeCategoryId = resolveCategory(searchParams.get('visaType'))
  const [expandedRequirements, setExpandedRequirements] = useState<ExpandedVisaGuideRequirements>({})

  if (!country) {
    return (
      <div className="visa-guide-page visa-guide-coming-soon" style={{ fontFamily: publicFonts.body }}>
        <PublicContainer sx={{ py: { xs: 8, md: 12 } }}>
          <Link className="visa-guide-coming-back" to="/visa-guide"><ArrowLeft size={17} aria-hidden="true" /> Back to Visa Guide</Link>
          <div className="visa-guide-coming-card">
            <Globe2 size={35} aria-hidden="true" />
            <h1>{countrySlug === 'singapore' ? 'Singapore' : 'Destination'} requirements coming soon</h1>
            <p>We do not have a verified visa checklist for this destination yet. Our team can help you confirm the documents for your trip.</p>
            <Link className="visa-guide-primary-button" to="/enquiry">Enquire Now <ArrowRight size={17} aria-hidden="true" /></Link>
          </div>
        </PublicContainer>
      </div>
    )
  }

  const activeCategory = visaGuideCategories.find(category => category.id === activeCategoryId)!
  const content = country.categories[activeCategoryId]

  const selectCategory = (categoryId: VisaGuideCategoryId) => {
    setSearchParams(previous => {
      const next = new URLSearchParams(previous)
      next.set('visaType', categoryId)
      return next
    }, { replace: true })
  }

  const toggleRequirement = (categoryId: VisaGuideCategoryId, requirementId: string) => {
    setExpandedRequirements(previous => toggleVisaGuideRequirement(previous, categoryId, requirementId))
  }

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, categoryId: VisaGuideCategoryId) => {
    const index = visaGuideCategories.findIndex(category => category.id === categoryId)
    const nextIndex = event.key === 'ArrowRight' ? (index + 1) % visaGuideCategories.length
      : event.key === 'ArrowLeft' ? (index - 1 + visaGuideCategories.length) % visaGuideCategories.length
      : event.key === 'Home' ? 0
      : event.key === 'End' ? visaGuideCategories.length - 1
      : -1
    if (nextIndex < 0) return
    event.preventDefault()
    const nextCategory = visaGuideCategories[nextIndex]
    selectCategory(nextCategory.id)
    document.getElementById(`visa-guide-tab-${nextCategory.id}`)?.focus()
  }

  return (
    <div className="visa-guide-page" style={{ fontFamily: publicFonts.body }}>
      <PublicContainer sx={{ pb: { xs: 8, md: 11 } }}>
        <section className="visa-guide-country" id="country-guide" aria-labelledby="visa-guide-country-title">
          <div className="visa-guide-country-banner" style={{ backgroundImage: `linear-gradient(90deg, rgba(0, 31, 63, .88) 0%, rgba(0, 31, 63, .52) 36%, rgba(0, 31, 63, .02) 78%), url('${country.bannerImage}')` }}>
            <Link className="visa-guide-back" to="/visa-guide">
              <ArrowLeft size={16} aria-hidden="true" /> Back to Visa Guide
            </Link>
            <div className="visa-guide-country-heading">
              <h2 id="visa-guide-country-title"><span className="visa-guide-flag" role="img" aria-label="Australian flag">{country.flag}</span>{country.name}</h2>
              <p>Find visa requirements and document guidance<br className="visa-guide-desktop-break" /> for your travel to {country.name}.</p>
            </div>
          </div>

          <div className="visa-guide-tabs-scroll" aria-label="Visa categories">
            <div className="visa-guide-tabs" role="tablist" aria-label={`${country.name} visa categories`}>
              {visaGuideCategories.map(category => {
                const Icon = categoryIcons[category.id]
                return (
                  <button
                    key={category.id}
                    id={`visa-guide-tab-${category.id}`}
                    type="button"
                    role="tab"
                    aria-selected={activeCategoryId === category.id}
                    aria-controls="visa-guide-tab-panel"
                    tabIndex={activeCategoryId === category.id ? 0 : -1}
                    className={`visa-guide-tab${activeCategoryId === category.id ? ' is-active' : ''}`}
                    onClick={() => selectCategory(category.id)}
                    onKeyDown={event => handleTabKeyDown(event, category.id)}
                  >
                    <Icon size={19} strokeWidth={1.9} aria-hidden="true" />
                    {category.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="visa-guide-content-grid" id="visa-guide-tab-panel" role="tabpanel" aria-labelledby={`visa-guide-tab-${activeCategoryId}`}>
            <section className="visa-guide-checklist" aria-labelledby="visa-guide-checklist-title">
              <div className="visa-guide-checklist-heading">
                <span className="visa-guide-heading-icon"><BriefcaseBusiness size={24} aria-hidden="true" /></span>
                <div>
                  <h3 id="visa-guide-checklist-title">{activeCategory.label} Requirements</h3>
                  <p>{content.description}</p>
                </div>
              </div>
              <p className="visa-guide-source-note"><ShieldCheck size={16} aria-hidden="true" /> {content.sourceNote}</p>
              {content.requirements.length ? (
                <ol className="visa-guide-requirement-list">
                  {content.requirements.map((requirement, index) => (
                    <RequirementRow
                      key={requirement.id}
                      requirement={requirement}
                      number={index + 1}
                      categoryId={activeCategoryId}
                      expanded={expandedRequirements[activeCategoryId]?.includes(requirement.id) ?? false}
                      onToggle={() => toggleRequirement(activeCategoryId, requirement.id)}
                    />
                  ))}
                </ol>
              ) : (
                <div className="visa-guide-empty-state">
                  <ClipboardList size={30} aria-hidden="true" />
                  <h4>Checklist awaiting verification</h4>
                  <p>GLTS has not supplied a documented checklist for {country.name} {activeCategory.label.toLowerCase()}. Our team can confirm the documents for your individual trip.</p>
                  <Link to="/enquiry">Ask a visa specialist <ArrowRight size={16} aria-hidden="true" /></Link>
                </div>
              )}
              <p className="visa-guide-disclaimer">Requirements can change and may differ by applicant. This guide contains unverified legacy information and is not an official immigration checklist. Confirm current requirements with GLTS or the relevant authority before applying.</p>
            </section>

            <aside className="visa-guide-sidebar" aria-label="Visa assistance and travel information">
              <section className="visa-guide-help-card" aria-labelledby="visa-guide-help-title">
                <div className="visa-guide-help-heading"><Headphones size={27} aria-hidden="true" /><div><h3 id="visa-guide-help-title">Need help with your visa?</h3><p>Our visa experts are here to assist you with document verification, application process and more.</p></div></div>
                <Link className="visa-guide-primary-button" to="/enquiry">Get Expert Assistance <ArrowRight size={17} aria-hidden="true" /></Link>
                <div className="visa-guide-contact-list">
                  <a href="tel:+912246025915"><Phone size={17} aria-hidden="true" /> +91 22 4602 5915</a>
                  <a href="mailto:visa@gltsonline.in"><Mail size={17} aria-hidden="true" /> visa@gltsonline.in</a>
                  <span><Clock3 size={17} aria-hidden="true" /> Mon – Sat, 10:00 AM – 6:00 PM</span>
                  <span><MapPin size={17} aria-hidden="true" /> B7, Wadala Udyog Bhavan, Naigaon Cross Road, NMGS Marg, Dadar / Wadala, Mumbai 400031</span>
                </div>
              </section>

              <section className="visa-guide-why-card" aria-labelledby="visa-guide-why-title">
                <h3 id="visa-guide-why-title"><span aria-hidden="true">★</span> Why Choose GLTS?</h3>
                <ul>
                  {['Expert guidance & support', 'Latest visa information', 'Hassle-free documentation', 'End-to-end assistance'].map(point => <li key={point}><Check size={17} aria-hidden="true" /> {point}</li>)}
                </ul>
              </section>

              <section className="visa-guide-travel-card" aria-labelledby="visa-guide-travel-title" style={{ backgroundImage: `linear-gradient(0deg, rgba(0,31,63,.92), rgba(0,31,63,.04) 73%), url('${country.travelImage}')` }}>
                <div><ShipWheel size={24} aria-hidden="true" /><h3 id="visa-guide-travel-title">Plan your trip to {country.name} with confidence</h3><p>Let us take care of your visa, while you focus on your journey.</p></div>
              </section>
            </aside>
          </div>
        </section>
      </PublicContainer>
    </div>
  )
}

export function VisaGuidePage() {
  const { countrySlug } = useParams<{ countrySlug?: string }>()
  return countrySlug ? <VisaGuideCountryPage countrySlug={countrySlug} /> : <VisaGuideLanding />
}
