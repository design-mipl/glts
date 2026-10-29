import { useRef, type KeyboardEvent } from 'react'
import { Box, ButtonBase, Stack, Typography } from '@mui/material'
import { site, siteFont, siteMotion, siteRadius } from '@/pages/website/theme/siteTheme'
import { applyFlow, getPressSx } from '@/pages/website/theme/applyFlowTheme'
import {
  extraServiceTabId,
  extraServices,
  type ExtraServiceId,
} from '../extraServicesPageData'

interface ExtraServiceSelectorProps {
  activeServiceId: ExtraServiceId
  onSelectService: (service: ExtraServiceId) => void
  /** id of the panel the tabs control, for `aria-controls`. */
  panelId: string
}

/**
 * Service chooser for the enquiry.
 *
 * This is a real tablist rather than three links: it changes the panel beside it and the
 * `Service` value on the form, so arrow-key navigation and `aria-selected` are required
 * for it to be usable without a mouse. Selection reads through the shared
 * gold-spine treatment used by every selectable surface in the retail flow.
 */
export function ExtraServiceSelector({
  activeServiceId,
  onSelectService,
  panelId,
}: ExtraServiceSelectorProps) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const lastIndex = extraServices.length - 1
    let nextIndex: number | null = null

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = index === lastIndex ? 0 : index + 1
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIndex = index === 0 ? lastIndex : index - 1
    } else if (event.key === 'Home') {
      nextIndex = 0
    } else if (event.key === 'End') {
      nextIndex = lastIndex
    }

    if (nextIndex === null) return
    event.preventDefault()
    const nextService = extraServices[nextIndex]
    onSelectService(nextService.id)
    tabRefs.current[nextIndex]?.focus()
  }

  return (
    <Box
      role="tablist"
      aria-label="Choose a service"
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', lg: 'repeat(3, minmax(0, 1fr))' },
        gap: { xs: 1.5, md: 2 },
        mb: { xs: 4, md: 5 },
      }}
    >
      {extraServices.map((service, index) => {
        const Icon = service.capability.icon
        const selected = service.id === activeServiceId

        return (
          <ButtonBase
            key={service.id}
            ref={(node: HTMLButtonElement | null) => {
              tabRefs.current[index] = node
            }}
            role="tab"
            id={extraServiceTabId(service.id)}
            aria-selected={selected}
            aria-controls={panelId}
            tabIndex={selected ? 0 : -1}
            onClick={() => onSelectService(service.id)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            disableRipple
            sx={{
              position: 'relative',
              display: 'block',
              width: '100%',
              textAlign: 'left',
              p: { xs: 2.25, md: 2.75 },
              borderRadius: siteRadius.card,
              overflow: 'hidden',
              border: `1px solid ${selected ? applyFlow.accentBorder : site.hairline}`,
              backgroundColor: selected ? applyFlow.accentSoft : site.surface,
              ...getPressSx(
                0.985,
                `border-color 160ms ${siteMotion.easeOut}, background-color 160ms ${siteMotion.easeOut}`,
              ),
              '&::before': {
                content: '""',
                position: 'absolute',
                insetBlock: 0,
                left: 0,
                width: '2px',
                backgroundColor: applyFlow.accent,
                transform: selected ? 'scaleY(1)' : 'scaleY(0)',
                transformOrigin: 'center',
                transition: `transform 200ms ${siteMotion.easeOut}`,
              },
              '&:focus-visible': {
                outline: 'none',
                borderColor: applyFlow.accent,
                boxShadow: `0 0 0 3px ${applyFlow.accentRing}`,
              },
              '@media (hover: hover) and (pointer: fine)': {
                '&:hover': {
                  borderColor: selected ? applyFlow.accentBorder : applyFlow.hairlineStrong,
                },
              },
              '@media (prefers-reduced-motion: reduce)': {
                '&::before': { transition: 'none' },
              },
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.25 }}>
              <Box
                aria-hidden
                sx={{
                  width: 30,
                  height: 30,
                  display: 'grid',
                  placeItems: 'center',
                  borderRadius: siteRadius.chip,
                  border: `1px solid ${selected ? applyFlow.accentBorder : site.hairline}`,
                  backgroundColor: site.surface,
                  color: selected ? applyFlow.accentInk : site.inkMuted,
                  flex: '0 0 auto',
                  transition: `color 160ms ${siteMotion.easeOut}, border-color 160ms ${siteMotion.easeOut}`,
                }}
              >
                <Icon size={15} strokeWidth={1.9} />
              </Box>

              <Typography
                sx={{
                  fontFamily: siteFont.display,
                  fontSize: 15,
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: site.ink,
                  lineHeight: 1.25,
                }}
              >
                {service.capability.title}
              </Typography>
            </Stack>

            <Typography
              sx={{
                fontFamily: siteFont.body,
                fontSize: 12.5,
                color: site.inkMuted,
                lineHeight: 1.5,
              }}
            >
              {service.capability.description}
            </Typography>
          </ButtonBase>
        )
      })}
    </Box>
  )
}
