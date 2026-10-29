import { orderStatusOptions } from './orderStatusConfig'

export const orderCustomerTypeOptions = [
  { label: 'All', value: '' },
  { label: 'Retail', value: 'retail' },
  { label: 'Corporate', value: 'corporate' },
  { label: 'Marine', value: 'marine' },
]

export const orderStatusFilterOptions = [{ label: 'All', value: '' }, ...orderStatusOptions]
