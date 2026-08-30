import type { RequirementMaster } from '@/shared/types/requirementMaster'

export const SEED_REQUIREMENT_MASTERS: RequirementMaster[] = [
  {
    id: 'req-schengen-tourist',
    name: 'Schengen tourist intake',
    description: 'Sample pack: purpose and employment questions with optional option-level documents.',
    status: 'active',
    questions: [
      {
        id: 'q-purpose',
        prompt: 'What is the primary purpose of this visit?',
        required: true,
        options: [
          {
            id: 'q-purpose-1',
            label: 'Tourism',
            documentIds: ['bank', 'insurance'],
          },
          {
            id: 'q-purpose-2',
            label: 'Visiting family or friends',
            documentIds: ['invitation'],
          },
          {
            id: 'q-purpose-3',
            label: 'Business',
            documentIds: ['company-covering-letter', 'invitation'],
          },
          {
            id: 'q-purpose-4',
            label: 'Other',
            documentIds: [],
          },
        ],
      },
      {
        id: 'q-employment',
        prompt: 'What is your current employment status?',
        required: true,
        options: [
          {
            id: 'q-employment-1',
            label: 'Salaried',
            documentIds: ['bank', 'salary-slip', 'employment-certificate'],
          },
          {
            id: 'q-employment-2',
            label: 'Self-employed',
            documentIds: ['certificate-of-incorporation', 'bank'],
          },
          {
            id: 'q-employment-3',
            label: 'Student',
            documentIds: [],
          },
          {
            id: 'q-employment-4',
            label: 'Unemployed',
            documentIds: [],
          },
        ],
      },
    ],
    createdBy: 'Rajan Mehta',
    updatedBy: 'Priya Sharma',
    createdAt: '2026-03-01T09:00:00.000Z',
    updatedAt: '2026-08-12T11:30:00.000Z',
  },
]
