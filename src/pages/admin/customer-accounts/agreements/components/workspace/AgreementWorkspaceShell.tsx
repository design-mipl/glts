import type { ReactNode } from 'react'
import {
  AdminWorkspaceShell,
  type AdminWorkspaceSectionNavItem,
} from '@/pages/admin/components/AdminWorkspaceShell'
import type { BreadcrumbItem } from '@/design-system/UIComponents'

export type AgreementWorkspaceSectionNavItem = AdminWorkspaceSectionNavItem

interface AgreementWorkspaceShellProps {
  breadcrumbs: BreadcrumbItem[]
  title: string
  description?: string
  headerActions?: ReactNode
  sections: AgreementWorkspaceSectionNavItem[]
  activeSectionId?: string
  onSectionClick: (sectionId: string) => void
  centerPanel: ReactNode
  footer: ReactNode
}

export function AgreementWorkspaceShell(props: AgreementWorkspaceShellProps) {
  return <AdminWorkspaceShell {...props} navTitle="Sections" />
}
