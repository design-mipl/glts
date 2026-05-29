import { useEffect, useMemo, useState } from 'react'
import { Box, CircularProgress } from '@mui/material'
import { useNavigate, useSearchParams } from 'react-router-dom'
import type { BreadcrumbItem } from '@/design-system/UIComponents'
import { ConfirmDialog, EmptyState, useToast } from '@/design-system/UIComponents'
import { AdminStepperFormFooter } from '@/pages/admin/components/AdminStepperFormFooter'
import { AdminStepperFormShell } from '@/pages/admin/components/AdminStepperFormShell'
import { corporateAccountService } from '@/shared/services/corporateAccountService'
import { validateCorporateAccountStep } from '@/shared/utils/corporateAccountValidation'
import { buildCorporateAccountFormSteps } from '../config/corporateAccountFormSteps'
import { useCorporateAccountForm } from '../hooks/useCorporateAccountForm'

interface CorporateAccountFormStepperPageProps {
  mode: 'create' | 'edit'
  accountId?: string
  breadcrumbs: BreadcrumbItem[]
  cancelHref: string
}

export function CorporateAccountFormStepperPage({
  mode,
  accountId,
  breadcrumbs,
  cancelHref,
}: CorporateAccountFormStepperPageProps) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { showToast } = useToast()
  const [activeStep, setActiveStep] = useState(0)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(mode === 'edit')
  const [savedId, setSavedId] = useState<string | undefined>(accountId)
  const { formData, setFormData, dirty, loadFromAccount, hydrateFromAgreement } = useCorporateAccountForm()

  const steps = useMemo(
    () =>
      buildCorporateAccountFormSteps(formData, setFormData, {
        corporateAccountId: savedId,
        onSelectAgreement: hydrateFromAgreement,
      }),
    [formData, setFormData, savedId, hydrateFromAgreement],
  )

  useEffect(() => {
    if (mode === 'edit' && accountId) {
      loadFromAccount(accountId)
      setSavedId(accountId)
      setLoading(false)
      return
    }
    const agreementId = searchParams.get('agreementId')
    if (agreementId) hydrateFromAgreement(agreementId)
    setLoading(false)
  }, [mode, accountId, loadFromAccount, searchParams, hydrateFromAgreement])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={32} />
      </Box>
    )
  }

  if (mode === 'edit' && (!accountId || !corporateAccountService.getById(accountId))) {
    return (
      <EmptyState
        variant="no-data"
        title="Corporate account not found"
        action={{ label: 'Back to corporate accounts', onClick: () => navigate('/admin/customer-accounts/corporate-accounts') }}
      />
    )
  }

  const tryAdvance = (): boolean => {
    const issues = validateCorporateAccountStep(activeStep, formData)
    if (issues.length > 0) {
      showToast({ title: 'Complete required fields', description: issues.join('; '), variant: 'error' })
      return false
    }
    setActiveStep((s) => Math.min(steps.length - 1, s + 1))
    return true
  }

  const handleSaveDraft = () => {
    setSubmitting(true)
    const record = corporateAccountService.saveDraft(savedId, formData)
    setSavedId(record.id)
    setSubmitting(false)
    showToast({ title: 'Draft saved', variant: 'success' })
    if (mode === 'create') {
      navigate(`/admin/customer-accounts/corporate-accounts/${record.id}/edit?step=${activeStep}`)
    }
  }

  const handleActivate = () => {
    setSubmitting(true)
    const id = savedId ?? accountId
    const draft = corporateAccountService.saveDraft(id, formData)
    const result = corporateAccountService.activate(draft.id, formData)
    setSubmitting(false)
    if (!result.ok) {
      showToast({ title: 'Cannot activate', description: result.issues.join('; '), variant: 'error' })
      return
    }
    showToast({ title: 'Corporate account activated', variant: 'success' })
    navigate(`/admin/customer-accounts/corporate-accounts/${result.record.id}`)
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
            onSubmit={handleActivate}
            submitLabel="Activate account"
            loading={submitting}
          />
        }
      />
      <ConfirmDialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        title="Discard changes?"
        description="Unsaved corporate account details will be lost."
        confirmLabel="Discard"
        variant="destructive"
        onConfirm={() => navigate(cancelHref)}
      />
    </>
  )
}
