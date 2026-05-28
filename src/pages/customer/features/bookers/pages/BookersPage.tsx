import { useMemo, useState, useCallback } from 'react'
import { Box, Typography, Avatar, Stack } from '@mui/material'
import { Plus, Eye, Pencil } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button, RowActions, useToast, type Column } from '@/design-system/UIComponents'
import { getPrimaryButtonSx, usePublicBrandColors } from '@/shared/theme/publicBrand'
import type { BookerRecord } from '../data/bookerData'
import { useCustomerPortalBase } from '@/pages/customer/features/shared/hooks/useCustomerPortalBase'
import { useCustomerListing } from '@/pages/customer/features/shared/hooks/useCustomerListing'
import { CustomerListingShell } from '@/pages/customer/features/shared/components/listing/CustomerListingShell'
import { CustomerListingToolbar } from '@/pages/customer/features/shared/components/listing/CustomerListingToolbar'
import { CustomerListingTable } from '@/pages/customer/features/shared/components/listing/CustomerListingTable'
import { CustomerListingPagination } from '@/pages/customer/features/shared/components/listing/CustomerListingPagination'
import { CustomerListingGrid } from '@/pages/customer/features/shared/components/listing/CustomerListingGrid'
import { CustomerStatusChip } from '@/pages/customer/features/shared/components/CustomerPrimitives'
import { customerPortalService } from '@/pages/customer/features/shared/services/customerPortalService'
import { BookerFormDrawer } from '../components/BookerFormDrawer'

function getBookerCellValue(row: BookerRecord, key: string): string {
  if (key === 'apps') return String(row.apps)
  if (key === 'status') return row.status
  return String(row[key as keyof BookerRecord] ?? '')
}

