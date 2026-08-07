/** Admin portal permission model — Module → Submodule → Tabs. */

export type TabPermissionAction = 'create' | 'view' | 'update'

/** @deprecated Use TabPermissionAction — kept during migration. */
export type SubmodulePermissionAction = TabPermissionAction

export type ModulePermissionPreset = 'all' | 'view_only'

export interface TabPermissionState {
  create: boolean
  view: boolean
  update: boolean
}

/** @deprecated Use TabPermissionState — kept during migration. */
export type SubmodulePermissionState = TabPermissionState

export interface SubmodulePermissionTreeState {
  tabs: Record<string, TabPermissionState>
}

export interface ModulePermissionState {
  /** Set when module-level preset is active; null when custom tab mix. */
  preset: ModulePermissionPreset | null
  submodules: Record<string, SubmodulePermissionTreeState>
}

export type AdminUserPermissions = Record<string, ModulePermissionState>

export interface AdminPermissionTab {
  id: string
  label: string
}

export interface AdminPermissionSubmodule {
  id: string
  label: string
  tabs: AdminPermissionTab[]
}

export interface AdminPermissionModule {
  id: string
  label: string
  submodules: AdminPermissionSubmodule[]
}
