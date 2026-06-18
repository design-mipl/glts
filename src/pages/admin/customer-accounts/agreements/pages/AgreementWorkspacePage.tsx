import { useEffect, useMemo, useState } from 'react'
import { Box, CircularProgress, Divider, Stack, Typography } from '@mui/material'
import { useNavigate, useSearchParams } from 'react-router-dom'
import type { BreadcrumbItem } from '@/design-system/UIComponents'
import { ConfirmDialog, EmptyState, useToast } from '@/design-system/UIComponents'
import { AdminStepperFormFooter } from '@/pages/admin/components/AdminStepperFormFooter'
import { commercialAgreementService } from '@/shared/services/commercialAgreementService'
import type { AgreementSectionId } from '@/shared/utils/commercialAgreementValidation'
import { useAgreementForm } from '../hooks/useAgreementForm'
import { AgreementApprovalSection } from '../components/workspace/AgreementApprovalSection'
import { AgreementBillingConfigSection } from '../components/workspace/AgreementBillingConfigSection'
import { AgreementCompanyInformationSection } from '../components/workspace/AgreementCompanyInformationSection'
import { AgreementCustomerSourceSection } from '../components/workspace/AgreementCustomerSourceSection'
import { AgreementEntitiesTable } from '../components/workspace/AgreementEntitiesTable'
import { AgreementOnboardingDocumentsSection } from '../components/workspace/AgreementOnboardingDocumentsSection'
import { AgreementPricingMatrixTable } from '../components/workspace/AgreementPricingMatrixTable'
import { AgreementTaxConfigSection } from '../components/workspace/AgreementTaxConfigSection'
import { AgreementWorkspaceShell } from '../components/workspace/AgreementWorkspaceShell'
import { agreementStatusLabel } from '../config/agreementStatusConfig'

const WORKSPACE_SECTIONS: { id: AgreementSectionId; navId: string; label: string; description: string }[] = [
  { id: 'customerSource', navId: 'section-customer-source', label: 'Customer source', description: 'Quotation, existing customer, or new customer' },
  { id: 'companyInfo', navId: 'section-company-info', label: 'Company information', description: 'Company profile' },
  { id: 'entities', navId: 'section-entities', label: 'Entities', description: 'Operational billing entities' },
  { id: 'pricing', navId: 'section-pricing', label: 'Pricing matrix', description: 'Country, visa, and service pricing' },
  { id: 'billing', navId: 'section-billing', label: 'Billing configuration', description: 'Advance, credit, or mixed billing rules' },
  { id: 'tax', navId: 'section-tax', label: 'Tax configuration', description: 'GST and TDS settings' },
  { id: 'documents', navId: 'section-documents', label: 'Onboarding documents', description: 'Finance contacts and document uploads' },
  { id: 'approval', navId: 'section-approval', label: 'Approval & activation', description: 'Review summary and submit for approval' },
]

interface AgreementWorkspacePageProps {
  mode: 'create' | 'edit'
  agreementId?: string
  breadcrumbs: BreadcrumbItem[]
  cancelHref: string
}

