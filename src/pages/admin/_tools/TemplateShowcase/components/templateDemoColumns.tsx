import type { Column, RowAction } from '@/design-system/UIComponents'
import { Badge, RowActions } from '@/design-system/UIComponents'
import type { TemplateDemoRecord, TemplateListingTab } from '../config/demoEntity'

interface TemplateColumnHandlers {
  onOpenDetail: (row: TemplateDemoRecord) => void
}

function statusColor(status: TemplateDemoRecord['status']): 'success' | 'warning' | 'neutral' {
  if (status === 'Active') return 'success'
  if (status === 'Pending') return 'warning'
  return 'neutral'
}

function priorityLabel(priority: TemplateDemoRecord['priority']): string {
  if (priority === 'high') return 'High'
  if (priority === 'medium') return 'Medium'
  return 'Low'
}

function priorityColor(priority: TemplateDemoRecord['priority']): 'error' | 'warning' | 'neutral' {
  if (priority === 'high') return 'error'
  if (priority === 'medium') return 'warning'
  return 'neutral'
}

export function buildTemplateListingColumns(
  activeTab: TemplateListingTab,
  { onOpenDetail }: TemplateColumnHandlers,
): Column<TemplateDemoRecord>[] {
  const columns: Column<TemplateDemoRecord>[] = [
    {
      key: 'reference',
      label: 'Reference',
      sortable: true,
      searchable: true,
      widthSize: 'md',
      hideable: false,
    },
    { key: 'name', label: 'Name', sortable: true, searchable: true, widthSize: 'xxl' },
    { key: 'country', label: 'Country', sortable: true, filterable: true, widthSize: 'md' },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      filterable: true,
      widthSize: 'sm',
      render: (_, row) => <Badge label={row.status} color={statusColor(row.status)} size="sm" />,
    },
    {
      key: 'priority',
      label: 'Priority',
      sortable: true,
      filterable: true,
      widthSize: 'sm',
      render: (_, row) => <Badge label={priorityLabel(row.priority)} color={priorityColor(row.priority)} size="sm" />,
    },
    { key: 'assignee', label: 'Assignee', sortable: true, searchable: true, widthSize: 'lg' },
    { key: 'updatedAt', label: 'Updated', sortable: true, widthSize: 'md' },
  ]

  if (activeTab === 'bulk') {
    columns.splice(2, 0, { key: 'recordKind', label: 'Type', sortable: true, widthSize: 'sm' })
  }

  columns.push({
    key: 'actions',
    label: '',
    sortable: false,
    filterable: false,
    searchable: false,
    hideable: false,
    align: 'center',
    render: (_, row) => {
      const actions: RowAction[] = [
        { label: 'View details', onClick: () => onOpenDetail(row) },
        { label: 'Edit', onClick: () => onOpenDetail(row) },
      ]
      return <RowActions row={row} actions={actions} />
    },
  })

  return columns
}