export function BookersPage() {
  const colors = usePublicBrandColors()
  const navigate = useNavigate()
  const { base, isAdmin } = useCustomerPortalBase()
  const { showToast } = useToast()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editBooker, setEditBooker] = useState<BookerRecord | undefined>()
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [statusTab, setStatusTab] = useState('all')
  const bookers = useMemo(() => customerPortalService.getBookers(), [])

  const listing = useCustomerListing({
    rows: bookers,
    getCellValue: getBookerCellValue,
    searchMatch: (row, q) => {
      const s = q.toLowerCase()
      return (
        row.name.toLowerCase().includes(s) ||
        row.email.toLowerCase().includes(s) ||
        row.mobile.includes(s) ||
        row.designation.toLowerCase().includes(s)
      )
    },
  })

  const tabFilteredRows = useMemo(() => {
    if (statusTab === 'active') return listing.filteredRows.filter(b => b.status === 'Active')
    if (statusTab === 'inactive') return listing.filteredRows.filter(b => b.status === 'Disabled')
    return listing.filteredRows
  }, [listing.filteredRows, statusTab])

  const paginatedRows = useMemo(() => {
    const start = listing.tableState.page * listing.tableState.pageSize
    return tabFilteredRows.slice(start, start + listing.tableState.pageSize)
  }, [tabFilteredRows, listing.tableState.page, listing.tableState.pageSize])

  const handleExport = useCallback(() => {
    showToast({ title: 'Export started', description: 'Booker list export will download shortly.', variant: 'success' })
  }, [showToast])

  const columns = useMemo((): Column<BookerRecord>[] => {
    return [
      {
        key: 'name',
        label: 'Booker name',
        sortable: true,
        filterable: true,
        render: (value: string, row: BookerRecord) => (
          <Stack direction="row" alignItems="center" spacing={1}>
            <Avatar sx={{ width: 32, height: 32, fontSize: 12, bgcolor: 'primary.main' }}>
              {value
                .split(' ')
                .map(w => w[0])
                .join('')
                .slice(0, 2)}
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight={700}>
                {value}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {row.designation}
              </Typography>
            </Box>
          </Stack>
        ),
      },
      {
        key: 'email',
        label: 'Email',
        sortable: true,
        filterable: true,
      },
      { key: 'mobile', label: 'Mobile', sortable: true, filterable: true },
      {
        key: 'apps',
        label: 'Assigned apps',
        sortable: true,
        align: 'right',
        render: (value: number) => (
          <Typography variant="body2" fontWeight={600} color="success.main">
            {value} active
          </Typography>
        ),
      },
      { key: 'lastActive', label: 'Last active', sortable: true, filterable: true },
      {
        key: 'status',
        label: 'Status',
        sortable: true,
        filterable: true,
        render: (_: unknown, row: BookerRecord) => (
          <CustomerStatusChip label={row.status} tone={row.status === 'Active' ? 'success' : 'neutral'} />
        ),
      },
      {
        key: 'actions',
        label: '',
        hideable: false,
        width: 56,
        render: (_: unknown, row: BookerRecord) => (
          <RowActions
            actions={[
              { label: 'View', icon: <Eye size={16} />, onClick: () => navigate(`${base}/bookers/${row.id}`) },
              {
                label: 'Edit',
                icon: <Pencil size={16} />,
                onClick: () => {
                  setEditBooker(row)
                  setDrawerOpen(true)
                },
              },
            ]}
            row={row}
          />
        ),
      },
    ]
  }, [base, navigate])

  if (!isAdmin) {
    return (
      <>
        <Typography sx={{ fontWeight: 800, fontSize: '20px', mb: 1 }}>Booker management</Typography>
        <Typography sx={{ fontSize: '14px', color: 'text.secondary' }}>
          Only corporate admins can manage bookers. Sign in with admin@glts.com.
        </Typography>
      </>
    )
  }

  return (
    <>
      <CustomerListingShell
        title="Booker management"
        tabs={[
          { value: 'all', label: 'All bookers' },
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
        ]}
        tabValue={statusTab}
        onTabChange={v => {
          setStatusTab(v)
          listing.setTableState(s => ({ ...s, page: 0 }))
        }}
        headerActions={
          <Button
            variant="contained"
            size="sm"
            startIcon={<Plus size={16} />}
            onClick={() => {
              setEditBooker(undefined)
              setDrawerOpen(true)
            }}
            sx={{ ...getPrimaryButtonSx(colors), fontSize: '13px' }}
          >
            Add booker
          </Button>
        }
        toolbar={
          <CustomerListingToolbar
            searchValue={listing.tableState.searchQuery}
            onSearch={listing.handleSearch}
            searchPlaceholder="Search bookers…"
            onExport={handleExport}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            columns={columns.filter(c => c.key !== 'actions').map(c => ({ key: c.key, label: c.label }))}
            hiddenColumnKeys={listing.tableState.hiddenColumnKeys}
            onHiddenColumnKeysChange={keys => listing.setTableState(s => ({ ...s, hiddenColumnKeys: keys }))}
            moreMenuItems={[
              { label: 'Import bookers', onClick: () => showToast({ title: 'Import', variant: 'info' }) },
              { label: 'Bulk disable', onClick: () => showToast({ title: 'Bulk action', variant: 'warning' }) },
            ]}
          />
        }
        table={
          viewMode === 'table' ? (
            <CustomerListingTable<BookerRecord>
              columns={columns}
              data={paginatedRows}
              filterSourceData={listing.filterSourceRows}
              rowKey="id"
              state={listing.tableState}
              onStateChange={listing.setTableState}
              columnFilters={listing.columnFilters}
              onColumnFiltersChange={listing.setColumnFilters}
              getCellValue={getBookerCellValue}
              onRowClick={row => navigate(`${base}/bookers/${row.id}`)}
              emptyTitle="No bookers found"
            />
          ) : (
            <CustomerListingGrid
              items={paginatedRows.map(b => ({
                id: b.id,
                title: b.name,
                subtitle: b.email,
                meta: `${b.apps} applications · ${b.lastActive}`,
                status: b.status,
                statusColor: b.status === 'Active' ? 'success' : 'default',
              }))}
              onItemClick={id => navigate(`${base}/bookers/${id}`)}
            />
          )
        }
        pagination={
          <CustomerListingPagination
            page={listing.tableState.page}
            pageSize={listing.tableState.pageSize}
            total={tabFilteredRows.length}
            onPage={page => listing.setTableState(s => ({ ...s, page }))}
            onPageSize={pageSize => listing.setTableState(s => ({ ...s, pageSize, page: 0 }))}
          />
        }
      />
      <BookerFormDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        initial={editBooker}
        onSave={data => {
          showToast({
            title: editBooker ? 'Booker updated' : 'Booker invited',
            description: `${data.name || 'Booker'} changes are staged in the mock service.`,
            variant: 'success',
          })
        }}
      />
    </>
  )
}
