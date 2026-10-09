import { useState, type CSSProperties, type ReactNode } from 'react'
import { Accordion, AccordionDetails, AccordionSummary, Tabs, Tab } from '@mui/material'
import { ArrowRight, Anchor, Building2, Check, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, Globe2, Search, ShieldCheck } from 'lucide-react'
import { Button, Checkbox, Input, RadioGroup, Select, Textarea, Toggle } from '@/design-system/UIComponents'
import { GREENLIGHT_LOGO_COLLAPSED_SRC, GREENLIGHT_LOGO_SRC } from '@/components/brand/GreenlightLogo'
import { WebsiteCard } from '../../components/WebsiteCard'
import { DestinationSearchFilter, DocumentChecklistItem, FileUploadCard, GoogleReviewSummary, PackageSelector, PricingBreakdown, TrustMetric, VisaCategorySelector, VisaEligibilitySelector, VisaStatusStepper, type UploadStatus } from '../../components/GLTSComponents'
import { websiteDesignSystem as ds } from '../../theme/websiteDesignSystem'
import { websiteButtonSx, websiteFieldSx } from '../../theme/websiteComponentStyles'
import { pagePatterns, semanticColorGroups, usageGuidelines } from './designSystemGuidance'
import './designSystemPage.css'

const nav = [
  ['foundation', 'Foundation'], ['colours', 'Colours'], ['typography', 'Typography'],
  ['spacing', 'Spacing'], ['layout', 'Layout'], ['buttons', 'Buttons'],
  ['forms', 'Forms'], ['cards', 'Cards'], ['badges', 'Badges'], ['icons', 'Icons'],
  ['images', 'Images'], ['shape', 'Radius & shadows'], ['navigation', 'Navigation'], ['patterns', 'Patterns'],
  ['page-patterns', 'Page Patterns'], ['glts-components', 'GLTS Components'],
  ['usage-guidelines', 'Usage Guidelines'], ['responsive', 'Responsive'], ['accessibility', 'Accessibility'],
] as const

const cardRules = [
  ['Destination', '4:5', '24px', '20px / 700', '14px / 400', 'Bottom', '1px / 12px', 'Subtle lift'],
  ['Service', '16:10', '24px', '20px / 700', '14px / 400', 'Bottom', '1px / 12px', 'Subtle lift'],
  ['Feature', 'None', '24px', '20px / 700', '14px / 400', 'Optional bottom', 'Quiet / 12px', 'Subtle lift'],
  ['Testimonial', 'Avatar 1:1', '24px', '20px / 700', '16px / 400', 'None', '1px / 12px', 'Border emphasis'],
  ['Information', 'None', '24px', '20px / 700', '14px / 400', 'Optional bottom', 'Teal rule / 12px', 'No movement'],
]

function Section({ id, number, title, intro, children }: { id: string; number: string; title: string; intro?: string; children: ReactNode }) {
  return <section className="glts-ds-section" id={id} aria-labelledby={`${id}-heading`}>
    <div className="glts-ds-section-head"><span className="glts-ds-section-number">{number}</span><div><h2 id={`${id}-heading`}>{title}</h2>{intro && <p>{intro}</p>}</div></div>
    {children}
  </section>
}

function Spec({ label, value }: { label: string; value: string }) {
  return <div className="glts-ds-spec"><span>{label}</span><strong>{value}</strong></div>
}

function Demo({ label, children }: { label: string; children: ReactNode }) {
  return <div className="glts-ds-demo"><div className="glts-ds-demo-label">{label}</div><div className="glts-ds-demo-body">{children}</div></div>
}

