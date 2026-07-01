import type { LucideIcon } from 'lucide-react'
import {
  Calendar,
  CreditCard,
  FileCheck,
  FileUp,
  KeyRound,
  Lightbulb,
  MoreHorizontal,
  Package,
  Plane,
  ShieldCheck,
  Stamp,
  Wrench,
} from 'lucide-react'

export interface PortalSupportCategory {
  id: string
  name: string
  description: string
  icon: LucideIcon
}

export const PORTAL_SUPPORT_CATEGORIES: PortalSupportCategory[] = [
  {
    id: 'login-access',
    name: 'Login & Access',
    description: 'Sign-in issues, password resets, and account access.',
    icon: KeyRound,
  },
  {
    id: 'application-creation',
    name: 'Application Creation',
    description: 'Single, bulk, and marine application workflows.',
    icon: Plane,
  },
  {
    id: 'document-upload',
    name: 'Document Upload',
    description: 'File requirements, uploads, and resubmissions.',
    icon: FileUp,
  },
  {
    id: 'document-verification',
    name: 'Document Verification',
    description: 'Review outcomes, corrections, and rejections.',
    icon: FileCheck,
  },
  {
    id: 'visa-processing',
    name: 'Visa Processing',
    description: 'Embassy submission, processing times, and outcomes.',
    icon: Stamp,
  },
  {
    id: 'appointment-biometrics',
    name: 'Appointment & Biometrics',
    description: 'Scheduling, attendance, and biometrics guidance.',
    icon: Calendar,
  },
  {
    id: 'invoice-billing',
    name: 'Invoice & Billing',
    description: 'Invoices, statements, and billing configuration.',
    icon: CreditCard,
  },
  {
    id: 'payment-issues',
    name: 'Payment Issues',
    description: 'Payment proof, failed payments, and reconciliations.',
    icon: ShieldCheck,
  },
  {
    id: 'passport-delivery',
    name: 'Passport Delivery',
    description: 'Courier tracking, collection, and return logistics.',
    icon: Package,
  },
  {
    id: 'technical-issue',
    name: 'Technical Issue',
    description: 'Portal errors, browser issues, and performance.',
    icon: Wrench,
  },
  {
    id: 'feature-request',
    name: 'Feature Request',
    description: 'Suggest improvements to the customer portal.',
    icon: Lightbulb,
  },
  {
    id: 'others',
    name: 'Others',
    description: 'General enquiries not covered by other categories.',
    icon: MoreHorizontal,
  },
]
