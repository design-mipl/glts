import { useMemo } from 'react'
import { Stack } from '@mui/material'
import {
  FileUpload,
  FormField,
  Input,
  RichTextEditor,
  Select,
  useToast,
} from '@/design-system/UIComponents'
import { PORTAL_SUPPORT_CATEGORIES } from '../../data/portalSupportCategories'
import { SUPPORT_SUBCATEGORIES } from '../../data/supportTicketOptions'
import type { SupportTicketsApi } from '../../hooks/useSupportTickets'
import { SupportFormSection } from './SupportFormSection'

interface RaiseSupportRequestSectionProps {
  ticketsApi: SupportTicketsApi
}

const FILE_ACCEPT = 'image/*,.pdf,.doc,.docx,.xls,.xlsx'

export function validateSupportRequestForm(ticketsApi: SupportTicketsApi): string | null {
  const form = ticketsApi.draft
  if (!form.category) return 'Select a support category'
  if (!form.subCategory) return 'Select a sub category'
  if (!form.subject.trim()) return 'Enter a subject'
  if (!form.description.replace(/<[^>]+>/g, '').trim()) return 'Enter a description'
  return null
}

export function RaiseSupportRequestSection({ ticketsApi }: RaiseSupportRequestSectionProps) {
  const { showToast } = useToast()
  const { draft, updateDraft } = ticketsApi

  const categoryOptions = useMemo(
    () => PORTAL_SUPPORT_CATEGORIES.map(cat => ({ value: cat.id, label: cat.name })),
    [],
  )

  const subCategoryOptions = useMemo(() => {
    if (!draft.category) return [{ value: '', label: 'Select category first' }]
    const subs = SUPPORT_SUBCATEGORIES[draft.category] ?? []
    return subs.map(s => ({ value: s, label: s }))
  }, [draft.category])

  const patchForm = (patch: Parameters<typeof updateDraft>[0]) => {
    if (patch.category && patch.category !== draft.category) {
      updateDraft({ ...patch, subCategory: '' })
      return
    }
    updateDraft(patch)
  }

  const handleAttachments = (files: File[]) => {
    updateDraft({ attachmentNames: files.map(f => f.name) })
  }

  return (
    <Stack spacing={2.5}>
      <SupportFormSection
        title="Ticket Information"
        description="Classify your request by category."
        columns={2}
      >
        <FormField label="Support Category" required>
          <Select
            value={draft.category}
            onChange={value => patchForm({ category: String(value) })}
            placeholder="Select category"
            options={categoryOptions}
          />
        </FormField>
        <FormField label="Sub Category" required>
          <Select
            value={draft.subCategory}
            onChange={value => patchForm({ subCategory: String(value) })}
            placeholder="Select sub category"
            options={subCategoryOptions}
            disabled={!draft.category}
          />
        </FormField>
      </SupportFormSection>

      <SupportFormSection title="Issue Details" description="Summarize the issue and provide full context.">
        <Stack spacing={2}>
          <FormField label="Subject" required>
            <Input
              value={draft.subject}
              onChange={value => patchForm({ subject: value })}
              placeholder="Brief summary of your issue"
            />
          </FormField>
          <FormField label="Description" required>
            <RichTextEditor
              value={draft.description}
              onChange={html => patchForm({ description: html })}
              placeholder="Describe your issue in detail..."
              minHeight={180}
              toolbar={[
                'bold',
                'italic',
                'underline',
                'divider',
                'bulletList',
                'orderedList',
                'divider',
                'link',
                'undo',
                'redo',
              ]}
            />
          </FormField>
        </Stack>
      </SupportFormSection>

      <SupportFormSection title="Attachments" description="Upload screenshots, documents, or spreadsheets.">
        <FileUpload
          multiple
          maxFiles={8}
          maxSize={10 * 1024 * 1024}
          accept={FILE_ACCEPT}
          dropzoneTitle="Drag and drop files here"
          dropzoneCaption="Images, PDF, DOC/DOCX, XLS/XLSX — up to 10 MB each"
          onUpload={handleAttachments}
          onError={msg => showToast({ title: msg, variant: 'warning' })}
        />
      </SupportFormSection>
    </Stack>
  )
}
