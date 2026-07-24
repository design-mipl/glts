import { useMemo, useState } from 'react'
import { Box, Collapse, Stack, Typography } from '@mui/material'
import { ChevronDown, ChevronUp, Filter } from 'lucide-react'
import { Input, Select, Button } from '@/design-system/UIComponents'
import { Badge } from '../../dashboard-ui-kit/shadcn'
import { DASHBOARD_SPACING } from '../../constants'
import { useDashboardFilters } from './DashboardFilterContext'
import type { DashboardIntelligenceFilters } from '../types'

export interface DashboardFilterBarProps {
  /** Compact = primary filters only; full shows all fields. */
  density?: 'compact' | 'full'
  sticky?: boolean
  showSearch?: boolean
  showReset?: boolean
  /**
   * toolbar = single dense row (workspace default).
   * stacked = legacy multi-row labeled layout.
   */
  layout?: 'toolbar' | 'stacked'
  /** Collapsible filter strip — collapsed by default for fold space. */
  collapsible?: boolean
  defaultExpanded?: boolean
}

const COMPACT_KEYS: Array<keyof DashboardIntelligenceFilters> = [
  'datePreset',
  'segment',
  'country',
  'client',
  'status',
]

/**
 * Executive filter bar — updates shared DashboardFilterContext.
 * Workspace uses collapsible toolbar layout to protect the first viewport.
 */
export function DashboardFilterBar({
  density = 'compact',
  sticky = true,
  showSearch = false,
  showReset = true,
  layout = 'toolbar',
  collapsible = true,
  defaultExpanded = false,
}: DashboardFilterBarProps) {
  const { filters, fields, activeCount, setFilter, setSearch, resetFilters } =
    useDashboardFilters()
  const [expanded, setExpanded] = useState(defaultExpanded)

  const visibleFields = useMemo(
    () =>
      density === 'full'
        ? fields
        : fields.filter((field) => COMPACT_KEYS.includes(field.id)),
    [density, fields],
  )

  const filterControls = (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      useFlexGap
      flexWrap="wrap"
      sx={{ width: '100%', minWidth: 0 }}
    >
      {visibleFields.map((field) => (
        <Box
          key={field.id}
          sx={{
            flex: { xs: '1 1 140px', md: '1 1 0' },
            minWidth: { xs: 120, md: 0 },
            maxWidth: { md: 180 },
          }}
        >
          <Select
            fullWidth
            size="sm"
            placeholder={field.label}
            aria-label={field.label}
            value={String(filters[field.id] ?? 'all')}
            options={field.options}
            onChange={(value) =>
              setFilter(
                field.id,
                String(value) as DashboardIntelligenceFilters[typeof field.id],
              )
            }
          />
        </Box>
      ))}
      {showSearch ? (
        <Box sx={{ flex: '1 1 160px', minWidth: 140, maxWidth: 240 }}>
          <Input
            fullWidth
            size="sm"
            placeholder="Search…"
            value={filters.search}
            onChange={setSearch}
            aria-label="Dashboard filter search"
          />
        </Box>
      ) : null}
      {showReset ? (
        <Button
          label="Reset"
          variant="text"
          size="sm"
          onClick={resetFilters}
          disabled={activeCount === 0}
        />
      ) : null}
    </Stack>
  )

  const stackedControls = (
    <Stack spacing={DASHBOARD_SPACING.field}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        useFlexGap
        spacing={1}
      >
        <Typography variant="subtitle2" fontWeight={700}>
          Executive filters
          {activeCount > 0 ? (
            <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
              {activeCount} active
            </Typography>
          ) : null}
        </Typography>
        {showReset ? (
          <Button
            label="Reset"
            variant="text"
            size="sm"
            onClick={resetFilters}
            disabled={activeCount === 0}
          />
        ) : null}
      </Stack>
      {showSearch ? (
        <Input
          fullWidth
          size="sm"
          placeholder="Client, country, vessel, employee…"
          value={filters.search}
          onChange={setSearch}
          aria-label="Executive dashboard search"
        />
      ) : null}
      {filterControls}
    </Stack>
  )

  const body = layout === 'stacked' ? stackedControls : filterControls

  return (
    <Box
      sx={{
        position: sticky ? 'sticky' : 'relative',
        top: sticky ? 0 : undefined,
        zIndex: (theme) => theme.zIndex.appBar - 1,
      }}
    >
      {collapsible ? (
        <Stack spacing={1}>
          <Stack direction="row" alignItems="center" spacing={1} useFlexGap flexWrap="wrap">
            <Button
              label={expanded ? 'Hide filters' : 'Filters'}
              variant="outlined"
              size="sm"
              startIcon={<Filter size={14} />}
              endIcon={expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              onClick={() => setExpanded((prev) => !prev)}
              aria-expanded={expanded}
              aria-controls="dashboard-filter-panel"
            />
            {activeCount > 0 ? (
              <Badge variant="secondary">{activeCount} active</Badge>
            ) : (
              <Typography variant="caption" color="text.secondary">
                Date · segment · country · client · status
              </Typography>
            )}
            {showReset && activeCount > 0 && !expanded ? (
              <Button label="Reset" variant="text" size="sm" onClick={resetFilters} />
            ) : null}
          </Stack>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Box id="dashboard-filter-panel" sx={{ pt: 0.5 }}>
              {body}
            </Box>
          </Collapse>
        </Stack>
      ) : (
        body
      )}
    </Box>
  )
}
