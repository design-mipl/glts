import { useState } from 'react'
import { AlertCircle, Check, CheckCircle2, Circle, FileCheck2, FileUp, LoaderCircle, Search, Star } from 'lucide-react'
import { Button, Input, Select } from '@/design-system/UIComponents'
import { websiteButtonSx, websiteFieldSx } from '../theme/websiteComponentStyles'
import './gltsComponents.css'

type Choice = { label: string; value: string }

export function VisaEligibilitySelector({ nationalities, destinations, purposes }: { nationalities: Choice[]; destinations: Choice[]; purposes: Choice[] }) {
  const [nationality, setNationality] = useState<string | number>('')
  const [destination, setDestination] = useState<string | number>('')
  const [purpose, setPurpose] = useState<string | number>('')
  const [ready, setReady] = useState(false)
  return <div className="glts-journey glts-eligibility">
    <div className="glts-eligibility-fields"><Select label="Nationality" placeholder="Select nationality" value={nationality} onChange={value => { setNationality(value); setReady(false) }} options={nationalities} size="md" fullWidth sx={websiteFieldSx} /><Select label="Destination" placeholder="Select destination" value={destination} onChange={value => { setDestination(value); setReady(false) }} options={destinations} size="md" fullWidth sx={websiteFieldSx} /><Select label="Purpose" placeholder="Select purpose" value={purpose} onChange={value => { setPurpose(value); setReady(false) }} options={purposes} size="md" fullWidth sx={websiteFieldSx} /></div>
    <Button disabled={!nationality || !destination || !purpose} onClick={() => setReady(true)} sx={websiteButtonSx}>Check requirements</Button>
    {ready && <p className="glts-journey-feedback" role="status">Inputs are ready for an eligibility lookup. No eligibility decision is made in this example.</p>}
  </div>
}

const VISA_STATUS_STAGES = ['Application started', 'Documents collected', 'Verification', 'Submitted', 'Decision received', 'Completed'] as const

export function VisaStatusStepper({ currentStage = 2, stages = VISA_STATUS_STAGES }: { currentStage?: number; stages?: readonly string[] }) {
  return <ol className="glts-status-stepper" aria-label="Visa application progress">{stages.map((stage, index) => { const state = index < currentStage ? 'completed' : index === currentStage ? 'current' : 'upcoming'; return <li key={stage} className={`glts-status-stepper__item is-${state}`} aria-current={state === 'current' ? 'step' : undefined}><span className="glts-status-stepper__marker" aria-hidden="true">{state === 'completed' ? <Check size={16} /> : index + 1}</span><span><strong>{stage}</strong><small>{state}</small></span></li> })}</ol>
}

export type ChecklistStatus = 'required' | 'optional' | 'missing' | 'verified'
const checklistIcon = { required: Circle, optional: Circle, missing: AlertCircle, verified: CheckCircle2 }
export function DocumentChecklistItem({ label, status, detail }: { label: string; status: ChecklistStatus; detail?: string }) {
  const Icon = checklistIcon[status]
  return <div className={`glts-checklist-item is-${status}`}><Icon size={20} aria-hidden="true" /><div><strong>{label}</strong>{detail && <small>{detail}</small>}</div><span className="glts-checklist-item__status">{status}</span></div>
}

export type UploadStatus = 'empty' | 'uploading' | 'uploaded' | 'error'
export function FileUploadCard({ status, fileName, onFileSelect }: { status: UploadStatus; fileName?: string; onFileSelect?: (file: File) => void }) {
  const Icon = status === 'uploaded' ? FileCheck2 : status === 'error' ? AlertCircle : status === 'uploading' ? LoaderCircle : FileUp
  const messages = { empty: 'Choose a document to upload', uploading: 'Uploading document…', uploaded: 'Document uploaded', error: 'Upload failed. Try again.' }
  return <div className={`glts-upload is-${status}`}><Icon size={24} aria-hidden="true" /><div><strong>{messages[status]}</strong><small>{fileName || (status === 'empty' ? 'PDF, JPG or PNG' : status)}</small></div>{status === 'empty' && onFileSelect && <label className="glts-upload__choose">Choose file<input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={event => { const file = event.target.files?.[0]; if (file) onFileSelect(file) }} /></label>}</div>
}

const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })
export function PricingBreakdown({ embassyFee, greenlightFee, note }: { embassyFee: number; greenlightFee: number; note?: string }) {
  return <div className="glts-pricing"><div><span>Embassy fee</span><strong>{inr.format(embassyFee)}</strong></div><div><span>GreenLight fee</span><strong>{inr.format(greenlightFee)}</strong></div><div className="glts-pricing__total"><span>Total</span><strong>{inr.format(embassyFee + greenlightFee)}</strong></div>{note && <small>{note}</small>}</div>
}

const VISA_PACKAGES = ['Standard', 'Priority', 'Concierge'] as const
export function PackageSelector({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return <div className="glts-choice-row" role="group" aria-label="Package">{VISA_PACKAGES.map(name => <button type="button" key={name} className={`glts-choice ${value === name ? 'is-selected' : ''}`} aria-pressed={value === name} onClick={() => onChange(name)}><strong>{name}</strong><small>{value === name ? 'Selected' : 'Select package'}</small></button>)}</div>
}

export function TrustMetric({ value, label, note }: { value: string; label: string; note?: string }) {
  return <div className="glts-trust-metric"><strong>{value}</strong><span>{label}</span>{note && <small>{note}</small>}</div>
}

export function GoogleReviewSummary({ rating, reviewCount, href }: { rating: number; reviewCount: number; href?: string }) {
  return <div className="glts-review-summary"><div><strong>{rating.toFixed(1)}</strong><span aria-label={`${rating.toFixed(1)} out of 5 stars`}>{Array.from({ length: 5 }, (_, index) => <Star key={index} size={18} fill="currentColor" aria-hidden="true" />)}</span></div><p>Google reviews · {reviewCount.toLocaleString('en-IN')} reviews</p>{href ? <a href={href} target="_blank" rel="noopener noreferrer">View reviews</a> : <span className="glts-review-summary__unlinked">View reviews · link required</span>}</div>
}

export function VisaCategorySelector({ categories, value, onChange }: { categories: (Choice & { disabled?: boolean })[]; value: string; onChange: (value: string) => void }) {
  return <div className="glts-choice-row" role="group" aria-label="Visa category">{categories.map(category => <button type="button" key={category.value} className={`glts-choice ${value === category.value ? 'is-selected' : ''}`} aria-pressed={value === category.value} disabled={category.disabled} onClick={() => onChange(category.value)}><strong>{category.label}</strong><small>{category.disabled ? 'Unavailable' : value === category.value ? 'Selected' : 'Select category'}</small></button>)}</div>
}

export function DestinationSearchFilter({ query, onQueryChange, region, onRegionChange }: { query: string; onQueryChange: (value: string) => void; region: string | number; onRegionChange: (value: string | number) => void }) {
  return <div className="glts-journey glts-destination-filter"><Input label="Search destinations" placeholder="Country or region" value={query} onChange={onQueryChange} startAdornment={<Search size={18} />} size="md" fullWidth sx={websiteFieldSx} /><Select label="Region" value={region} onChange={onRegionChange} options={[{ label: 'All regions', value: 'all' }, { label: 'Asia', value: 'asia' }, { label: 'Europe', value: 'europe' }, { label: 'Americas', value: 'americas' }]} size="md" fullWidth sx={websiteFieldSx} /><span className="glts-destination-filter__summary" role="status">{query ? `Search: ${query}` : 'All destinations'} · {region === 'all' ? 'All regions' : region}</span></div>
}
