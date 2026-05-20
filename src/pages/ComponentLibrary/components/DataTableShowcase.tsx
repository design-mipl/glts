import { useState } from 'react'
import { Box } from '@mui/material'
import { DataTable } from '@/design-system/components'
import type { Column, TableState } from '@/design-system/components'
import { Tag } from '@/design-system/components'

interface Row {
  id: string
  name: string
  email: string
  role: string
  status: 'Active' | 'Inactive' | 'Pending'
  joined: string
}

const rows: Row[] = [
  { id: '1', name: 'Alice Chen', email: 'alice@example.com', role: 'Admin', status: 'Active', joined: '2024-01-15' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', role: 'Editor', status: 'Active', joined: '2024-02-20' },
  { id: '3', name: 'Carol White', email: 'carol@example.com', role: 'Viewer', status: 'Inactive', joined: '2024-03-05' },
  { id: '4', name: 'Dave Jones', email: 'dave@example.com', role: 'Editor', status: 'Pending', joined: '2024-04-10' },
  { id: '5', name: 'Eve Taylor', email: 'eve@example.com', role: 'Admin', status: 'Active', joined: '2024-05-22' },
  { id: '6', name: 'Frank Brown', email: 'frank@example.com', role: 'Viewer', status: 'Active', joined: '2024-06-01' },
  { id: '7', name: 'Grace Lee', email: 'grace@example.com', role: 'Editor', status: 'Inactive', joined: '2024-06-15' },
  { id: '8', name: 'Hank Wilson', email: 'hank@example.com', role: 'Viewer', status: 'Pending', joined: '2024-07-03' },
]

const statusColor: Record<string, 'success' | 'error' | 'warning'> = {
  Active: 'success',
  Inactive: 'error',
  Pending: 'warning',
}

const columns: Column<Row>[] = [
  { key: 'name', label: 'Name', sortable: true, searchable: true, width: 160 },
  { key: 'email', label: 'Email', sortable: true, searchable: true, width: 220 },
  { key: 'role', label: 'Role', sortable: true, filterable: true, width: 120 },
  {
    key: 'status',
    label: 'Status',
    width: 120,
    render: (value: string) => <Tag label={value} color={statusColor[value]} />,
  },
  { key: 'joined', label: 'Joined', sortable: true, width: 130 },
]

const initialState: TableState = {
  page: 0,
  pageSize: 5,
  sortKey: null,
  sortDirection: null,
  filters: [],
  searchQuery: '',
  columnSearch: {},
  selectedRows: [],
  expandedRows: [],
}

export function DataTableShowcase() {
  const [tableState, setTableState] = useState<TableState>(initialState)

  return (
    <Box>
      <DataTable
        columns={columns}
        data={rows}
        rowKey="id"
        total={rows.length}
        state={tableState}
        onStateChange={setTableState}
        title="Users"
        bulkActions={[
          { label: 'Delete Selected', onClick: () => {}, variant: 'destructive' },
        ]}
        emptyState={{
          title: 'No users found',
          description: 'Try adjusting your search or filters.',
        }}
      />
    </Box>
  )
}
