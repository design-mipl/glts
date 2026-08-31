import { useMemo } from 'react'
import { Box, Grid, Stack } from '@mui/material'
import { PublicContainer } from '@/pages/website/components/PublicContainer'
import { applyCanvasSx } from '@/pages/website/theme/applyFlowTheme'
import { listStoredDocuments } from '@/shared/services/storedDocumentsService'
import { RetailAccountNav } from './RetailAccountNav'
import { RetailProfileCard } from './RetailProfileCard'
import { RetailApplicationsPanel } from './RetailApplicationsPanel'
import { RetailDocumentsSection } from './RetailDocumentsSection'

export type RetailAccountSection = 'applications' | 'documents'

/**
 * Website-style account: profile card + two links on the left, one section at a time on
 * the right. Profile is identity that stays on screen, not a destination behind a tab.
 *
 * Breakpoint note: this project's scale is shifted (`md` is 428px, `xl` is 900px — see
 * `src/design-system/breakpoints.ts`), so the two-column split keys off `xl`.
 */
export function RetailAccountPage({ section }: { section: RetailAccountSection }) {
  const documentCount = useMemo(() => listStoredDocuments().length, [])

  return (
    <Box sx={{ ...applyCanvasSx, py: { xs: 3, lg: 5 } }}>
      <PublicContainer>
        <Grid container spacing={{ xs: 3, lg: 4 }} alignItems="flex-start">
          <Grid size={{ xs: 12, xl: 4 }}>
            <Box sx={{ position: { xl: 'sticky' }, top: { xl: 88 } }}>
              <Stack spacing={2}>
                <RetailProfileCard />
                <RetailAccountNav documentCount={documentCount} />
              </Stack>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, xl: 8 }}>
            {section === 'applications' ? <RetailApplicationsPanel /> : <RetailDocumentsSection />}
          </Grid>
        </Grid>
      </PublicContainer>
    </Box>
  )
}
