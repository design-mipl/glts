import { Box, CircularProgress, Stack, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { Badge, Button, EmptyState, Select, useToast } from '@/design-system/UIComponents'
import { AdminStepperFormShell } from '@/pages/admin/components/AdminStepperFormShell'
import { AdminFullPageFormFooter } from '@/pages/admin/components/AdminFullPageFormFooter'
import { useViewFormWorkspace } from '../hooks/useViewFormWorkspace'
import { CopyAssistFieldList } from '../components/view-form/CopyAssistField'
import { StepConfirmModal } from '../components/view-form/StepConfirmModal'
import { ViewFormSubmissionSection } from '../components/view-form/ViewFormSubmissionSection'
import { VerifyDocumentsTimeline } from '../components/verify/VerifyDocumentsTimeline'
import { buildFormAssistFieldsForStep } from '../utils/formAssistFieldBuilder'

export function MarineViewFormPage() {
  const { applicationId } = useParams<{ applicationId: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()

  const workspace = useViewFormWorkspace(applicationId)
  const {
    notFound,
    detail,
    rows,
    isBulk,
    selectedTravelerId,
    setSelectedTravelerId,
    selectedRow,
    steps,
    activeStepIndex,
    setActiveStep,
    currentStep,
    isLastStep,
    formContext,
    submission,
    updateSubmission,
    pickSubmissionFile,
    confirmModalOpen,
    requestStepContinue,
    confirmStepContinue,
    cancelStepConfirm,
    saveDraft,
    markAsSubmitted,
    externallySubmitted,
    timelineSteps,
  } = workspace

  const listingPath = '/admin/application-management/marine'
  const verifyPath = `/admin/application-management/marine/${applicationId}`

  if (!applicationId) {
    return (
      <EmptyState
        title="Application not found"
        description="No application reference was provided."
        action={{ label: 'Back to applications', onClick: () => navigate(listingPath) }}
      />
    )
  }

  if (notFound) {
    return (
      <EmptyState
        title="Application not found"
        description="This application may be a draft, non-marine, or unavailable for form assist."
        action={{ label: 'Back to applications', onClick: () => navigate(listingPath) }}
      />
    )
  }

  if (!detail) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={32} />
      </Box>
    )
  }

  if (!selectedRow || !formContext) {
    return (
      <EmptyState
        title="No traveler data yet"
        description="Applicant rows are still processing or unavailable. Try Verify Documents first, or check again once passport scan completes."
        action={{ label: 'Back to applications', onClick: () => navigate(listingPath) }}
      />
    )
  }

  const handleSaveDraft = () => {
    saveDraft()
    showToast({ title: 'Draft saved', description: 'Form assist progress saved.', variant: 'success' })
  }

  const handleMarkSubmitted = () => {
    const result = markAsSubmitted()
    if (!result.ok) {
      showToast({
        title: 'Cannot mark as submitted',
        description: result.errors.join(' · '),
        variant: 'error',
      })
      return
    }
    showToast({
      title: 'Marked as submitted',
      description: 'Status updated to Submitted · Embassy submission.',
      variant: 'success',
    })
    navigate(listingPath)
  }

  const reviewFields = buildFormAssistFieldsForStep('review', formContext)

  const stepperSteps = steps.map(step => ({
    id: step.id,
    label: step.label,
    review:
      step.id === 'review' ? (
        <Stack spacing={2}>
          <Stack spacing={0.5}>
            <Typography variant="subtitle2" fontWeight={700}>
              Review applicant data
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
              Copy values into the external embassy/VFS portal. GLTS does not submit forms automatically.
            </Typography>
          </Stack>
          <CopyAssistFieldList fields={reviewFields} />
          <ViewFormSubmissionSection
            submission={submission}
            onChange={updateSubmission}
            onPickFile={pickSubmissionFile}
          />
        </Stack>
      ) : undefined,
    sections:
      step.id !== 'review'
        ? [
            {
              id: step.id,
              title: step.label,
              description: 'Use the copy icon to paste each value into the external portal.',
              children: (
                <CopyAssistFieldList fields={buildFormAssistFieldsForStep(step.id, formContext)} />
              ),
            },
          ]
        : undefined,
  }))

  const footer = isLastStep ? (
    <AdminFullPageFormFooter
      onCancel={() => navigate(verifyPath)}
      cancelLabel="Back to verify"
      onDraft={externallySubmitted ? undefined : handleSaveDraft}
      draftLabel="Save draft"
      onSave={externallySubmitted ? undefined : handleMarkSubmitted}
      saveLabel="Mark as submitted"
      disabled={externallySubmitted}
    />
  ) : (
    <Stack direction="row" spacing={1} justifyContent="flex-end" flexWrap="wrap" useFlexGap>
      <Button
        label="Back"
        variant="outlined"
        color="secondary"
        disabled={activeStepIndex === 0}
        onClick={() => setActiveStep(Math.max(0, activeStepIndex - 1))}
        sx={{ width: { xs: '100%', sm: 'auto' } }}
      />
      <Button
        label="Continue"
        variant="contained"
        onClick={requestStepContinue}
        sx={{ width: { xs: '100%', sm: 'auto' } }}
      />
    </Stack>
  )

  return (
    <>
      <Stack spacing={2} sx={{ mb: 2 }}>
        {isBulk && rows.length > 1 ? (
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
            <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13, minWidth: 80 }}>
              Traveler
            </Typography>
            <Select
              value={selectedTravelerId ?? ''}
              onChange={v => setSelectedTravelerId(String(v))}
              options={rows.map(r => ({
                value: r.id,
                label: `${r.travelerName} · ${r.passportNo}`,
              }))}
              size="sm"
              sx={{ minWidth: 280 }}
            />
          </Stack>
        ) : null}

        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
            {selectedRow.travelerName} · {selectedRow.passportNo}
          </Typography>
          {externallySubmitted ? (
            <Badge label="Externally submitted" color="success" size="sm" />
          ) : (
            <Badge label={currentStep?.label ?? 'In progress'} color="info" size="sm" />
          )}
        </Stack>

        <VerifyDocumentsTimeline steps={timelineSteps} multiTraveler={rows.length > 1} />
      </Stack>

      <AdminStepperFormShell
        breadcrumbs={[
          { label: 'Application Management', href: listingPath },
          { label: 'View Form' },
        ]}
        steps={stepperSteps}
        activeStep={activeStepIndex}
        onActiveStepChange={setActiveStep}
        onStepClick={index => {
          if (index <= activeStepIndex) setActiveStep(index)
        }}
        footer={footer}
      />

      <StepConfirmModal
        open={confirmModalOpen}
        onClose={cancelStepConfirm}
        onConfirm={confirmStepContinue}
      />
    </>
  )
}
