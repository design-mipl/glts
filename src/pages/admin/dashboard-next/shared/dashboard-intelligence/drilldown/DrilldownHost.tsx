import { Box, Stack, Typography } from '@mui/material'
import { Drawer, Button, Modal } from '@/design-system/UIComponents'
import { useDrilldown } from './DrilldownContext'

export interface DrilldownHostProps {
  /** Optional custom body renderer for the active payload. */
  renderBody?: (payload: NonNullable<ReturnType<typeof useDrilldown>['active']>) => React.ReactNode
}

/**
 * Hosts drawer / dialog / slide-over for the shared drilldown engine.
 * Lazy-friendly: only mounts content when a drilldown is active.
 */
export function DrilldownHost({ renderBody }: DrilldownHostProps) {
  const { active, history, closeDrilldown, popDrilldown } = useDrilldown()

  if (!active) return null

  const body = (
    <Stack spacing={2} sx={{ p: 0.5 }}>
      {active.trail && active.trail.length > 0 ? (
        <Typography variant="caption" color="text.secondary">
          {active.trail.map((step) => step.label).join(' → ')} → {active.title}
        </Typography>
      ) : null}
      {active.subtitle ? (
        <Typography variant="body2" color="text.secondary">
          {active.subtitle}
        </Typography>
      ) : null}
      {renderBody ? (
        renderBody(active)
      ) : (
        <Box>
          <Typography variant="body2" color="text.secondary">
            Drilldown framework ready. Connect domain detail views for{' '}
            <strong>{active.entityType}</strong>
            {active.entityId ? ` · ${active.entityId}` : ''}.
          </Typography>
          {active.meta ? (
            <Box
              component="pre"
              sx={{
                mt: 2,
                p: 1.5,
                borderRadius: 1,
                bgcolor: 'action.hover',
                fontSize: 12,
                overflow: 'auto',
              }}
            >
              {JSON.stringify(active.meta, null, 2)}
            </Box>
          ) : null}
        </Box>
      )}
      <Stack direction="row" spacing={1} justifyContent="flex-end">
        {history.length > 0 ? (
          <Button label="Back" variant="outlined" size="sm" onClick={popDrilldown} />
        ) : null}
        <Button label="Close" variant="contained" size="sm" onClick={closeDrilldown} />
      </Stack>
    </Stack>
  )

  const surface = active.surface ?? 'drawer'

  if (surface === 'dialog') {
    return (
      <Modal
        open
        onClose={closeDrilldown}
        title={active.title}
        size="md"
      >
        {body}
      </Modal>
    )
  }

  return (
    <Drawer
      open
      onClose={closeDrilldown}
      title={active.title}
      anchor="right"
      width={surface === 'slide-over' ? 520 : 440}
    >
      {body}
    </Drawer>
  )
}
