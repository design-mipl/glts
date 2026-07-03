import type { CreditCardMaster } from '@/shared/types/creditCardMaster'

export const SEED_CREDIT_CARD_MASTERS: CreditCardMaster[] = [
  {
    id: 'credit-card-visa',
    cardName: 'Visa',
    description: 'Visa credit and debit cards accepted for visa fee payments.',
    createdBy: 'Rajan Mehta',
    updatedBy: 'Rajan Mehta',
    createdAt: '2025-10-01T09:00:00.000Z',
    updatedAt: '2026-01-15T10:30:00.000Z',
  },
  {
    id: 'credit-card-mastercard',
    cardName: 'Mastercard',
    description: 'Mastercard network cards for domestic and international transactions.',
    createdBy: 'Priya Sharma',
    updatedBy: 'Priya Sharma',
    createdAt: '2025-10-05T11:00:00.000Z',
    updatedAt: '2026-02-01T14:20:00.000Z',
  },
  {
    id: 'credit-card-amex',
    cardName: 'American Express',
    description: 'American Express cards for premium payment processing.',
    createdBy: 'Rajan Mehta',
    updatedBy: 'Priya Sharma',
    createdAt: '2025-11-10T08:45:00.000Z',
    updatedAt: '2026-02-10T09:15:00.000Z',
  },
  {
    id: 'credit-card-rupay',
    cardName: 'RuPay',
    description: 'Domestic RuPay cards for India-based payment collections.',
    createdBy: 'Priya Sharma',
    updatedBy: 'Priya Sharma',
    createdAt: '2025-12-01T10:00:00.000Z',
    updatedAt: '2026-01-20T16:00:00.000Z',
  },
]