export function DesignSystemPage() {
  const [selectValue, setSelectValue] = useState<string | number>('tourist')
  const [search, setSearch] = useState('')
  const [radio, setRadio] = useState<string | number>('retail')
  const [activeChip, setActiveChip] = useState('Tourist')
  const [tab, setTab] = useState(0)
  const [slide, setSlide] = useState(0)
  const [toggle, setToggle] = useState(true)
  const [packageValue, setPackageValue] = useState('Standard')
  const [visaCategory, setVisaCategory] = useState('tourist')
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('empty')
  const [uploadFileName, setUploadFileName] = useState<string>()
  const [destinationQuery, setDestinationQuery] = useState('')
  const [destinationRegion, setDestinationRegion] = useState<string | number>('all')
  const carouselItems = ['Discover destinations', 'Prepare documents', 'Travel with confidence']
  const buttonSx = websiteButtonSx
  const fieldSx = websiteFieldSx

  return <div className="glts-ds">
    <div className="glts-ds-intro"><div className="glts-ds-container"><span className="glts-ds-overline">GLTS · website foundation</span><h1>Design System</h1><p>A shared visual language for clear travel guidance, specialist services and dependable digital experiences.</p><div className="glts-ds-intro-meta"><span>Brand aligned</span><span>Reusable tokens</span><span>Accessible interactions</span></div></div></div>
    <div className="glts-ds-container glts-ds-layout">
      <aside className="glts-ds-sidebar" aria-label="Design system sections"><div className="glts-ds-sidebar-title">On this page</div><nav>{nav.map(([id, label]) => <a href={`#${id}`} key={id}>{label}</a>)}</nav></aside>
      <div className="glts-ds-content">
        <Section id="foundation" number="01" title="Foundation" intro="The supplied wordmark sets the direction: green action, teal expertise, navy depth and restrained light surfaces.">
          <div className="glts-ds-logo-grid"><div className="glts-ds-logo-panel"><img src={GREENLIGHT_LOGO_SRC} alt="GreenLight Travel Solutions logo on white" /><span>Primary wordmark · on light surfaces</span></div><div className="glts-ds-logo-panel glts-ds-logo-panel--dark"><img src={GREENLIGHT_LOGO_COLLAPSED_SRC} alt="GreenLight compact brand mark on navy" /><span>Existing compact mark · on dark surfaces</span></div></div>
          <p className="glts-ds-note">Keep the full wordmark clear of nearby UI. Use the supplied files; preserve aspect ratio and leave at least 16px of clear space. The logo image was sampled to confirm green <strong>#73C265</strong> and teal <strong>#0C6C79</strong>.</p>
        </Section>

        <Section id="colours" number="02" title="Semantic Colours" intro="Existing GLTS colours now have named jobs. Use teal or navy for readable text on light green where contrast is needed.">
          {semanticColorGroups.map(group => <div className="glts-ds-color-group" key={group.title}><h3>{group.title}</h3><div className="glts-ds-swatch-grid">{group.tokens.map(([token, hex, usage]) => <div className="glts-ds-swatch" key={token}><span className="glts-ds-swatch-color" style={{ background: hex }} /><strong>{token}</strong><code>{hex}</code><p>{usage}</p></div>)}</div></div>)}
          <div className="glts-ds-state-grid"><div style={{ background: ds.color.successSurface, color: ds.color.success }}>Success · completed</div><div style={{ background: ds.color.warningSurface, color: ds.color.warning }}>Warning · attention needed</div><div style={{ background: ds.color.errorSurface, color: ds.color.error }}>Error · action required</div></div>
          <p className="glts-ds-note">Primary interaction states use green at rest, darker green on hover, the deeper pressed shade, a neutral disabled surface and a teal keyboard focus ring. Disabled controls also include the disabled attribute.</p>
        </Section>

        <Section id="typography" number="03" title="Responsive Typography" intro="Roboto Slab is the display font for hero and major marketing headings. Roboto is the UI and body font for navigation, cards, forms, buttons, FAQ rows and supporting copy. Sizes retain their tablet and mobile scale.">
          <div className="glts-ds-type-list">{Object.entries(ds.type).map(([name, spec]) => {
            const isDisplay = name === 'display' || name === 'h1' || name === 'h2'
            return <div className="glts-ds-type-row" key={name}><div className="glts-ds-type-sample" style={{ '--glts-type-desktop': `${spec.size}px`, '--glts-type-tablet': `${spec.tablet}px`, '--glts-type-mobile': `${spec.mobile}px`, fontFamily: isDisplay ? ds.fonts.display : ds.fonts.ui, fontWeight: spec.weight, lineHeight: spec.lineHeight, letterSpacing: spec.tracking } as CSSProperties}>{name === 'eyebrow' ? 'EXPERT GUIDANCE' : name === 'button' ? 'Continue application' : 'Travel with clarity'}</div><div className="glts-ds-type-meta"><strong>{name}</strong><span>Desktop {spec.size} · tablet {spec.tablet} · mobile {spec.mobile}px</span><span>{isDisplay ? 'Roboto Slab · display' : 'Roboto · UI'} · {spec.weight} · line {spec.lineHeight}</span><code>Tracking {spec.tracking}</code></div></div>
          })}</div>
          <div className="glts-ds-spec-grid"><Spec label="Display font" value="Roboto Slab · 600–700" /><Spec label="UI / body font" value="Roboto · 400–700" /></div>
          <div className="glts-ds-spec-grid"><Spec label="Heading → paragraph" value={`${ds.typeLayout.headingToParagraph}px`} /><Spec label="Section heading max" value={`${ds.typeLayout.sectionHeadingMax}px`} /><Spec label="Paragraph max" value={`${ds.typeLayout.paragraphMax}px`} /><Spec label="Light surface" value="Navy heading · dark body" /><Spec label="Dark surface" value="White heading · light body" /></div>
        </Section>

        <Section id="spacing" number="04" title="Spacing system" intro="Use the 4px base scale for interior padding, gaps and section rhythm.">
          <div className="glts-ds-spacing-list">{ds.space.slice(1).map(value => <div className="glts-ds-spacing-row" key={value}><code>{value}px</code><span style={{ width: `${value}px` }} /></div>)}</div>
        </Section>

        <Section id="layout" number="05" title="Section Layout Rules" intro="The standard content width follows the current PublicContainer. All five section variants use the existing spacing scale.">
          <div className="glts-ds-spec-grid"><Spec label="Standard maximum" value="1280px" /><Spec label="Hero maximum" value="1760px" /><Spec label="Desktop gutter" value="48px" /><Spec label="Tablet gutter" value="32px" /><Spec label="Mobile gutter" value="24px" /></div>
          <div className="glts-ds-grid-demo" aria-label="Twelve column grid">{Array.from({ length: 12 }, (_, index) => <span key={index}>{index + 1}</span>)}</div>
          <div className="glts-ds-table-wrap"><table><thead><tr><th>Variant</th><th>Mobile</th><th>Tablet</th><th>Desktop</th><th>Content max</th><th>Heading gap</th><th>Description gap</th><th>Content gap</th></tr></thead><tbody>{Object.entries(ds.section).map(([name, value]) => <tr key={name}><th>{({ compact: 'Compact', regular: 'Standard', feature: 'Feature', dark: 'Dark Feature', hero: 'Hero' } as Record<string, string>)[name]}</th><td>{value.mobile}px</td><td>{value.tablet}px</td><td>{value.desktop}px</td><td>{value.contentMax}px</td><td>{value.headingGap}px</td><td>{value.descriptionGap}px</td><td>{value.contentGap}px</td></tr>)}</tbody></table></div>
          <div className="glts-ds-hierarchy" aria-label="Section content hierarchy">{ds.sectionHierarchy.map((step, index) => <span key={step}>{index > 0 && <ArrowRight size={16} aria-hidden="true" />}{step}</span>)}</div>
          <p className="glts-ds-note">Heading gap separates eyebrow and heading; description gap separates heading and supporting copy; content gap separates copy and the main content. Keep the CTA after the content when it is needed.</p>
        </Section>

        <Section id="buttons" number="06" title="Buttons" intro="One action hierarchy. The existing shared Button is shown below with public website dimensions.">
          <Demo label="Variants"><div className="glts-ds-inline"><Button sx={buttonSx} endIcon={<ArrowRight size={16} />}>Primary action</Button><Button variant="soft" color="secondary" sx={buttonSx}>Secondary</Button><Button variant="outlined" color="secondary" sx={buttonSx}>Outline</Button><Button variant="text" color="secondary" sx={buttonSx}>Text link</Button><button className="glts-ds-icon-button" aria-label="Next example"><ChevronRight size={20} /></button></div></Demo>
          <Demo label="States"><div className="glts-ds-inline"><Button sx={buttonSx}>Default</Button><Button sx={buttonSx} disabled>Disabled</Button><span className="glts-ds-button-state">Hover: darker green · Active: pressed · Focus: teal ring</span></div></Demo>
          <div className="glts-ds-spec-grid"><Spec label="Height" value="44px" /><Spec label="Horizontal padding" value="24px" /><Spec label="Radius" value="12px" /><Spec label="Icon gap" value="8px" /><Spec label="Label" value="14px / 600" /></div>
        </Section>

        <Section id="forms" number="07" title="Form controls" intro="Shared form primitives provide labels, helper text and validation. Public website fields use a 44px target height.">
          <div className="glts-ds-form-grid"><Demo label="Text input · default"><Input label="Full name" placeholder="Enter your name" size="md" sx={fieldSx} /></Demo><Demo label="Select · filled"><Select label="Visa category" options={[{ label: 'Tourist', value: 'tourist' }, { label: 'Business', value: 'business' }, { label: 'Marine', value: 'marine' }]} value={selectValue} onChange={setSelectValue} size="md" sx={fieldSx} /></Demo><Demo label="Search"><Input label="Search destinations" placeholder="Country or region" value={search} onChange={setSearch} startAdornment={<Search size={18} />} size="md" sx={fieldSx} /></Demo><Demo label="Date field"><Input label="Departure date" type="date" size="md" sx={fieldSx} /></Demo><Demo label="Textarea"><Textarea label="How can we help?" placeholder="Tell us about your travel plans" rows={3} sx={fieldSx} /></Demo><Demo label="Error"><Input label="Email address" defaultValue="invalid-email" error helperText="Enter a valid email address." size="md" sx={fieldSx} /></Demo><Demo label="Disabled"><Input label="Reference number" defaultValue="Issued after submission" disabled size="md" sx={fieldSx} /></Demo><Demo label="Selection"><Checkbox label="I agree to the terms" defaultChecked /><RadioGroup label="Service" value={radio} onChange={setRadio} orientation="horizontal" options={[{ label: 'Retail', value: 'retail' }, { label: 'Marine', value: 'marine' }]} /><Toggle label="Email updates" checked={toggle} onChange={setToggle} /></Demo></div>
          <div className="glts-ds-spec-grid"><Spec label="Control height" value="44px" /><Spec label="Border" value="1px neutral" /><Spec label="Radius" value="12px" /><Spec label="Label gap" value="8px" /><Spec label="Placeholder" value="Muted text" /><Spec label="Focus" value="2px teal ring" /></div>
          <p className="glts-ds-note">Default, hover, focus, filled, disabled and error are interactive states. Labels remain visible; errors include text and are not conveyed by colour alone.</p>
        </Section>

        <Section id="cards" number="08" title="Card families" intro="Each family has its own content anatomy. Cards within a family share dimensions and image treatment.">
          <div className="glts-ds-card-grid"><WebsiteCard family="destination" title="Explore Japan" eyebrow="Destination" description="Visa guidance for memorable journeys." image="/images/destinations-hero.png" imageAlt="Travel destination landscape" href="/countries" cta="View destinations" /><WebsiteCard family="service" title="Visa services" eyebrow="Service" description="Practical support from preparation through submission." image="/images/services-hero.png" imageAlt="Travel documents and service setting" href="/services" cta="Explore services" /><WebsiteCard family="feature" title="Expert led" description="Experienced specialists help travelers navigate the details." icon={<ShieldCheck size={24} />} /><WebsiteCard family="testimonial" title="Traveler feedback" description="The process felt clear from the first conversation to the final update." avatar="GLTS traveler" /><WebsiteCard family="information" title="Before you apply" eyebrow="Information" description="Check eligibility, documents and lead times for your destination." href="/countries" cta="Find requirements" /></div>
          <div className="glts-ds-table-wrap"><table><thead><tr>{['Family', 'Image ratio', 'Padding', 'Heading', 'Description', 'CTA', 'Edge', 'Shadow / hover'].map(x => <th key={x}>{x}</th>)}</tr></thead><tbody>{cardRules.map(row => <tr key={row[0]}>{row.map((cell, index) => index === 0 ? <th key={index}>{cell}</th> : <td key={index}>{cell}</td>)}</tr>)}</tbody></table></div>
        </Section>

        <Section id="badges" number="09" title="Badges, chips & status" intro="Text and shape reinforce meaning; status is never colour alone.">
          <div className="glts-ds-inline"><span className="glts-ds-badge glts-ds-badge--info">Information</span><span className="glts-ds-badge glts-ds-badge--success"><Check size={14} /> Approved</span><span className="glts-ds-badge glts-ds-badge--warning">Pending review</span><span className="glts-ds-badge glts-ds-badge--error">Action required</span></div>
          <div className="glts-ds-inline glts-ds-chips">{['Tourist', 'Business', 'Marine'].map(label => <button key={label} className={activeChip === label ? 'is-active' : ''} aria-pressed={activeChip === label} onClick={() => setActiveChip(label)}>{label}</button>)}</div>
        </Section>

        <Section id="icons" number="10" title="Icons" intro="Lucide is the current public website icon set. Use a 2px stroke and consistent size roles.">
          <div className="glts-ds-icon-row">{[[Globe2, 'Destinations'], [Anchor, 'Marine'], [Building2, 'Corporate'], [ShieldCheck, 'Assurance'], [CircleHelp, 'Help']].map(([Icon, label]) => { const IconComponent = Icon as typeof Globe2; return <div key={label as string}><span><IconComponent size={24} strokeWidth={2} /></span><strong>{label as string}</strong></div> })}</div><div className="glts-ds-spec-grid"><Spec label="Small" value="16px" /><Spec label="Standard" value="20px" /><Spec label="Large" value="24px" /><Spec label="Container" value="44px" /><Spec label="Icon + text" value="8px" /></div>
        </Section>

        <Section id="images" number="11" title="Imagery" intro="Subject matter changes by service line; crop, contrast and restraint remain consistent.">
          <div className="glts-ds-image-grid"><div><img src="/images/retail-visa-hero.png" alt="Traveler focused retail visa imagery" /><strong>Retail · traveler focused</strong></div><div><img src="/images/marine-crew-visa-hero.png" alt="Marine industry imagery" /><strong>Marine · operational</strong></div><div><img src="/images/corporate-retainer-plans/boardroom.png" alt="Corporate business imagery" /><strong>Corporate · professional</strong></div></div>
          <div className="glts-ds-spec-grid"><Spec label="Hero" value="16:7 · cover" /><Spec label="Destination" value="4:5 · cover" /><Spec label="Service" value="16:10 · cover" /><Spec label="Editorial" value="4:3 · cover" /><Spec label="Avatar" value="1:1 · cover" /></div>
          <p className="glts-ds-note">Keep the subject visible across crops. Use a navy overlay only when text sits on an image. Image corners use the medium or large radius. Avoid decorative filters.</p>
        </Section>

        <Section id="shape" number="12" title="Radius & shadows" intro="Three corner sizes and two elevation levels cover the public website. Use a pill only for chips and badges.">
          <div className="glts-ds-radius-shadow"><div><span className="glts-ds-radius-demo" /><strong>Radius</strong><code>Small 8 · medium 12 · large 20px</code></div><div><span className="glts-ds-shadow-demo" /><strong>Shadow</strong><code>Subtle · elevated</code></div></div>
        </Section>

        <Section id="navigation" number="13" title="Navigation" intro="The site header and footer surrounding this page are the live navigation examples.">
          <Demo label="Breadcrumb"><nav className="glts-ds-breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><ChevronRight size={16} aria-hidden="true" /><span aria-current="page">Design System</span></nav></Demo>
          <div className="glts-ds-spec-grid"><Spec label="Header" value="72px sticky" /><Spec label="Active item" value="Green tint + weight" /><Spec label="Mobile" value="Menu drawer" /><Spec label="Focus" value="Visible teal ring" /></div><p className="glts-ds-note">The existing PublicHeader handles desktop links, search, sign in and the mobile drawer. Dropdowns, where introduced, should use the same focus and spacing rules.</p>
        </Section>

        <Section id="patterns" number="14" title="Interaction patterns & CTAs" intro="Use the same icon language, 8px interior rhythm and visible keyboard focus across disclosures, tabs and controls.">
          <div className="glts-ds-pattern-grid"><Demo label="FAQ accordion"><Accordion disableGutters elevation={0}><AccordionSummary expandIcon={<ChevronDown size={20} />}>What do I need before applying?</AccordionSummary><AccordionDetails>Check your destination, travel dates and required documents before starting an application.</AccordionDetails></Accordion></Demo><Demo label="Tabs"><Tabs value={tab} onChange={(_, next: number) => setTab(next)} aria-label="Service example tabs"><Tab label="Retail" /><Tab label="Marine" /><Tab label="Corporate" /></Tabs><p className="glts-ds-tab-copy">{['Guidance for individual travelers.', 'Support for seafarers and crew.', 'Travel support for business teams.'][tab]}</p></Demo><Demo label="Carousel controls"><div className="glts-ds-carousel"><button aria-label="Previous slide" onClick={() => setSlide((slide + 2) % 3)}><ChevronLeft size={20} /></button><div role="status" aria-live="polite"><strong>{carouselItems[slide]}</strong><span>{slide + 1} / 3</span></div><button aria-label="Next slide" onClick={() => setSlide((slide + 1) % 3)}><ChevronRight size={20} /></button></div></Demo></div>
          <div className="glts-ds-cta-grid"><div className="glts-ds-cta"><span className="glts-ds-overline">Light CTA</span><h3>Plan your next journey</h3><p>Get guidance that makes the next step clear.</p><Button href="/countries" sx={buttonSx}>Explore destinations</Button></div><div className="glts-ds-cta glts-ds-cta--dark"><span className="glts-ds-overline">Dark CTA</span><h3>Travel with expert support</h3><p>Speak with the team about specialist visa services.</p><div className="glts-ds-inline"><Button href="/services" sx={buttonSx}>Our services</Button><Button href="/about" variant="outlined" sx={buttonSx}>About GLTS</Button></div></div></div>
          <p className="glts-ds-note">CTA headings stay within 400px and supporting copy within 440px. Use a light surface or solid navy background by default; add imagery only when it helps explain the offer.</p>
        </Section>

        <Section id="page-patterns" number="15" title="Page Patterns" intro="Recommended story order for each GLTS page type. These are composition rules; combine or omit sections when the content calls for it.">
          <div className="glts-ds-page-patterns">{pagePatterns.map(pattern => <article key={pattern.page}><h3>{pattern.page}</h3><p>{pattern.intent}</p><ol>{pattern.steps.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, '0')}</span>{step}</li>)}</ol></article>)}</div>
        </Section>

        <Section id="glts-components" number="16" title="GLTS Components" intro="Reusable, front-end examples of travel and visa UI. Values below illustrate states and anatomy; they do not run eligibility, pricing or upload services.">
          <div className="glts-ds-component-stack">
            <Demo label="Visa Eligibility Selector · nationality, destination, purpose, CTA"><VisaEligibilitySelector nationalities={[{ label: 'India', value: 'india' }, { label: 'United Arab Emirates', value: 'uae' }]} destinations={[{ label: 'Japan', value: 'japan' }, { label: 'United Kingdom', value: 'uk' }]} purposes={[{ label: 'Tourism', value: 'tourism' }, { label: 'Business', value: 'business' }]} /></Demo>
            <Demo label="Visa Status Stepper · completed, current, upcoming"><VisaStatusStepper currentStage={2} /></Demo>
            <Demo label="Document Checklist Item · required, optional, missing, verified"><div className="glts-checklist"><DocumentChecklistItem label="Passport copy" status="required" detail="Required for this example" /><DocumentChecklistItem label="Travel itinerary" status="optional" /><DocumentChecklistItem label="Recent photograph" status="missing" detail="Upload needed" /><DocumentChecklistItem label="Application form" status="verified" detail="Checked by the team" /></div></Demo>
            <Demo label="File Upload Card · empty, uploading, uploaded, error"><div className="glts-upload-grid"><FileUploadCard status={uploadStatus} fileName={uploadFileName} onFileSelect={file => { setUploadStatus('uploaded'); setUploadFileName(file.name) }} /><FileUploadCard status="uploading" fileName="passport.pdf" /><FileUploadCard status="uploaded" fileName="passport.pdf" /><FileUploadCard status="error" fileName="photo.jpg" /></div></Demo>
            <div className="glts-ds-component-pair"><Demo label="Pricing Breakdown · illustrative UI values"><PricingBreakdown embassyFee={4500} greenlightFee={1500} note="Example amounts only; live fees must come from verified service data." /></Demo><Demo label="Package Selector · one selected option"><PackageSelector value={packageValue} onChange={setPackageValue} /></Demo></div>
            <div className="glts-ds-component-pair"><Demo label="Trust Metric · value, label, note"><TrustMetric value="98%" label="Example completion metric" note="Illustrative value; show a source and qualification with real metrics." /></Demo><Demo label="Google Review Summary · rating, stars, count, action"><GoogleReviewSummary rating={4.8} reviewCount={128} /><p className="glts-ds-note">Illustrative values. Supply the verified Google review URL to enable “View reviews”.</p></Demo></div>
            <Demo label="Visa Category Selector · selected, unselected, disabled"><VisaCategorySelector value={visaCategory} onChange={setVisaCategory} categories={[{ label: 'Tourist', value: 'tourist' }, { label: 'Business', value: 'business' }, { label: 'Marine', value: 'marine', disabled: true }]} /></Demo>
            <Demo label="Destination Search / Filter Pattern"><DestinationSearchFilter query={destinationQuery} onQueryChange={setDestinationQuery} region={destinationRegion} onRegionChange={setDestinationRegion} /></Demo>
          </div>
        </Section>

        <Section id="usage-guidelines" number="17" title="Usage Guidelines" intro="Choose the simplest pattern that makes the information easy to scan and act on.">
          <div className="glts-ds-usage-list">{usageGuidelines.map(rule => <div key={rule.component}><h3>{rule.component}</h3><div><strong>Use when</strong><p>{rule.use}</p></div><div><strong>Avoid when</strong><p>{rule.avoid}</p></div></div>)}</div>
        </Section>

        <Section id="responsive" number="18" title="Responsive rules" intro="Reflow by the shared foundation breakpoints and public website grid, not by unique per page values.">
          <div className="glts-ds-responsive-grid">{[['Mobile', '0–599px', '4 columns', '24px gutter', 'Stack content; full width controls'], ['Tablet', '600–1023px', '8 columns', '32px gutter', 'Two column groups; compact nav'], ['Laptop', '1024–1279px', '12 columns', '48px gutter', 'Full nav; compact copy widths'], ['Desktop', '1280px+', '12 columns', '48px gutter', 'Standard 1280px container']].map(row => <div key={row[0]}><strong>{row[0]}</strong><span>{row[1]}</span><span>{row[2]}</span><span>{row[3]}</span><p>{row[4]}</p></div>)}</div>
        </Section>

        <Section id="accessibility" number="19" title="Accessibility" intro="Practical rules for every component in the public experience.">
          <ul className="glts-ds-checklist"><li><Check size={18} /> Use navy or teal text on brand green to maintain readable contrast.</li><li><Check size={18} /> Keep focus rings visible on links, buttons and form controls.</li><li><Check size={18} /> Give primary interactive targets at least 44 × 44px.</li><li><Check size={18} /> Preserve heading order and meaningful image alt text.</li><li><Check size={18} /> Pair validation colour with an explicit message and accessible label.</li><li><Check size={18} /> Respect reduced motion preferences in interactive transitions.</li></ul>
        </Section>
      </div>
    </div>
  </div>
}
