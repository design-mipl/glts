import { Box, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { FORM_CONTROL } from '@/design-system/formControl'
import {
  COUNTRY_WORKSPACE_SEARCH_ROW_HEIGHT_PX,
  COUNTRY_WORKSPACE_SEARCH_ROW_SX,
} from '../../config/countryWorkspaceLayout'
import type { WorkspacePanelMeta } from '../../utils/countryWorkspacePanelUtils'

interface WorkspacePanelHeaderProps {
  meta: WorkspacePanelMeta
  actions?: ReactNode
}

export function WorkspacePanelHeader({ meta, actions }: WorkspacePanelHeaderProps) {
  return (
    <Box
      sx={{
        ...COUNTRY_WORKSPACE_SEARCH_ROW_SX,
        bgcolor: 'background.paper',
        px: { xs: 2, sm: 2.5, md: 3 },
        minHeight: COUNTRY_WORKSPACE_SEARCH_ROW_HEIGHT_PX,
        boxSizing: 'border-box',
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={1.5}
        sx={{ width: '100%', minWidth: 0, flex: 1 }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="body2"
            fontWeight={FORM_CONTROL.labelFontWeight}
            color="text.primary"
            sx={{
              fontSize: FORM_CONTROL.fontSize,
              lineHeight: 1.2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {meta.title}
          </Typography>
        </Box>
        {actions ? (
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ flexShrink: 0 }}>
            {actions}
          </Stack>
        ) : null}
      </Stack>
    </Box>
  )
}
