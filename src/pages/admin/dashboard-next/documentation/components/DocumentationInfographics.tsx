import { Stack } from '@mui/material'
import { DASHBOARD_SPACING } from '../../shared/constants'
import { ApplicationMarketInfographics } from '../../shared/widgets/operations/ApplicationMarketInfographics'
import { OpsOrgQueueAgeing } from '../../shared/widgets/operations/OpsOrgInfographics'
import type { DocumentationDashboardData } from '../types'

export interface DocumentationInfographicsProps {
  data: DocumentationDashboardData
  loading?: boolean
}

/** Overview infographics — Queue ageing · top clients/countries. */
export function DocumentationInfographics({ data, loading }: DocumentationInfographicsProps) {
  return (
    <Stack spacing={DASHBOARD_SPACING.field}>
      <OpsOrgQueueAgeing
        rows={data.ageingByQueue}
        loading={loading}
        description="Application Management queues by wait time"
      />
      <ApplicationMarketInfographics
        topClients={data.topClients}
        topCountries={data.topCountries}
        submissionByJurisdiction={data.submissionByJurisdiction}
        loading={loading}
      />
    </Stack>
  )
}

export {
  OpsOrgWorkloadBySegment as DocumentationWorkloadBySegment,
} from '../../shared/widgets/operations/OpsOrgInfographics'
export type { OpsOrgWorkloadBySegmentProps as DocumentationWorkloadBySegmentProps } from '../../shared/widgets/operations/OpsOrgInfographics'
