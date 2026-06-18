import { useEffect, useRef, useState } from 'react'
import { Box, CircularProgress } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { useToast } from '@/design-system/UIComponents'
import {
  AdminFullPageFormFooter,
  AdminFullPageFormHeaderSave,
} from '@/pages/admin/components/AdminFullPageFormFooter'
import { AdminFullPageFormShell } from '@/pages/admin/components/AdminFullPageFormShell'
import { quotationService } from '@/shared/services/quotationService'
import { getCurrentVersion } from '@/shared/utils/quotationValidation'
import { buildQuotationFormSections } from '../components/QuotationFormSections'
import { useQuotationForm } from '../hooks/useQuotationForm'

const ACTOR = 'Admin User'

export function EditQuotationPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { quotationId } = useParams<{ quotationId: string }>()
  const { formData, setFormData, errors, validate, loadFormData } = useQuotationForm()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [readOnlyPricing, setReadOnlyPricing] = useState(false)
  const addPricingHandlerRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    if (!quotationId) return
    const record = quotationService.getById(quotationId)
    if (!record) {
      navigate('/admin/customer-accounts/quotations')
      return
    }
    const version = getCurrentVersion(record)
    setReadOnlyPricing(version?.status !== 'draft')
    loadFormData(quotationService.recordToFormData(record))
    setLoading(false)
  }, [quotationId, loadFormData, navigate])

  const breadcrumbs = [
    { label: 'Customer & Accounts', href: '/admin/customer-accounts/quotations' },
    { label: 'Quotation Management', href: '/admin/customer-accounts/quotations' },
    { label: formData.customer.companyName || 'Edit Quotation' },
  ]

  const save = async (submitAfter = false) => {
    if (!quotationId) return
    if (submitAfter && !validate()) return
    setSaving(true)
    quotationService.saveForm(quotationId, formData, ACTOR)
    if (submitAfter) {
      const result = quotationService.submitForApproval(quotationId, ACTOR)
      if (!result.ok) {
        showToast({ title: 'Cannot submit', description: result.issues?.join('; '), variant: 'error' })
        setSaving(false)
        return
      }
      showToast({ title: 'Submitted for approval', variant: 'success' })
    } else {
      showToast({ title: 'Quotation saved', variant: 'success' })
    }
    navigate(`/admin/customer-accounts/quotations/${quotationId}`)
    setSaving(false)
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 240 }}>
        <CircularProgress size={32} />
      </Box>
    )
  }

  return (
    <AdminFullPageFormShell
      breadcrumbs={breadcrumbs}
      title="Edit Quotation"
      headerActions={<AdminFullPageFormHeaderSave loading={saving} onClick={() => void save(false)} />}
      sections={buildQuotationFormSections({ formData, setFormData, errors, readOnlyPricing, addPricingHandlerRef })}
      footer={
        <AdminFullPageFormFooter
          loading={saving}
          onCancel={() => navigate(`/admin/customer-accounts/quotations/${quotationId}`)}
          onDraft={() => void save(false)}
          onSave={() => void save(true)}
          saveLabel="Submit for Approval"
        />
      }
    />
  )
}
