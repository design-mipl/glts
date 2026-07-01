import type { LucideIcon } from 'lucide-react'
import { History, MessageSquarePlus } from 'lucide-react'

export type ContactSupportSectionId = 'raise-request' | 'history'

export interface ContactSupportSectionNavItem {
  id: ContactSupportSectionId
  label: string
  icon: LucideIcon
  description: string
}

export const CONTACT_SUPPORT_SECTIONS: ContactSupportSectionNavItem[] = [
  {
    id: 'raise-request',
    label: 'Raise Support Request',
    icon: MessageSquarePlus,
    description: 'Provide as much detail as possible so our support team can assist you quickly.',
  },
  {
    id: 'history',
    label: 'Support History',
    icon: History,
    description: 'Search tickets by number or subject, filter by status and category, and continue conversations.',
  },
]

export function isContactSupportSectionId(value: string | null | undefined): value is ContactSupportSectionId {
  return value === 'raise-request' || value === 'history'
}
