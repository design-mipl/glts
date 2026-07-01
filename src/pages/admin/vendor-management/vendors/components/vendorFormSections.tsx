import type { Dispatch, ReactNode, SetStateAction } from 'react'
import { AdminFullPageFormFieldSpan } from '@/pages/admin/components/AdminFullPageFormShell'
import type { AdminFullPageFormSection } from '@/pages/admin/components/AdminFullPageFormShell'
import type { VendorFormData } from '@/shared/types/vendor'
import { VendorBankFields } from './VendorBankFields'
import { VendorBasicInfoFields } from './VendorBasicInfoFields'
import { VendorCommercialFields } from './VendorCommercialFields'
import { VendorContactFields } from './VendorContactFields'
import { VendorInternalNotesFields } from './VendorInternalNotesFields'
import { VendorTaxFields } from './VendorTaxFields'

interface BuildVendorFormSectionsOptions {
  formData: VendorFormData
  setFormData: Dispatch<SetStateAction<VendorFormData>>
  serviceMappingHeaderAction: ReactNode
  serviceMappingContent: ReactNode
}

export function buildVendorFormSections({
  formData,
  setFormData,
  serviceMappingHeaderAction,
  serviceMappingContent,
}: BuildVendorFormSectionsOptions): AdminFullPageFormSection[] {
  const onChange = (next: VendorFormData) => setFormData(next)

  return [
    {
      id: 'basic',
      title: 'Basic information',
      columns: 2,
      importance: 'primary',
      children: <VendorBasicInfoFields data={formData} onChange={onChange} />,
    },
    {
      id: 'contact',
      title: 'Contact information',
      columns: 2,
      importance: 'primary',
      children: <VendorContactFields data={formData} onChange={onChange} />,
    },
    {
      id: 'commercial',
      title: 'Commercial details',
      columns: 2,
      importance: 'secondary',
      children: <VendorCommercialFields data={formData} onChange={onChange} />,
    },
    {
      id: 'bank',
      title: 'Bank details',
      columns: 2,
      importance: 'secondary',
      children: <VendorBankFields data={formData} onChange={onChange} />,
    },
    {
      id: 'tax',
      title: 'Tax information',
      columns: 2,
      importance: 'primary',
      children: <VendorTaxFields data={formData} onChange={onChange} />,
    },
    {
      id: 'notes',
      title: 'Internal notes',
      columns: 2,
      importance: 'secondary',
      children: <VendorInternalNotesFields data={formData} onChange={onChange} />,
    },
    {
      id: 'services',
      title: 'Service & rate mapping',
      columns: 2,
      importance: 'primary',
      span: 2,
      headerAction: serviceMappingHeaderAction,
      children: <AdminFullPageFormFieldSpan>{serviceMappingContent}</AdminFullPageFormFieldSpan>,
    },
  ]
}
