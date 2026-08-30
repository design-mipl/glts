import { generateDocumentRuleId } from '@/shared/data/countryJurisdictionDefaults'
import type { RequirementMaster } from '@/shared/types/requirementMaster'

export const SEED_REQUIREMENT_MASTERS: RequirementMaster[] = [
  {
    id: 'req-schengen-tourist',
    name: 'Schengen tourist intake',
    description: 'Sample pack: travel purpose questions plus core identity documents.',
    status: 'active',
    questions: [
      {
        id: 'q-purpose',
        prompt: 'What is the primary purpose of this trip?',
        type: 'multiple_choice',
        required: true,
        options: [
          { id: 'q-purpose-1', label: 'Tourism' },
          { id: 'q-purpose-2', label: 'Visiting family or friends' },
          { id: 'q-purpose-3', label: 'Other' },
        ],
      },
      {
        id: 'q-docs-held',
        prompt: 'Which of the following do you already hold?',
        type: 'checkboxes',
        required: false,
        options: [
          { id: 'q-docs-1', label: 'Valid travel insurance' },
          { id: 'q-docs-2', label: 'Confirmed hotel booking' },
          { id: 'q-docs-3', label: 'Return flight reservation' },
        ],
      },
    ],
    documents: [
      {
        id: generateDocumentRuleId(),
        documentId: 'passport',
        group: 'jurisdiction',
        mandatory: true,
        ocrEnabled: true,
        multipleUpload: false,
        commonDocument: false,
        originalDocument: false,
        ownerType: 'applicant',
        sortOrder: 0,
        acceptedFormats: ['PDF', 'JPG', 'PNG'],
      },
    ],
    createdBy: 'Rajan Mehta',
    updatedBy: 'Priya Sharma',
    createdAt: '2026-03-01T09:00:00.000Z',
    updatedAt: '2026-08-12T11:30:00.000Z',
  },
]
