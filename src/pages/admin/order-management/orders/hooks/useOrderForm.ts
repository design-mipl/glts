import { useMemo, useState } from 'react'
import type { OrderFormData } from '@/shared/types/order'

export const INITIAL_ORDER_FORM: OrderFormData = {
  customer: {
    companyOrCustomerName: '',
    customerType: 'retail',
    contactPersonName: '',
    contactNumber: '',
    emailAddress: '',
    alternateContactNumber: '',
    companyWebsite: '',
    companyAddress: '',
  },
  lineItems: [],
  notes: '',
  attachments: [],
  status: 'draft',
}

export function useOrderForm(initialData?: OrderFormData) {
  const [formData, setFormData] = useState<OrderFormData>(initialData ?? INITIAL_ORDER_FORM)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const setFieldError = (key: string, message?: string) => {
    setErrors((prev) => {
      const next = { ...prev }
      if (message) next[key] = message
      else delete next[key]
      return next
    })
  }

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors])

  const validate = () => {
    const next: Record<string, string> = {}
    if (!formData.customer.companyOrCustomerName.trim()) next.companyOrCustomerName = 'Customer name is required'
    if (!formData.customer.contactPersonName.trim()) next.contactPersonName = 'Contact person is required'
    if (!formData.customer.contactNumber.trim()) next.contactNumber = 'Mobile number is required'
    if (!formData.customer.emailAddress.trim()) next.emailAddress = 'Email is required'
    if (formData.lineItems.length === 0) {
      next.lineItems = 'Add at least one service line item'
    } else if (
      formData.lineItems.some((line) => !line.serviceMasterId || !line.vendorId || line.quantity <= 0)
    ) {
      next.lineItems = 'Each line item requires a service, vendor, and quantity greater than zero'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const reset = () => {
    setFormData(initialData ?? INITIAL_ORDER_FORM)
    setErrors({})
  }

  return {
    formData,
    setFormData,
    errors,
    setFieldError,
    isValid,
    validate,
    reset,
  }
}
