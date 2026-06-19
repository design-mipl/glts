import { serviceMasterService } from '@/shared/services/serviceMasterService'

export function getVendorServiceMasterOptions() {
  return serviceMasterService.list({ status: 'active' }).map((s) => ({
    value: s.id,
    label: `${s.serviceName} (${s.serviceCode})`,
  }))
}
