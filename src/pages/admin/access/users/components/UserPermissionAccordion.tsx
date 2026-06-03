import { useState } from 'react'
import { Box, Collapse, Stack, Typography } from '@mui/material'
import { ChevronDown } from 'lucide-react'
import { Checkbox } from '@/design-system/UIComponents'
import { ADMIN_PERMISSION_MODULES } from '@/shared/config/adminPermissionModules'
import type { AdminUserPermissions } from '@/shared/types/adminPermission'
import {
  isModuleAllPermissions,
  isModuleViewOnly,
  isSubmoduleActionDisabled,
  setModulePreset,
  toggleSubmoduleAction,
} from '@/shared/utils/adminPermissionEngine'

interface UserPermissionAccordionProps {
  permissions: AdminUserPermissions
  onChange: (next: AdminUserPermissions) => void
  readOnly?: boolean
}

export function UserPermissionAccordion({
  permissions,
  onChange,
  readOnly = false,
}: UserPermissionAccordionProps) {
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    masters: true,
  })

  const toggleExpanded = (moduleId: string) => {
    setExpandedModules((prev) => ({ ...prev, [moduleId]: !prev[moduleId] }))
  }

  return (
    <Stack spacing={1.5}>
      {ADMIN_PERMISSION_MODULES.map((mod) => {
        const state = permissions[mod.id]
        if (!state) return null
        const expanded = expandedModules[mod.id] ?? false
        const allChecked = isModuleAllPermissions(state, mod.id)
        const viewOnlyChecked = isModuleViewOnly(state, mod.id)

        return (
          <Box
            key={mod.id}
            sx={{
              border: 1,
              borderColor: 'divider',
              borderRadius: 2,
              overflow: 'hidden',
              bgcolor: 'background.paper',
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ px: 2, py: 1.25, cursor: 'pointer', bgcolor: 'action.hover' }}
              onClick={() => toggleExpanded(mod.id)}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <ChevronDown
                  size={18}
                  style={{
                    transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                  }}
                />
                <Typography variant="body2" fontWeight={600}>
                  {mod.label}
                </Typography>
              </Stack>
            </Stack>

            <Collapse in={expanded}>
              <Box sx={{ px: { xs: 1.5, sm: 2 }, py: 2 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" sx={{ mb: 1 }}>
                  Module level
                </Typography>
                <Stack direction="row" spacing={2} sx={{ mb: 2, flexWrap: 'wrap' }}>
                  <Checkbox
                    label="All Permissions"
                    checked={allChecked}
                    disabled={readOnly}
                    onChange={(checked) => {
                      if (checked) {
                        onChange(setModulePreset(permissions, mod.id, 'all'))
                      } else {
                        onChange(setModulePreset(permissions, mod.id, 'view_only'))
                      }
                    }}
                  />
                  <Checkbox
                    label="Only View"
                    checked={viewOnlyChecked && !allChecked}
                    disabled={readOnly}
                    onChange={(checked) => {
                      if (checked) {
                        onChange(setModulePreset(permissions, mod.id, 'view_only'))
                      }
                    }}
                  />
                </Stack>

                <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" sx={{ mb: 1 }}>
                  Submodules
                </Typography>
                <Stack spacing={1.5}>
                  {mod.submodules.map((sub) => {
                    const subState = state.submodules[sub.id] ?? {
                      create: false,
                      view: false,
                      update: false,
                    }
                    return (
                      <Box
                        key={sub.id}
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: { xs: '1fr', sm: '180px 1fr' },
                          gap: 1,
                          alignItems: 'center',
                          py: 0.5,
                          borderTop: 1,
                          borderColor: 'divider',
                        }}
                      >
                        <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
                          {sub.label}
                        </Typography>
                        <Stack direction="row" spacing={1.5} useFlexGap sx={{ flexWrap: 'wrap' }}>
                          <Checkbox
                            label="Create"
                            checked={subState.create}
                            disabled={readOnly || isSubmoduleActionDisabled(subState, 'create')}
                            onChange={(checked) =>
                              onChange(
                                toggleSubmoduleAction(permissions, mod.id, sub.id, 'create', checked),
                              )
                            }
                          />
                          <Checkbox
                            label="View"
                            checked={subState.view}
                            disabled={readOnly}
                            onChange={(checked) =>
                              onChange(
                                toggleSubmoduleAction(permissions, mod.id, sub.id, 'view', checked),
                              )
                            }
                          />
                          <Checkbox
                            label="Update/Edit"
                            checked={subState.update}
                            disabled={readOnly || isSubmoduleActionDisabled(subState, 'update')}
                            onChange={(checked) =>
                              onChange(
                                toggleSubmoduleAction(permissions, mod.id, sub.id, 'update', checked),
                              )
                            }
                          />
                        </Stack>
                      </Box>
                    )
                  })}
                </Stack>
              </Box>
            </Collapse>
          </Box>
        )
      })}
    </Stack>
  )
}
