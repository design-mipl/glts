/**
 * DESIGN DIRECTION SPIKE — dev-only, not linked from product nav.
 *
 * Route: /_preview/direction
 *
 * Purpose: react to a proposed visual language before it is applied across the
 * ~134 website and ~179 customer files. Nothing here is imported by product code;
 * tokens live locally on purpose so the spike can be deleted in one step.
 *
 * Thesis — "Clearance": a visa is a sequence of gates being cleared. The language is a
 * precision instrument, not a SaaS dashboard: light-first surfaces, hairline structure,
 * machine-readable-zone mono for anything a machine would read (references, dates, counts),
 * and exactly one luminous signal colour that only ever means "this is where you act".
 */

import { useEffect, useRef, useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { ArrowRight, Check, Fingerprint, ScanLine } from 'lucide-react'

/* ------------------------------------------------------------------ tokens */

const t = {
  /** Cool near-white. Not cream — cream + serif is the default "premium" tell. */
  canvas: '#F6F8FA',
  surface: '#FFFFFF',
  /** Deep navy-slate. Carries the brand navy without going to near-black. */
  ink: '#0B1B2B',
  inkMuted: '#4A5A6B',
  inkFaint: '#6B7A88',
  hairline: 'rgba(11, 27, 43, 0.10)',
  hairlineSoft: 'rgba(11, 27, 43, 0.06)',
  /** Signal. Amber survives from the existing brand; used ONLY as a fill, never as text. */
  signal: '#FFB020',
  signalInk: '#7A4E00',
  signalSoft: 'rgba(255, 176, 32, 0.12)',
  signalEdge: 'rgba(255, 176, 32, 0.55)',
  /** Semantic: cleared. */
  cleared: '#0E9F6E',
  clearedSoft: 'rgba(14, 159, 110, 0.10)',
  mono: '"Roboto Mono", ui-monospace, monospace',
  body: '"Roboto", system-ui, sans-serif',
  display: '"Roboto Slab", Georgia, serif',
  easeOut: 'cubic-bezier(0.23, 1, 0.32, 1)',
} as const

const mrz = {
  fontFamily: t.mono,
  fontSize: 10.5,
  fontWeight: 600,
  letterSpacing: '0.18em',
  textTransform: 'uppercase' as const,
  color: t.inkFaint,
  fontVariantNumeric: 'tabular-nums',
} as const

/* ------------------------------------------------------------------- page */

export default function DirectionSpikePage() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: t.canvas, fontFamily: t.body, color: t.ink, pb: 10 }}>
      <Box sx={{ maxWidth: 1080, mx: 'auto', px: { xs: 2.5, lg: 5 } }}>
        <Hero />
        <Section label="01 · Gates" title="Progress as clearance">
          <ClearanceRail />
        </Section>
        <Section label="02 · Surfaces" title="Cards are instruments">
          <CardRow />
        </Section>
        <Section label="03 · Actions" title="One signal colour">
          <Controls />
        </Section>
      </Box>
    </Box>
  )
}

/* ------------------------------------------------------------------- hero */

/**
 * Signature element: a scan line that sweeps the passport field once on load and
 * resolves the MRZ from placeholder glyphs to real data. It runs once — this is a
 * first-time/rare tier moment, which is the only tier where delight is affordable.
 */
