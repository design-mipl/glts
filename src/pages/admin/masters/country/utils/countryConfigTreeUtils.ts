import type {
  BusinessSegment,
  ConfigNodeStatus,
  CountryMaster,
  CountryVisaType,
} from '@/shared/types/countryMaster'
import { SEGMENT_LABELS } from '../config/countrySegmentConfig'
import { getCountryConfigWarnings } from '@/shared/utils/countryConfigValidation'
import {
  shouldShowJurisdictionNodes,
} from '@/shared/utils/jurisdictionRequirementPreview'

export { shouldShowJurisdictionNodes }

export type ConfigTreeNodeType =
  | 'overview'
  | 'segment'
  | 'visaType'
  | 'jurisdiction'
  | 'review'

export interface ConfigTreeNode {
  id: string
  path: string
  type: ConfigTreeNodeType
  label: string
  segment?: BusinessSegment
  visaTypeId?: string
  jurisdictionId?: string
  status: ConfigNodeStatus
  enabled: boolean
  /** Leaf hierarchy row — bullet instead of expand chevron or empty spacer. */
  showHierarchyBullet?: boolean
  children: ConfigTreeNode[]
  depth: number
}

export function parseConfigNodePath(path: string | null | undefined): string {
  if (!path || path === 'overview') return 'overview'
  if (path === 'review') return 'review'
  return path
}

/** Leaf visa types with jurisdiction disabled (e-Visa or explicit toggle off) show a hierarchy bullet. */
export function shouldShowVisaTypeHierarchyBullet(
  visaType: Pick<CountryVisaType, 'jurisdictionEnabled' | 'jurisdictions' | 'visaMode'>,
): boolean {
  if (shouldShowJurisdictionNodes(visaType)) return false
  return visaType.jurisdictionEnabled === false || visaType.visaMode === 'e_visa'
}

export function buildConfigTree(country: CountryMaster): ConfigTreeNode[] {
  const warnings = getCountryConfigWarnings(country)
  const warningPaths = new Set(warnings.map((w) => w.nodePath))

  const overviewNode: ConfigTreeNode = {
    id: 'overview',
    path: 'overview',
    type: 'overview',
    label: 'Overview',
    status: country.status === 'draft' ? 'draft' : 'enabled',
    enabled: true,
    children: [],
    depth: 0,
  }

  const segmentNodes: ConfigTreeNode[] = country.segments.map((seg) => {
    const segPath = seg.segment
    const segStatus: ConfigNodeStatus = !seg.enabled
      ? 'disabled'
      : warningPaths.has(segPath)
        ? 'warning'
        : 'enabled'

    const visaChildren: ConfigTreeNode[] = seg.visaTypes.map((vt) => {
      const vtPath = `${seg.segment}/${vt.id}`
      const vtStatus: ConfigNodeStatus =
        vt.status === 'inactive'
          ? 'disabled'
          : warningPaths.has(vtPath)
            ? 'warning'
            : 'enabled'

      const jurChildren: ConfigTreeNode[] = shouldShowJurisdictionNodes(vt)
        ? (vt.jurisdictions ?? []).map((jur) => {
            const jurPath = `${vtPath}/${jur.id}`
            return {
              id: jurPath,
              path: jurPath,
              type: 'jurisdiction' as const,
              label: jur.name,
              segment: seg.segment,
              visaTypeId: vt.id,
              jurisdictionId: jur.id,
              status: (warningPaths.has(jurPath)
                ? 'warning'
                : jur.status === 'active'
                  ? 'enabled'
                  : 'disabled') as ConfigNodeStatus,
              enabled: jur.status === 'active',
              showHierarchyBullet: true,
              children: [],
              depth: 3,
            }
          })
        : []

      return {
        id: vtPath,
        path: vtPath,
        type: 'visaType' as const,
        label: vt.name,
        segment: seg.segment,
        visaTypeId: vt.id,
        status: vtStatus,
        enabled: vt.status === 'active',
        showHierarchyBullet: shouldShowVisaTypeHierarchyBullet(vt),
        children: jurChildren,
        depth: 2,
      }
    })

    return {
      id: segPath,
      path: segPath,
      type: 'segment' as const,
      label: SEGMENT_LABELS[seg.segment],
      segment: seg.segment,
      status: segStatus,
      enabled: seg.enabled,
      children: visaChildren,
      depth: 1,
    }
  })

  const reviewNode: ConfigTreeNode = {
    id: 'review',
    path: 'review',
    type: 'review',
    label: 'Review & Publish',
    status: warnings.some((w) => w.severity === 'error') ? 'warning' : 'enabled',
    enabled: true,
    children: [],
    depth: 0,
  }

  return [overviewNode, ...segmentNodes, reviewNode]
}

export function filterConfigTree(nodes: ConfigTreeNode[], query: string): ConfigTreeNode[] {
  const q = query.trim().toLowerCase()
  if (!q) return nodes

  const filterNode = (node: ConfigTreeNode): ConfigTreeNode | null => {
    const labelMatch = node.label.toLowerCase().includes(q)
    const filteredChildren = node.children
      .map(filterNode)
      .filter((child): child is ConfigTreeNode => child !== null)

    if (labelMatch || filteredChildren.length > 0) {
      return { ...node, children: filteredChildren }
    }
    return null
  }

  return nodes.map(filterNode).filter((node): node is ConfigTreeNode => node !== null)
}

export function findTreeNode(nodes: ConfigTreeNode[], path: string): ConfigTreeNode | undefined {
  for (const node of nodes) {
    if (node.path === path) return node
    const found = findTreeNode(node.children, path)
    if (found) return found
  }
  return undefined
}

export function getExpandedPathsForNode(path: string): string[] {
  if (path === 'overview' || path === 'review') return []
  const parts = path.split('/')
  const expanded: string[] = []
  if (parts[0]) expanded.push(parts[0])
  if (parts.length >= 2) expanded.push(`${parts[0]}/${parts[1]}`)
  return expanded
}
