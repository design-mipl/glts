import { useEffect, useMemo, useState } from 'react'
import { Box, CircularProgress, Divider, Stack, Typography } from '@mui/material'
import { useNavigate, useSearchParams } from 'react-router-dom'
import type { BreadcrumbItem } from '@/design-system/UIComponents'
import { ConfirmDialog, EmptyState, useToast } from '@/design-system/UIComponents'
import { AdminFormSectionsLayout } from '@/pages/admin/components/AdminFormSectionsLayout'
import { AdminStepperFormFooter } from '@/pages/admin/components/AdminStepperFormFooter'
import { corporateAccountService } from '@/shared/services/corporateAccountService'
import {
  corporateAccountSectionComplete,
  validateCorporateAccountStep,
} from '@/shared/utils/corporateAccountValidation'
import { CorporateAccountWorkspaceShell } from '../components/CorporateAccountWorkspaceShell'
import {
  buildCorporateAccountFormSteps,
  CORPORATE_ACCOUNT_WORKSPACE_SECTIONS,
} from '../config/corporateAccountFormSteps'
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

  const activeSection = CORPORATE_ACCOUNT_WORKSPACE_SECTIONS[activeStep]
  const isLastStep = activeStep === CORPORATE_ACCOUNT_WORKSPACE_SECTIONS.length - 1

  const sectionNav = useMemo(
    () =>
      CORPORATE_ACCOUNT_WORKSPACE_SECTIONS.map((section) => ({
        id: section.navId,
        label: section.label,
        complete: corporateAccountSectionComplete(section.id, formData),
      })),
    [formData],
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

  useEffect(() => {
    const stepParam = searchParams.get('step')
    if (!stepParam) return
    const step = Number.parseInt(stepParam, 10)
    if (Number.isNaN(step) || step < 0 || step >= CORPORATE_ACCOUNT_WORKSPACE_SECTIONS.length) return
    setActiveStep(step)
  }, [searchParams])

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

  const goToStep = (step: number) => {
    const clamped = Math.max(0, Math.min(CORPORATE_ACCOUNT_WORKSPACE_SECTIONS.length - 1, step))
    setActiveStep(clamped)
  }

  const goToSectionNav = (navId: string) => {
    const index = CORPORATE_ACCOUNT_WORKSPACE_SECTIONS.findIndex((section) => section.navId === navId)
    if (index >= 0) goToStep(index)
  }

  const tryAdvance = (): boolean => {
    const issues = validateCorporateAccountStep(activeStep, formData)
    if (issues.length > 0) {
      showToast({ title: 'Complete required fields', description: issues.join('; '), variant: 'error' })
      return false
    }
    goToStep(activeStep + 1)
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

  const currentStep = steps[activeStep]

  const renderActiveSection = () => {
    if (currentStep.review) return currentStep.review
    if (currentStep.sections) {
      return <AdminFormSectionsLayout sections={currentStep.sections} variant="page" />
    }
    if (currentStep.children != null) {
      return <Box sx={{ width: '100%' }}>{currentStep.children}</Box>
    }
    return null
  }

  return (
    <>
      <CorporateAccountWorkspaceShell
        breadcrumbs={breadcrumbs}
        title={mode === 'create' ? 'Create corporate account' : 'Edit corporate account'}
        description="Link an agreement ready for activation, configure portal access, and activate the corporate account."
        sections={sectionNav}
        activeSectionId={activeSection.navId}
        onSectionClick={goToSectionNav}
        centerPanel={
          <Stack spacing={3}>
            <Box sx={{ px: 0.5 }}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ fontSize: 15 }}>
                {activeSection.label}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, maxWidth: 560 }}>
                {activeSection.description}
              </Typography>
            </Box>
            <Divider />
            <Box sx={{ px: 0.5, pt: 0.5 }}>{renderActiveSection()}</Box>
          </Stack>
        }
        footer={
          <AdminStepperFormFooter
            activeStep={activeStep}
            isLastStep={isLastStep}
            onCancel={handleCancel}
            onDraft={handleSaveDraft}
            onBack={() => goToStep(activeStep - 1)}
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
