import { Box, Typography } from '@mui/material'
import type { NavigateFunction } from 'react-router-dom'
import { Badge, RowActions, type Column } from '@/design-system/UIComponents'
import { adminListingColumnWidthSize } from '@/pages/admin/components/listing'
import type { ApplicationExpenseListingRow } from '@/shared/types/applicationExpenseManagement'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import {
  rollupApprovalStatusLabel,
  rollupPaymentStatusLabel,
} from '@/shared/utils/applicationExpenseManagementUtils'
import { navigateFromListing } from '@/shared/utils/listingNavigationUtils'
import {
  expenseRollupApprovalColor,
  expenseRollupPaymentColor,
} from '../config/expenseStatusConfig'
import { EXPENSE_LISTING_BASE_PATH } from '../config/expenseListingTabs'

export interface ExpenseApplicationColumnHandlers {
  navigate: NavigateFunction
  fromListing: string
}

export function buildExpenseApplicationColumns(
  handlers: ExpenseApplicationColumnHandlers,
): Column<ApplicationExpenseListingRow>[] {
  const base = EXPENSE_LISTING_BASE_PATH
  const { navigate, fromListing } = handlers

  return [
    {
      key: 'applicationId',
      label: 'Application ID',
      widthSize: adminListingColumnWidthSize('code'),
      sortable: true,
      searchable: true,
      hideable: false,
      render: (value: string) => (
        <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13, fontFamily: 'monospace' }}>
          {value}
        </Typography>
      ),
    },
    {
      key: 'companyName',
      label: 'Company Name',
      widthSize: adminListingColumnWidthSize('company'),
      sortable: true,
      searchable: true,
    },
    {
      key: 'vesselName',
      label: 'Vessel Name',
      widthSize: adminListingColumnWidthSize('name'),
      sortable: true,
      searchable: true,
    },
    {
      key: 'crewCount',
      label: 'Crew Count',
      widthSize: adminListingColumnWidthSize('count'),
      sortable: true,
      align: 'right',
      render: (_: unknown, row) => String(row.crewCount),
    },
    {
      key: 'visaCountryVisaType',
      label: 'Visa Country + Visa Type',
      widthSize: adminListingColumnWidthSize('applicationSummary'),
      sortable: true,
      render: (_: unknown, row) => (
        <Box>
          <Typography variant="body2" sx={{ fontSize: 13 }}>
            {row.visaCountry}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
            {row.visaType}
          </Typography>
        </Box>
      ),
    },
    {
      key: 'jurisdiction',
      label: 'Jurisdiction',
      widthSize: adminListingColumnWidthSize('jurisdiction'),
      sortable: true,
      filterable: true,
    },
    {
      key: 'submissionDate',
      label: 'Submission Date',
      widthSize: adminListingColumnWidthSize('date'),
      sortable: true,
    },
    {
      key: 'totalExpense',
      label: 'Total Expense',
      widthSize: 'md',
      sortable: true,
      align: 'right',
      render: (_: unknown, row) => (
        <Typography variant="body2" fontWeight={700} sx={{ fontSize: 13 }}>
          {formatInr(row.totalExpense)}
        </Typography>
      ),
    },
    {
      key: 'pendingExpense',
      label: 'Pending Expense',
      widthSize: 'md',
      sortable: true,
      align: 'right',
      render: (_: unknown, row) => formatInr(row.pendingExpense),
    },
    {
      key: 'approvalStatus',
      label: 'Approval Status',
      widthSize: adminListingColumnWidthSize('statusGroup'),
      sortable: true,
      filterable: true,
      render: (_: unknown, row) => (
        <Badge
          label={rollupApprovalStatusLabel(row.approvalStatus)}
          color={expenseRollupApprovalColor[row.approvalStatus]}
          size="sm"
        />
      ),
    },
    {
      key: 'paymentStatus',
      label: 'Payment Status',
      widthSize: adminListingColumnWidthSize('statusGroup'),
      sortable: true,
      filterable: true,
      render: (_: unknown, row) => (
        <Badge
          label={rollupPaymentStatusLabel(row.paymentStatus)}
          color={expenseRollupPaymentColor[row.paymentStatus]}
          size="sm"
        />
      ),
    },
    {
      key: 'actions',
      label: '',
      hideable: false,
      sortable: false,
      filterable: false,
      searchable: false,
      render: (_: unknown, row) => (
        <RowActions
          row={row}
          actions={[
            {
              label: 'View Details',
              onClick: () => navigateFromListing(navigate, `${base}/${row.applicationId}`, fromListing),
            },
            {
              label: 'Add Expense',
              onClick: () =>
                navigateFromListing(navigate, `${base}/${row.applicationId}`, fromListing, {
                  state: { openAddExpense: true },
                }),
            },
            {
              label: 'View Approval Status',
              onClick: () =>
                navigateFromListing(navigate, `${base}/${row.applicationId}`, fromListing, {
                  state: { highlightPending: true },
                }),
            },
          ]}
        />
      ),
    },
  ]
}
