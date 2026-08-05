/**
 * Compatibility re-exports — org infographics live in shared widgets.
 * Ops Overview and Admin Operations both consume OpsOrgInfographics.
 */
export {
  OpsOrgInfographics as OperationsInfographics,
  OpsOrgWorkloadBySegment as OperationsWorkloadBySegment,
} from '../../shared/widgets/operations/OpsOrgInfographics'
export type {
  OpsOrgInfographicsProps as OperationsInfographicsProps,
  OpsOrgWorkloadBySegmentProps as OperationsWorkloadBySegmentProps,
} from '../../shared/widgets/operations/OpsOrgInfographics'
