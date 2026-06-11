import { useMemo, useState } from 'react'
import { Box, Collapse, Divider, Stack, Typography } from '@mui/material'
import { ChevronDown, ChevronRight, Plus, Search } from 'lucide-react'
import { IconButton, Input } from '@/design-system/UIComponents'
import type { CountryMaster } from '@/shared/types/countryMaster'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import {
  COUNTRY_WORKSPACE_TREE_HIERARCHY_MUTED,
  COUNTRY_WORKSPACE_TREE_HIERARCHY_MUTED_HOVER,
  COUNTRY_WORKSPACE_TREE_INDENT,
  COUNTRY_WORKSPACE_TREE_SX,
} from '../../config/countryWorkspaceLayout'
import {
  buildConfigTree,
  filterConfigTree,
  getExpandedPathsForNode,
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

  const renderNode = (node: ConfigTreeNode) => {
    const isActive = node.path === activeNode
    const hasChildren = node.children.length > 0
    const isExpanded = expanded.has(node.path) || Boolean(search.trim())
    const isMuted = node.status === 'disabled'

    return (
      <Box key={node.id}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={0.75}
          sx={{
            mr: 0.75,
            py: 0.625,
            pl: rowPaddingLeft,
            pr: 0.5,
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
          {!readOnly && node.type === 'segment' && node.enabled && onAddVisaType ? (
            <Box sx={{ flexShrink: 0 }}>
              <IconButton
                size="sm"
                icon={<Plus size={14} />}
                aria-label="Add visa type"
                onClick={(e) => {
                  e.stopPropagation()
                  onAddVisaType(node.path)
                }}
              />
            </Box>
          ) : null}
          {!readOnly &&
          node.type === 'visaType' &&
          node.enabled &&
          isSegmentEnabled(node.segment) &&
          onAddJurisdiction &&
          node.segment &&
          node.visaTypeId ? (
            <Box sx={{ flexShrink: 0 }}>
              <IconButton
                size="sm"
                icon={<Plus size={14} />}
                aria-label="Add jurisdiction"
                onClick={(e) => {
                  e.stopPropagation()
                  onAddJurisdiction(node.segment!, node.visaTypeId!)
                }}
              />
            </Box>
          ) : null}
        </Stack>
        {hasChildren ? (
          <Collapse in={isExpanded}>
            <Box sx={{ position: 'relative', pl: `${childBranchPaddingLeftPx}px`, zIndex: 1 }}>
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
        />
      </Box>
      <Box sx={COUNTRY_WORKSPACE_TREE_SX.scrollArea}>
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
