import { useState } from 'react'
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import Typography from '@mui/material/Typography'
import type { SxProps, Theme } from '@mui/material/styles'
import type { ReactNode } from 'react'
import { tokens } from '../../../tokens'

export interface FormSectionProps {
  title?: string
  description?: string
  children: ReactNode
  columns?: 1 | 2 | 3
  divider?: boolean
  collapsible?: boolean
  defaultCollapsed?: boolean
  sx?: SxProps<Theme>
}

export default function FormSection({
  title,
  description,
  children,
  columns = 1,
  divider = true,
  collapsible = false,
  defaultCollapsed = false,
  sx,
}: FormSectionProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed)

  return (
    <Box
      sx={[
        {
          display: 'flex',
          flexDirection: 'column',
          gap: tokens.spacing[4],
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      {divider ? <Divider /> : null}

      {(title || description) ? (
        <Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: tokens.spacing[3],
            }}
          >
            <Box>
              {title ? <Typography variant="h6">{title}</Typography> : null}
              {description ? (
                <Typography variant="body2" color="text.secondary" sx={{ mt: tokens.spacing[1] }}>
                  {description}
                </Typography>
              ) : null}
            </Box>
            {collapsible ? (
              <IconButton
                aria-label={collapsed ? 'Expand section' : 'Collapse section'}
                onClick={() => setCollapsed((value) => !value)}
                sx={{
                  transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
                  transition: tokens.transition.normal,
                }}
              >
                <KeyboardArrowDownIcon />
              </IconButton>
            ) : null}
          </Box>
        </Box>
      ) : null}

      <Collapse in={!collapsed}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: `repeat(${columns}, minmax(0, 1fr))`,
            },
            gap: tokens.spacing[4],
          }}
        >
          {children}
        </Box>
      </Collapse>
    </Box>
  )
}
