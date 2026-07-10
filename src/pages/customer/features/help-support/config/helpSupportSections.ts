import type { LucideIcon } from 'lucide-react'
import { BookOpen, CircleHelp, Newspaper } from 'lucide-react'

export type HelpSupportSectionId = 'faq' | 'articles' | 'guides' | 'categories'

export interface HelpSupportSectionNavItem {
  id: HelpSupportSectionId
  label: string
  icon: LucideIcon
  description: string
}

export const HELP_SUPPORT_SECTIONS: HelpSupportSectionNavItem[] = [
  {
    id: 'faq',
    label: 'FAQ',
    icon: CircleHelp,
    description: 'Search and filter common questions about applications, documents, billing, and more.',
  },
  {
    id: 'articles',
    label: 'Help Articles',
    icon: Newspaper,
    description: 'In-depth walkthroughs for common portal workflows and processes.',
  },
  {
    id: 'guides',
    label: 'User Guides',
    icon: BookOpen,
    description: 'Download official guides, templates, and reference documents for your team.',
  },
]

export const HELP_SUPPORT_SECTION_LABELS: Record<HelpSupportSectionId, string> = {
  faq: 'FAQ',
  articles: 'Help Articles',
  guides: 'User Guides',
  categories: 'Support Categories',
}

export function isHelpSupportSectionId(value: string | null | undefined): value is HelpSupportSectionId {
  return value === 'faq' || value === 'articles' || value === 'guides' || value === 'categories'
}
