import { Stack } from '@mui/material'
import { DASHBOARD_SPACING } from '../../shared/constants'
import { ApplicationMarketInfographics } from '../../shared/widgets/operations/ApplicationMarketInfographics'
import {
  OpsOrgInfographics,
  OpsOrgWorkloadBySegment,
} from '../../shared/widgets/operations/OpsOrgInfographics'
import type { AdminDashboardNextData } from '../types'

export interface AdminInfographicsProps {
  data: Pick<
    AdminDashboardNextData,
    | 'opsQueueSnapshot'
    | 'topClients'
    | 'topCountries'
    | 'submissionByJurisdiction'
  >
  loading?: boolean
}

/**
 * Overview infographics — same shared stack as Ops / Documentation:
 * ground assignment · Queue ageing · top clients/countries · workload by segment.
 */
export function AdminInfographics({ data, loading }: AdminInfographicsProps) {
  return (
    <Stack spacing={DASHBOARD_SPACING.field}>
      <OpsOrgInfographics data={data.opsQueueSnapshot} loading={loading} />
      <ApplicationMarketInfographics
        topClients={data.topClients}
        topCountries={data.topCountries}
        submissionByJurisdiction={data.submissionByJurisdiction}
        loading={loading}
      />
    </Stack>
  )
}

export function AdminWorkloadBySegment({
  data,
  loading,
}: {
  data: Pick<AdminDashboardNextData, 'opsQueueSnapshot'>
  loading?: boolean
}) {
  return <OpsOrgWorkloadBySegment data={data.opsQueueSnapshot} loading={loading} />
}
