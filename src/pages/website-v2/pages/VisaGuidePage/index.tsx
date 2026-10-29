import { useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { MenuItem, Select } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
  Anchor, ArrowLeft, ArrowRight, BriefcaseBusiness, Camera, Check, ChevronDown,
  ClipboardList, Clock3, FileText, Globe2, Headphones, HeartPulse, Image,
  Mail, MapPin, Phone, Plane, Search, ShieldCheck, ShipWheel, Ticket,
  UserRound, Wallet,
} from 'lucide-react'
import { PublicContainer } from '../../components/PublicContainer'
import { publicFonts } from '../../theme/publicSiteTokens'
import { selectMenuSlotProps } from '@/design-system/formControl'
import { CountryFlagVisual } from '@/shared/components/CountryFlagVisual'
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

const countryOptions = [
  { value: 'australia', label: 'Australia' },
  { value: 'singapore', label: 'Singapore' },
] as const

type CountryOptionValue = (typeof countryOptions)[number]['value']

/** Maps a landing-page selection to the existing guide route slug. */
function resolveGuideCountrySlug(value: string): CountryOptionValue | undefined {
  return countryOptions.find(option => option.value === value)?.value
}

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
  const theme = useTheme()
  const countryFieldRef = useRef<HTMLDivElement>(null)
  /** Blocks click-through from the closing menu from immediately reopening the Select. */
  const suppressOpenRef = useRef(false)
  const [selectedCountry, setSelectedCountry] = useState('')
  const [countryMenuOpen, setCountryMenuOpen] = useState(false)
  const [countryMenuWidth, setCountryMenuWidth] = useState<number>()
  const [selectionError, setSelectionError] = useState<string | null>(null)
  const countryMenuProps = selectMenuSlotProps(theme)

  const closeCountryMenu = () => {
    setCountryMenuOpen(false)
    // Prevent the same click that closed the menu (backdrop / field) from immediately reopening it.
    suppressOpenRef.current = true
    window.setTimeout(() => {
      suppressOpenRef.current = false
    }, 300)
  }

  const openCountryMenu = () => {
    if (suppressOpenRef.current || countryMenuOpen) return
    setCountryMenuWidth(countryFieldRef.current?.getBoundingClientRect().width)
    setCountryMenuOpen(true)
  }

  const toggleCountryMenu = () => {
    if (suppressOpenRef.current) return
    if (countryMenuOpen) closeCountryMenu()
    else openCountryMenu()
  }

  const openSelectedGuide = () => {
    closeCountryMenu()

    const slug = resolveGuideCountrySlug(selectedCountry)
    if (!slug) {
      setSelectionError('Please select a country to check visa requirements.')
      return
    }

    // Known destinations without a published checklist still use the guide route
    // (coming-soon page). Australia must resolve to the existing guide data.
    if (!getVisaGuideCountry(slug) && slug === 'australia') {
      setSelectionError('Australia visa guidance could not be loaded. Please try again or enquire with our team.')
      return
    }

    setSelectionError(null)
    navigate(`/visa-guide/${slug}`)
  }

  const checkRequirements = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    openSelectedGuide()
  }

  return (
    <div className="visa-guide-page visa-guide-landing" style={{ fontFamily: publicFonts.body }}>
      <section className="visa-guide-hero" aria-labelledby="visa-guide-title">
        <PublicContainer>
          <div className="visa-guide-hero-copy">
            <h1 id="visa-guide-title">Visa Guide</h1>
            <p>Check visa requirements and required documents for your destination.</p>
          </div>
          <form className="visa-guide-search-panel visa-guide-landing-panel" onSubmit={checkRequirements} aria-label="Select a country for visa requirements" noValidate>
            <div
              className={`visa-guide-field${selectionError ? ' has-error' : ''}`}
              ref={countryFieldRef}
              onClick={event => {
                // Decorative icons / label sit outside MUI Select — toggle from the whole field.
                if ((event.target as HTMLElement).closest('.MuiSelect-root')) return
                toggleCountryMenu()
              }}
            >
              <Globe2 className="visa-guide-field-icon" size={20} aria-hidden="true" />
              <span className="visa-guide-field-control">
                <strong id="visa-guide-country-label">Select Country</strong>
                <Select
                  className="visa-guide-country-select"
                  variant="standard"
                  disableUnderline
                  displayEmpty
                  open={countryMenuOpen}
                  labelId="visa-guide-country-label"
                  value={selectedCountry}
                  onChange={event => {
                    setSelectedCountry(String(event.target.value))
                    setSelectionError(null)
                    closeCountryMenu()
                  }}
                  onOpen={openCountryMenu}
                  onClose={closeCountryMenu}
                  renderValue={value => countryOptions.find(option => option.value === value)?.label ?? <span className="visa-guide-select-placeholder">Choose a country</span>}
                  MenuProps={{
                    ...countryMenuProps,
                    // Anchor to the full field (globe + value + chevron), not the inset Select trigger,
                    // so the menu drops directly under the control instead of opening off to the side.
                    anchorEl: countryFieldRef.current,
                    disableAutoFocusItem: true,
                    marginThreshold: 0,
                    anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
                    transformOrigin: { vertical: 'top', horizontal: 'left' },
                    // Inline style beats Select’s built-in minWidth based on the inset trigger.
                    PaperProps: {
                      style: countryMenuWidth
                        ? { width: countryMenuWidth, minWidth: countryMenuWidth, maxWidth: countryMenuWidth }
                        : undefined,
                    },
                    slotProps: {
                      ...countryMenuProps.slotProps,
                      paper: {
                        ...countryMenuProps.slotProps.paper,
                        sx: {
                          ...countryMenuProps.slotProps.paper.sx,
                          width: countryMenuWidth,
                          minWidth: countryMenuWidth,
                          maxWidth: countryMenuWidth,
                          ml: 0,
                        },
                      },
                    },
                  }}
                >
                  {countryOptions.map(option => <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>)}
                </Select>
              </span>
              <ChevronDown className="visa-guide-field-chevron" size={17} aria-hidden="true" />
            </div>
            <div className="visa-guide-search-actions">
              <button className="visa-guide-primary-button" type="submit"><Search size={18} aria-hidden="true" /> Check Requirements</button>
              <Link className="visa-guide-outline-button" to="/enquiry"><Mail size={17} aria-hidden="true" /> Enquire Now</Link>
            </div>
            {selectionError ? (
              <p className="visa-guide-search-error" role="alert">{selectionError}</p>
            ) : (
              <p className="visa-guide-search-note"><ShieldCheck size={15} aria-hidden="true" /> Australia guidance is available. Singapore requirements are coming soon.</p>
            )}
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
    const destinationLabel = resolveGuideCountrySlug(countrySlug)
      ? countryOptions.find(option => option.value === countrySlug)?.label
      : undefined

    return (
      <div className="visa-guide-page visa-guide-coming-soon" style={{ fontFamily: publicFonts.body }}>
        <PublicContainer sx={{ py: { xs: 8, md: 12 } }}>
          <Link className="visa-guide-coming-back" to="/visa-guide"><ArrowLeft size={17} aria-hidden="true" /> Back to Visa Guide</Link>
          <div className="visa-guide-coming-card">
            <Globe2 size={35} aria-hidden="true" />
            <h1>{destinationLabel ? `${destinationLabel} requirements coming soon` : 'Destination requirements coming soon'}</h1>
            <p>
              {destinationLabel
                ? `We do not have a published visa checklist for ${destinationLabel} yet. Our team can help you confirm the documents for your trip.`
                : 'We could not find a visa guide for this destination. Choose a supported country from the Visa Guide page, or enquire with our team.'}
            </p>
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
              <h2 id="visa-guide-country-title">
                <span className="visa-guide-flag" role="img" aria-label={`${country.name} flag`}>
                  <CountryFlagVisual flag={country.flag} countryCode={country.countryCode} size={35} />
                </span>
                {country.name}
              </h2>
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
                </div>
              </div>
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
