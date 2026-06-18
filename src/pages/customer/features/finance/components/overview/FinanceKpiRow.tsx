import { Banknote, AlertCircle, TrendingUp, Wallet, Clock } from 'lucide-react'
import { CustomerListingKpis } from '@/pages/customer/features/shared/components/listing/CustomerListingKpis'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import type { FinanceOverviewMetrics } from '../../types/customerFinance.types'

interface FinanceKpiRowProps {
  metrics: FinanceOverviewMetrics
}

export function FinanceKpiRow({ metrics }: FinanceKpiRowProps) {
  return (
    <CustomerListingKpis
      items={[
        { id: 'invoiced', label: 'Total Invoiced', value: formatInr(metrics.totalInvoiced), icon: Wallet, color: 'primary' },
        { id: 'paid', label: 'Total Paid', value: formatInr(metrics.totalPaid), icon: Banknote, color: 'success' },
        { id: 'outstanding', label: 'Outstanding', value: formatInr(metrics.outstanding), icon: TrendingUp, color: 'warning' },
        { id: 'overdue', label: 'Overdue', value: formatInr(metrics.overdue), icon: AlertCircle, color: 'warning' },
        { id: 'upcoming', label: 'Upcoming Due', value: formatInr(metrics.upcomingDue), icon: Clock, color: 'info' },
      ]}
    />
  )
}
