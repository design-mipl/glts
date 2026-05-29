import type { EntityMasterFormData } from '@/shared/types/entityMaster'
import { isValidEmail, isValidMobile } from '@/shared/utils/contactValidation'

export function createEmptyEntityFormData(): EntityMasterFormData {
  return {
    entityName: '',
    contactPersonName: '',
    contactPersonEmail: '',
    contactPersonMobile: '',
    location: '',
    city: '',
    country: '',
    status: 'active',
    notes: '',
  }
}

export function entityMasterToFormData(record: {
  entityName: string
  contactPersonName: string
  contactPersonEmail: string
  contactPersonMobile: string
  location: string
  city: string
  country: string
  status: EntityMasterFormData['status']
  notes: string
}): EntityMasterFormData {
  return {
    entityName: record.entityName,
    contactPersonName: record.contactPersonName,
    contactPersonEmail: record.contactPersonEmail,
    contactPersonMobile: record.contactPersonMobile,
    location: record.location,
    city: record.city,
    country: record.country,
    status: record.status,
    notes: record.notes,
  }
}

export function validateEntityForm(data: EntityMasterFormData): Record<string, string> {
  const errors: Record<string, string> = {}
  if (!data.entityName.trim()) errors.entityName = 'Entity name is required'
  if (!data.contactPersonName.trim()) errors.contactPersonName = 'Contact person name is required'
  if (!data.country.trim()) errors.country = 'Country is required'
  if (data.contactPersonEmail.trim() && !isValidEmail(data.contactPersonEmail)) {
    errors.contactPersonEmail = 'Enter a valid email address'
  }
  if (data.contactPersonMobile.trim() && !isValidMobile(data.contactPersonMobile)) {
    errors.contactPersonMobile = 'Enter a valid mobile number'
  }
  return errors
}
