import { Fragment } from 'react'
import { Box, Typography } from '@mui/material'
import { Plane } from 'lucide-react'
import { publicFonts, publicTypography, usePublicBrandColors } from '@/shared/theme/publicBrand'
import { applyFlow, accentGoldRgb, tabularNums } from '@/pages/website-v2/theme/applyFlowTheme'

const timelineSteps = [
  { title: 'Submit', desc: 'Documents reviewed in 4h' },
  { title: 'Appointment', desc: 'VFS biometrics booked' },
  { title: 'Embassy', desc: 'Decision in 10–14 days' },
  { title: 'Collection', desc: 'Courier or pickup' },
]

function stepIndex(i: number) {
  return String(i + 1).padStart(2, '0')
}

export function TimelineSection() {
  const colors = usePublicBrandColors()

  return (
    <Box>
      <Typography
        sx={{
          fontFamily: publicFonts.heading,
          fontWeight: 800,
          fontSize: publicTypography.h3,
          color: colors.navy,
          mb: 3,
        }}
      >
        How your application moves
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'stretch', gap: 0 }}>
        {timelineSteps.map((step, i) => {
          const isFirst = i === 0
          return (
            <Fragment key={step.title}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'row', md: 'column' },
                  alignItems: { xs: 'flex-start', md: 'center' },
                  gap: { xs: 2, md: 1.25 },
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    width: 46,
                    height: 46,
                    flexShrink: 0,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: colors.navy,
                    color: '#fff',
                    fontFamily: publicFonts.mono,
                    fontWeight: 800,
                    fontSize: '15px',
                    ...tabularNums,
                    boxShadow: isFirst ? `0 0 0 4px rgba(${accentGoldRgb}, 0.22)` : 'none',
                    border: isFirst ? `2px solid ${applyFlow.accent}` : '2px solid transparent',
                  }}
                >
                  {stepIndex(i)}
                </Box>
                <Box sx={{ textAlign: { md: 'center' }, px: { md: 1 } }}>
                  <Typography sx={{ fontWeight: 700, color: colors.navy, fontSize: '14px' }}>
                    {step.title}
                  </Typography>
                  <Typography sx={{ color: colors.textSecondary, fontSize: '12.5px', mt: 0.25 }}>
                    {step.desc}
                  </Typography>
                </Box>
              </Box>

              {i < timelineSteps.length - 1 && (
                <Box
                  aria-hidden
                  sx={{
                    display: { xs: 'flex', md: 'flex' },
                    flexDirection: { xs: 'row', md: 'column' },
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: { xs: '0 0 auto', md: 1 },
                    minWidth: { xs: 46, md: 0 },
                    minHeight: { xs: 32, md: 46 },
                    ml: { xs: '23px', md: 0 },
                    my: { xs: 0.5, md: 0 },
                  }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      flex: 1,
                      width: { xs: 2, md: '100%' },
                      height: { xs: '100%', md: 2 },
                      backgroundImage: `linear-gradient(${colors.border}, ${colors.border})`,
                      backgroundRepeat: 'repeat',
                      backgroundSize: { xs: '2px 6px', md: '10px 2px' },
                      display: { xs: 'block', md: 'flex' },
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        display: { xs: 'none', md: 'flex' },
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%) rotate(90deg)',
                        bgcolor: colors.surface,
                        px: 0.5,
                      }}
                    >
                      <Plane size={13} color={colors.textMuted} strokeWidth={2} />
                    </Box>
                  </Box>
                </Box>
              )}
            </Fragment>
          )
        })}
      </Box>
    </Box>
  )
}
