import type { ReactNode } from 'react'
import { EmptyState } from '@/design-system/UIComponents'

export interface PermissionGuardProps {
  children: ReactNode
  requiredPermissions?: string[]
  enforce?: boolean
  fallback?: ReactNode
}

export function PermissionGuard({
  children,
  requiredPermissions = [],
  enforce = false,
  fallback,
}: PermissionGuardProps) {
  const hasAccess = !enforce || requiredPermissions.length === 0

  if (!hasAccess) {
    return (
      fallback ?? (
        <EmptyState
          variant="no-access"
          title="Access restricted"
          description="Permission checks will be connected when admin roles are implemented."
        />
      )
    )
  }

  return <>{children}</>
}
