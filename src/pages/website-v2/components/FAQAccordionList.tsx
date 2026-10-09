import { useId, useState } from 'react'
import { Box, Collapse, Typography, useMediaQuery } from '@mui/material'
import { Minus, Plus } from 'lucide-react'
import { websiteDesignSystem as ds } from '../theme/websiteDesignSystem'

export interface FAQItem {
  q: string
  a: string
}

interface FAQAccordionListProps {
  faqs: readonly FAQItem[]
  displayOrder?: readonly number[]
  columns?: 1 | 2
  columnsAt?: number
  ariaLabel?: string
}

/** Shared accessible FAQ accordion rows; section layout remains owned by each page variant. */
export function FAQAccordionList({
  faqs,
  displayOrder,
  columns = 1,
  columnsAt = ds.breakpoint.tablet,
  ariaLabel = 'Frequently asked questions',
}: FAQAccordionListProps) {
  const [expanded, setExpanded] = useState<Set<number>>(() => new Set())
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const idPrefix = useId().replace(/:/g, '')
  const orderedFaqs = faqs.map((item, sourceIndex) => ({ item, sourceIndex }))

  if (displayOrder) {
    orderedFaqs.sort((first, second) => {
      const firstPosition = displayOrder.indexOf(first.sourceIndex)
      const secondPosition = displayOrder.indexOf(second.sourceIndex)
      return (firstPosition < 0 ? faqs.length + first.sourceIndex : firstPosition)
        - (secondPosition < 0 ? faqs.length + second.sourceIndex : secondPosition)
    })
  }

  const toggle = (index: number) => {
    setExpanded((current) => {
      const next = new Set(current)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  return (
    <Box
      component="ol"
      role="list"
      aria-label={ariaLabel}
      sx={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr)',
        gap: `${ds.component.faq.gap}px`,
        listStyle: 'none',
        p: 0,
        m: 0,
        ...(columns === 2 && {
          [`@media (min-width: ${columnsAt}px)`]: {
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          },
        }),
      }}
    >
      {orderedFaqs.map(({ item: { q, a }, sourceIndex }) => {
        const isOpen = expanded.has(sourceIndex)
        const buttonId = `${idPrefix}-question-${sourceIndex}`
        const panelId = `${idPrefix}-answer-${sourceIndex}`

        return (
          <Box
            component="li"
            key={q}
            sx={{
              alignSelf: 'start',
              minWidth: 0,
              bgcolor: ds.color.surface,
              border: `1px solid ${isOpen ? ds.color.brand : ds.color.border}`,
              borderRadius: `${ds.component.faq.radius}px`,
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.035)',
              overflow: 'hidden',
              transition: prefersReducedMotion ? 'none' : 'border-color 180ms ease, box-shadow 180ms ease',
            }}
          >
            <Box
              id={buttonId}
              component="button"
              type="button"
              onClick={() => toggle(sourceIndex)}
              aria-expanded={isOpen}
              aria-controls={panelId}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: `${ds.component.faq.gap}px`,
                width: '100%',
                minHeight: `${ds.component.faq.rowMinHeight}px`,
                px: `${ds.component.faq.rowPaddingX}px`,
                py: `${ds.component.faq.rowPaddingY}px`,
                color: ds.color.navy,
                bgcolor: isOpen ? ds.color.successSurface : 'transparent',
                border: 0,
                textAlign: 'left',
                fontFamily: ds.fonts.ui,
                cursor: 'pointer',
                transition: prefersReducedMotion ? 'none' : 'background-color 180ms ease',
                '&:hover': { bgcolor: ds.color.surfaceMuted },
                '&:focus-visible': { outline: `3px solid ${ds.color.focus}`, outlineOffset: -3 },
              }}
            >
              <Typography
                component="span"
                sx={{
                  minWidth: 0,
                  color: 'inherit',
                  fontSize: `${ds.component.faq.questionSize}px`,
                  fontWeight: ds.component.faq.questionWeight,
                  lineHeight: ds.component.faq.questionLineHeight,
                }}
              >
                {q}
              </Typography>
              <Box
                component="span"
                aria-hidden="true"
                sx={{
                  display: 'grid',
                  placeItems: 'center',
                  flex: '0 0 auto',
                  width: `${ds.component.faq.iconContainerSize}px`,
                  height: `${ds.component.faq.iconContainerSize}px`,
                  color: isOpen ? ds.color.brandHover : ds.color.navy,
                }}
              >
                {isOpen
                  ? <Minus size={ds.component.faq.iconSize} strokeWidth={ds.icon.strokeWidth} />
                  : <Plus size={ds.component.faq.iconSize} strokeWidth={ds.icon.strokeWidth} />}
              </Box>
            </Box>
            <Collapse
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              in={isOpen}
              timeout={prefersReducedMotion ? 0 : ds.component.faq.transitionMs}
            >
              <Typography
                component="p"
                sx={{
                  m: 0,
                  px: `${ds.component.faq.rowPaddingX}px`,
                  pb: `${ds.component.faq.rowPaddingY}px`,
                  color: ds.color.textSecondary,
                  fontSize: `${ds.component.faq.answerSize}px`,
                  lineHeight: ds.component.faq.answerLineHeight,
                }}
              >
                {a}
              </Typography>
            </Collapse>
          </Box>
        )
      })}
    </Box>
  )
}
