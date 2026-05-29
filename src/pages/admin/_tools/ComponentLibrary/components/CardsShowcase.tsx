import { Box, Typography, Grid } from '@mui/material'
import {
  BaseCard, StatCard, MetricCard, ActionCard,
  ListCard, ProfileCard, ImageCard, SummaryCard,
  Button,
} from '@/design-system/UIComponents'
import { Users, DollarSign, TrendingUp, ShoppingCart, Edit, Trash2, Eye } from 'lucide-react'

export function CardsShowcase() {
  return (
    <Box>
      <Grid container spacing={3}>
        {/* BaseCard */}
        <Grid size={12}>
          <Typography variant="h3" sx={{ mb: 1.5 }}>BaseCard</Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <BaseCard>
                <Typography variant="body2">A simple base card with any content inside.</Typography>
              </BaseCard>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <BaseCard hoverable>
                <Typography variant="body2">Hoverable â€” try hovering over this card.</Typography>
              </BaseCard>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <BaseCard elevation={4}>
                <Typography variant="body2">Higher elevation with deeper shadow.</Typography>
              </BaseCard>
            </Grid>
          </Grid>
        </Grid>

        {/* StatCard */}
        <Grid size={12}>
          <Typography variant="h3" sx={{ mb: 1.5 }}>StatCard</Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard label="Total Users" value="12,480" icon={<Users size={20} />} delta={12.4} deltaLabel="vs last month" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard label="Revenue" value="$48,295" icon={<DollarSign size={20} />} delta={8.4} deltaLabel="vs last month" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard label="Growth" value="23.5%" icon={<TrendingUp size={20} />} delta={-3.2} deltaLabel="vs last month" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard label="Orders" value="1,024" icon={<ShoppingCart size={20} />} delta={5.1} deltaLabel="vs last month" />
            </Grid>
          </Grid>
        </Grid>

        {/* MetricCard */}
        <Grid size={12}>
          <Typography variant="h3" sx={{ mb: 1.5 }}>MetricCard</Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <MetricCard
                title="Conversion Metrics"
                metrics={[
                  { label: 'Conversion Rate', value: '3.24%', delta: 0.8 },
                  { label: 'Click-through Rate', value: '8.6%', delta: 1.2 },
                ]}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <MetricCard
                title="Engagement"
                metrics={[
                  { label: 'Avg Session', value: '4m 32s', delta: -12 },
                  { label: 'Bounce Rate', value: '42.1%', delta: -2.3 },
                ]}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <MetricCard
                title="Revenue Breakdown"
                metrics={[
                  { label: 'MRR', value: '$12,480', delta: 8.2 },
                  { label: 'ARR', value: '$149,760', delta: 8.2 },
                ]}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* ActionCard */}
        <Grid size={12}>
          <Typography variant="h3" sx={{ mb: 1.5 }}>ActionCard</Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <ActionCard
                title="Export Report"
                description="Download your analytics as PDF or CSV"
                icon={<TrendingUp size={20} />}
                onClick={() => {}}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <ActionCard
                title="Manage Team"
                description="Invite members and set permissions"
                icon={<Users size={20} />}
                onClick={() => {}}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <ActionCard
                title="Settings"
                description="Configure your workspace preferences"
                icon={<ShoppingCart size={20} />}
                badge="New"
                onClick={() => {}}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* ProfileCard */}
        <Grid size={12}>
          <Typography variant="h3" sx={{ mb: 1.5 }}>ProfileCard</Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <ProfileCard
                name="Sarah Johnson"
                subtitle="Product Designer"
                description="5 years experience in UX"
                stats={[{ label: 'Projects', value: 12 }, { label: 'Tasks', value: 48 }]}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <ProfileCard
                name="Mike Davis"
                subtitle="Engineer"
                avatarSrc="https://i.pravatar.cc/150?img=5"
                badges={[{ label: 'Senior', color: 'primary' }, { label: 'Active', color: 'success' }]}
                stats={[{ label: 'Commits', value: 342 }, { label: 'PRs', value: 28 }]}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* ImageCard */}
        <Grid size={12}>
          <Typography variant="h3" sx={{ mb: 1.5 }}>ImageCard</Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <ImageCard
                image="https://picsum.photos/seed/card1/400/200"
                title="Mountain Retreat"
                description="A peaceful escape in the mountains."
                actions={
                  <Button variant="outlined" startIcon={<Eye size={14} />}>View</Button>
                }
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <ImageCard
                image="https://picsum.photos/seed/card2/400/200"
                title="Urban Design"
                description="Modern architecture in the city."
                badges={[{ label: 'Featured', color: '#6366F1' }]}
                actions={
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button variant="outlined" startIcon={<Edit size={14} />}>Edit</Button>
                    <Button variant="text" color="error" startIcon={<Trash2 size={14} />}>Delete</Button>
                  </Box>
                }
              />
            </Grid>
          </Grid>
        </Grid>

        {/* ListCard & SummaryCard */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h3" sx={{ mb: 1.5 }}>ListCard</Typography>
          <ListCard
            title="Recent Activity"
            items={[
              { id: '1', primary: 'User registered', secondary: '2 minutes ago' },
              { id: '2', primary: 'Order #1042 placed', secondary: '15 minutes ago' },
              { id: '3', primary: 'Report generated', secondary: '1 hour ago' },
              { id: '4', primary: 'Backup completed', secondary: '3 hours ago' },
            ]}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h3" sx={{ mb: 1.5 }}>SummaryCard</Typography>
          <SummaryCard
            title="Account Summary"
            fields={[
              { label: 'Plan', value: 'Pro' },
              { label: 'Status', value: 'Active' },
              { label: 'Renewal', value: 'Jan 1, 2026' },
              { label: 'Seats', value: '12 / 20' },
            ]}
            columns={2}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

