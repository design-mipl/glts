import { useState } from 'react'
import { Box, Collapse, Stack, Typography } from '@mui/material'
import { ChevronDown } from 'lucide-react'
import { Checkbox } from '@/design-system/UIComponents'
import { ADMIN_PERMISSION_MODULES } from '@/shared/config/adminPermissionModules'
import type { AdminUserPermissions } from '@/shared/types/adminPermission'
import {
  isModuleAllPermissions,
  isModuleViewOnly,
  isTabActionDisabled,
  setModulePreset,
  toggleTabAction,
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
    application_management: true,
  })
  const [expandedSubmodules, setExpandedSubmodules] = useState<Record<string, boolean>>({})

  const toggleExpanded = (moduleId: string) => {
    setExpandedModules((prev) => ({ ...prev, [moduleId]: !prev[moduleId] }))
  }

  const toggleSubmoduleExpanded = (key: string) => {
    setExpandedSubmodules((prev) => ({ ...prev, [key]: !prev[key] }))
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
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight={600}
                  display="block"
                  sx={{ mb: 1 }}
                >
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

                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight={600}
                  display="block"
                  sx={{ mb: 1 }}
                >
                  Submodules & tabs
                </Typography>
                <Stack spacing={1}>
                  {mod.submodules.map((sub) => {
                    const subKey = `${mod.id}:${sub.id}`
                    const subExpanded = expandedSubmodules[subKey] ?? true
                    const subState = state.submodules[sub.id]
                    const singleTab = sub.tabs.length === 1

                    return (
                      <Box
                        key={sub.id}
                        sx={{
                          border: 1,
                          borderColor: 'divider',
                          borderRadius: 1.5,
                          overflow: 'hidden',
                        }}
                      >
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1}
                          sx={{
                            px: 1.5,
                            py: 1,
                            cursor: singleTab ? 'default' : 'pointer',
                            bgcolor: 'action.hover',
                          }}
                          onClick={() => {
                            if (!singleTab) toggleSubmoduleExpanded(subKey)
                          }}
                        >
                          {!singleTab ? (
                            <ChevronDown
                              size={16}
                              style={{
                                transform: subExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.2s',
                              }}
                            />
                          ) : null}
                          <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
                            {sub.label}
                          </Typography>
                        </Stack>

                        <Collapse in={singleTab || subExpanded}>
                          <Stack spacing={1} sx={{ px: 1.5, py: 1.25 }}>
                            {sub.tabs.map((tab) => {
                              const tabState = subState?.tabs[tab.id] ?? {
                                create: false,
                                view: false,
                                update: false,
                              }
                              return (
                                <Box
                                  key={tab.id}
                                  sx={{
                                    display: 'grid',
                                    gridTemplateColumns: {
                                      xs: '1fr',
                                      sm: singleTab ? '1fr' : 'minmax(140px, 220px) 1fr',
                                    },
                                    gap: 1,
                                    alignItems: 'center',
                                    py: 0.5,
                                    borderTop: singleTab ? 0 : 1,
                                    borderColor: 'divider',
                                    '&:first-of-type': { borderTop: 0 },
                                  }}
                                >
                                  {!singleTab ? (
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                      sx={{ fontSize: 12, pl: { sm: 0.5 } }}
                                    >
                                      {tab.label}
                                    </Typography>
                                  ) : null}
                                  <Stack
                                    direction="row"
                                    spacing={1.5}
                                    useFlexGap
                                    sx={{ flexWrap: 'wrap' }}
                                  >
                                    <Checkbox
                                      label="Create"
                                      checked={tabState.create}
                                      disabled={
                                        readOnly || isTabActionDisabled(tabState, 'create')
                                      }
                                      onChange={(checked) =>
                                        onChange(
                                          toggleTabAction(
                                            permissions,
                                            mod.id,
                                            sub.id,
                                            tab.id,
                                            'create',
                                            checked,
                                          ),
                                        )
                                      }
                                    />
                                    <Checkbox
                                      label="View"
                                      checked={tabState.view}
                                      disabled={readOnly}
                                      onChange={(checked) =>
                                        onChange(
                                          toggleTabAction(
                                            permissions,
                                            mod.id,
                                            sub.id,
                                            tab.id,
                                            'view',
                                            checked,
                                          ),
                                        )
                                      }
                                    />
                                    <Checkbox
                                      label="Update"
                                      checked={tabState.update}
                                      disabled={
                                        readOnly || isTabActionDisabled(tabState, 'update')
                                      }
                                      onChange={(checked) =>
                                        onChange(
                                          toggleTabAction(
                                            permissions,
                                            mod.id,
                                            sub.id,
                                            tab.id,
                                            'update',
                                            checked,
                                          ),
                                        )
                                      }
                                    />
                                  </Stack>
                                </Box>
                              )
                            })}
                          </Stack>
                        </Collapse>
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
