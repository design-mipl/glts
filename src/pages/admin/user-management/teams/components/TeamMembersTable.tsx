import { useMemo } from 'react'
import { Box, Typography } from '@mui/material'
import type { Column } from '@/design-system/UIComponents'
import { Badge } from '@/design-system/UIComponents'
import { AdminListingTable, adminListingColumnWidthSize } from '@/pages/admin/components/listing'
import { masterStatusColor, masterStatusLabel } from '@/pages/admin/masters/config/masterStatusConfig'
import { useCustomerListing } from '@/pages/customer/features/shared/hooks/useCustomerListing'
import { adminPortalUserService } from '@/shared/services/adminPortalUserService'
import type { AdminPortalUser } from '@/shared/types/adminPortalUser'
import { getTeamMemberCellValue } from '../utils/teamListingUtils'

interface TeamMembersTableProps {
  teamId: string
}

type MemberRow = Pick<AdminPortalUser, 'id' | 'fullName' | 'email' | 'designation' | 'status'>

function buildMemberColumns(): Column<MemberRow>[] {
  return [
    {
      key: 'fullName',
      label: 'User Name',
      widthSize: adminListingColumnWidthSize('name'),
      sortable: true,
      filterable: true,
    },
    {
      key: 'email',
      label: 'Email',
      widthSize: adminListingColumnWidthSize('email'),
      sortable: false,
      filterable: true,
    },
    {
      key: 'designation',
      label: 'Designation',
      widthSize: adminListingColumnWidthSize('service'),
      sortable: false,
      filterable: true,
    },
    {
      key: 'status',
      label: 'Status',
      widthSize: adminListingColumnWidthSize('status'),
      sortable: false,
      filterable: true,
      render: (_, row) => (
        <Badge
          label={masterStatusLabel[row.status]}
          color={masterStatusColor[row.status]}
          size="sm"
        />
      ),
    },
  ]
}

export function TeamMembersTable({ teamId }: TeamMembersTableProps) {
  const members = useMemo(() => adminPortalUserService.listByTeamId(teamId), [teamId])
  const rows: MemberRow[] = useMemo(
    () =>
      members.map((m) => ({
        id: m.id,
        fullName: m.fullName,
        email: m.email,
        designation: m.designation,
        status: m.status,
      })),
    [members],
  )

  const listing = useCustomerListing({
    rows,
    getCellValue: getTeamMemberCellValue,
    searchMatch: () => true,
    initialPageSize: 10,
  })

  const columns = useMemo(() => buildMemberColumns(), [])

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1.5 }}>
        Team members
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: 13 }}>
        Users assigned to this team. Team assignment is managed from User &amp; permission.
      </Typography>
      <AdminListingTable
        columns={columns}
        data={listing.paginatedRows}
        filterSourceData={listing.filterSourceRows}
        rowKey="id"
        state={listing.tableState}
        onStateChange={listing.setTableState}
        columnFilters={listing.columnFilters}
        onColumnFiltersChange={listing.setColumnFilters}
        getCellValue={getTeamMemberCellValue}
        stickyHeader
        emptyTitle="No users in this team"
        emptyDescription="Assign users to this team from User & permission."
      />
    </Box>
  )
}
