import { useEffect, useMemo, useState } from 'react'
import { Box, CircularProgress } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import type { BreadcrumbItem } from '@/design-system/UIComponents'
import {
  ConfirmDialog,
  EmptyState,
  FormField,
  Input,
  Select,
  Tabs,
  useToast,
} from '@/design-system/UIComponents'
import { AdminFullPageFormFieldSpan, AdminFullPageFormShell } from '@/pages/admin/components/AdminFullPageFormShell'
import { AdminFullPageFormFooter } from '@/pages/admin/components/AdminFullPageFormFooter'
import { requirementMasterService } from '@/shared/services/requirementMasterService'
import type { RequirementMasterFormData } from '@/shared/types/requirementMaster'
import { masterStatusLabel } from '../../config/masterStatusConfig'
import { RequirementDocumentsTab } from '../components/RequirementDocumentsTab'
import { RequirementQuestionnaireTab } from '../components/RequirementQuestionnaireTab'
import { emptyRequirementForm } from '../hooks/useRequirementForm'
import { validateRequirementForm } from '../utils/requirementQuestionUtils'

const LISTING_PATH = '/admin/masters/requirements'
const WORKSPACE_TABS = [
  { value: 'questionnaire', label: 'Questionnaire' },
  { value: 'documents', label: 'Documents' },
] as const

interface RequirementFormPageProps {
  mode: 'create' | 'edit'
  requirementId?: string
}

export function RequirementFormPage({ mode, requirementId }: RequirementFormPageProps) {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [formData, setFormData] = useState<RequirementMasterFormData>(emptyRequirementForm)
  const [dirty, setDirty] = useState(false)
  const [loading, setLoading] = useState(mode === 'edit')
  const [submitting, setSubmitting] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<(typeof WORKSPACE_TABS)[number]['value']>('questionnaire')

  const patch = (next: RequirementMasterFormData) => {
    setFormData(next)
    setDirty(true)
  }

  useEffect(() => {
    if (mode !== 'edit' || !requirementId) {
      setLoading(false)
      return
    }
    const record = requirementMasterService.getById(requirementId)
    if (record) {
      setFormData(requirementMasterService.toFormData(record))
      setDirty(false)
    }
    setLoading(false)
  }, [mode, requirementId])

  const breadcrumbs: BreadcrumbItem[] = useMemo(
    () => [
      { label: 'Requirement Master', href: LISTING_PATH },
      { label: mode === 'create' ? 'Create pack' : 'Edit pack' },
    ],
    [mode],
  )

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={32} />
      </Box>
    )
  }

  if (mode === 'edit' && requirementId && !requirementMasterService.getById(requirementId)) {
    return (
      <EmptyState
        variant="no-data"
        title="Requirement pack not found"
        action={{ label: 'Back to listing', onClick: () => navigate(LISTING_PATH) }}
      />
    )
  }

  const handleCancel = () => {
    if (dirty) {
      setCancelOpen(true)
      return
    }
    navigate(LISTING_PATH)
  }

  const handleSave = () => {
    const issues = validateRequirementForm(formData)
    if (issues.length > 0) {
      setActiveTab('questionnaire')
      showToast({
        title: 'Complete required fields',
        description: issues[0],
        variant: 'error',
      })
      return
    }

    setSubmitting(true)
    try {
      if (mode === 'create') {
        requirementMasterService.create(formData)
        showToast({ title: 'Requirement pack created', variant: 'success' })
      } else if (requirementId) {
        requirementMasterService.update(requirementId, formData)
        showToast({ title: 'Requirement pack updated', variant: 'success' })
      }
      navigate(LISTING_PATH)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <AdminFullPageFormShell
        breadcrumbs={breadcrumbs}
        title={mode === 'create' ? 'Create requirement pack' : 'Edit requirement pack'}
        description="Temporary name — questionnaire plus documents from Document Master."
        footer={
          <AdminFullPageFormFooter
            onCancel={handleCancel}
            onSave={handleSave}
            saveLabel={mode === 'create' ? 'Submit' : 'Save changes'}
            loading={submitting}
          />
        }
        sections={[
          {
            id: 'basics',
            title: 'Pack details',
            importance: 'primary',
            columns: 2,
            children: (
              <>
                <FormField label="Name" required>
                  <Input
                    value={formData.name}
                    onChange={(value) => patch({ ...formData, name: value })}
                    placeholder="e.g. Schengen tourist intake"
                    size="sm"
                    fullWidth
                  />
                </FormField>
                <FormField label="Status" required>
                  <Select
                    value={formData.status}
                    onChange={(value) =>
                      patch({ ...formData, status: value as RequirementMasterFormData['status'] })
                    }
                    options={(Object.entries(masterStatusLabel) as [RequirementMasterFormData['status'], string][]).map(
                      ([value, label]) => ({ value, label }),
                    )}
                    size="sm"
                    fullWidth
                  />
                </FormField>
                <AdminFullPageFormFieldSpan>
                  <FormField label="Description" optional>
                    <Input
                      value={formData.description}
                      onChange={(value) => patch({ ...formData, description: value })}
                      placeholder="Optional summary for ops"
                      size="sm"
                      fullWidth
                    />
                  </FormField>
                </AdminFullPageFormFieldSpan>
              </>
            ),
          },
          {
            id: 'workspace',
            title: 'Configuration',
            importance: 'secondary',
            columns: 1,
            span: 2,
            children: (
              <Box>
                <Tabs
                  items={[...WORKSPACE_TABS]}
                  value={activeTab}
                  onChange={(value) => setActiveTab(value as typeof activeTab)}
                  variant="underline"
                  size="sm"
                />
                <Box sx={{ mt: 2, pb: 10 }}>
                  {activeTab === 'questionnaire' ? (
                    <RequirementQuestionnaireTab
                      questions={formData.questions}
                      onChange={(questions) => patch({ ...formData, questions })}
                    />
                  ) : (
                    <RequirementDocumentsTab
                      documents={formData.documents}
                      onChange={(documents) => patch({ ...formData, documents })}
                    />
                  )}
                </Box>
              </Box>
            ),
          },
        ]}
      />

      <ConfirmDialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onConfirm={() => navigate(LISTING_PATH)}
        title="Discard changes?"
        description="Unsaved questionnaire and document changes will be lost."
      />
    </>
  )
}
