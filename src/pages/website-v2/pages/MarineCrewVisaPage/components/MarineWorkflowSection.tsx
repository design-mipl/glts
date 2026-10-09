import { FileSearch, FileText, Mail } from 'lucide-react'
import { ProcessStepsSection, type ProcessStep } from '../../../components/ProcessStepsSection'

function PassportIcon({ size = 54, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 54 54" fill="none" aria-hidden="true">
      <rect x="9" y="3" width="36" height="48" rx="2" stroke={color} strokeWidth="2.8" />
      <path d="M15 10h24" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
      <circle cx="27" cy="29" r="10" stroke={color} strokeWidth="2.5" />
      <path d="M17 29h20M27 19c-3 3-4.5 6.3-4.5 10S24 36 27 39M27 19c3 3 4.5 6.3 4.5 10S30 36 27 39" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M17 45h20" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

const steps: ProcessStep[] = [
  {
    title: 'Share crew details',
    description: 'Provide crew information, travel plans and destination requirements.',
    icon: FileText,
  },
  {
    title: 'We review documents',
    description: 'Our team checks passports, visas and supporting documents for each crew member.',
    icon: FileSearch,
  },
  {
    title: 'Visa coordination',
    description: 'We liaise with embassies and authorities to process and obtain the required visas and approvals.',
    icon: PassportIcon,
  },
  {
    title: 'Track progress & updates',
    description: 'Receive clear status updates until your crew are ready to travel.',
    icon: Mail,
  },
]

export function MarineWorkflowSection() {
  return (
    <ProcessStepsSection
      id="how-marine-visa-handling-works"
      sectionLabel="How it works"
      heading="A simple process from crew details to deployment"
      subheading="We make marine visa coordination straightforward, with clear steps and proactive support."
      steps={steps}
    />
  )
}
