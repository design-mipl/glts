import { useMemo, useState } from 'react'
import { Box, Stack } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Select, useToast, type TableState } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { executiveCardLevel2Sx } from '@/pages/admin/dashboard/components/executiveDashboardTokens'
import { ExecutiveSectionHeader } from '@/pages/admin/dashboard/components'
import { AdminListingTable } from '@/pages/admin/components/listing'
import { MarineApplicationAssignTeamModal } from '@/pages/admin/application-management/marine/components/MarineApplicationAssignTeamModal'
import { buildMarineApplicationColumns } from '@/pages/admin/application-management/marine/components/MarineApplicationTableColumns'
import type { ApplicationConsultantAssignmentPayload } from '@/pages/admin/application-management/shared/utils/applicationConsultantUtils'
import {
  filterMarineRowsByTab,
  getAllMarineListingRows,
  getMarineApplicationCellValue,
} from '@/pages/admin/application-management/marine/utils/marineApplicationListingUtils'
import { marineApplicationAdminService } from '@/shared/services/marineApplicationAdminService'
import type { MarineApplicationRow } from '@/shared/services/marineApplicationAdminService'
import { adminPortalUserService } from '@/shared/services/adminPortalUserService'
import { teamService } from '@/shared/services/teamService'

const LIMIT_OPTIONS = [
  { label: 'Top 5', value: '5' },
  { label: 'Top 7', value: '7' },
  { label: 'Top 10', value: '10' },
] as const

type PendingLimit = 5 | 7 | 10

const LISTING_RETURN = '/admin/dashboard-next?tab=applications'

function createTableState(pageSize: number): TableState {
  return {
    page: 0,
    pageSize,
    sortKey: null,
    sortDirection: 'asc',
    filters: [],
    searchQuery: '',
    columnSearch: {},
    selectedRows: [],
    expandedRows: [],
    hiddenColumnKeys: [],
  }
}

export interface AdminPendingVerificationSectionProps {
  loading?: boolean
  onViewQueue?: () => void
}

/**
 * Pending verification queue using the same AdminListingTable + marine
 * application-management columns, with Top 5 / 7 / 10 visibility.
 */
export function AdminPendingVerificationSection({
  loading = false,
  onViewQueue,
}: AdminPendingVerificationSectionProps) {
  const colors = usePublicBrandColors()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [limit, setLimit] = useState<PendingLimit>(5)
  const [assignTarget, setAssignTarget] = useState<MarineApplicationRow | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [tableState, setTableState] = useState<TableState>(() => createTableState(5))
  const [columnFilters, setColumnFilters] = useState<Record<string, string[]>>({})

  const verificationRows = useMemo(() => {
    const { singles, bulks } = marineApplicationAdminService.listMarineApplications()
    const all = getAllMarineListingRows(singles, bulks)
    return filterMarineRowsByTab(all, 'verification_pending')
  }, [refreshKey])

  const displayRows = useMemo(
    () => verificationRows.slice(0, limit),
    [verificationRows, limit],
  )

  const columns = useMemo(
    () =>
      buildMarineApplicationColumns({
        navigate,
        showToast,
        onAssignTeam: setAssignTarget,
        fromListing: LISTING_RETURN,
      }),
    [navigate, showToast],
  )

  const handleLimitChange = (value: string | number) => {
    const next = Number(value) as PendingLimit
    setLimit(next)
    setTableState((prev) => ({ ...prev, pageSize: next, page: 0 }))
  }

  const handleAssignTeamSubmit = (payload: ApplicationConsultantAssignmentPayload) => {
    if (!assignTarget) return
    const { teamId, userId, priority, isVip } = payload
    const updated = marineApplicationAdminService.assignTeam(assignTarget.id, teamId, userId, {
      priority,
      isVip,
    })
    if (!updated) {
      showToast({
        title: 'Assignment failed',
        description: 'Could not assign the selected team and consultant.',
        variant: 'error',
      })
      return
    }

    const teamName = teamService.getById(teamId)?.name ?? 'Team'
    const userName = adminPortalUserService.getById(userId)?.fullName ?? 'Consultant'
    setAssignTarget(null)
    setRefreshKey((key) => key + 1)
    showToast({
      title: 'Consultant assigned',
      description: `${assignTarget.id} → ${userName} · ${teamName} · ${priority}${isVip ? ' · VIP' : ''}`,
      variant: 'success',
    })
  }

  return (
    <>
      <Box sx={{ ...executiveCardLevel2Sx(colors), p: 0, overflow: 'hidden' }}>
        <Box sx={{ px: 2, pt: 2, pb: 1.5 }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignItems={{ xs: 'stretch', sm: 'center' }}
            justifyContent="space-between"
            spacing={1.25}
          >
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <ExecutiveSectionHeader
                title="Pending verification"
                description="Applications waiting for verification — same listing as application management."
                actionLabel="View queue"
                onAction={onViewQueue}
              />
            </Box>
            <Box sx={{ width: { xs: '100%', sm: 140 }, flexShrink: 0 }}>
              <Select
                size="sm"
                fullWidth
                aria-label="Show top pending rows"
                value={String(limit)}
                options={[...LIMIT_OPTIONS]}
                onChange={handleLimitChange}
              />
            </Box>
          </Stack>
        </Box>
        <Box sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
          <AdminListingTable
            columns={columns}
            data={displayRows}
            filterSourceData={displayRows}
            rowKey="id"
            state={tableState}
            onStateChange={setTableState}
            columnFilters={columnFilters}
            onColumnFiltersChange={setColumnFilters}
            getCellValue={getMarineApplicationCellValue}
            stickyHeader
            enableColumnSort={false}
            enableColumnFilters={false}
            loading={loading}
            emptyTitle="No pending verifications"
            emptyDescription="Verification queue is clear for the current filters."
            emptyAction={
              onViewQueue
                ? { label: 'Open applications', onClick: onViewQueue }
                : undefined
            }
            onRowClick={(row) =>
              navigate(`/admin/application-management/marine/${row.id}`)
            }
          />
        </Box>
      </Box>
      <MarineApplicationAssignTeamModal
        open={Boolean(assignTarget)}
        record={assignTarget}
        onClose={() => setAssignTarget(null)}
        onSubmit={handleAssignTeamSubmit}
      />
    </>
  )
}
