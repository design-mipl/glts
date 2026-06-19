import { useEffect, useState } from 'react'
import { Box, CircularProgress } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import type { BreadcrumbItem } from '@/design-system/UIComponents'
import { ConfirmDialog, EmptyState, useToast } from '@/design-system/UIComponents'
import { AdminFullPageFormFooter } from '@/pages/admin/components/AdminFullPageFormFooter'
import { AdminFullPageFormShell } from '@/pages/admin/components/AdminFullPageFormShell'
import { vendorService } from '@/shared/services/vendorService'
import { VendorBankFields } from '../components/VendorBankFields'
import { VendorBasicInfoFields } from '../components/VendorBasicInfoFields'
import { VendorCommercialFields } from '../components/VendorCommercialFields'
import { VendorServiceMappingSection } from '../components/VendorServiceMappingSection'
import { useVendorForm, validateVendorForm } from '../hooks/useVendorForm'

interface VendorFormPageProps {
  mode: 'create' | 'edit'
  vendorId?: string
  breadcrumbs: BreadcrumbItem[]
  cancelHref: string
}

export function VendorFormPage({ mode, vendorId, breadcrumbs, cancelHref }: VendorFormPageProps) {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { formData, setFormData, dirty, loadFromVendor } = useVendorForm()
  const [loading, setLoading] = useState(mode === 'edit')
  const [submitting, setSubmitting] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)

  useEffect(() => {
    if (mode === 'edit' && vendorId) {
      const ok = loadFromVendor(vendorId)
      setLoading(false)
      if (!ok) return
    } else {
      setLoading(false)
    }
  }, [mode, vendorId, loadFromVendor])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={32} />
      </Box>
    )
  }

  if (mode === 'edit' && vendorId && !vendorService.getById(vendorId)) {
    return (
      <EmptyState
        variant="no-data"
        title="Vendor not found"
        action={{ label: 'Back to vendors', onClick: () => navigate('/admin/vendor-management/vendors') }}
      />
    )
  }

  const handleCancel = () => {
    if (dirty) {
      setCancelOpen(true)
      return
    }
    navigate(cancelHref)
  }

  const handleSave = async () => {
    const issues = validateVendorForm(formData)
    if (issues.length > 0) {
      showToast({ title: 'Complete required fields', description: issues.join('; '), variant: 'error' })
      return
    }

    setSubmitting(true)
    try {
      if (mode === 'create') {
        const created = vendorService.create(formData)
        showToast({ title: 'Vendor created', variant: 'success' })
        navigate(`/admin/vendor-management/vendors/${created.id}`)
      } else if (vendorId) {
        vendorService.update(vendorId, formData)
        showToast({ title: 'Vendor updated', variant: 'success' })
        navigate(`/admin/vendor-management/vendors/${vendorId}`)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <AdminFullPageFormShell
        breadcrumbs={breadcrumbs}
        title={mode === 'create' ? 'Add vendor' : 'Edit vendor'}
        description="Basic information, commercial terms, bank details, and service rate mapping"
        footer={
          <AdminFullPageFormFooter
            onCancel={handleCancel}
            onSave={handleSave}
            saveLabel={mode === 'create' ? 'Create vendor' : 'Save changes'}
            loading={submitting}
          />
        }
        sections={[
          {
            id: 'basic',
            title: 'Basic information',
            columns: 1,
            importance: 'primary',
            children: <VendorBasicInfoFields data={formData} onChange={setFormData} />,
          },
          {
            id: 'commercial',
            title: 'Commercial details',
            columns: 1,
            importance: 'secondary',
            children: <VendorCommercialFields data={formData} onChange={setFormData} />,
          },
          {
            id: 'bank',
            title: 'Bank details',
            columns: 1,
            importance: 'secondary',
            children: <VendorBankFields data={formData} onChange={setFormData} />,
          },
          {
            id: 'services',
            title: 'Service & rate mapping',
            columns: 1,
            importance: 'primary',
            span: 2,
            children: <VendorServiceMappingSection data={formData} onChange={setFormData} />,
          },
        ]}
      />

      <ConfirmDialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onConfirm={() => navigate(cancelHref)}
        title="Discard changes?"
        description="Unsaved vendor details will be lost."
        confirmLabel="Discard"
        variant="destructive"
      />
    </>
  )
}
