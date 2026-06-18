import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/design-system/UIComponents'
import {
  AdminFullPageFormFooter,
  AdminFullPageFormHeaderSave,
} from '@/pages/admin/components/AdminFullPageFormFooter'
import { AdminFullPageFormShell } from '@/pages/admin/components/AdminFullPageFormShell'
import { quotationService } from '@/shared/services/quotationService'
import { buildQuotationFormSections } from '../components/QuotationFormSections'
import { useQuotationForm } from '../hooks/useQuotationForm'

const breadcrumbs = [
  { label: 'Customer & Accounts', href: '/admin/customer-accounts/quotations' },
  { label: 'Quotation Management', href: '/admin/customer-accounts/quotations' },
  { label: 'Create Quotation' },
]

const ACTOR = 'Admin User'

export function CreateQuotationPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { formData, setFormData, errors, validate } = useQuotationForm()
  const [loading, setLoading] = useState(false)
  const addPricingHandlerRef = useRef<(() => void) | null>(null)

  const save = async (submitAfter = false) => {
    if (submitAfter && !validate()) return
    setLoading(true)
    const record = quotationService.saveForm(undefined, formData, ACTOR)
    if (submitAfter) {
      const result = quotationService.submitForApproval(record.id, ACTOR)
      if (!result.ok) {
        showToast({ title: 'Cannot submit', description: result.issues?.join('; '), variant: 'error' })
        setLoading(false)
        return
      }
      showToast({ title: 'Submitted for approval', variant: 'success' })
      navigate(`/admin/customer-accounts/quotations/${record.id}`)
    } else {
      showToast({ title: 'Draft saved', variant: 'success' })
      navigate(`/admin/customer-accounts/quotations/${record.id}`)
    }
    setLoading(false)
  }

  return (
    <AdminFullPageFormShell
      breadcrumbs={breadcrumbs}
      title="Create Quotation"
      headerActions={<AdminFullPageFormHeaderSave loading={loading} onClick={() => void save(false)} />}
      sections={buildQuotationFormSections({ formData, setFormData, errors, addPricingHandlerRef })}
      footer={
        <AdminFullPageFormFooter
          loading={loading}
          onCancel={() => navigate('/admin/customer-accounts/quotations')}
          onDraft={() => void save(false)}
          onSave={() => void save(true)}
          saveLabel="Submit for Approval"
        />
      }
    />
  )
}
