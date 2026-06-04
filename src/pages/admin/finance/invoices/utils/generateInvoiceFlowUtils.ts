import type { InvoiceFeeCompositionState } from '../types/invoiceFeeComposition.types'

export function listCompositionApplicationIds(composition: InvoiceFeeCompositionState): string[] {
  return [
    ...composition.singles.map(s => s.applicationId),
    ...composition.bulks.map(b => b.batchId),
  ]
}

export function parseGenerateInvoiceStepParam(step: string | null): number {
  if (step === '1' || step === 'composition') return 1
  return 0
}
