import type { ReactNode } from 'react'
import { Drawer } from '@/design-system/UIComponents'
import { AdminFormSectionsLayout } from './AdminFormSectionsLayout'
import { ADMIN_DRAWER_FORM_LAYOUT } from './adminOverlayFormLayout'
import type { AdminFullPageFormSection } from './AdminFullPageFormShell'

export interface AdminDrawerFormShellProps {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  /** Same section model as AdminFullPageFormShell — stacked vertically in the drawer */
  sections: AdminFullPageFormSection[]
  footer: ReactNode
  width?: number
}

/**
 * Full-page form pattern inside a right drawer: white body, primary + secondary
 * section cards stacked vertically, same field grids as AdminFullPageFormShell.
 */
export function AdminDrawerFormShell({
  open,
  onClose,
  title,
  subtitle,
  sections,
  footer,
  width = ADMIN_DRAWER_FORM_LAYOUT.recommendedWidth,
}: AdminDrawerFormShellProps) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      width={width}
      footer={footer}
    >
      <AdminFormSectionsLayout sections={sections} variant="stack" />
    </Drawer>
  )
}
