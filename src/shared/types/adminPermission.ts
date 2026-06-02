/** Admin portal permission model — module and submodule level. */

export type SubmodulePermissionAction = 'create' | 'view' | 'update'

export type ModulePermissionPreset = 'all' | 'view_only'

export interface SubmodulePermissionState {
  create: boolean
  view: boolean
  update: boolean
}

export interface ModulePermissionState {
  /** Set when module-level preset is active; null when custom submodule mix. */
  preset: ModulePermissionPreset | null
  submodules: Record<string, SubmodulePermissionState>
}

export type AdminUserPermissions = Record<string, ModulePermissionState>

export interface AdminPermissionSubmodule {
  id: string
  label: string
}

export interface AdminPermissionModule {
  id: string
  label: string
  submodules: AdminPermissionSubmodule[]
}
