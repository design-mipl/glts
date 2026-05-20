import { useState, useMemo } from 'react'
import {
  Box, Typography, Chip, Avatar, Paper, Grid,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import EditIcon from '@mui/icons-material/Edit'
import { alpha } from '@mui/material/styles'
import {
  DataTable, RowActions, RichTextEditor,
} from '../../design-system/UIComponents'
import type { Column, TableState, BulkAction, SearchResults } from '../../design-system/UIComponents'
import { GlobalSearchProvider } from '../../design-system/UIComponents/DataTable/GlobalSearch/provider'
import { useTheme } from '@mui/material/styles'

// ── Mock data ──────────────────────────────────────────────────────
type User = {
  id: string; name: string; email: string; role: string
  status: string; joinedDate: string; salary: number; department: string
}

const ROLES = ['Admin', 'Editor', 'Viewer', 'Manager', 'Developer']
const STATUSES = ['Active', 'Inactive', 'Pending', 'Suspended']
const DEPARTMENTS = ['Engineering', 'Marketing', 'Sales', 'Support', 'Design', 'Finance']

function makeUser(i: number): User {
  const firstNames = ['Alice', 'Bob', 'Carol', 'Dave', 'Eve', 'Frank', 'Grace', 'Hank', 'Iris', 'Jack']
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Wilson', 'Moore']
  const name = `${firstNames[i % 10]} ${lastNames[Math.floor(i / 10) % 10]}`
  return {
    id: String(i + 1),
    name,
    email: `${name.toLowerCase().replace(' ', '.')}@company.com`,
    role: ROLES[i % ROLES.length],
    status: STATUSES[i % STATUSES.length],
    joinedDate: new Date(2020 + Math.floor(i / 12), i % 12, 1).toISOString().slice(0, 10),
    salary: 50000 + (i * 1500) % 80000,
    department: DEPARTMENTS[i % DEPARTMENTS.length],
  }
}

const ALL_DATA: User[] = Array.from({ length: 50 }, (_, i) => makeUser(i))

// ── Column search + global filter ──────────────────────────────────
function applyState(data: User[], state: TableState): { rows: User[]; total: number } {
  let rows = [...data]

  // Global search
  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase()
    rows = rows.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.department.toLowerCase().includes(q)
    )
  }

  // Column search
  Object.entries(state.columnSearch).forEach(([key, val]) => {
    if (!val) return
    const q = val.toLowerCase()
    rows = rows.filter(r => String((r as any)[key] ?? '').toLowerCase().includes(q))
  })

  // Filters
  state.filters.forEach(f => {
    rows = rows.filter(r => {
      const v = (r as any)[f.columnKey]
      if (f.operator === 'is_empty') return v == null || v === ''
      if (f.operator === 'is_not_empty') return v != null && v !== ''
      if (f.operator === 'equals') return String(v).toLowerCase() === String(f.value).toLowerCase()
      if (f.operator === 'not_equals') return String(v).toLowerCase() !== String(f.value).toLowerCase()
      if (f.operator === 'contains') return String(v).toLowerCase().includes(String(f.value).toLowerCase())
      if (f.operator === 'not_contains') return !String(v).toLowerCase().includes(String(f.value).toLowerCase())
      if (f.operator === 'starts_with') return String(v).toLowerCase().startsWith(String(f.value).toLowerCase())
      if (f.operator === 'ends_with') return String(v).toLowerCase().endsWith(String(f.value).toLowerCase())
      if (f.operator === 'greater_than') return Number(v) > Number(f.value)
      if (f.operator === 'less_than') return Number(v) < Number(f.value)
      return true
    })
  })

  // Sort
  if (state.sortKey) {
    const key = state.sortKey
    const dir = state.sortDirection === 'asc' ? 1 : -1
    rows.sort((a, b) => {
      const av = (a as any)[key]
      const bv = (b as any)[key]
      if (av < bv) return -1 * dir
      if (av > bv) return 1 * dir
      return 0
    })
  }

  const total = rows.length
  // Paginate
  const start = state.page * state.pageSize
  rows = rows.slice(start, start + state.pageSize)

  return { rows, total }
}

const DEFAULT_STATE: TableState = {
  page: 0, pageSize: 10,
  sortKey: null, sortDirection: null,
  filters: [], searchQuery: '', columnSearch: {},
  selectedRows: [], expandedRows: [],
  hiddenColumnKeys: [],
}

// ── Columns ───────────────────────────────────────────────────────
function StatusChip({ status }: { status: string }) {
  const colors: Record<string, 'success' | 'error' | 'warning' | 'default'> = {
    Active: 'success', Inactive: 'default', Pending: 'warning', Suspended: 'error',
  }
  return <Chip label={status} size="small" color={colors[status] ?? 'default'} sx={{ fontSize: 11 }} />
}

function UserCell({ name, email }: { name: string; email: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Avatar sx={{ width: 28, height: 28, fontSize: 12, bgcolor: 'primary.main' }}>
        {name[0]}
      </Avatar>
      <Box>
        <Typography variant="body2" fontWeight={500} sx={{ lineHeight: 1.2 }}>{name}</Typography>
        <Typography variant="caption" color="text.secondary">{email}</Typography>
      </Box>
    </Box>
  )
}

