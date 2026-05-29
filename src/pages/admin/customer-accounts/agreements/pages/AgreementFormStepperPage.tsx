import { useEffect, useMemo, useState } from 'react'
import { Box, CircularProgress } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import type { BreadcrumbItem } from '@/design-system/UIComponents'
import { ConfirmDialog, EmptyState, useToast } from '@/design-system/UIComponents'
import { AdminStepperFormFooter } from '@/pages/admin/components/AdminStepperFormFooter'
import { AdminStepperFormShell } from '@/pages/admin/components/AdminStepperFormShell'
import { commercialAgreementService } from '@/shared/services/commercialAgreementService'
import { validateAgreementStep } from '@/shared/utils/commercialAgreementValidation'
import { buildAgreementFormSteps } from '../config/agreementFormSteps'
import { useAgreementForm } from '../hooks/useAgreementForm'

interface AgreementFormStepperPageProps {
  mode: 'create' | 'edit'
  agreementId?: string
  breadcrumbs: BreadcrumbItem[]
  cancelHref: string
}

export function AgreementFormStepperPage({
  mode,
  agreementId,
  breadcrumbs,
  cancelHref,
}: AgreementFormStepperPageProps) {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [activeStep, setActiveStep] = useState(0)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(mode === 'edit')
  const [savedId, setSavedId] = useState<string | undefined>(agreementId)
  const { formData, setFormData, dirty, loadFromAgreement, hydrateCompanyFromSelection } = useAgreementForm()

  const steps = useMemo(
    () =>
      buildAgreementFormSteps(formData, setFormData, {
        onSelectExisting: hydrateCompanyFromSelection,
      }),
    [formData, setFormData, hydrateCompanyFromSelection],
  )

  useEffect(() => {
    if (mode !== 'edit' || !agreementId) {
      setLoading(false)
      return
    }
    loadFromAgreement(agreementId)
    setSavedId(agreementId)
    setLoading(false)
  }, [mode, agreementId, loadFromAgreement])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={32} />
      </Box>
    )
  }

  if (mode === 'edit' && (!agreementId || !commercialAgreementService.getById(agreementId))) {
    return (
      <EmptyState
        variant="no-data"
        title="Agreement not found"
        action={{ label: 'Back to agreements', onClick: () => navigate('/admin/customer-accounts/agreements') }}
      />
    )
  }

  const tryAdvance = (): boolean => {
    const issues = validateAgreementStep(activeStep, formData)
    if (issues.length > 0) {
      showToast({ title: 'Complete required fields', description: issues.join('; '), variant: 'error' })
      return false
    }
    setActiveStep((s) => Math.min(steps.length - 1, s + 1))
    return true
  }

  const handleSaveDraft = () => {
    setSubmitting(true)
    const record = commercialAgreementService.saveDraft(savedId, formData)
    setSavedId(record.id)
    setSubmitting(false)
    showToast({ title: 'Draft saved', variant: 'success' })
    if (mode === 'create') {
      navigate(`/admin/customer-accounts/agreements/${record.id}/edit?step=${activeStep}`)
    }
  }

  const handleSubmit = () => {
    const validation = commercialAgreementService.validateForApproval(formData)
    if (!validation.ok) {
      showToast({ title: 'Cannot submit', description: validation.issues.join('; '), variant: 'error' })
      return
    }
    setSubmitting(true)
    const id = savedId ?? agreementId
    const draft = commercialAgreementService.saveDraft(id, formData)
    const record = commercialAgreementService.submit(draft.id, formData)
    setSubmitting(false)
    showToast({ title: 'Agreement submitted', variant: 'success' })
    navigate(`/admin/customer-accounts/agreements/${record.id}`)
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
            submitLabel="Submit agreement"
            loading={submitting}
          />
        }
      />
      <ConfirmDialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        title="Discard changes?"
        description="Unsaved agreement details will be lost."
        confirmLabel="Discard"
        variant="destructive"
        onConfirm={() => navigate(cancelHref)}
      />
    </>
  )
}
