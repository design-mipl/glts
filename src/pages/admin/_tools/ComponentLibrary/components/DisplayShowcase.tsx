import { Box, Typography, Stack, Grid } from '@mui/material'
import {
  Avatar, AvatarGroup, Badge, Tag, Spinner,
  CopyButton, NotificationBell, UserCard, ActivityFeed, Divider,
} from '@/design-system/UIComponents'

const activities = [
  { id: '1', user: { name: 'Alice Chen', avatarSrc: '' }, action: 'created', target: 'Project Alpha', timestamp: new Date(Date.now() - 3600000) },
  { id: '2', user: { name: 'Bob Smith', avatarSrc: '' }, action: 'updated', target: 'Dashboard config', timestamp: new Date(Date.now() - 7200000) },
  { id: '3', user: { name: 'Carol White', avatarSrc: '' }, action: 'deleted', target: 'Old report', timestamp: new Date(Date.now() - 86400000) },
]

export function DisplayShowcase() {
  return (
    <Box>
      <Grid container spacing={4}>
        {/* Avatar */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h3" sx={{ mb: 1.5 }}>Avatar</Typography>
          <Stack direction="row" gap={2} alignItems="center" flexWrap="wrap">
            <Avatar size="xs" name="Alice Chen" />
            <Avatar size="sm" name="Bob Smith" />
            <Avatar size="md" name="Carol White" />
            <Avatar size="lg" name="Dave Jones" />
            <Avatar size="xl" name="Eve Taylor" />
          </Stack>
          <Stack direction="row" gap={2} alignItems="center" sx={{ mt: 2 }}>
            <Avatar name="Alice" src="https://i.pravatar.cc/150?img=1" />
            <Avatar name="Bob" src="https://i.pravatar.cc/150?img=2" />
            <Avatar name="Carol" src="https://i.pravatar.cc/150?img=3" />
          </Stack>
        </Grid>

        {/* AvatarGroup */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h3" sx={{ mb: 1.5 }}>AvatarGroup</Typography>
          <Stack gap={2}>
            <AvatarGroup
              users={[
                { name: 'Alice' }, { name: 'Bob' }, { name: 'Carol' },
                { name: 'Dave' }, { name: 'Eve' },
              ]}
              max={4}
              size="sm"
            />
            <AvatarGroup
              users={[
                { name: 'Alice' }, { name: 'Bob' }, { name: 'Carol' },
                { name: 'Dave' }, { name: 'Eve' }, { name: 'Frank' },
              ]}
              max={3}
              size="md"
            />
          </Stack>
        </Grid>

        <Grid size={12}><Divider /></Grid>

        {/* Badge (standalone label badge) */}
        <Grid size={12}>
          <Typography variant="h3" sx={{ mb: 1.5 }}>Badge</Typography>
          <Stack direction="row" gap={2} flexWrap="wrap" alignItems="center">
            <Badge label="Default" />
            <Badge label="Primary" color="primary" />
            <Badge label="Success" color="success" />
            <Badge label="Warning" color="warning" />
            <Badge label="Error" color="error" />
            <Badge label="Info" color="info" />
            <Badge label="Neutral" color="neutral" />
            <Badge label="Outlined" color="primary" variant="outlined" />
            <Badge label="Soft" color="primary" variant="soft" />
            <Badge label="Dot" color="success" dot />
          </Stack>
        </Grid>

        <Grid size={12}><Divider /></Grid>

        {/* Tag */}
        <Grid size={12}>
          <Typography variant="h3" sx={{ mb: 1.5 }}>Tag</Typography>
          <Stack direction="row" gap={1.5} flexWrap="wrap">
            <Tag label="Default" />
            <Tag label="Success" variant="success" />
            <Tag label="Warning" variant="warning" />
            <Tag label="Error" variant="error" />
            <Tag label="Info" variant="info" />
            <Tag label="Neutral" variant="neutral" />
            <Tag label="Removable" variant="info" onDelete={() => {}} />
          </Stack>
        </Grid>

        <Grid size={12}><Divider /></Grid>

        {/* Spinner */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="h3" sx={{ mb: 1.5 }}>Spinner</Typography>
          <Stack direction="row" gap={3} alignItems="center">
            <Spinner size="sm" />
            <Spinner size="md" />
            <Spinner size="lg" />
          </Stack>
        </Grid>

        {/* CopyButton */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="h3" sx={{ mb: 1.5 }}>CopyButton</Typography>
          <Stack direction="row" gap={2} alignItems="center">
            <CopyButton value="Text to copy" />
            <CopyButton value="Another value" label="Copy ID" />
          </Stack>
        </Grid>

        {/* NotificationBell */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="h3" sx={{ mb: 1.5 }}>NotificationBell</Typography>
          <Stack direction="row" gap={2} alignItems="center">
            <NotificationBell count={0} onClick={() => {}} />
            <NotificationBell count={3} onClick={() => {}} />
            <NotificationBell count={99} onClick={() => {}} />
          </Stack>
        </Grid>

        <Grid size={12}><Divider /></Grid>

        {/* UserCard */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h3" sx={{ mb: 1.5 }}>UserCard</Typography>
          <Stack gap={2}>
            <UserCard name="Sarah Johnson" role="Admin" email="sarah@example.com" />
            <UserCard name="Mike Davis" role="Editor" email="mike@example.com" avatarSrc="https://i.pravatar.cc/150?img=5" />
          </Stack>
        </Grid>

        {/* ActivityFeed */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h3" sx={{ mb: 1.5 }}>ActivityFeed</Typography>
          <ActivityFeed items={activities} />
        </Grid>
      </Grid>
    </Box>
  )
}

