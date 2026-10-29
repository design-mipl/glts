import { useEffect, useMemo, useState } from 'react'
import { Box, CircularProgress } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import type { BreadcrumbItem } from '@/design-system/UIComponents'
import {
  ConfirmDialog,
  EmptyState,
  FormField,
  Input,
  useToast,
} from '@/design-system/UIComponents'
import {
  AdminFullPageFormShell,
} from '@/pages/admin/components/AdminFullPageFormShell'
import { AdminFullPageFormFooter } from '@/pages/admin/components/AdminFullPageFormFooter'
import { requirementMasterService } from '@/shared/services/requirementMasterService'
import type { RequirementMasterFormData } from '@/shared/types/requirementMaster'
import { RequirementQuestionsSection } from '../components/RequirementQuestionsSection'
import { emptyRequirementForm } from '../hooks/useRequirementForm'
import { validateRequirementForm } from '../utils/requirementQuestionUtils'

const LISTING_PATH = '/admin/masters/requirements'

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
        description="Configure pack details and questions with optional option-level document mappings."
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
            span: 2,
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
                <FormField label="Description" optional>
                  <Input
                    value={formData.description}
                    onChange={(value) => patch({ ...formData, description: value })}
                    placeholder="Optional summary for ops"
                    size="sm"
                    fullWidth
                  />
                </FormField>
              </>
            ),
          },
          {
            id: 'questions',
            title: 'Questions',
            importance: 'secondary',
            columns: 1,
            span: 2,
            children: (
              <Box sx={{ pb: 8 }}>
                <RequirementQuestionsSection
                  questions={formData.questions}
                  onChange={(questions) => patch({ ...formData, questions })}
                />
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
        description="Unsaved pack details and questions will be lost."
      />
    </>
  )
}
