import { useCallback, useMemo, useState } from 'react'
import type {
  OrganizationLocationMaster,
  OrganizationLocationMasterFormData,
} from '@/shared/types/organizationLocationMaster'
import { isValidEmail, isValidMobile } from '@/shared/utils/contactValidation'

export const INITIAL_ORGANIZATION_LOCATION_FORM: OrganizationLocationMasterFormData = {
  name: '',
  organizationType: 'glts_branch',
  contactPerson: '',
  mobileNumber: '',
  emailAddress: '',
  address: '',
  countryId: '',
  country: '',
  state: '',
  city: '',
  pincode: '',
}

export function organizationLocationToFormData(
  row: OrganizationLocationMaster,
): OrganizationLocationMasterFormData {
  return {
    name: row.name,
    organizationType: row.organizationType,
    contactPerson: row.contactPerson,
    mobileNumber: row.mobileNumber,
    emailAddress: row.emailAddress,
    address: row.address,
    countryId: row.countryId,
    country: row.country,
    state: row.state,
    city: row.city,
    pincode: row.pincode,
  }
}

export function useOrganizationLocationForm(initialData?: OrganizationLocationMasterFormData) {
  const [formData, setFormData] = useState<OrganizationLocationMasterFormData>(
    initialData ?? INITIAL_ORGANIZATION_LOCATION_FORM,
  )
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors])

  const validate = () => {
    const next: Record<string, string> = {}
    if (!formData.name.trim()) next.name = 'Name is required'
    if (!formData.organizationType) next.organizationType = 'Organization type is required'
    if (!formData.contactPerson.trim()) next.contactPerson = 'Contact person is required'
    if (!formData.mobileNumber.trim()) next.mobileNumber = 'Mobile number is required'
    else if (!isValidMobile(formData.mobileNumber)) next.mobileNumber = 'Enter a valid mobile number'
    if (!formData.emailAddress.trim()) next.emailAddress = 'Email is required'
    else if (!isValidEmail(formData.emailAddress)) next.emailAddress = 'Enter a valid email address'
    if (!formData.address.trim()) next.address = 'Address is required'
    if (!formData.country.trim()) next.country = 'Country is required'
    if (!formData.state.trim()) next.state = 'State is required'
    if (!formData.city.trim()) next.city = 'City is required'
    if (!formData.pincode.trim()) next.pincode = 'Pincode is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const reset = useCallback((data?: OrganizationLocationMasterFormData) => {
    setFormData(data ?? INITIAL_ORGANIZATION_LOCATION_FORM)
    setErrors({})
  }, [])

  return { formData, setFormData, errors, isValid, validate, reset }
}
