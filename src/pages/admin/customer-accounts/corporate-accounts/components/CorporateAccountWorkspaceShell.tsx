import type { ReactNode } from 'react'
import {
  AdminWorkspaceShell,
  type AdminWorkspaceSectionNavItem,
} from '@/pages/admin/components/AdminWorkspaceShell'
import type { BreadcrumbItem } from '@/design-system/UIComponents'

export type CorporateAccountWorkspaceSectionNavItem = AdminWorkspaceSectionNavItem

interface CorporateAccountWorkspaceShellProps {
  breadcrumbs: BreadcrumbItem[]
  title: string
  description?: string
  headerActions?: ReactNode
  sections: CorporateAccountWorkspaceSectionNavItem[]
  activeSectionId?: string
  onSectionClick: (sectionId: string) => void
  centerPanel: ReactNode
  footer: ReactNode
}

export function CorporateAccountWorkspaceShell(props: CorporateAccountWorkspaceShellProps) {
  return <AdminWorkspaceShell {...props} navTitle="Sections" />
}
