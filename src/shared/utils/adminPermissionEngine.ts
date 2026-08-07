import { ADMIN_PERMISSION_MODULES } from '@/shared/config/adminPermissionModules'
import type {
  AdminUserPermissions,
  ModulePermissionPreset,
  ModulePermissionState,
  SubmodulePermissionTreeState,
  TabPermissionAction,
  TabPermissionState,
} from '@/shared/types/adminPermission'

const ALL_ACTIONS: TabPermissionAction[] = ['create', 'view', 'update']
const VIEW_ONLY_ACTIONS: TabPermissionAction[] = ['view']

function emptyTabState(): TabPermissionState {
  return { create: false, view: false, update: false }
}

function tabStateFromActions(actions: TabPermissionAction[]): TabPermissionState {
  return {
    create: actions.includes('create'),
    view: actions.includes('view'),
    update: actions.includes('update'),
  }
}

function getModuleDef(moduleId: string) {
  return ADMIN_PERMISSION_MODULES.find((m) => m.id === moduleId)
}

function getSubmoduleDef(moduleId: string, submoduleId: string) {
  return getModuleDef(moduleId)?.submodules.find((s) => s.id === submoduleId)
}

function createEmptySubmoduleState(moduleId: string, submoduleId: string): SubmodulePermissionTreeState {
  const sub = getSubmoduleDef(moduleId, submoduleId)
  const tabs: Record<string, TabPermissionState> = {}
  for (const tab of sub?.tabs ?? []) {
    tabs[tab.id] = emptyTabState()
  }
  return { tabs }
}

function applyActionsToSubmodule(
  moduleId: string,
  submoduleId: string,
  actions: TabPermissionAction[],
): SubmodulePermissionTreeState {
  const sub = getSubmoduleDef(moduleId, submoduleId)
  const tabs: Record<string, TabPermissionState> = {}
  for (const tab of sub?.tabs ?? []) {
    tabs[tab.id] = tabStateFromActions(actions)
  }
  return { tabs }
}

function tabHasAnyAccess(tab: TabPermissionState | undefined): boolean {
  return Boolean(tab?.create || tab?.view || tab?.update)
}

function submoduleHasAnyAccess(state: SubmodulePermissionTreeState | undefined): boolean {
  if (!state) return false
  return Object.values(state.tabs).some(tabHasAnyAccess)
}

function isTabFullyGranted(tab: TabPermissionState | undefined): boolean {
  return Boolean(tab?.create && tab?.view && tab?.update)
}

function isTabViewOnly(tab: TabPermissionState | undefined): boolean {
  return Boolean(tab?.view && !tab?.create && !tab?.update)
}

export function createEmptyPermissions(): AdminUserPermissions {
  const permissions: AdminUserPermissions = {}
  for (const mod of ADMIN_PERMISSION_MODULES) {
    const submodules: Record<string, SubmodulePermissionTreeState> = {}
    for (const sub of mod.submodules) {
      submodules[sub.id] = createEmptySubmoduleState(mod.id, sub.id)
    }
    permissions[mod.id] = { preset: null, submodules }
  }
  return permissions
}

export function createModuleState(moduleId: string): ModulePermissionState {
  const mod = getModuleDef(moduleId)
  const submodules: Record<string, SubmodulePermissionTreeState> = {}
  for (const sub of mod?.submodules ?? []) {
    submodules[sub.id] = createEmptySubmoduleState(moduleId, sub.id)
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
  const submodules: Record<string, SubmodulePermissionTreeState> = {}
  for (const sub of mod.submodules) {
    submodules[sub.id] = applyActionsToSubmodule(moduleId, sub.id, actions)
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
    const subState = state.submodules[sub.id]
    return sub.tabs.every((tab) => isTabFullyGranted(subState?.tabs[tab.id]))
  })
}

export function isModuleViewOnly(state: ModulePermissionState, moduleId: string): boolean {
  if (state.preset === 'view_only') return true
  const mod = getModuleDef(moduleId)
  if (!mod) return false
  return mod.submodules.every((sub) => {
    const subState = state.submodules[sub.id]
    return sub.tabs.every((tab) => isTabViewOnly(subState?.tabs[tab.id]))
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

export function toggleTabAction(
  permissions: AdminUserPermissions,
  moduleId: string,
  submoduleId: string,
  tabId: string,
  action: TabPermissionAction,
  checked: boolean,
): AdminUserPermissions {
  const current = permissions[moduleId] ?? createModuleState(moduleId)
  const sub = current.submodules[submoduleId] ?? createEmptySubmoduleState(moduleId, submoduleId)
  const tab = sub.tabs[tabId] ?? emptyTabState()

  let nextTab: TabPermissionState = { ...tab }

  if (action === 'view') {
    nextTab.view = checked
    if (!checked) {
      nextTab.create = false
      nextTab.update = false
    }
  } else if (action === 'create' || action === 'update') {
    if (!tab.view && checked) {
      nextTab.view = true
    }
    nextTab[action] = checked
  }

  const nextModule: ModulePermissionState = {
    preset: null,
    submodules: {
      ...current.submodules,
      [submoduleId]: {
        tabs: {
          ...sub.tabs,
          [tabId]: nextTab,
        },
      },
    },
  }

  return {
    ...permissions,
    [moduleId]: syncModulePreset(nextModule, moduleId),
  }
}

/** @deprecated Use toggleTabAction */
export function toggleSubmoduleAction(
  permissions: AdminUserPermissions,
  moduleId: string,
  submoduleId: string,
  action: TabPermissionAction,
  checked: boolean,
): AdminUserPermissions {
  const sub = getSubmoduleDef(moduleId, submoduleId)
  const tabId = sub?.tabs[0]?.id ?? 'listing'
  return toggleTabAction(permissions, moduleId, submoduleId, tabId, action, checked)
}

export function superAdminFullPermissions(): AdminUserPermissions {
  let permissions = createEmptyPermissions()
  for (const mod of ADMIN_PERMISSION_MODULES) {
    permissions = applyModulePresetToPermissions(permissions, mod.id, 'all')
  }
  return permissions
}

export function isTabActionDisabled(tab: TabPermissionState, action: TabPermissionAction): boolean {
  if (action === 'view') return false
  return !tab.view
}

/** @deprecated Use isTabActionDisabled */
export function isSubmoduleActionDisabled(
  tab: TabPermissionState,
  action: TabPermissionAction,
): boolean {
  return isTabActionDisabled(tab, action)
}

export function countGrantedTabActions(state: TabPermissionState): number {
  return [state.create, state.view, state.update].filter(Boolean).length
}

/** @deprecated Use countGrantedTabActions */
export function countGrantedSubmoduleActions(state: TabPermissionState): number {
  return countGrantedTabActions(state)
}

export function hasNoConfiguredPermissions(permissions: AdminUserPermissions): boolean {
  return !ADMIN_PERMISSION_MODULES.some((mod) => {
    const state = permissions[mod.id]
    if (!state) return false
    return mod.submodules.some((sub) => submoduleHasAnyAccess(state.submodules[sub.id]))
  })
}

export function getTabActionsLabel(tab: TabPermissionState | undefined): string[] {
  if (!tab) return []
  const actions: string[] = []
  if (tab.create) actions.push('Create')
  if (tab.view) actions.push('View')
  if (tab.update) actions.push('Update')
  return actions
}

export function submoduleHasGrantedAccess(state: SubmodulePermissionTreeState | undefined): boolean {
  return submoduleHasAnyAccess(state)
}
