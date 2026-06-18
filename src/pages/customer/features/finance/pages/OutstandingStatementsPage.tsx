import { useMemo, useState } from 'react'
import {
  Box,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Card,
} from '@mui/material'
import { Download } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { BaseCard, Button, Tabs, useToast } from '@/design-system/UIComponents'
import { BORDER_RADIUS, BORDER_WIDTH, SHADOWS } from '@/design-system/tokens'
import { customerFinanceService } from '@/shared/services/customerFinanceService'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import { useCustomerPortalBase } from '@/pages/customer/features/shared/hooks/useCustomerPortalBase'
import { FinanceStatusBadges } from '../components/shared/FinanceStatusBadges'
import {
  PORTAL_RECORD_PAGE_TITLE_SX,
  PORTAL_RECORD_PAGE_TITLE_VARIANT,
} from '@/shared/theme/portalChromeLayout'

type TabValue = 'outstanding' | 'overdue' | 'statement' | 'aging'

const TABS = [
  { value: 'outstanding' as const, label: 'Outstanding' },
  { value: 'overdue' as const, label: 'Overdue' },
  { value: 'statement' as const, label: 'Statement of Account' },
  { value: 'aging' as const, label: 'Aging Summary' },
]

export function OutstandingStatementsPage() {
  const [tab, setTab] = useState<TabValue>('outstanding')
  const navigate = useNavigate()
  const { base } = useCustomerPortalBase()
  const { showToast } = useToast()

  const outstanding = useMemo(() => customerFinanceService.listOutstandingInvoices(false), [])
  const overdue = useMemo(() => customerFinanceService.listOutstandingInvoices(true), [])
  const statement = useMemo(() => customerFinanceService.getStatementOfAccount(6), [])
  const aging = useMemo(() => customerFinanceService.getAgingSummary(), [])

  const handleDownloadStatement = () => {
    showToast({ title: 'Download started', description: 'Statement of account PDF', variant: 'success' })
  }

  const renderOutstandingTable = (rows: typeof outstanding) => (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Invoice Number</TableCell>
          <TableCell>Invoice Date</TableCell>
          <TableCell>Due Date</TableCell>
          <TableCell align="right">Outstanding</TableCell>
          <TableCell>Days Outstanding</TableCell>
          <TableCell>Status</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6}>
              <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                No records in this view.
              </Typography>
            </TableCell>
          </TableRow>
        ) : (
          rows.map(row => (
            <TableRow
              key={row.invoice.id}
              hover
              sx={{ cursor: 'pointer' }}
              onClick={() => navigate(`${base}/finance/invoices/${row.invoice.id}`)}
            >
              <TableCell>
                <Typography variant="body2" fontWeight={600} color="primary.main">
                  {row.invoice.invoiceId}
                </Typography>
              </TableCell>
              <TableCell>{row.invoice.invoiceDate}</TableCell>
              <TableCell>{row.invoice.dueDate}</TableCell>
              <TableCell align="right">{formatInr(row.outstandingAmount)}</TableCell>
              <TableCell>{row.daysOutstanding}</TableCell>
              <TableCell>
                <FinanceStatusBadges invoice={row.invoice} />
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )

  const tabContent = {
    outstanding: renderOutstandingTable(outstanding),
    overdue: renderOutstandingTable(overdue),
    statement: (
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" color="text.secondary">
            {statement.periodLabel}
          </Typography>
          <Button
            label="Download statement"
            variant="outlined"
            size="sm"
            startIcon={<Download size={14} />}
            onClick={handleDownloadStatement}
          />
        </Stack>
        <Grid container spacing={2}>
          {[
            { label: 'Opening Balance', value: statement.openingBalance },
            { label: 'Invoices Raised', value: statement.invoicesRaised },
            { label: 'Payments Received', value: statement.paymentsReceived },
            { label: 'Credit Notes', value: statement.creditNotes },
            { label: 'Closing Balance', value: statement.closingBalance },
          ].map(item => (
            <Grid key={item.label} size={{ xs: 6, sm: 4, md: 2.4 }}>
              <BaseCard sx={{ p: 1.5 }}>
                <Typography variant="caption" color="text.secondary">
                  {item.label}
                </Typography>
                <Typography variant="body1" fontWeight={700}>
                  {formatInr(item.value)}
                </Typography>
              </BaseCard>
            </Grid>
          ))}
        </Grid>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Reference</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Debit</TableCell>
              <TableCell align="right">Credit</TableCell>
              <TableCell align="right">Balance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {statement.lineItems.map(item => (
              <TableRow key={item.id}>
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.reference}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell align="right">{item.debit ? formatInr(item.debit) : '—'}</TableCell>
                <TableCell align="right">{item.credit ? formatInr(item.credit) : '—'}</TableCell>
                <TableCell align="right">{formatInr(item.balance)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Stack>
    ),
    aging: (
      <Grid container spacing={2}>
        {aging.map(bucket => (
          <Grid key={bucket.range} size={{ xs: 12, sm: 6, md: 3 }}>
            <BaseCard sx={{ p: 2 }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                {bucket.label}
              </Typography>
              <Typography variant="h5" fontWeight={700} sx={{ mt: 0.5 }}>
                {formatInr(bucket.amount)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {bucket.invoiceCount} invoice{bucket.invoiceCount === 1 ? '' : 's'}
              </Typography>
            </BaseCard>
          </Grid>
        ))}
      </Grid>
    ),
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant={PORTAL_RECORD_PAGE_TITLE_VARIANT}
          component="h1"
          fontWeight={700}
          color="text.primary"
          sx={PORTAL_RECORD_PAGE_TITLE_SX}
        >
          Outstanding & Statements
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, maxWidth: 720 }}>
          Pending dues, account statements, and invoice aging for your company.
        </Typography>
      </Box>

      <Card
        elevation={0}
        sx={{
          border: `${BORDER_WIDTH.thin} solid`,
          borderColor: 'divider',
          borderRadius: BORDER_RADIUS.lg,
          boxShadow: SHADOWS.sm,
          overflow: 'hidden',
          bgcolor: 'background.paper',
        }}
      >
        <Box sx={{ borderBottom: `${BORDER_WIDTH.thin} solid`, borderColor: 'divider' }}>
          <Tabs
            value={tab}
            onChange={v => setTab(v as TabValue)}
            variant="underline"
            size="sm"
            items={TABS}
            sx={{ mb: 0, px: 2, minHeight: 44 }}
          />
        </Box>
        <Box sx={{ p: 2 }}>{tabContent[tab]}</Box>
      </Card>
    </Box>
  )
}
