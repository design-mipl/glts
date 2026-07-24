import type { ReactNode } from 'react'
import { FormField } from '@/design-system/UIComponents'

export interface DashboardFilterFieldProps {
  label: string
  children: ReactNode
}

/** Label-above field wrapper for dashboard filter bars (matches admin FormField spec). */
export function DashboardFilterField({ label, children }: DashboardFilterFieldProps) {
  return (
    <FormField label={label} sx={{ minWidth: 0 }}>
      {children}
    </FormField>
  )
}
