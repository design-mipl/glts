import { ADMIN_PERMISSION_MODULES } from '@/shared/config/adminPermissionModules'
import type {
  AdminUserPermissions,
  ModulePermissionPreset,
  ModulePermissionState,
  SubmodulePermissionAction,
  SubmodulePermissionState,
} from '@/shared/types/adminPermission'

const ALL_ACTIONS: SubmodulePermissionAction[] = ['create', 'view', 'update']
const VIEW_ONLY_ACTIONS: SubmodulePermissionAction[] = ['view']

function emptySubmoduleState(): SubmodulePermissionState {
  return { create: false, view: false, update: false }
}

function submoduleStateFromActions(actions: SubmodulePermissionAction[]): SubmodulePermissionState {
  return {
    create: actions.includes('create'),
    view: actions.includes('view'),
    update: actions.includes('update'),
  }
}

function getModuleDef(moduleId: string) {
  return ADMIN_PERMISSION_MODULES.find((m) => m.id === moduleId)
}

export function createEmptyPermissions(): AdminUserPermissions {
  const permissions: AdminUserPermissions = {}
  for (const mod of ADMIN_PERMISSION_MODULES) {
    const submodules: Record<string, SubmodulePermissionState> = {}
    for (const sub of mod.submodules) {
      submodules[sub.id] = emptySubmoduleState()
    }
    permissions[mod.id] = { preset: null, submodules }
  }
  return permissions
}

export function createModuleState(moduleId: string): ModulePermissionState {
  const mod = getModuleDef(moduleId)
  const submodules: Record<string, SubmodulePermissionState> = {}
  for (const sub of mod?.submodules ?? []) {
    submodules[sub.id] = emptySubmoduleState()
  }
  return { preset: null, submodules }
}

export function applyModulePreset(
  state: ModulePermissionState,
  moduleId: string,
  preset: ModulePermissionPreset,
): ModulePermissionState {
  const mod = getModuleDef(moduleId)
  if (!mod) return state

  const actions = preset === 'all' ? ALL_ACTIONS : VIEW_ONLY_ACTIONS
  const submodules: Record<string, SubmodulePermissionState> = {}
  for (const sub of mod.submodules) {
    submodules[sub.id] = submoduleStateFromActions(actions)
  }
  return { preset, submodules }
}

export function applyModulePresetToPermissions(
  permissions: AdminUserPermissions,
  moduleId: string,
  preset: ModulePermissionPreset,
): AdminUserPermissions {
  const current = permissions[moduleId] ?? createModuleState(moduleId)
  return {
    ...permissions,
    [moduleId]: applyModulePreset(current, moduleId, preset),
  }
}

export function isModuleAllPermissions(state: ModulePermissionState, moduleId: string): boolean {
  if (state.preset === 'all') return true
  const mod = getModuleDef(moduleId)
  if (!mod) return false
  return mod.submodules.every((sub) => {
    const s = state.submodules[sub.id]
    return s?.create && s?.view && s?.update
  })
}

export function isModuleViewOnly(state: ModulePermissionState, moduleId: string): boolean {
  if (state.preset === 'view_only') return true
  const mod = getModuleDef(moduleId)
  if (!mod) return false
  return mod.submodules.every((sub) => {
    const s = state.submodules[sub.id]
    return s?.view && !s?.create && !s?.update
  })
}

export function syncModulePreset(state: ModulePermissionState, moduleId: string): ModulePermissionState {
  if (isModuleAllPermissions(state, moduleId)) {
    return { ...state, preset: 'all' }
  }
  if (isModuleViewOnly(state, moduleId)) {
    return { ...state, preset: 'view_only' }
  }
  return { ...state, preset: null }
}

export function setModulePreset(
  permissions: AdminUserPermissions,
  moduleId: string,
  preset: ModulePermissionPreset,
): AdminUserPermissions {
  const current = permissions[moduleId] ?? createModuleState(moduleId)
  return {
    ...permissions,
    [moduleId]: applyModulePreset(current, moduleId, preset),
  }
}

export function clearModulePreset(
  permissions: AdminUserPermissions,
  moduleId: string,
): AdminUserPermissions {
  const current = permissions[moduleId] ?? createModuleState(moduleId)
  return {
    ...permissions,
    [moduleId]: { ...current, preset: null },
  }
}

export function toggleSubmoduleAction(
  permissions: AdminUserPermissions,
  moduleId: string,
  submoduleId: string,
  action: SubmodulePermissionAction,
  checked: boolean,
): AdminUserPermissions {
  const current = permissions[moduleId] ?? createModuleState(moduleId)
  const sub = current.submodules[submoduleId] ?? emptySubmoduleState()

  let nextSub: SubmodulePermissionState = { ...sub }

  if (action === 'view') {
    nextSub.view = checked
    if (!checked) {
      nextSub.create = false
      nextSub.update = false
    }
  } else if (action === 'create' || action === 'update') {
    if (!sub.view && checked) {
      nextSub.view = true
    }
    nextSub[action] = checked
  }

  const nextModule: ModulePermissionState = {
    preset: null,
    submodules: {
      ...current.submodules,
      [submoduleId]: nextSub,
    },
  }

  return {
    ...permissions,
    [moduleId]: syncModulePreset(nextModule, moduleId),
  }
}

export function superAdminFullPermissions(): AdminUserPermissions {
  let permissions = createEmptyPermissions()
  for (const mod of ADMIN_PERMISSION_MODULES) {
    permissions = applyModulePresetToPermissions(permissions, mod.id, 'all')
  }
  return permissions
}

export function isSubmoduleActionDisabled(
  sub: SubmodulePermissionState,
  action: SubmodulePermissionAction,
): boolean {
  if (action === 'view') return false
  return !sub.view
}

export function countGrantedSubmoduleActions(state: SubmodulePermissionState): number {
  return [state.create, state.view, state.update].filter(Boolean).length
}

export function hasNoConfiguredPermissions(permissions: AdminUserPermissions): boolean {
  return !ADMIN_PERMISSION_MODULES.some((mod) => {
    const state = permissions[mod.id]
    if (!state) return false
    return mod.submodules.some((sub) => {
      const s = state.submodules[sub.id]
      return s?.create || s?.view || s?.update
    })
  })
}
