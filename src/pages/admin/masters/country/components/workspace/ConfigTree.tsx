import { useMemo, useState } from 'react'
import { Box, Collapse, Divider, Stack, Typography } from '@mui/material'
import { ChevronDown, ChevronRight, Plus, Search } from 'lucide-react'
import { IconButton, Input } from '@/design-system/UIComponents'
import type { CountryMaster } from '@/shared/types/countryMaster'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import {
  COUNTRY_WORKSPACE_SEARCH_ROW_FIELD_HEIGHT,
  COUNTRY_WORKSPACE_TREE_ACTION_SLOT_PX,
  COUNTRY_WORKSPACE_TREE_HIERARCHY_MUTED,
  COUNTRY_WORKSPACE_TREE_HIERARCHY_MUTED_HOVER,
  COUNTRY_WORKSPACE_TREE_INDENT,
  COUNTRY_WORKSPACE_TREE_ROW_GAP_PX,
  COUNTRY_WORKSPACE_TREE_ROW_HEIGHT_PX,
  COUNTRY_WORKSPACE_TREE_SX,
} from '../../config/countryWorkspaceLayout'
import {
  buildConfigTree,
  filterConfigTree,
  getExpandedPathsForNode,
  shouldShowVisaTypeHierarchyBullet,
  type ConfigTreeNode,
} from '../../utils/countryConfigTreeUtils'
import { useCountryWorkspaceMode } from './countryWorkspaceModeContext'

interface ConfigTreeProps {
  country: CountryMaster
  activeNode: string
  onSelectNode: (path: string) => void
  onAddVisaType?: (segment: string) => void
  onAddJurisdiction?: (segment: string, visaTypeId: string) => void
}

function showsHierarchyDot(nodeType: ConfigTreeNode['type']) {
  return nodeType === 'segment' || nodeType === 'visaType' || nodeType === 'jurisdiction'
}

const TREE_SECTION_DIVIDER_SX = { my: 0.75, mx: 1.25 } as const

function getTreeRowBackground(
  nodeType: ConfigTreeNode['type'],
  isActive: boolean,
  greenMuted: string,
) {
  if (showsHierarchyDot(nodeType)) {
    const hierarchyType = nodeType as keyof typeof COUNTRY_WORKSPACE_TREE_HIERARCHY_MUTED
    if (isActive) return COUNTRY_WORKSPACE_TREE_HIERARCHY_MUTED[hierarchyType]
    return 'transparent'
  }
  if (isActive) return greenMuted
  return 'transparent'
}

function getTreeRowHoverBackground(
  nodeType: ConfigTreeNode['type'],
  isActive: boolean,
  greenMuted: string,
) {
  if (showsHierarchyDot(nodeType)) {
    const hierarchyType = nodeType as keyof typeof COUNTRY_WORKSPACE_TREE_HIERARCHY_MUTED_HOVER
    return isActive
      ? COUNTRY_WORKSPACE_TREE_HIERARCHY_MUTED[hierarchyType]
      : COUNTRY_WORKSPACE_TREE_HIERARCHY_MUTED_HOVER[hierarchyType]
  }
  return isActive ? greenMuted : 'action.selected'
}

const { chevronColumnPx, guideLineLeftPx, childBranchPaddingLeftPx, rowPaddingLeft } =
  COUNTRY_WORKSPACE_TREE_INDENT

const HIERARCHY_BULLET_COLOR = {
  segment: 'rgba(13, 148, 136, 0.55)',
  visaType: 'rgba(124, 58, 237, 0.55)',
  jurisdiction: 'rgba(234, 88, 12, 0.55)',
} as const

