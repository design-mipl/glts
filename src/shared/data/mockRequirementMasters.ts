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
  {
    id: 'req-basic-retail',
    name: 'Basic retail intake',
    description: 'Standard retail applicant profile questions used across countries and visa types.',
    status: 'active',
    questions: [
      {
        id: 'q-trip-purpose',
        prompt: 'What is the main purpose of your trip?',
        required: true,
        options: [
          { id: 'q-trip-purpose-1', label: 'Tourism', documentIds: ['bank', 'insurance'] },
          { id: 'q-trip-purpose-2', label: 'Visiting friends/family', documentIds: ['invitation'] },
          {
            id: 'q-trip-purpose-3',
            label: 'Attending an event',
            documentIds: ['invitation', 'schedule-of-stay'],
          },
          { id: 'q-trip-purpose-4', label: 'Other', documentIds: [] },
        ],
      },
      {
        id: 'q-travelling-with',
        prompt: 'Who will you be travelling with?',
        required: true,
        options: [
          { id: 'q-travelling-with-1', label: 'Alone', documentIds: [] },
          { id: 'q-travelling-with-2', label: 'Spouse', documentIds: [] },
          { id: 'q-travelling-with-3', label: 'Family', documentIds: [] },
          { id: 'q-travelling-with-4', label: 'Friends', documentIds: [] },
          { id: 'q-travelling-with-5', label: 'Organised group', documentIds: ['schedule-of-stay'] },
        ],
      },
      {
        id: 'q-occupation',
        prompt: 'What do you currently do?',
        required: true,
        options: [
          {
            id: 'q-occupation-1',
            label: 'Salaried Employee',
            documentIds: ['bank', 'salary-slip', 'employment-certificate'],
          },
          {
            id: 'q-occupation-2',
            label: 'Self Employed',
            documentIds: ['certificate-of-incorporation', 'bank', 'income-tax-return'],
          },
          {
            id: 'q-occupation-3',
            label: 'Business Owner',
            documentIds: ['certificate-of-incorporation', 'company-bank-statement', 'income-tax-return'],
          },
          {
            id: 'q-occupation-4',
            label: 'Student',
            documentIds: ['authority-letter', 'bank-balance-certificate'],
          },
          { id: 'q-occupation-5', label: 'Retired', documentIds: ['bank-balance-certificate'] },
          { id: 'q-occupation-6', label: 'Other', documentIds: [] },
        ],
      },
      {
        id: 'q-trip-payer',
        prompt: 'Who will be paying for this trip?',
        required: true,
        options: [
          { id: 'q-trip-payer-1', label: 'Self', documentIds: [] },
          { id: 'q-trip-payer-2', label: 'Spouse/Family', documentIds: ['bank-balance-certificate'] },
          {
            id: 'q-trip-payer-3',
            label: 'Employer',
            documentIds: ['company-covering-letter', 'expense-undertaking-letter'],
          },
          { id: 'q-trip-payer-4', label: 'Sponsor', documentIds: ['invitation', 'letter-of-guarantee'] },
        ],
      },
      {
        id: 'q-intl-travel',
        prompt: 'Have you travelled internationally before?',
        required: true,
        options: [
          { id: 'q-intl-travel-1', label: 'Yes', documentIds: ['old-passport'] },
          { id: 'q-intl-travel-2', label: 'No', documentIds: ['bank-balance-certificate'] },
        ],
      },
    ],
    createdBy: 'Rajan Mehta',
    updatedBy: 'Priya Sharma',
    createdAt: '2026-09-01T09:00:00.000Z',
    updatedAt: '2026-09-01T09:00:00.000Z',
  },
]
