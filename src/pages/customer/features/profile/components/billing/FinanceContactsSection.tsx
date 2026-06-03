import { CustomerDetailSection } from '@/pages/customer/features/shared/components/detail'
import type { FinanceContactPerson } from '../../types/accountWorkspace'
import { FinanceContactsTable } from './FinanceContactsTable'

export interface FinanceContactsSectionProps {
  financeContactPersons: FinanceContactPerson[]
}

export function FinanceContactsSection({ financeContactPersons }: FinanceContactsSectionProps) {
  return (
    <CustomerDetailSection title="Finance contacts">
      <FinanceContactsTable persons={financeContactPersons} />
    </CustomerDetailSection>
  )
}
