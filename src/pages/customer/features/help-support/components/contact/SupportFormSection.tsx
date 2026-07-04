import type { ReactNode } from 'react'
import { AdminOverlayFormSection } from '@/pages/admin/components/AdminOverlayFormSection'

interface SupportFormSectionProps {
  title: string
  description?: string
  children: ReactNode
  columns?: 1 | 2 | 3
}

export function SupportFormSection({ title, description, children, columns = 1 }: SupportFormSectionProps) {
  return (
    <AdminOverlayFormSection title={title} description={description} columns={columns}>
      {children}
    </AdminOverlayFormSection>
  )
}
