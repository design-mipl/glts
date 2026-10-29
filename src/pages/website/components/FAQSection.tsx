import { useState } from 'react'
import { Box, Collapse, Typography } from '@mui/material'
import { Minus, Plus } from 'lucide-react'
import { PaperSection, PaperSectionHeading } from './PaperSection'
import { accent, ink, paper, paperFont, paperMotion } from '../theme/sitePaper'

export interface FAQItem {
  q: string
  a: string
}

export interface FAQSectionProps {
  faqs: FAQItem[]
  title?: string
}

const DEFAULT_TITLE = 'Common questions'

/**
 * FAQ — a single hairline-divided list of disclosures.
 *
 * Each row is its own disclosure and several can be open at once: people scanning an FAQ
 * are usually comparing two answers, and an accordion that closes the previous one makes
 * that impossible.
 *
 * The `01 / 02 / 03` index that ran down the left of each question is gone. Questions are
 * not a sequence — nobody reads an FAQ in order — so the numbers were labelling nothing.
 *
 * Motion: the disclosure is the one place on this page where something genuinely appears,
 * so it animates. 200ms, strong ease-out, height only on the panel MUI already measures.
 * The `+ / −` toggle carries the state, so the row still reads correctly with motion off.
 */
export function FAQSection({ faqs, title = DEFAULT_TITLE }: FAQSectionProps) {
  const [openIds, setOpenIds] = useState<Set<number>>(new Set())

  function toggle(index: number) {
    setOpenIds((current) => {
      const next = new Set(current)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  return (
    <PaperSection id="faq" ground="base" divided>
      <PaperSectionHeading
        eyebrow="Questions"
        title={title}
        lead="Short answers to what people ask most. Anything not covered here, a specialist can answer directly."
      />

      <Box sx={{ borderTop: `1px solid ${paper.hairline}`, maxWidth: 860 }}>
        {faqs.map((faq, index) => {
          const isOpen = openIds.has(index)
          const panelId = `faq-panel-${index}`
          const buttonId = `faq-button-${index}`

          return (
            <Box key={faq.q} sx={{ borderBottom: `1px solid ${paper.hairline}` }}>
              <Box
                component="button"
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(index)}
                sx={{
                  appearance: 'none',
                  width: '100%',
                  m: 0,
                  px: 0,
                  py: { xs: 2.25, xl: 2.75 },
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 2.5,
                  fontFamily: 'inherit',
                  color: isOpen ? accent.ink : ink.strong,
                  transition: `color ${paperMotion.hoverMs}ms ease`,

                  '&:focus-visible': {
                    outline: `2px solid ${ink.strong}`,
                    outlineOffset: 3,
                    borderRadius: 4,
                  },
                  '@media (hover: hover) and (pointer: fine)': {
                    '&:hover': { color: accent.ink },
                  },
                }}
              >
                <Typography
                  component="span"
                  sx={{
                    fontFamily: paperFont.display,
                    fontSize: { xs: 16, xl: 17.5 },
                    fontWeight: 700,
                    letterSpacing: '-0.015em',
                    lineHeight: 1.35,
                    color: 'inherit',
                  }}
                >
                  {faq.q}
                </Typography>

                <Box
                  aria-hidden
                  sx={{
                    flex: '0 0 auto',
                    width: 30,
                    height: 30,
                    display: 'grid',
                    placeItems: 'center',
                    borderRadius: '50%',
                    border: `1px solid ${isOpen ? accent.border : paper.hairlineStrong}`,
                    backgroundColor: isOpen ? accent.softer : 'transparent',
                    color: isOpen ? accent.ink : ink.muted,
                    transition: `border-color ${paperMotion.hoverMs}ms ease, background-color ${paperMotion.hoverMs}ms ease, color ${paperMotion.hoverMs}ms ease`,
                  }}
                >
                  {isOpen ? <Minus size={15} /> : <Plus size={15} />}
                </Box>
              </Box>

              <Collapse
                in={isOpen}
                timeout={paperMotion.overlayMs}
                easing={paperMotion.easeOut}
                unmountOnExit
              >
                <Typography
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  sx={{
                    pb: { xs: 2.5, xl: 3 },
                    pr: { xs: 0, xl: 7 },
                    fontFamily: paperFont.body,
                    fontSize: 15,
                    lineHeight: 1.7,
                    color: ink.muted,
                  }}
                >
                  {faq.a}
                </Typography>
              </Collapse>
            </Box>
          )
        })}
      </Box>
    </PaperSection>
  )
}