// ── Main component ─────────────────────────────────────────────────
export default function DataTableTest() {
  const theme = useTheme()
  const [tableState, setTableState] = useState<TableState>(DEFAULT_STATE)
  const [editedRows, setEditedRows] = useState<Record<string, Partial<User>>>({})
  const [richText, setRichText] = useState('<p>Try the <strong>rich text editor</strong> below!</p>')

  const { rows, total } = useMemo(() => applyState(ALL_DATA, tableState), [tableState])

  // Merge edits into display data
  const displayRows = rows.map(r => ({ ...r, ...(editedRows[r.id] ?? {}) }))

  const columns: Column<User>[] = [
    {
      key: 'name',
      label: 'Name',
      sticky: true,
      sortable: true,
      searchable: true,
      minWidth: 180,
      render: (_, row) => <UserCell name={row.name} email={row.email} />,
    },
    {
      key: 'role',
      label: 'Role',
      type: 'select',
      sortable: true,
      searchable: true,
      editable: true,
      options: ROLES.map(r => ({ label: r, value: r })),
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      sortable: true,
      filterable: true,
      searchable: false,
      options: STATUSES.map(s => ({ label: s, value: s })),
      render: (val) => <StatusChip status={val} />,
    },
    {
      key: 'department',
      label: 'Department',
      type: 'select',
      sortable: true,
      searchable: true,
      hideBelow: 'xl',
      options: DEPARTMENTS.map(d => ({ label: d, value: d })),
    },
    {
      key: 'salary',
      label: 'Salary',
      type: 'number',
      sortable: true,
      searchable: false,
      editable: true,
      align: 'right',
      hideBelow: 'desktop',
      formatValue: (v) => `$${Number(v).toLocaleString()}`,
    },
    {
      key: 'joinedDate',
      label: 'Joined',
      type: 'date',
      sortable: true,
      searchable: false,
      hideBelow: 'desktopMd',
      formatValue: (v) => new Date(v).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    },
    {
      key: 'id',
      label: '',
      hideable: false,
      sortable: false,
      filterable: false,
      searchable: false,
      width: 48,
      render: (_, row) => (
        <RowActions
          row={row}
          actions={[
            {
              label: 'Edit',
              icon: <EditIcon fontSize="small" />,
              onClick: (r) => alert(`Edit: ${r.name}`),
            },
            {
              label: 'Delete',
              icon: <DeleteIcon fontSize="small" />,
              onClick: (r) => alert(`Delete: ${r.name}`),
              variant: 'destructive',
              divider: true,
            },
          ]}
        />
      ),
    },
  ]

  const bulkActions: BulkAction[] = [
    {
      label: 'Delete Selected',
      icon: <DeleteIcon fontSize="small" />,
      onClick: (rows) => alert(`Delete ${rows.length} rows`),
      variant: 'destructive',
    },
    {
      label: 'Export',
      icon: <FileDownloadIcon fontSize="small" />,
      onClick: (rows) => alert(`Export ${rows.length} rows`),
    },
  ]

  const handleSearch = async (query: string): Promise<SearchResults> => {
    const q = query.toLowerCase()
    const matching = ALL_DATA.filter(u =>
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.department.toLowerCase().includes(q)
    ).slice(0, 5)

    return {
      pages: [],
      records: matching.map(u => ({
        id: u.id,
        type: 'record' as const,
        title: u.name,
        subtitle: `${u.role} · ${u.department}`,
      })),
      users: [],
    }
  }

  return (
    <GlobalSearchProvider onSearch={handleSearch}>
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1400, mx: 'auto' }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>Data Table Test</Typography>
          <Typography variant="body2" color="text.secondary">
            Press <kbd style={{ background: alpha(theme.palette.text.primary, 0.08), padding: '1px 6px', borderRadius: 4, fontFamily: 'monospace' }}>⌘K</kbd> to open global search
          </Typography>
        </Box>

        <Paper variant="outlined" sx={{ p: { xs: 1.5, md: 2.5 }, mb: 4 }}>
          <DataTable
            title="Team Members"
            columns={columns}
            data={displayRows}
            rowKey="id"
            total={total}
            state={tableState}
            onStateChange={setTableState}
            bulkActions={bulkActions}
            onCellEdit={(rowId, columnKey, value) => {
              setEditedRows(prev => ({ ...prev, [rowId]: { ...prev[rowId], [columnKey]: value } }))
            }}
            renderExpanded={(row: User) => (
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="caption" color="text.secondary" display="block">Full Name</Typography>
                  <Typography variant="body2">{row.name}</Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="caption" color="text.secondary" display="block">Email</Typography>
                  <Typography variant="body2">{row.email}</Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="caption" color="text.secondary" display="block">Department</Typography>
                  <Typography variant="body2">{row.department}</Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="caption" color="text.secondary" display="block">Salary</Typography>
                  <Typography variant="body2">${row.salary.toLocaleString()}</Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="caption" color="text.secondary" display="block">Joined</Typography>
                  <Typography variant="body2">{new Date(row.joinedDate).toLocaleDateString()}</Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="caption" color="text.secondary" display="block">Role</Typography>
                  <Typography variant="body2">{row.role}</Typography>
                </Grid>
              </Grid>
            )}
            emptyState={{
              title: 'No team members found',
              description: 'Try adjusting your search or filters',
            }}
            actions={undefined}
          />
        </Paper>

        {/* RichTextEditor test */}
        <Paper variant="outlined" sx={{ p: { xs: 1.5, md: 2.5 } }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>Rich Text Editor</Typography>
          <RichTextEditor
            label="Notes"
            value={richText}
            onChange={setRichText}
            placeholder="Start typing your notes..."
            minHeight={180}
            helperText="Supports bold, italic, headings, lists, and more"
          />
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>HTML Output:</Typography>
            <Box
              component="pre"
              sx={{
                fontSize: 11,
                p: 1.5,
                bgcolor: 'action.hover',
                borderRadius: 1,
                overflow: 'auto',
                maxHeight: 120,
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
              }}
            >
              {richText}
            </Box>
          </Box>
        </Paper>
      </Box>
    </GlobalSearchProvider>
  )
}
