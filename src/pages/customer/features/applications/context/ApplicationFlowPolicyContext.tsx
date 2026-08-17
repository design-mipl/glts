import { createContext, useContext, useMemo, type ReactNode } from 'react'
import type { BreadcrumbItem } from '@/design-system/UIComponents'
import type { ApplicationCustomerSegment } from '@/pages/customer/features/applications/types/applicationListing.types'
import type { BusinessSegment } from '@/shared/types/countryMaster'

export type ApplicationFlowPolicy = 'customer' | 'admin' | 'website'

export const ADMIN_MARINE_APPLICATION_FLOW_STORAGE_KEY = 'glts:admin-marine-application-flow'
export const ADMIN_B2B_APPLICATION_FLOW_STORAGE_KEY = 'glts:admin-b2b-application-flow'
export const ADMIN_CORPORATE_APPLICATION_FLOW_STORAGE_KEY = 'glts:admin-corporate-application-flow'
export const WEBSITE_APPLICATION_FLOW_STORAGE_KEY = 'glts:website-application-flow'
export const CUSTOMER_MARINE_APPLICATION_FLOW_STORAGE_KEY = 'glts:application-flow'
export const CUSTOMER_CORPORATE_APPLICATION_FLOW_STORAGE_KEY = 'glts:customer-corporate-application-flow'
export const CUSTOMER_B2B_APPLICATION_FLOW_STORAGE_KEY = 'glts:customer-b2b-application-flow'
export const CUSTOMER_RETAIL_APPLICATION_FLOW_STORAGE_KEY = 'glts:customer-retail-application-flow'

export interface ApplicationFlowPolicyContextValue {
  policy: ApplicationFlowPolicy
  listingPath: string
  breadcrumbItems: BreadcrumbItem[]
  storageKey: string
  /** Country Master / listing segment for admin create flows. */
  customerSegment: ApplicationCustomerSegment
}

const defaultValue: ApplicationFlowPolicyContextValue = {
  policy: 'customer',
  listingPath: '',
  breadcrumbItems: [],
  storageKey: CUSTOMER_RETAIL_APPLICATION_FLOW_STORAGE_KEY,
  customerSegment: 'retail',
}

const ApplicationFlowPolicyContext = createContext<ApplicationFlowPolicyContextValue>(defaultValue)

export interface ApplicationFlowPolicyProviderProps {
  policy: ApplicationFlowPolicy
  listingPath: string
  breadcrumbItems: BreadcrumbItem[]
  storageKey?: string
  /** Country Master segment for admin modules and customer portals. Defaults to retail. */
  customerSegment?: ApplicationCustomerSegment
  children: ReactNode
}

function defaultStorageKeyFor(
  policy: ApplicationFlowPolicy,
  customerSegment: ApplicationCustomerSegment,
): string {
  if (policy === 'website') return WEBSITE_APPLICATION_FLOW_STORAGE_KEY
  if (policy === 'customer') {
    switch (customerSegment) {
      case 'corporate':
        return CUSTOMER_CORPORATE_APPLICATION_FLOW_STORAGE_KEY
      case 'b2bAgents':
        return CUSTOMER_B2B_APPLICATION_FLOW_STORAGE_KEY
      case 'marine':
        return CUSTOMER_MARINE_APPLICATION_FLOW_STORAGE_KEY
      case 'retail':
      default:
        return CUSTOMER_RETAIL_APPLICATION_FLOW_STORAGE_KEY
    }
  }
  switch (customerSegment) {
    case 'b2bAgents':
      return ADMIN_B2B_APPLICATION_FLOW_STORAGE_KEY
    case 'corporate':
      return ADMIN_CORPORATE_APPLICATION_FLOW_STORAGE_KEY
    case 'retail':
    case 'marine':
    default:
      return ADMIN_MARINE_APPLICATION_FLOW_STORAGE_KEY
  }
}

export function ApplicationFlowPolicyProvider({
  policy,
  listingPath,
  breadcrumbItems,
  storageKey,
  customerSegment = 'retail',
  children,
}: ApplicationFlowPolicyProviderProps) {
  const value = useMemo(
    (): ApplicationFlowPolicyContextValue => ({
      policy,
      listingPath,
      breadcrumbItems,
      customerSegment,
      storageKey: storageKey ?? defaultStorageKeyFor(policy, customerSegment),
    }),
    [policy, listingPath, breadcrumbItems, storageKey, customerSegment],
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

/** Map listing customer segment to Country Master business segment. */
export function customerSegmentToBusinessSegment(
  segment: ApplicationCustomerSegment,
): BusinessSegment {
  return segment
}