function TreeHierarchyBullet({
  nodeType,
  isActive,
}: {
  nodeType: ConfigTreeNode['type']
  isActive: boolean
}) {
  const bulletColor =
    nodeType === 'segment' || nodeType === 'visaType' || nodeType === 'jurisdiction'
      ? HIERARCHY_BULLET_COLOR[nodeType]
      : 'text.secondary'

  return (
    <Box
      sx={{
        width: chevronColumnPx,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        component="span"
        aria-hidden
        sx={{
          width: isActive ? 6 : 5,
          height: isActive ? 6 : 5,
          borderRadius: '50%',
          bgcolor: bulletColor,
        }}
      />
    </Box>
  )
}

export function ConfigTree({
  country,
  activeNode,
  onSelectNode,
  onAddVisaType,
  onAddJurisdiction,
}: ConfigTreeProps) {
  const { readOnly } = useCountryWorkspaceMode()
  const colors = usePublicBrandColors()
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<Set<string>>(() => {
    const initial = new Set(getExpandedPathsForNode(activeNode))
    country.segments.forEach((s) => {
      if (s.enabled) initial.add(s.segment)
    })
    return initial
  })

  const tree = useMemo(() => buildConfigTree(country), [country])
  const filteredTree = useMemo(() => filterConfigTree(tree, search), [tree, search])
  const overviewNode = filteredTree.find((node) => node.type === 'overview')
  const reviewNode = filteredTree.find((node) => node.type === 'review')
  const segmentNodes = filteredTree.filter(
    (node) => node.type !== 'overview' && node.type !== 'review',
  )

  const toggleExpand = (path: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(path)) next.delete(path)
      else next.add(path)
      return next
    })
  }

  const isSegmentEnabled = (segmentKey?: string) => {
    if (!segmentKey) return false
    return country.segments.find((s) => s.segment === segmentKey)?.enabled ?? false
  }

  const isJurisdictionEnabledForVisaType = (segmentKey?: string, visaTypeId?: string) => {
    if (!segmentKey || !visaTypeId) return false
    const visaType = country.segments
      .find((s) => s.segment === segmentKey)
      ?.visaTypes.find((v) => v.id === visaTypeId)
    return visaType?.jurisdictionEnabled === true
  }

  const resolveVisaType = (node: ConfigTreeNode) => {
    if (node.type !== 'visaType' || !node.segment || !node.visaTypeId) return undefined
    return country.segments
      .find((segment) => segment.segment === node.segment)
      ?.visaTypes.find((visaType) => visaType.id === node.visaTypeId)
  }

  const renderNode = (node: ConfigTreeNode) => {
    const isActive = node.path === activeNode
    const hasChildren = node.children.length > 0
    const isExpanded = expanded.has(node.path) || Boolean(search.trim())
    const isMuted = node.status === 'disabled'
    const visaType = resolveVisaType(node)
    const showVisaTypeBullet =
      node.type === 'visaType' &&
      (visaType ? shouldShowVisaTypeHierarchyBullet(visaType) : Boolean(node.showHierarchyBullet))

    const showAddVisaType =
      !readOnly && node.type === 'segment' && node.enabled && Boolean(onAddVisaType)
    const showAddJurisdiction =
      !readOnly &&
      node.type === 'visaType' &&
      node.enabled &&
      isSegmentEnabled(node.segment) &&
      isJurisdictionEnabledForVisaType(node.segment, node.visaTypeId) &&
      Boolean(onAddJurisdiction) &&
      Boolean(node.segment) &&
      Boolean(node.visaTypeId)
    const reserveActionSlot =
      !readOnly &&
      ((node.type === 'segment' && node.enabled && Boolean(onAddVisaType)) ||
        (node.type === 'visaType' && node.enabled && isSegmentEnabled(node.segment)))

    return (
      <Box key={node.id}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={0.75}
          sx={{
            mr: 0.75,
            pl: rowPaddingLeft,
            pr: 0.5,
            minHeight: COUNTRY_WORKSPACE_TREE_ROW_HEIGHT_PX,
            height: COUNTRY_WORKSPACE_TREE_ROW_HEIGHT_PX,
            boxSizing: 'border-box',
            borderRadius: 1.25,
            cursor: 'pointer',
            opacity: isMuted ? 0.5 : 1,
            bgcolor: getTreeRowBackground(node.type, isActive, colors.greenMuted),
            '&:hover': {
              bgcolor: getTreeRowHoverBackground(node.type, isActive, colors.greenMuted),
            },
          }}
          onClick={() => onSelectNode(node.path)}
        >
          {hasChildren ? (
            <Box
              component="span"
              onClick={(e) => {
                e.stopPropagation()
                toggleExpand(node.path)
              }}
              sx={{
                width: chevronColumnPx,
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'text.secondary',
              }}
            >
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </Box>
          ) : showVisaTypeBullet || node.showHierarchyBullet ? (
            <TreeHierarchyBullet nodeType={node.type} isActive={isActive} />
          ) : (
            <Box sx={{ width: chevronColumnPx, flexShrink: 0 }} />
          )}
          <Typography
            variant="body2"
            fontWeight={isActive ? 600 : 400}
            color="text.primary"
            sx={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 13 }}
          >
            {node.label}
          </Typography>
          {reserveActionSlot ? (
            <Box
              sx={{
                width: COUNTRY_WORKSPACE_TREE_ACTION_SLOT_PX,
                minWidth: COUNTRY_WORKSPACE_TREE_ACTION_SLOT_PX,
                height: COUNTRY_WORKSPACE_TREE_ACTION_SLOT_PX,
                maxHeight: COUNTRY_WORKSPACE_TREE_ROW_HEIGHT_PX,
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {showAddVisaType ? (
                <IconButton
                  size="sm"
                  icon={<Plus size={14} />}
                  aria-label="Add visa type"
                  onClick={() => onAddVisaType!(node.path)}
                />
              ) : null}
              {showAddJurisdiction ? (
                <IconButton
                  size="sm"
                  icon={<Plus size={14} />}
                  aria-label="Add jurisdiction"
                  onClick={() => onAddJurisdiction!(node.segment!, node.visaTypeId!)}
                />
              ) : null}
            </Box>
          ) : null}
        </Stack>
        {hasChildren ? (
          <Collapse in={isExpanded}>
            <Box
              sx={{
                position: 'relative',
                pl: `${childBranchPaddingLeftPx}px`,
                zIndex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: `${COUNTRY_WORKSPACE_TREE_ROW_GAP_PX}px`,
                pt: `${COUNTRY_WORKSPACE_TREE_ROW_GAP_PX}px`,
              }}
            >
              <Box
                aria-hidden
                sx={{
                  position: 'absolute',
                  left: `${guideLineLeftPx}px`,
                  top: 0,
                  bottom: 0,
                  width: '1px',
                  bgcolor: 'divider',
                  pointerEvents: 'none',
                  zIndex: 0,
                }}
              />
              {node.children.map(renderNode)}
            </Box>
          </Collapse>
        ) : null}
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      <Box sx={COUNTRY_WORKSPACE_TREE_SX.searchWrap}>
        <Input
          value={search}
          onChange={setSearch}
          placeholder="Search configuration…"
          size="sm"
          fullWidth
          startAdornment={<Search size={14} />}
          sx={{ '& .MuiOutlinedInput-root': { height: COUNTRY_WORKSPACE_SEARCH_ROW_FIELD_HEIGHT } }}
        />
      </Box>
      <Box
        sx={{
          ...COUNTRY_WORKSPACE_TREE_SX.scrollArea,
          display: 'flex',
          flexDirection: 'column',
          gap: `${COUNTRY_WORKSPACE_TREE_ROW_GAP_PX}px`,
        }}
      >
        {overviewNode ? renderNode(overviewNode) : null}
        {overviewNode && segmentNodes.length > 0 ? <Divider sx={TREE_SECTION_DIVIDER_SX} /> : null}
        {segmentNodes.map(renderNode)}
        {reviewNode && (overviewNode || segmentNodes.length > 0) ? (
          <Divider sx={TREE_SECTION_DIVIDER_SX} />
        ) : null}
        {reviewNode ? renderNode(reviewNode) : null}
      </Box>
    </Box>
  )
}
