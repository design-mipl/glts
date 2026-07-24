import type { VesselMasterFormData } from '@/shared/types/vesselMaster'
import { isNumericImo } from '@/shared/utils/contactValidation'

export function createEmptyVesselFormData(): VesselMasterFormData {
  return {
    linkedEntityId: '',
    vesselName: '',
    imoNumber: '',
    vesselType: 'bulk_carrier',
    flagCountry: '',
    portOfRegistry: '',
    contactPersonName: '',
    contactPersonEmail: '',
    contactPersonMobile: '',
    status: 'active',
    notes: '',
  }
}

export function vesselMasterToFormData(record: Partial<VesselMasterFormData> & { linkedEntityId?: string }): VesselMasterFormData {
  return {
    ...createEmptyVesselFormData(),
    ...record,
    linkedEntityId: record.linkedEntityId ?? '',
  }
}

export function validateVesselForm(
  data: VesselMasterFormData,
  options?: { excludeId?: string; isImoTaken?: (imo: string, excludeId?: string) => boolean },
): Record<string, string> {
  const errors: Record<string, string> = {}
  if (!data.vesselName.trim()) errors.vesselName = 'Vessel name is required'
  if (data.imoNumber.trim()) {
    if (!isNumericImo(data.imoNumber)) {
      errors.imoNumber = 'IMO must be a 7-digit numeric value'
    } else if (options?.isImoTaken?.(data.imoNumber, options.excludeId)) {
      errors.imoNumber = 'This IMO number is already registered'
    }
  }
  return errors
}
