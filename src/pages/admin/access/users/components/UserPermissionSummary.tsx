import { Box, Stack, Typography } from '@mui/material'
import { ADMIN_PERMISSION_MODULES } from '@/shared/config/adminPermissionModules'
import type { AdminUserPermissions } from '@/shared/types/adminPermission'
import {
  isModuleAllPermissions,
  isModuleViewOnly,
} from '@/shared/utils/adminPermissionEngine'

interface UserPermissionSummaryProps {
  permissions: AdminUserPermissions
  isSuperAdmin?: boolean
}

function SubmoduleSummary({
  label,
  actions,
}: {
  label: string
  actions: string[]
}) {
  if (actions.length === 0) return null
  return (
    <Typography variant="body2" sx={{ fontSize: 13, pl: 2 }}>
      {label}: {actions.join(', ')}
    </Typography>
  )
}

export function UserPermissionSummary({ permissions, isSuperAdmin }: UserPermissionSummaryProps) {
  if (isSuperAdmin) {
    return (
      <Box sx={{ py: 1 }}>
        <Typography variant="body2" fontWeight={600} color="success.main">
          Full access — Super Admin
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: 13 }}>
          Super Admin has unrestricted access to all modules and submodules.
        </Typography>
      </Box>
    )
  }

  const modulesWithAccess = ADMIN_PERMISSION_MODULES.filter((mod) => {
    const state = permissions[mod.id]
    if (!state) return false
    return mod.submodules.some((sub) => {
      const s = state.submodules[sub.id]
      return s?.create || s?.view || s?.update
    })
  })

  if (modulesWithAccess.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No permissions configured.
      </Typography>
    )
  }

  return (
    <Stack spacing={2}>
      {modulesWithAccess.map((mod) => {
        const state = permissions[mod.id]
        if (!state) return null
        const moduleLabel = isModuleAllPermissions(state, mod.id)
          ? 'All permissions'
          : isModuleViewOnly(state, mod.id)
            ? 'View only'
            : 'Custom access'

        return (
          <Box key={mod.id}>
            <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
              {mod.label}
              <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                ({moduleLabel})
              </Typography>
            </Typography>
            <Stack spacing={0.25} sx={{ mt: 0.5 }}>
              {mod.submodules.map((sub) => {
                const s = state.submodules[sub.id]
                if (!s) return null
                const actions: string[] = []
                if (s.create) actions.push('Create')
                if (s.view) actions.push('View')
                if (s.update) actions.push('Update/Edit')
                return (
                  <SubmoduleSummary key={sub.id} label={sub.label} actions={actions} />
                )
              })}
            </Stack>
          </Box>
        )
      })}
    </Stack>
  )
}
