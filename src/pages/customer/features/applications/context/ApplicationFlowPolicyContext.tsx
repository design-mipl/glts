import { createContext, useContext, useMemo, type ReactNode } from 'react'
import type { BreadcrumbItem } from '@/design-system/UIComponents'

export type ApplicationFlowPolicy = 'customer' | 'admin' | 'website'

export const ADMIN_MARINE_APPLICATION_FLOW_STORAGE_KEY = 'glts:admin-marine-application-flow'
export const WEBSITE_APPLICATION_FLOW_STORAGE_KEY = 'glts:website-application-flow'

export interface ApplicationFlowPolicyContextValue {
  policy: ApplicationFlowPolicy
  listingPath: string
  breadcrumbItems: BreadcrumbItem[]
  storageKey: string
}

const defaultValue: ApplicationFlowPolicyContextValue = {
  policy: 'customer',
  listingPath: '',
  breadcrumbItems: [],
  storageKey: 'glts:application-flow',
}

const ApplicationFlowPolicyContext = createContext<ApplicationFlowPolicyContextValue>(defaultValue)

export interface ApplicationFlowPolicyProviderProps {
  policy: ApplicationFlowPolicy
  listingPath: string
  breadcrumbItems: BreadcrumbItem[]
  storageKey?: string
  children: ReactNode
}

export function ApplicationFlowPolicyProvider({
  policy,
  listingPath,
  breadcrumbItems,
  storageKey,
  children,
}: ApplicationFlowPolicyProviderProps) {
  const value = useMemo(
    (): ApplicationFlowPolicyContextValue => ({
      policy,
      listingPath,
      breadcrumbItems,
      storageKey:
        storageKey ??
        (policy === 'admin'
          ? ADMIN_MARINE_APPLICATION_FLOW_STORAGE_KEY
          : policy === 'website'
            ? WEBSITE_APPLICATION_FLOW_STORAGE_KEY
            : 'glts:application-flow'),
    }),
    [policy, listingPath, breadcrumbItems, storageKey],
  )

  return (
    <ApplicationFlowPolicyContext.Provider value={value}>{children}</ApplicationFlowPolicyContext.Provider>
  )
}

export function useApplicationFlowPolicy(): ApplicationFlowPolicyContextValue {
  return useContext(ApplicationFlowPolicyContext)
}

export function isAdminFlowPolicy(policy: ApplicationFlowPolicy): boolean {
  return policy === 'admin'
}

export function isWebsiteFlowPolicy(policy: ApplicationFlowPolicy): boolean {
  return policy === 'website'
}

export function requiresFieldValidation(policy: ApplicationFlowPolicy): boolean {
  return policy === 'customer' || policy === 'website'
}
