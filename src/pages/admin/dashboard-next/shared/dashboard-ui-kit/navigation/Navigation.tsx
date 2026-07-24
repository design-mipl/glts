import type { ReactNode } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import type { SxProps, Theme } from '@mui/material/styles'
import { Card, CardContent, Tabs, TabsContent, TabsList, TabsTrigger } from '../shadcn'
import { UI_KIT_SPACING, UI_KIT_Z, uiKitPad } from '../tokens'

export interface UiKitTabItem {
  id: string
  label: string
  content: ReactNode
  icon?: ReactNode
  disabled?: boolean
  hidden?: boolean
}

export interface WorkspaceTabsProps {
  tabs: UiKitTabItem[]
  value?: string
  defaultTab?: string
  onChange?: (id: string) => void
  toolbar?: ReactNode
  sx?: SxProps<Theme>
}

export function WorkspaceTabs({
  tabs,
  value,
  defaultTab,
  onChange,
  toolbar,
  sx,
}: WorkspaceTabsProps) {
  const visible = tabs.filter((t) => !t.hidden)
  const active = value ?? defaultTab ?? visible[0]?.id ?? ''

  return (
    <Card
      elevation="raised"
      sx={{
        overflow: 'hidden',
        ...((sx as object) ?? {}),
      }}
    >
      <Tabs
        value={active}
        onValueChange={(next) => onChange?.(next)}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'stretch', sm: 'center' },
            justifyContent: 'space-between',
            px: UI_KIT_SPACING.field,
            gap: 1,
          }}
        >
          <TabsList aria-label="Dashboard workspace tabs">
            {visible.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} disabled={tab.disabled}>
                {tab.icon}
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {toolbar ? <Box sx={{ px: 1, py: 1 }}>{toolbar}</Box> : null}
        </Box>
        {visible.map((tab) => (
          <TabsContent key={tab.id} value={tab.id}>
            <CardContent sx={{ p: uiKitPad(), pt: UI_KIT_SPACING.stack }}>
              {tab.content}
            </CardContent>
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  )
}

export interface FilterBarProps {
  children: ReactNode
  sx?: SxProps<Theme>
}

/** Soft surface for filter controls — no visual noise. */
export function FilterBar({ children, sx }: FilterBarProps) {
  return (
    <Card
      elevation="raised"
      sx={{
        ...((sx as object) ?? {}),
      }}
    >
      <CardContent sx={{ py: UI_KIT_SPACING.cluster }}>{children}</CardContent>
    </Card>
  )
}

export interface StoryNavProps {
  items: Array<{ id: string; label: string; href?: string }>
  activeId?: string
  onSelect?: (id: string) => void
  sx?: SxProps<Theme>
}

/** Lightweight in-page story anchors (Hero → Executive → Analytics…). */
export function StoryNav({ items, activeId, onSelect, sx }: StoryNavProps) {
  return (
    <Stack
      direction="row"
      spacing={UI_KIT_SPACING.field}
      useFlexGap
      flexWrap="wrap"
      component="nav"
      aria-label="Dashboard sections"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: UI_KIT_Z.sticky,
        py: 1,
        ...((sx as object) ?? {}),
      }}
    >
      {items.map((item) => {
        const active = item.id === activeId
        return (
          <Box
            key={item.id}
            component="button"
            type="button"
            onClick={() => onSelect?.(item.id)}
            sx={{
              border: 'none',
              bgcolor: 'transparent',
              cursor: 'pointer',
              px: 1,
              py: 0.5,
              borderBottom: '2px solid',
              borderColor: active ? 'primary.main' : 'transparent',
              '&:focus-visible': {
                outline: (theme) => `2px solid ${theme.palette.primary.main}`,
                outlineOffset: 2,
              },
            }}
          >
            <Typography
              variant="caption"
              fontWeight={active ? 700 : 600}
              color={active ? 'text.primary' : 'text.secondary'}
            >
              {item.label}
            </Typography>
          </Box>
        )
      })}
    </Stack>
  )
}
