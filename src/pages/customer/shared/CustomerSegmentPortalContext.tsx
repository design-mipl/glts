import { createContext, useContext, type ReactNode } from 'react'
import type { CustomerSegmentPortalConfig } from './segmentTypes'

const retailConfig: CustomerSegmentPortalConfig = {
  customerType: 'corporate',
  showVesselMaster: false,
  showCrewUpload: false,
}

const CustomerSegmentPortalContext = createContext<CustomerSegmentPortalConfig>(retailConfig)

export function CustomerSegmentPortalProvider({
  config,
  children,
}: {
  config: CustomerSegmentPortalConfig
  children: ReactNode
}) {
  return (
    <CustomerSegmentPortalContext.Provider value={config}>{children}</CustomerSegmentPortalContext.Provider>
  )
}

export function useCustomerSegmentPortalConfig(): CustomerSegmentPortalConfig {
  return useContext(CustomerSegmentPortalContext)
}