export function AgreementWorkspacePage({
  mode,
  agreementId,
  breadcrumbs,
  cancelHref,
}: AgreementWorkspacePageProps) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(mode === 'edit')
  const [cancelOpen, setCancelOpen] = useState(false)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [savedId, setSavedId] = useState<string | undefined>(agreementId)
  const [activeStep, setActiveStep] = useState(0)
  const [recordStatus, setRecordStatus] = useState<string>('draft')
  const [agreementDisplayId, setAgreementDisplayId] = useState<string>()

  const {
    formData,
    setFormData,
    dirty,
    errors,
    loadFromAgreement,
    validate,
    validateSection,
    touchSection,
    clearFieldError,
    hydrateFromQuotation,
    hydrateFromExistingCustomer,
    addEntity,
    updateEntity,
    removeEntity,
    sectionComplete,
  } = useAgreementForm()

  const activeSection = WORKSPACE_SECTIONS[activeStep]
  const isLastStep = activeStep === WORKSPACE_SECTIONS.length - 1

  useEffect(() => {
    if (mode !== 'edit' || !agreementId) {
      setLoading(false)
      return
    }
    const agreement = commercialAgreementService.getById(agreementId)
    if (agreement) {
      loadFromAgreement(agreementId)
      setSavedId(agreementId)
      setRecordStatus(agreement.status)
      setAgreementDisplayId(agreement.agreementId)
    }
    setLoading(false)
  }, [mode, agreementId, loadFromAgreement])

  useEffect(() => {
    if (mode !== 'create') return
    const quotationId = searchParams.get('quotationId')
    if (quotationId) {
      hydrateFromQuotation(quotationId)
    }
  }, [mode, searchParams, hydrateFromQuotation])

  const sectionNav = useMemo(
    () =>
      WORKSPACE_SECTIONS.map((section) => ({
        id: section.navId,
        label: section.label,
        complete: sectionComplete(section.id),
      })),
    [sectionComplete],
  )

  const goToStep = (step: number) => {
    const clamped = Math.max(0, Math.min(WORKSPACE_SECTIONS.length - 1, step))
    setActiveStep(clamped)
  }

  const goToSectionNav = (navId: string) => {
    const index = WORKSPACE_SECTIONS.findIndex((section) => section.navId === navId)
    if (index >= 0) goToStep(index)
  }

  const tryAdvance = (): boolean => {
    touchSection(activeSection.id)
    const ok = validateSection(activeSection.id)
    if (!ok) {
      showToast({
        title: 'Complete required fields',
        description: 'Fix validation errors in this section before continuing.',
        variant: 'error',
      })
      return false
    }
    goToStep(activeStep + 1)
    return true
  }

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

  const handleSaveDraft = () => {
    setSubmitting(true)
    const record = commercialAgreementService.saveDraft(savedId, formData)
    setSavedId(record.id)
    setAgreementDisplayId(record.agreementId)
    setRecordStatus(record.status)
    setSubmitting(false)
    showToast({ title: 'Draft saved', variant: 'success' })
    if (mode === 'create') {
      navigate(`/admin/customer-accounts/agreements/${record.id}/edit`, { replace: true })
    }
  }

  const handleSubmit = () => {
    if (!validate()) {
      showToast({ title: 'Complete required fields', description: 'Fix validation errors before submitting.', variant: 'error' })
      return
    }
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
    setRecordStatus(record.status)
    showToast({ title: 'Agreement submitted', variant: 'success' })
    navigate(`/admin/customer-accounts/agreements/${record.id}`)
  }

  const handleApprove = () => {
    const id = savedId ?? agreementId
    if (!id) return
    const result = commercialAgreementService.approve(id)
    if (!result.ok) {
      showToast({ title: 'Cannot approve', description: result.issues.join('; '), variant: 'error' })
      return
    }
    setRecordStatus('approved')
    showToast({ title: 'Agreement approved', variant: 'success' })
    navigate(`/admin/customer-accounts/agreements/${id}`)
  }

  const handleReject = () => {
    const id = savedId ?? agreementId
    if (!id) return
    commercialAgreementService.reject(id, 'Rejected from workspace')
    setRecordStatus('rejected')
    setRejectOpen(false)
    showToast({ title: 'Agreement rejected', variant: 'info' })
    navigate(`/admin/customer-accounts/agreements/${id}`)
  }

  const handleCancel = () => {
    if (dirty) {
      setCancelOpen(true)
      return
    }
    navigate(cancelHref)
  }

  const statusLabel = agreementStatusLabel[recordStatus as keyof typeof agreementStatusLabel] ?? recordStatus

  const renderActiveSection = () => {
    switch (activeSection.id) {
      case 'customerSource':
        return (
          <AgreementCustomerSourceSection
            data={formData}
            errors={errors}
            onChange={setFormData}
            onSelectQuotation={hydrateFromQuotation}
            onSelectExisting={hydrateFromExistingCustomer}
            onClearError={clearFieldError}
          />
        )
      case 'companyInfo':
        return (
          <AgreementCompanyInformationSection
            data={formData}
            errors={errors}
            onChange={setFormData}
            onClearError={clearFieldError}
          />
        )
      case 'entities':
        return (
          <AgreementEntitiesTable
            data={formData}
            errors={errors}
            onChange={setFormData}
            onAddEntity={addEntity}
            onUpdateEntity={updateEntity}
            onRemoveEntity={removeEntity}
          />
        )
      case 'pricing':
        return <AgreementPricingMatrixTable data={formData} errors={errors} onChange={setFormData} />
      case 'billing':
        return <AgreementBillingConfigSection data={formData} errors={errors} onChange={setFormData} />
      case 'tax':
        return <AgreementTaxConfigSection data={formData} errors={errors} onChange={setFormData} />
      case 'documents':
        return (
          <AgreementOnboardingDocumentsSection
            data={formData}
            errors={errors}
            onChange={setFormData}
            onClearError={clearFieldError}
          />
        )
      case 'approval':
        return (
          <AgreementApprovalSection
            data={formData}
            agreementRecordId={savedId ?? agreementId}
            agreementDisplayId={agreementDisplayId}
            status={recordStatus}
            statusLabel={statusLabel}
            onSubmit={recordStatus === 'draft' ? handleSubmit : undefined}
            onApprove={recordStatus === 'submitted' ? handleApprove : undefined}
            onReject={recordStatus === 'submitted' ? () => setRejectOpen(true) : undefined}
          />
        )
      default:
        return null
    }
  }

  return (
    <>
      <AgreementWorkspaceShell
        breadcrumbs={breadcrumbs}
        title={mode === 'create' ? 'Create agreement' : 'Edit agreement'}
        description="Corporate onboarding, finance configuration, and commercial agreement workspace."
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
            onSubmit={recordStatus === 'draft' ? handleSubmit : undefined}
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

      <ConfirmDialog
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        title="Reject agreement?"
        description="This agreement will be marked as rejected."
        confirmLabel="Reject"
        variant="destructive"
        onConfirm={handleReject}
      />
    </>
  )
}