function Hero() {
  const [scanned, setScanned] = useState(false)
  const reduce = useRef(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    if (reduce.current) {
      setScanned(true)
      return
    }
    const id = window.setTimeout(() => setScanned(true), 1250)
    return () => window.clearTimeout(id)
  }, [])

  return (
    <Box sx={{ pt: { xs: 7, lg: 12 }, pb: { xs: 6, lg: 9 } }}>
      <Typography sx={{ ...mrz, mb: 2.5 }}>Greenlight · Visa Clearance</Typography>
      <Typography
        sx={{
          fontFamily: t.display,
          fontWeight: 700,
          fontSize: { xs: 34, lg: 54 },
          lineHeight: 1.05,
          letterSpacing: '-0.03em',
          maxWidth: 620,
        }}
      >
        Every border is a checklist.
        <Box component="span" sx={{ display: 'block', color: t.inkFaint }}>
          We clear it for you.
        </Box>
      </Typography>

      <Box
        sx={{
          mt: 5,
          position: 'relative',
          overflow: 'hidden',
          maxWidth: 560,
          p: 3,
          bgcolor: t.surface,
          border: `1px solid ${t.hairline}`,
          borderRadius: '4px',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.25} sx={{ mb: 2 }}>
          <Fingerprint size={15} color={t.inkFaint} />
          <Typography sx={mrz}>Machine readable zone</Typography>
        </Stack>

        <Typography
          sx={{
            fontFamily: t.mono,
            fontSize: { xs: 11, lg: 13 },
            letterSpacing: '0.06em',
            lineHeight: 1.9,
            color: scanned ? t.ink : t.inkFaint,
            transition: `color 500ms ${t.easeOut}`,
            wordBreak: 'break-all',
          }}
        >
          {scanned ? 'P<INDDESAI<<ANITA<<<<<<<<<<<<<<<<<<<<<<<<<<<' : 'P<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<'}
          <br />
          {scanned ? 'M8123456<7IND9204159F3105108<<<<<<<<<<<<<<06' : '<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<'}
        </Typography>

        {/* Sweep: transform-only, runs once, removed entirely under reduced motion. */}
        {!scanned && !reduce.current ? (
          <Box
            aria-hidden
            sx={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              background: `linear-gradient(90deg, transparent, ${t.signalSoft} 45%, ${t.signal} 50%, ${t.signalSoft} 55%, transparent)`,
              animation: 'spikeScan 1.25s cubic-bezier(0.23, 1, 0.32, 1) forwards',
              '@keyframes spikeScan': {
                from: { transform: 'translateX(-100%)' },
                to: { transform: 'translateX(100%)' },
              },
            }}
          />
        ) : null}
      </Box>
    </Box>
  )
}

/* ---------------------------------------------------------------- sections */

function Section({
  label,
  title,
  children,
}: {
  label: string
  title: string
  children: React.ReactNode
}) {
  return (
    <Box sx={{ pt: { xs: 6, lg: 8 }, borderTop: `1px solid ${t.hairline}` }}>
      <Typography sx={{ ...mrz, mb: 1.25 }}>{label}</Typography>
      <Typography
        sx={{
          fontFamily: t.display,
          fontWeight: 700,
          fontSize: 24,
          letterSpacing: '-0.02em',
          mb: 3.5,
        }}
      >
        {title}
      </Typography>
      {children}
    </Box>
  )
}

/**
 * Structure encodes meaning: the rail is numbered because the visa process genuinely is
 * an ordered sequence the customer must pass through — not decoration.
 */
function ClearanceRail() {
  const gates = [
    { id: 'docs', label: 'Documents received', state: 'cleared' as const, at: '28 JAN' },
    { id: 'verify', label: 'Verification', state: 'cleared' as const, at: '02 FEB' },
    { id: 'embassy', label: 'Embassy review', state: 'active' as const, at: 'NOW' },
    { id: 'decision', label: 'Decision', state: 'pending' as const },
    { id: 'dispatch', label: 'Dispatch', state: 'pending' as const },
  ]

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 0,
        gridTemplateColumns: { xs: '1fr', lg: 'repeat(5, 1fr)' },
        border: `1px solid ${t.hairline}`,
        bgcolor: t.surface,
        borderRadius: '4px',
        overflow: 'hidden',
      }}
    >
      {gates.map((g, i) => (
        <Box
          key={g.id}
          sx={{
            p: 2.5,
            borderRight: { lg: i < gates.length - 1 ? `1px solid ${t.hairlineSoft}` : 'none' },
            borderBottom: { xs: i < gates.length - 1 ? `1px solid ${t.hairlineSoft}` : 'none', lg: 'none' },
            bgcolor: g.state === 'active' ? t.signalSoft : 'transparent',
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
            <Box
              sx={{
                width: 18,
                height: 18,
                display: 'grid',
                placeItems: 'center',
                borderRadius: '2px',
                bgcolor:
                  g.state === 'cleared' ? t.cleared : g.state === 'active' ? t.signal : 'transparent',
                border: g.state === 'pending' ? `1px solid ${t.hairline}` : 'none',
              }}
            >
              {g.state === 'cleared' ? <Check size={11} color="#fff" strokeWidth={3.5} /> : null}
              {g.state === 'active' ? <ScanLine size={11} color={t.ink} strokeWidth={2.5} /> : null}
            </Box>
            <Typography sx={{ ...mrz, fontSize: 9.5, color: t.inkFaint }}>
              {String(i + 1).padStart(2, '0')}
            </Typography>
          </Stack>
          <Typography
            sx={{
              fontSize: 13,
              fontWeight: g.state === 'pending' ? 500 : 700,
              color: g.state === 'pending' ? t.inkFaint : t.ink,
              lineHeight: 1.35,
            }}
          >
            {g.label}
          </Typography>
          {g.at ? <Typography sx={{ ...mrz, fontSize: 9.5, mt: 0.75 }}>{g.at}</Typography> : null}
        </Box>
      ))}
    </Box>
  )
}

