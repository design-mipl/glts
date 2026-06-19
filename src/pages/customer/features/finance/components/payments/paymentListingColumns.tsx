import { Eye, Download } from 'lucide-react'
import type { NavigateFunction } from 'react-router-dom'
import { RowActions, type Column } from '@/design-system/UIComponents'
import type { Toast } from '@/design-system/UIComponents'
import { Badge } from '@/design-system/UIComponents'
import type { CustomerPaymentRow } from '../../types/customerFinance.types'
import { FinanceAmountCell } from '../shared/FinanceAmountCell'

type ToastFn = (toast: Omit<Toast, 'id'>) => void

export interface PaymentListingColumnsParams {
  base: string
  navigate: NavigateFunction
  showToast: ToastFn
}

export function buildPaymentListingColumns({
  base,
  navigate,
  showToast,
}: PaymentListingColumnsParams): Column<CustomerPaymentRow>[] {
  return [
    { key: 'paymentDate', label: 'Payment Date', sortable: true, width: 120 },
    {
      key: 'receiptNumber',
      label: 'Receipt Number',
      sortable: true,
      width: 160,
    },
    {
      key: 'invoiceNumber',
      label: 'Invoice Number',
      sortable: true,
      width: 150,
    },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      width: 120,
      render: (_: unknown, row: CustomerPaymentRow) => <FinanceAmountCell amount={row.amount} fontWeight={600} />,
    },
    { key: 'paymentMode', label: 'Payment Mode', sortable: true, width: 120 },
    {
      key: 'transactionReference',
      label: 'Transaction Ref',
      sortable: true,
      width: 140,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      width: 100,
      render: (_: unknown, row: CustomerPaymentRow) => (
        <Badge label={row.status} color="info" size="sm" />
      ),
    },
    {
      key: 'actions',
      label: '',
      hideable: false,
      width: 56,
      sortable: false,
      filterable: false,
      searchable: false,
      render: (_: unknown, row: CustomerPaymentRow) => (
        <RowActions
          row={row}
          actions={[
            {
              label: 'View payment',
              icon: <Eye size={16} />,
              onClick: () => navigate(`${base}/finance/payments/${row.id}`),
            },
            {
              label: 'Download receipt',
              icon: <Download size={16} />,
              onClick: () =>
                showToast({
                  title: 'Download started',
                  description: `${row.receiptNumber}.pdf`,
                  variant: 'success',
                }),
            },
          ]}
        />
      ),
    },
  ]
}
