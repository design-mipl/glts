import { useEffect, useMemo, useState } from 'react'
import { Box, CircularProgress } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { ConfirmDialog, EmptyState, useToast } from '@/design-system/UIComponents'
import { AdminStepperFormFooter } from '@/pages/admin/components/AdminStepperFormFooter'
import { AdminStepperFormShell } from '@/pages/admin/components/AdminStepperFormShell'
import type { BreadcrumbItem } from '@/design-system/UIComponents'
import { countryMasterAdminService } from '@/shared/services/countryMasterAdminService'
import { buildCountryFormSteps } from '../config/countryFormSteps'
import { useCountryForm } from '../hooks/useCountryForm'

interface CountryFormStepperPageProps {
  mode: 'create' | 'edit'
  countryId?: string
  initialStep?: number
  breadcrumbs: BreadcrumbItem[]
  cancelHref: string
}

export function CountryFormStepperPage({
  mode,
  countryId,
  initialStep = 0,
  breadcrumbs,
  cancelHref,
}: CountryFormStepperPageProps) {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [activeStep, setActiveStep] = useState(
    Number.isFinite(initialStep) ? Math.min(4, Math.max(0, initialStep)) : 0,
  )
  const [cancelOpen, setCancelOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(mode === 'edit')
  const { formData, setFormData, dirty, loadFromMaster } = useCountryForm()

  const steps = useMemo(
    () => buildCountryFormSteps(formData, setFormData),
    [formData, setFormData],
  )

  useEffect(() => {
    if (mode !== 'edit' || !countryId) {
      setLoading(false)
      return
    }
    const master = countryMasterAdminService.getById(countryId)
    if (master) loadFromMaster(master)
    setLoading(false)
  }, [mode, countryId, loadFromMaster])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={32} />
      </Box>
    )
  }

  if (mode === 'edit' && (!countryId || !countryMasterAdminService.getById(countryId))) {
    return (
      <EmptyState
        variant="no-data"
        title="Country not found"
        action={{
          label: 'Back to Country Master',
          onClick: () => navigate('/admin/masters/country'),
        }}
      />
    )
  }

  const tryAdvance = (): boolean => {
    setActiveStep((s) => Math.min(steps.length - 1, s + 1))
    return true
  }

  const handleSaveDraft = () => {
    setSubmitting(true)
    const record = countryMasterAdminService.saveDraft(countryId, formData)
    setSubmitting(false)
    showToast({ title: 'Draft saved', variant: 'success' })
    if (mode === 'create') {
      navigate(`/admin/masters/country/${record.id}/edit?step=${activeStep}`)
    }
  }

  const handleSubmit = () => {
    setSubmitting(true)
    const record = countryMasterAdminService.submit(countryId, formData)
    setSubmitting(false)
    const firstSegment = countryMasterAdminService.getEnabledSegments(record)[0] ?? 'retail'
    showToast({
      title: mode === 'create' ? 'Country created' : 'Country updated',
      variant: 'success',
    })
    navigate(`/admin/masters/country/${record.id}?segment=${firstSegment}`)
  }

  const handleCancel = () => {
    if (dirty) {
      setCancelOpen(true)
      return
    }
    navigate(cancelHref)
  }

  return (
    <>
      <AdminStepperFormShell
        breadcrumbs={breadcrumbs}
        steps={steps}
        activeStep={activeStep}
        onActiveStepChange={setActiveStep}
        onStepClick={(index) => {
          if (index <= activeStep) setActiveStep(index)
        }}
        footer={
          <AdminStepperFormFooter
            activeStep={activeStep}
            isLastStep={activeStep === steps.length - 1}
            onCancel={handleCancel}
            onDraft={handleSaveDraft}
            onBack={() => setActiveStep((s) => Math.max(0, s - 1))}
            onNext={tryAdvance}
            onSubmit={handleSubmit}
            loading={submitting}
          />
        }
      />
      <ConfirmDialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        title="Discard changes?"
        description="Unsaved country configuration will be lost."
        confirmLabel="Discard"
        variant="destructive"
        onConfirm={() => navigate(cancelHref)}
      />
    </>
  )
}