function CardRow() {
  const items = [
    { flag: '🇯🇵', type: 'e-Visa · Tourist', who: 'Anita Desai', ref: 'GL-901', pct: 36 },
    { flag: '🇫🇷', type: 'Schengen · Short stay', who: 'Rohan Mehta', ref: 'GL-902', pct: 78 },
  ]
  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, minmax(0, 1fr))' },
      }}
    >
      {items.map(a => (
        <Box
          key={a.ref}
          sx={{
            p: 2.5,
            bgcolor: t.surface,
            border: `1px solid ${t.hairline}`,
            borderRadius: '4px',
            transition: `border-color 180ms ${t.easeOut}, transform 180ms ${t.easeOut}`,
            '@media (hover: hover) and (pointer: fine)': {
              '&:hover': { borderColor: t.signalEdge, transform: 'translateY(-2px)' },
            },
            '@media (prefers-reduced-motion: reduce)': { transition: 'border-color 180ms linear' },
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography sx={{ ...mrz, mb: 1 }}>{a.ref}</Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography sx={{ fontSize: 19 }}>{a.flag}</Typography>
                <Typography
                  sx={{ fontFamily: t.display, fontWeight: 700, fontSize: 16, letterSpacing: '-0.01em' }}
                >
                  {a.type}
                </Typography>
              </Stack>
              <Typography sx={{ fontSize: 13, color: t.inkMuted, mt: 0.5 }}>{a.who}</Typography>
            </Box>
            <ArrowRight size={16} color={t.inkFaint} />
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mt: 2.5 }}>
            <Box sx={{ flex: 1, height: 2, bgcolor: t.hairline, overflow: 'hidden' }}>
              <Box sx={{ width: `${a.pct}%`, height: '100%', bgcolor: t.signal }} />
            </Box>
            <Typography sx={{ ...mrz, fontSize: 10 }}>{a.pct}%</Typography>
          </Stack>
        </Box>
      ))}
    </Box>
  )
}

function Controls() {
  return (
    <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap alignItems="center">
      <Box
        component="button"
        sx={{
          px: 2.5,
          height: 40,
          border: 'none',
          borderRadius: '3px',
          bgcolor: t.signal,
          color: t.ink,
          fontFamily: t.body,
          fontSize: 13.5,
          fontWeight: 700,
          cursor: 'pointer',
          transition: `transform 140ms ${t.easeOut}, background-color 140ms ${t.easeOut}`,
          '&:active': { transform: 'scale(0.97)' },
          '@media (hover: hover) and (pointer: fine)': { '&:hover': { bgcolor: '#F0A310' } },
          '@media (prefers-reduced-motion: reduce)': { transition: 'background-color 140ms linear' },
        }}
      >
        Continue application
      </Box>
      <Box
        component="button"
        sx={{
          px: 2.5,
          height: 40,
          borderRadius: '3px',
          bgcolor: 'transparent',
          border: `1px solid ${t.hairline}`,
          color: t.inkMuted,
          fontFamily: t.body,
          fontSize: 13.5,
          fontWeight: 600,
          cursor: 'pointer',
          transition: `border-color 140ms ${t.easeOut}, transform 140ms ${t.easeOut}`,
          '&:active': { transform: 'scale(0.97)' },
          '@media (hover: hover) and (pointer: fine)': { '&:hover': { borderColor: t.ink, color: t.ink } },
        }}
      >
        Save and exit
      </Box>
      <Box
        component="span"
        sx={{
          px: 1.25,
          py: 0.5,
          borderRadius: '2px',
          bgcolor: t.clearedSoft,
          ...mrz,
          fontSize: 10,
          color: t.cleared,
        }}
      >
        Cleared
      </Box>
    </Stack>
  )
}
