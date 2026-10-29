import { serviceMasterService } from '@/shared/services/serviceMasterService'
import { getMockVendors } from '@/shared/data/mockVendors'
import { taxMasterService } from '@/shared/services/taxMasterService'

export function getOrderServiceOptions() {
  return serviceMasterService
    .list({ status: 'active' })
    .map((service) => ({ value: service.id, label: `${service.serviceName} (${service.serviceCode})` }))
}

export function getOrderServiceLabel(serviceMasterId: string): string {
  const service = serviceMasterService.getById(serviceMasterId)
  return service ? `${service.serviceName} (${service.serviceCode})` : serviceMasterId
}

export function getOrderVendorOptions() {
  return getMockVendors()
    .filter((vendor) => vendor.status === 'active')
    .map((vendor) => ({ value: vendor.id, label: `${vendor.vendorName} (${vendor.vendorId})` }))
}

export function getOrderVendorLabel(vendorId: string): string {
  const vendor = getMockVendors().find((item) => item.id === vendorId)
  return vendor ? `${vendor.vendorName} (${vendor.vendorId})` : vendorId
}

export function getOrderGstOptions() {
  return taxMasterService
    .listGst({ status: 'active' })
    .map((gst) => ({ value: gst.id, label: `${gst.slabName} (${gst.ratePercent}%)` }))
}

export function getOrderGstRate(gstMasterId: string): number {
  const gst = taxMasterService.listGst().find((item) => item.id === gstMasterId)
  return gst ? gst.ratePercent : 0
}

export function getOrderGstLabel(gstMasterId: string): string {
  const gst = taxMasterService.listGst().find((item) => item.id === gstMasterId)
  return gst ? `${gst.slabName} (${gst.ratePercent}%)` : gstMasterId
}
