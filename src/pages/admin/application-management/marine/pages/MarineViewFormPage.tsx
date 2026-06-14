import { useMemo } from 'react'
import { Box, CircularProgress, Divider, Stack, Typography } from '@mui/material'
import { useParams } from 'react-router-dom'
import { useAppNavigate } from '@/shared/hooks/useAppNavigate'
import { Badge, Button, EmptyState, Select, useToast } from '@/design-system/UIComponents'
import { AdminRecordPageChrome } from '@/pages/admin/components/AdminRecordPageChrome'
import { AdminWorkspaceShell } from '@/pages/admin/components/AdminWorkspaceShell'
import { AdminStepperFormFooter } from '@/pages/admin/components/AdminStepperFormFooter'
import { useViewFormWorkspace } from '../hooks/useViewFormWorkspace'
import { CopyAssistFieldSections } from '../components/view-form/CopyAssistField'
import { ViewFormAssistHeaderSection } from '../components/view-form/ViewFormAssistHeaderSection'
import { ViewFormSubmissionSection } from '../components/view-form/ViewFormSubmissionSection'
import { ViewFormDocumentVault } from '../components/view-form/ViewFormDocumentVault'
import { VerifyDocumentsTimeline } from '../components/verify/VerifyDocumentsTimeline'
import { buildFormAssistFieldSectionsForStep } from '../utils/formAssistFieldBuilder'
import { buildOverviewFromDetail } from '../utils/verifyDocumentsUtils'

export function MarineViewFormPage() {
  const { applicationId } = useParams<{ applicationId: string }>()
  const navigate = useAppNavigate()
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
    requestStepContinue,
    saveDraft,
    markAsSubmitted,
    externallySubmitted,
    timelineSteps,
    completedStepIds,
  } = workspace

  const listingPath = '/admin/application-management/marine'
  const verifyPath = `/admin/application-management/marine/${applicationId}`

  const overview = useMemo(
    () =>
      applicationId && detail
        ? buildOverviewFromDetail(applicationId, isBulk, rows, detail.application)
        : null,
    [applicationId, detail, isBulk, rows],
  )

  const sectionNav = useMemo(
    () =>
      steps.map(step => ({
        id: step.id,
        label: step.label,
        complete: completedStepIds.includes(step.id),
      })),
    [steps, completedStepIds],
  )

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

  if (!selectedRow || !formContext || !currentStep) {
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

  const goToStep = (stepId: string) => {
    const index = steps.findIndex(step => step.id === stepId)
    if (index < 0) return
    setActiveStep(index)
  }

  const renderStepContent = () => {
    if (currentStep.id === 'submission') {
      return (
        <ViewFormSubmissionSection
          submission={submission}
          onChange={updateSubmission}
          onPickFile={pickSubmissionFile}
        />
      )
    }

    return (
      <CopyAssistFieldSections
        sections={buildFormAssistFieldSectionsForStep(currentStep.id, formContext)}
      />
    )
  }

  const headerActions = (
    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
      {isBulk && rows.length > 1 ? (
        <Select
          value={selectedTravelerId ?? ''}
          onChange={v => setSelectedTravelerId(String(v))}
          options={rows.map(r => ({
            value: r.id,
            label: `${r.travelerName} · ${r.passportNo}`,
          }))}
          size="sm"
          sx={{ minWidth: 240 }}
        />
      ) : null}
      {externallySubmitted ? (
        <Badge label="Externally submitted" color="success" size="sm" />
      ) : (
        <Badge label={currentStep.label} color="info" size="sm" />
      )}
      <Button label="Back to verify" variant="neutral" onClick={() => navigate(verifyPath)} />
    </Stack>
  )

  return (
      <AdminRecordPageChrome
        breadcrumbs={[
          { label: 'Application Management', href: listingPath },
          { label: 'View Form' },
        ]}
      >
        <Stack spacing={2}>
          {overview ? (
            <ViewFormAssistHeaderSection
              overview={overview}
              description={`${selectedRow.travelerName} · ${selectedRow.passportNo}${
                detail.application?.jurisdiction ? ` · ${detail.application.jurisdiction}` : ''
              }`}
              headerActions={headerActions}
            />
          ) : null}

          <VerifyDocumentsTimeline steps={timelineSteps} multiTraveler={rows.length > 1} />

          <ViewFormDocumentVault
            applicationId={applicationId}
            selectedRow={selectedRow}
            detail={detail}
            submission={submission}
          />

          <AdminWorkspaceShell
            hidePageChrome
            breadcrumbs={[]}
            title=""
            showTitleCard={false}
            navTitle="Steps"
            sections={sectionNav}
            activeSectionId={currentStep.id}
            onSectionClick={goToStep}
            centerPanel={
              <Stack spacing={3}>
                <Box sx={{ px: 0.5 }}>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ fontSize: 15 }}>
                    {currentStep.label}
                  </Typography>
                </Box>
                <Divider />
                <Box sx={{ px: 0.5, pt: 0.5 }}>{renderStepContent()}</Box>
              </Stack>
            }
            footer={
              <AdminStepperFormFooter
                activeStep={activeStepIndex}
                isLastStep={isLastStep}
                onCancel={() => navigate(verifyPath)}
                cancelLabel="Back to verify"
                onDraft={externallySubmitted ? undefined : handleSaveDraft}
                draftLabel="Save draft"
                onBack={() => setActiveStep(Math.max(0, activeStepIndex - 1))}
                onNext={requestStepContinue}
                nextLabel="Continue"
                onSubmit={externallySubmitted ? undefined : handleMarkSubmitted}
                submitLabel="Mark as submitted"
                disabled={externallySubmitted}
              />
            }
          />
        </Stack>
      </AdminRecordPageChrome>
  )
}
