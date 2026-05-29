import type { VesselMasterFormData } from '@/shared/types/vesselMaster'
import { isValidEmail, isValidMobile, isNumericImo } from '@/shared/utils/contactValidation'

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
  if (!data.imoNumber.trim()) {
    errors.imoNumber = 'IMO number is required'
  } else if (!isNumericImo(data.imoNumber)) {
    errors.imoNumber = 'IMO must be a 7-digit numeric value'
  } else if (options?.isImoTaken?.(data.imoNumber, options.excludeId)) {
    errors.imoNumber = 'This IMO number is already registered'
  }
  if (!data.vesselType) errors.vesselType = 'Vessel type is required'
  if (!data.flagCountry.trim()) errors.flagCountry = 'Flag country is required'
  if (data.contactPersonEmail.trim() && !isValidEmail(data.contactPersonEmail)) {
    errors.contactPersonEmail = 'Enter a valid email address'
  }
  if (data.contactPersonMobile.trim() && !isValidMobile(data.contactPersonMobile)) {
    errors.contactPersonMobile = 'Enter a valid mobile number'
  }
  return errors
}
