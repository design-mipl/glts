import { Box, Stack, Typography } from '@mui/material'
import { FileText, LayoutDashboard, Users } from 'lucide-react'
import { Badge, BaseCard } from '@/design-system/UIComponents'
import { loadSession } from '@/shared/auth/session'
import { AdminPageHeader } from '../../components/AdminPageHeader'

export function InternalDashboard() {
  const session = loadSession()
  const cards = [
    { icon: LayoutDashboard, title: 'Processing queue', desc: '12 urgent · 48 in review', tone: 'warning' as const },
    { icon: FileText, title: 'Document verification', desc: 'Passport & supporting docs', tone: 'info' as const },
    { icon: Users, title: 'Team assignments', desc: 'Marine, corporate & B2B lanes', tone: 'success' as const },
  ]

  return (
    <Box>
      <AdminPageHeader
        eyebrow="Operations"
        title="Operations dashboard"
        description={`Welcome${session?.email ? `, ${session.email}` : ''}. Process applications, verify documents, and manage embassy workflows inside the GLTS admin portal.`}
        meta={<Badge label="Internal module" color="info" />}
      />

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        {cards.map(({ icon: Icon, title, desc, tone }) => (
          <BaseCard key={title} sx={{ flex: 1 }}>
            <Stack spacing={1.5}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  bgcolor: `${tone}.main`,
                  color: `${tone}.contrastText`,
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <Icon size={18} />
              </Box>
              <Box>
                <Typography variant="subtitle2" fontWeight={700}>
                  {title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {desc}
                </Typography>
              </Box>
            </Stack>
          </BaseCard>
        ))}
      </Stack>
    </Box>
  )
}
