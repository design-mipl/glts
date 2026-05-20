import { useState, useMemo, useEffect } from 'react'
import { Box, Stack, Grid, Typography, Divider, Paper, Tooltip, FormControlLabel } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import {
  DollarSign, Users as UsersIcon, ShoppingCart, TrendingUp,
  FileText, Edit, Trash2, Eye, Plus, Check,
  AlertCircle, CheckCircle, Zap, Star,
} from 'lucide-react'
import dayjs from 'dayjs'

import PageHeader from '@/components/layout/PageHeader'
import { useFoundationBreakpointIndex, useFoundationBreakpointKey } from '@/design-system/hooks/useResponsiveValue'
import { useFoundationTheme } from '@/design-system/ThemeContext'
import { generateScale, generateNeutralScale, tokens } from '@/design-system/tokens'

// All DS imports from barrel
import {
  Alert,
  AreaChart,
  Avatar,
  AvatarGroup,
  BackButton,
  Badge,
  BarChart,
  BaseCard,
  Breadcrumb,
  Button,
  ChartCard,
  Checkbox,
  ComparisonBar,
  ConfirmDialog,
  CopyButton,
  DataTable,
  DatePicker,
  DateRangePicker,
  Divider as DSDivider,
  DonutChart,
  Drawer,
  FileUpload,
  FormActions,
  FormField,
  FormSection,
  GaugeChart,
  Heatmap,
  IconButton,
  ImageCard,
  Input,
  KPIBlock,
  LineChart,
  ListCard,
  LoadingOverlay,
  Menu,
  MetricCard,
  Modal,
  MultiSelect,
  NotificationBell,
  PieChart,
  Popover,
  ProfileCard,
  ProgressBar,
  ProgressRing,
  RadioGroup,
  ResponsiveButton,
  ResponsiveCard,
  ResponsiveGrid,
  ResponsiveInput,
  ResponsiveListItem,
  RichTextEditor,
  SearchInput,
  Select,
  Skeleton,
  SkeletonCard,
  SkeletonList,
  SparkLine,
  Spinner,
  StatCard,
  Stepper,
  SummaryCard,
  Tabs,
  Tag,
  TagInput,
  Textarea,
  Timeline,
  Toggle,
  UserCard,
  useToast,
  ActivityFeed,
  ActionCard,
  TrendIndicator,
} from '@/design-system/UIComponents'
import type { Column, TableState, BulkAction } from '@/design-system/UIComponents'

function BreakpointDebug() {
  const tierKey = useFoundationBreakpointKey()
  const tierIdx = useFoundationBreakpointIndex()
  const [widthPx, setWidthPx] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 0,
  )
  useEffect(() => {
    const onResize = () => setWidthPx(window.innerWidth)
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return (
    <Stack direction="row" flexWrap="wrap" gap={2} alignItems="center">
      <Typography variant="body2" fontWeight={600}>{widthPx}px</Typography>
      <Typography variant="body2" color="text.secondary">
        Tier {tierIdx}: {tierKey}
      </Typography>
    </Stack>
  )
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box sx={{ mb: 6 }}>
      <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1.5, fontWeight: 600, display: 'block', mb: 1 }}>
        {title}
      </Typography>
      <Divider sx={{ mb: 3 }} />
      {children}
    </Box>
  )
}

// ─── Color swatch ─────────────────────────────────────────────────────────────

function Swatch({ color, label }: { color: string; label: string | number }) {
  return (
    <Tooltip title={color} arrow placement="top">
      <Box sx={{ textAlign: 'center' }}>
        <Box sx={{ width: 48, height: 48, bgcolor: color, borderRadius: tokens.borderRadius.md, mb: 0.5 }} />
        <Typography variant="caption" color="text.secondary">{label}</Typography>
      </Box>
    </Tooltip>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function PreviewPage() {
  const theme = useTheme()
  const { config } = useFoundationTheme()
  const { showToast } = useToast()

  const primary = useMemo(() => generateScale(config.brandColor), [config.brandColor])
  const neutral = useMemo(() => generateNeutralScale(config.brandColor), [config.brandColor])

  const SHADE_STOPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const

  // ── Local state ──────────────────────────────────────────────────────────────
  const [tab1, setTab1] = useState('overview')
  const [tab2, setTab2] = useState('tab1')
  const [tab3, setTab3] = useState('tab1')
  const [radioVal, setRadioVal] = useState('opt1')
  const [toggleVal, setToggleVal] = useState(true)
  const [tags, setTags] = useState(['react', 'typescript'])
  const [search, setSearch] = useState('')
  const [multiVal, setMultiVal] = useState<(string | number)[]>(['designer', 'engineer'])
  const [richText, setRichText] = useState('')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null])
  const [modalOpen, setModalOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [cardLoading, setCardLoading] = useState(false)

  // ── DataTable state ──────────────────────────────────────────────────────────
  const [tableState, setTableState] = useState<TableState>({
    page: 0, pageSize: 10, sortKey: null, sortDirection: null,
    filters: [], searchQuery: '', columnSearch: {}, selectedRows: [], expandedRows: [],
    hiddenColumnKeys: [],
  })

  const tableColumns: Column[] = [
    { key: 'name', label: 'Name', sortable: true, searchable: true, width: '20%' },
    { key: 'email', label: 'Email', sortable: true, searchable: true, width: '25%', hideBelow: 'lg' },
    { key: 'role', label: 'Role', sortable: true, filterable: true, width: '15%',
      type: 'select', options: [
        { label: 'Admin', value: 'Admin' },
        { label: 'Editor', value: 'Editor' },
        { label: 'Viewer', value: 'Viewer' },
      ],
    },
    { key: 'status', label: 'Status', sortable: true, filterable: true, width: '15%',
      type: 'select', options: [
        { label: 'Active', value: 'Active' },
        { label: 'Inactive', value: 'Inactive' },
      ],
      render: (val: string) => (
        <Badge label={val} color={val === 'Active' ? 'success' : 'neutral'} variant="soft" />
      ),
    },
    {
      key: 'department',
      label: 'Department',
      sortable: true,
      width: '15%',
      hideBelow: 'xl',
      hideOnTablet: true,
    },
    { key: 'joined', label: 'Joined', sortable: true, width: '10%', hideBelow: 'desktop', type: 'date' },
  ]

  const tableData = Array.from({ length: 20 }, (_, i) => ({
    id: `row-${i}`,
    name: ['Alice Chen', 'Bob Smith', 'Carol Park', 'David Kim', 'Eva Torres',
      'Frank Liu', 'Grace Lee', 'Henry Wang', 'Iris Zhang', 'Jack Ma',
      'Karen Wu', 'Leo Yang', 'Mia Chen', 'Nick Zhou', 'Olivia Lin',
      'Paul Xu', 'Quinn Ng', 'Rachel Ho', 'Sam Tan', 'Tina Lim'][i],
    email: `user${i + 1}@example.com`,
    role: ['Admin', 'Editor', 'Viewer'][i % 3],
    status: i % 5 === 0 ? 'Inactive' : 'Active',
    department: ['Engineering', 'Design', 'Product', 'Marketing', 'Sales'][i % 5],
    joined: `2024-${String((i % 12) + 1).padStart(2, '0')}-15`,
  }))

  const bulkActions: BulkAction[] = [
    { label: 'Export', onClick: (rows) => showToast({ variant: 'info', title: `Exporting ${rows.length} rows` }) },
    { label: 'Delete', variant: 'destructive', onClick: (rows) => showToast({ variant: 'error', title: `Deleted ${rows.length} rows` }) },
  ]

  // ── Heatmap data ─────────────────────────────────────────────────────────────
  const heatmapData = useMemo(() => {
    const data: { date: string; value: number }[] = []
    const end = new Date()
    const cur = new Date(end)
    cur.setDate(cur.getDate() - 364)
    while (cur <= end) {
      data.push({ date: dayjs(cur).format('YYYY-MM-DD'), value: Math.floor(Math.random() * 10) })
      cur.setDate(cur.getDate() + 1)
    }
    return data
  }, [])

  // ── Timeline events ───────────────────────────────────────────────────────────
  const timelineEvents = [
    { id: '1', title: 'Project Kickoff', description: 'Initial planning session', date: '2026-01-10', status: 'completed' as const, icon: <Zap size={14} />, color: theme.palette.success.main },
    { id: '2', title: 'Design Phase', description: 'UI/UX wireframes complete', date: '2026-01-28', status: 'completed' as const, icon: <Star size={14} />, color: theme.palette.info.main },
    { id: '3', title: 'Development Sprint 1', description: 'Core components built', date: '2026-02-15', status: 'active' as const, icon: <Check size={14} />, color: theme.palette.primary.main },
    { id: '4', title: 'QA Testing', description: 'Full regression testing', date: '2026-03-01', status: 'pending' as const, icon: <AlertCircle size={14} /> },
    { id: '5', title: 'Launch', description: 'Production deployment', date: '2026-03-30', status: 'pending' as const, icon: <CheckCircle size={14} /> },
  ]

  // ── Activity feed ─────────────────────────────────────────────────────────────
  const activities = [
    { id: '1', user: { name: 'Alice Chen' }, action: 'created', target: 'Report Q1-2026.pdf', timestamp: new Date(Date.now() - 5 * 60000) },
    { id: '2', user: { name: 'Bob Smith' }, action: 'updated', target: 'User settings', timestamp: new Date(Date.now() - 30 * 60000) },
    { id: '3', user: { name: 'Carol Park' }, action: 'deleted', target: 'Draft document', timestamp: new Date(Date.now() - 2 * 3600000) },
    { id: '4', user: { name: 'David Kim' }, action: 'commented on', target: 'Design review', timestamp: new Date(Date.now() - 5 * 3600000) },
    { id: '5', user: { name: 'Eva Torres' }, action: 'approved', target: 'Budget proposal', timestamp: new Date(Date.now() - 24 * 3600000) },
  ]

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 2, md: 3, lg: 4 }, py: 4 }}>

      {/* ── THEME INFO BAR ── */}
      <Paper
        elevation={0}
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 2,
          px: 3,
          py: 1.5,
          mb: 4,
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          mx: { xs: -2, md: -3, lg: -4 },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 18, height: 18, borderRadius: '50%', bgcolor: config.brandColor, border: '1px solid', borderColor: 'divider' }} />
          <Typography variant="body2" fontWeight={600}>{config.brandColor}</Typography>
        </Box>
        <DSDivider orientation="vertical" sx={{ mx: 1, height: 20, alignSelf: 'center' }} />
        <Typography variant="body2" color="text.secondary">{config.fontFamily}</Typography>
        <DSDivider orientation="vertical" sx={{ mx: 1, height: 20, alignSelf: 'center' }} />
        <Badge label={config.mode === 'dark' ? '🌙 Dark' : '☀️ Light'} variant="soft" />
      </Paper>

      {/* ── PAGE HEADER ── */}
      <PageHeader
        title="Component Library"
        subtitle="Complete design system showcase — all custom components"
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Preview' }]}
        actions={
          <Button startIcon={<Plus size={16} />} onClick={() => showToast({ variant: 'success', title: 'Action triggered' })}>
            New Component
          </Button>
        }
      />

      <Section title="1b. Responsive system">
        <Stack spacing={3}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Current breakpoint
            </Typography>
            <BreakpointDebug />
          </Paper>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6, lg: 4 }}>
              <ResponsiveButton />
            </Grid>
            <Grid size={{ xs: 12, md: 6, lg: 4 }}>
              <ResponsiveInput />
            </Grid>
            <Grid size={{ xs: 12, md: 6, lg: 4 }}>
              <ResponsiveCard />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <ResponsiveListItem />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <ResponsiveGrid />
            </Grid>
          </Grid>
        </Stack>
      </Section>

      {/* ── 2. TYPOGRAPHY ── */}
      <Section title="2. Typography">
        <Stack spacing={2}>
          {(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const).map(v => (
            <Box key={v} sx={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
              <Typography variant="caption" color="text.disabled" sx={{ minWidth: 40, flexShrink: 0 }}>{v}</Typography>
              <Typography variant={v}>The quick brown fox jumps over the lazy dog</Typography>
            </Box>
          ))}
          {(['body1', 'body2', 'caption', 'overline'] as const).map(v => (
            <Box key={v} sx={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
              <Typography variant="caption" color="text.disabled" sx={{ minWidth: 40, flexShrink: 0 }}>{v}</Typography>
              <Typography variant={v}>The quick brown fox jumps over the lazy dog</Typography>
            </Box>
          ))}
        </Stack>
      </Section>

      {/* ── 3. COLORS ── */}
      <Section title="3. Colors">
        <Stack spacing={3}>
          <Box>
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">Primary scale</Typography>
            <Stack direction="row" flexWrap="wrap" gap={1.5}>
              {SHADE_STOPS.map(s => <Swatch key={s} color={primary[s]} label={s} />)}
            </Stack>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">Neutral scale</Typography>
            <Stack direction="row" flexWrap="wrap" gap={1.5}>
              {SHADE_STOPS.map(s => <Swatch key={s} color={neutral[s]} label={s} />)}
            </Stack>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">Semantic</Typography>
            <Stack direction="row" flexWrap="wrap" gap={1.5}>
              {([
                { label: 'error', color: tokens.color.error[500] },
                { label: 'success', color: tokens.color.success[500] },
                { label: 'warning', color: tokens.color.warning[500] },
                { label: 'info', color: tokens.color.info[500] },
              ]).map(({ label, color }) => <Swatch key={label} color={color} label={label} />)}
            </Stack>
          </Box>
        </Stack>
      </Section>

      {/* ── 4. BUTTONS ── */}
      <Section title="4. Buttons">
        <Stack spacing={3}>
          <Box>
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">Variants</Typography>
            <Stack direction="row" flexWrap="wrap" gap={1.5}>
              <Button variant="contained">Contained</Button>
              <Button variant="outlined">Outlined</Button>
              <Button variant="text">Text</Button>
              <Button variant="soft">Soft</Button>
            </Stack>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">Colors</Typography>
            <Stack direction="row" flexWrap="wrap" gap={1.5}>
              <Button color="primary">Primary</Button>
              <Button color="secondary">Secondary</Button>
              <Button color="error">Error</Button>
              <Button color="success">Success</Button>
              <Button color="warning">Warning</Button>
              <Button color="info">Info</Button>
            </Stack>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">Sizes + Icons + States</Typography>
            <Stack direction="row" flexWrap="wrap" gap={1.5} alignItems="center">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <Button startIcon={<Plus size={16} />}>With Icon</Button>
              <Button endIcon={<TrendingUp size={16} />}>End Icon</Button>
              <Button loading>Loading</Button>
              <Button disabled>Disabled</Button>
            </Stack>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">Icon Buttons</Typography>
            <Stack direction="row" flexWrap="wrap" gap={1.5} alignItems="center">
              <IconButton size="sm" icon={<Edit size={14} />} />
              <IconButton icon={<Edit size={16} />} />
              <IconButton size="lg" icon={<Edit size={20} />} />
              <IconButton variant="outlined" icon={<Trash2 size={16} />} />
              <IconButton variant="soft" icon={<Eye size={16} />} />
              <IconButton color="error" icon={<Trash2 size={16} />} />
            </Stack>
          </Box>
        </Stack>
      </Section>

      {/* ── 5. FORM INPUTS ── */}
      <Section title="5. Form Inputs">
        <FormSection title="Basic Fields" description="Text inputs, selects, pickers" columns={2}>
          <FormField label="Text Input" required hint="Max 100 characters">
            <Input placeholder="Enter text..." showCount maxLength={100} />
          </FormField>
          <FormField label="Error State" error helperText="This field is required">
            <Input error placeholder="Error state" />
          </FormField>
          <FormField label="Textarea (auto-resize)">
            <Textarea placeholder="Multi-line text..." autoResize showCount maxLength={300} />
          </FormField>
          <FormField label="Select (clearable)">
            <Select
              value="engineer"
              options={[
                { label: 'Engineer', value: 'engineer' },
                { label: 'Designer', value: 'designer' },
                { label: 'Product', value: 'product' },
              ]}
              clearable
            />
          </FormField>
          <FormField label="Multi-Select (searchable)">
            <MultiSelect
              value={multiVal}
              onChange={setMultiVal}
              options={[
                { label: 'Engineer', value: 'engineer' },
                { label: 'Designer', value: 'designer' },
                { label: 'Product Manager', value: 'product' },
                { label: 'Marketing', value: 'marketing' },
              ]}
              searchable
            />
          </FormField>
          <FormField label="DatePicker">
            <DatePicker value={selectedDate} onChange={setSelectedDate} />
          </FormField>
          <FormField label="DateRangePicker">
            <DateRangePicker value={dateRange} onChange={setDateRange} />
          </FormField>
          <FormField label="SearchInput (pill, debounced 300ms)">
            <SearchInput value={search} onChange={setSearch} placeholder="Search users..." debounce={300} fullWidth />
          </FormField>
        </FormSection>

        <FormSection title="Selections & Controls" description="Checkboxes, radios, toggle">
          <Box>
            <Typography variant="body2" fontWeight={600} gutterBottom>Checkboxes</Typography>
            <Stack>
              <FormControlLabel control={<Checkbox />} label="Unchecked" />
              <FormControlLabel control={<Checkbox defaultChecked />} label="Checked" />
              <FormControlLabel control={<Checkbox indeterminate />} label="Indeterminate" />
            </Stack>
          </Box>
          <Box>
            <Typography variant="body2" fontWeight={600} gutterBottom>RadioGroup (horizontal)</Typography>
            <RadioGroup
              value={radioVal}
              onChange={(val) => setRadioVal(String(val))}
              options={[
                { label: 'Option 1', value: 'opt1' },
                { label: 'Option 2', value: 'opt2' },
                { label: 'Option 3', value: 'opt3' },
              ]}
              orientation="horizontal"
            />
          </Box>
          <Box>
            <Typography variant="body2" fontWeight={600} gutterBottom>Toggle</Typography>
            <Toggle
              checked={toggleVal}
              onChange={(checked) => setToggleVal(checked)}
              label="Enable notifications"
              description="Receive email updates for new activity"
            />
          </Box>
        </FormSection>

        <FormSection title="Advanced Inputs" description="Tags, file upload, rich text" collapsible defaultCollapsed={false}>
          <FormField label="TagInput (suggestions)">
            <TagInput
              value={tags}
              onChange={setTags}
              placeholder="Add technology..."
              suggestions={['react', 'vue', 'angular', 'typescript', 'javascript', 'python', 'rust', 'go']}
              maxTags={8}
              helperText="Press Enter or comma to add. Max 8 tags."
            />
          </FormField>
          <FormField label="FileUpload (drag zone)">
            <FileUpload accept="image/*, .png, .jpg, .pdf" maxFiles={3} maxSize={10485760} onUpload={() => {}} />
          </FormField>
          <Box sx={{ gridColumn: '1 / -1' }}>
            <FormField label="RichTextEditor">
              <RichTextEditor value={richText} onChange={setRichText} placeholder="Start typing..." />
            </FormField>
          </Box>
        </FormSection>
      </Section>

      {/* ── 6. FEEDBACK ── */}
      <Section title="6. Feedback">
        <Stack spacing={4}>
          <Box>
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">Alerts — all severities × variants</Typography>
            <Stack spacing={2}>
              <Alert severity="success" variant="soft" title="Profile saved">Your profile information has been updated successfully.</Alert>
              <Alert severity="error" variant="soft" title="Payment failed">Unable to process payment. Please check your card details.</Alert>
              <Alert severity="warning" variant="outlined">Your session will expire in 5 minutes.</Alert>
              <Alert severity="info" variant="filled">A new version of the application is available.</Alert>
              <Alert severity="success" dismissible>This alert can be dismissed.</Alert>
            </Stack>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">ProgressBar — linear sm/md/lg + circular + indeterminate</Typography>
            <Stack spacing={2}>
              <ProgressBar value={0} size="sm" label="0%" showValue />
              <ProgressBar value={45} size="md" label="In progress" showValue />
              <ProgressBar value={75} size="lg" color="success" label="Almost done" showValue />
              <ProgressBar value={100} color="success" size="md" label="Complete" showValue />
              <ProgressBar size="md" label="Indeterminate" />
              <ProgressBar value={60} animated color="primary" label="Animated stripes" />
              <Stack direction="row" gap={4} alignItems="center">
                <ProgressBar variant="circular" value={65} showValue size="sm" />
                <ProgressBar variant="circular" value={65} showValue size="md" color="success" />
                <ProgressBar variant="circular" value={65} showValue size="lg" color="warning" />
                <ProgressBar variant="circular" />
              </Stack>
            </Stack>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">Skeleton</Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 4 }}><Skeleton variant="text" lines={3} /></Grid>
              <Grid size={{ xs: 12, md: 4 }}><SkeletonCard /></Grid>
              <Grid size={{ xs: 12, md: 4 }}><SkeletonList count={3} /></Grid>
            </Grid>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">Toast triggers</Typography>
            <Stack direction="row" flexWrap="wrap" gap={1.5}>
              <Button onClick={() => showToast({ variant: 'success', title: 'Saved successfully', description: 'Your changes have been saved.' })}>Success Toast</Button>
              <Button color="error" onClick={() => showToast({ variant: 'error', title: 'Something went wrong', description: 'Please try again later.' })}>Error Toast</Button>
              <Button color="warning" onClick={() => showToast({ variant: 'warning', title: 'Heads up', description: 'This action cannot be undone.' })}>Warning Toast</Button>
              <Button color="info" onClick={() => showToast({ variant: 'info', title: 'New update', description: 'Refresh to see changes.' })}>Info Toast</Button>
              <Button variant="outlined" onClick={() => showToast({ variant: 'success', title: 'File uploaded', action: { label: 'View file', onClick: () => {} } })}>With Action</Button>
            </Stack>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">LoadingOverlay on Card</Typography>
            <LoadingOverlay loading={cardLoading} blur>
              <BaseCard sx={{ p: 3, width: 300 }}>
                <Typography variant="subtitle1" fontWeight={600} mb={1}>Card content</Typography>
                <Typography variant="body2" color="text.secondary">Click below to toggle loading overlay.</Typography>
              </BaseCard>
            </LoadingOverlay>
            <Button sx={{ mt: 2 }} onClick={() => { setCardLoading(true); setTimeout(() => setCardLoading(false), 2000) }}>
              Toggle Loading (2s)
            </Button>
          </Box>
        </Stack>
      </Section>

      {/* ── 7. DISPLAY COMPONENTS ── */}
      <Section title="7. Display Components">
        <Stack spacing={3}>
          <Box>
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">Badge — colors × variants + dot</Typography>
            <Stack direction="row" flexWrap="wrap" gap={1.5}>
              <Badge label="Default" />
              <Badge label="Primary" color="primary" variant="filled" />
              <Badge label="Success" color="success" variant="filled" />
              <Badge label="Error" color="error" variant="filled" />
              <Badge label="Warning" color="warning" variant="filled" />
              <Badge label="Outlined" variant="outlined" />
              <Badge label="Soft" variant="soft" color="info" />
              <Badge label="" dot />
              <Badge label="" dot color="success" />
              <Badge label="" dot color="error" />
            </Stack>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">Avatar — sizes + online indicator + AvatarGroup</Typography>
            <Stack direction="row" gap={2} alignItems="center" flexWrap="wrap">
              <Avatar name="Sarah Johnson" size="xs" />
              <Avatar name="Bob Smith" size="sm" />
              <Avatar name="Carol Park" size="md" online />
              <Avatar name="David Kim" size="lg" />
              <Avatar name="Eva Torres" size="xl" />
              <DSDivider orientation="vertical" sx={{ height: 40, alignSelf: 'center' }} />
              <AvatarGroup max={4} spacing="sm" users={[
                { name: 'Alice' }, { name: 'Bob' }, { name: 'Carol' },
                { name: 'David' }, { name: 'Eva' }, { name: 'Frank' },
              ]} />
            </Stack>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">Spinner — all sizes</Typography>
            <Stack direction="row" gap={3} alignItems="center">
              <Spinner size="xs" />
              <Spinner size="sm" />
              <Spinner size="md" />
              <Spinner size="lg" />
              <Spinner size="xl" />
            </Stack>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">Tags</Typography>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              <Tag label="Default" />
              <Tag label="React" color="primary" />
              <Tag label="Success" color="success" />
              <Tag label="Warning" color="warning" />
              <Tag label="Error" color="error" />
              <Tag label="Info" color="info" />
              <Tag label="Neutral" />
              <Tag label="Brand" color="primary" />
            </Stack>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">CopyButton · UserCard · NotificationBell · TrendIndicator</Typography>
            <Stack direction="row" flexWrap="wrap" gap={3} alignItems="flex-start">
              <CopyButton value="https://example.com/some-long-link" label="Copy link" />
              <UserCard name="Sarah Johnson" role="Senior Designer" email="sarah@example.com" sx={{ width: 260 }} />
              <Stack gap={2}>
                <NotificationBell count={5} />
                <NotificationBell count={0} />
              </Stack>
              <Stack gap={1.5}>
                <TrendIndicator value={12.5} size="sm" />
                <TrendIndicator value={-3.2} size="md" />
                <TrendIndicator value={0} size="lg" />
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Section>

      {/* ── 8. CARDS ── */}
      <Section title="8. Cards">
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <StatCard
              label="Total Revenue"
              value="$48,295"
              delta={12.5}
              deltaLabel="vs last month"
              icon={<DollarSign size={22} />}
              headerColor={primary[500]}
              sparklineData={[20, 35, 28, 45, 38, 52, 48, 61]}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <StatCard
              label="Active Users"
              value="2,847"
              delta={-3.2}
              deltaLabel="vs last week"
              icon={<UsersIcon size={22} />}
              headerColor={primary[400]}
              sparklineData={[61, 48, 52, 38, 45, 28, 35, 20]}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <StatCard
              label="Orders"
              value="1,234"
              delta={8.1}
              deltaLabel="this month"
              icon={<ShoppingCart size={22} />}
              headerColor={theme.palette.success.main}
              sparklineData={[10, 25, 18, 35, 28, 42, 38, 51]}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <MetricCard
              title="Performance"
              subtitle="This month"
              metrics={[
                { label: 'Calls', value: 1234, delta: 8.2 },
                { label: 'Conversion', value: '3.2%', delta: 1.5 },
                { label: 'Avg Duration', value: '2m 15s', delta: -3.1 },
                { label: 'Bounce Rate', value: '28%', delta: -2.4 },
              ]}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <ProfileCard
              name="Sarah Johnson"
              subtitle="Senior Designer"
              description="Creates beautiful, accessible interfaces with pixel-perfect attention to detail."
              badges={[{ label: 'Design Systems' }, { label: 'Figma' }, { label: 'UX Research' }]}
              headerColor={primary[500]}
              stats={[
                { label: 'Projects', value: 42 },
                { label: 'Reviews', value: 128 },
                { label: 'Rating', value: '4.9' },
              ]}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <ActionCard
              title="Generate Report"
              description="Export your analytics data as PDF or CSV for offline analysis."
              icon={<FileText size={32} />}
              onClick={() => showToast({ variant: 'success', title: 'Report generated', description: 'Your report is ready to download.' })}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <ImageCard
              title="Mountain Sunrise"
              subtitle="Photography Collection"
              image=""
              imageFallbackColor={primary[100]}
              overlay={false}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <ListCard
              title="Recent Activity"
              items={[
                { id: '1', primary: 'New user registered', secondary: '2 mins ago', icon: <UsersIcon size={16} />, badge: { label: 'New', color: 'success' } },
                { id: '2', primary: 'Order #1234 completed', secondary: '1 hour ago', icon: <ShoppingCart size={16} /> },
                { id: '3', primary: 'System alert', secondary: '3 hours ago', icon: <AlertCircle size={16} />, badge: { label: 'Alert', color: 'warning' } },
                { id: '4', primary: 'Report exported', secondary: '5 hours ago', icon: <FileText size={16} /> },
                { id: '5', primary: 'Backup completed', secondary: '1 day ago', icon: <CheckCircle size={16} /> },
              ]}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <SummaryCard
              title="Order #1234"
              fields={[
                { label: 'Status', value: 'Completed' },
                { label: 'Total', value: '$234.56' },
                { label: 'Date', value: 'Mar 15, 2026' },
                { label: 'Customer', value: 'John Doe' },
                { label: 'Items', value: '5' },
                { label: 'Shipping', value: 'Standard' },
              ]}
              columns={2}
            />
          </Grid>
        </Grid>
      </Section>

      {/* ── 9. CHARTS ── */}
      <Section title="9. Charts">
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 6 }}>
            <ChartCard title="Monthly Revenue" subtitle="Revenue vs Target, last 12 months">
              <LineChart
                data={[
                  { month: 'Jan', revenue: 4200, target: 3800 },
                  { month: 'Feb', revenue: 3800, target: 3900 },
                  { month: 'Mar', revenue: 4600, target: 4000 },
                  { month: 'Apr', revenue: 5100, target: 4200 },
                  { month: 'May', revenue: 4800, target: 4300 },
                  { month: 'Jun', revenue: 5600, target: 4500 },
                  { month: 'Jul', revenue: 6100, target: 4700 },
                  { month: 'Aug', revenue: 5900, target: 4900 },
                  { month: 'Sep', revenue: 6400, target: 5000 },
                  { month: 'Oct', revenue: 7200, target: 5200 },
                  { month: 'Nov', revenue: 6800, target: 5400 },
                  { month: 'Dec', revenue: 7800, target: 5600 },
                ]}
                xKey="month"
                lines={[
                  { key: 'revenue', label: 'Revenue', color: primary[500] },
                  { key: 'target', label: 'Target', color: neutral[400] },
                ]}
                height={280}
              />
            </ChartCard>
          </Grid>
          <Grid size={{ xs: 12, lg: 6 }}>
            <ChartCard title="Weekly Visitors" subtitle="8 weeks, desktop vs mobile">
              <AreaChart
                data={[
                  { week: 'W1', desktop: 1200, mobile: 800 },
                  { week: 'W2', desktop: 1500, mobile: 950 },
                  { week: 'W3', desktop: 1100, mobile: 700 },
                  { week: 'W4', desktop: 1800, mobile: 1100 },
                  { week: 'W5', desktop: 2100, mobile: 1300 },
                  { week: 'W6', desktop: 1900, mobile: 1150 },
                  { week: 'W7', desktop: 2400, mobile: 1500 },
                  { week: 'W8', desktop: 2200, mobile: 1400 },
                ]}
                xKey="week"
                lines={[
                  { key: 'desktop', label: 'Desktop', color: primary[500] },
                  { key: 'mobile', label: 'Mobile', color: primary[300] },
                ]}
                height={280}
              />
            </ChartCard>
          </Grid>
          <Grid size={{ xs: 12, lg: 6 }}>
            <ChartCard title="Sales by Category">
              <BarChart
                data={[
                  { category: 'Electronics', sales: 8400 },
                  { category: 'Clothing', sales: 5200 },
                  { category: 'Food', sales: 3800 },
                  { category: 'Books', sales: 2100 },
                  { category: 'Toys', sales: 4600 },
                  { category: 'Sports', sales: 3200 },
                ]}
                xKey="category"
                bars={[{ key: 'sales', label: 'Sales ($)', color: primary[500] }]}
                height={280}
              />
            </ChartCard>
          </Grid>
          <Grid size={{ xs: 12, lg: 6 }}>
            <ChartCard title="Traffic Sources">
              <PieChart
                data={[
                  { key: 'organic', label: 'Organic', value: 38 },
                  { key: 'direct', label: 'Direct', value: 27 },
                  { key: 'referral', label: 'Referral', value: 18 },
                  { key: 'social', label: 'Social', value: 11 },
                  { key: 'paid', label: 'Paid', value: 6 },
                ]}
                height={280}
              />
            </ChartCard>
          </Grid>
          <Grid size={{ xs: 12, lg: 6 }}>
            <ChartCard title="Budget Allocation">
              <DonutChart
                data={[
                  { key: 'dev', label: 'Development', value: 40 },
                  { key: 'mkt', label: 'Marketing', value: 25 },
                  { key: 'ops', label: 'Operations', value: 20 },
                  { key: 'adm', label: 'Admin', value: 15 },
                ]}
                centerValue="$48K"
                centerLabel="Total Budget"
                height={280}
              />
            </ChartCard>
          </Grid>
          <Grid size={{ xs: 12, lg: 6 }}>
            <ChartCard title="SparkLines in StatCards">
              <Grid container spacing={2} sx={{ pt: 1 }}>
                {([
                  { label: 'Revenue', value: '$48K', data: [20, 35, 28, 45, 38, 52, 48, 61], delta: 12.5 },
                  { label: 'Users', value: '2,847', data: [61, 48, 52, 38, 45, 28, 35, 20], delta: -3.2 },
                  { label: 'Orders', value: '1,234', data: [10, 25, 18, 35, 28, 42, 38, 51], delta: 8.1 },
                  { label: 'Conversion', value: '3.24%', data: [3, 3.5, 2.8, 4, 3.8, 4.2, 3.9, 4.5], delta: 0.5 },
                ]).map(({ label, value, data, delta }) => (
                  <Grid key={label} size={6}>
                    <BaseCard sx={{ p: 2 }}>
                      <Typography variant="caption" color="text.secondary" display="block">{label}</Typography>
                      <Typography variant="h6" fontWeight={700}>{value}</Typography>
                      <SparkLine data={data} height={40} color={delta >= 0 ? theme.palette.success.main : theme.palette.error.main} />
                    </BaseCard>
                  </Grid>
                ))}
              </Grid>
            </ChartCard>
          </Grid>
        </Grid>
      </Section>

      {/* ── 10. INFOGRAPHICS ── */}
      <Section title="10. Infographics">
        <Stack spacing={4}>
          <Box>
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">KPIBlock (3 in a row)</Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <KPIBlock label="Total Revenue" value="$48,295" delta={12.5} deltaLabel="vs last month" />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <KPIBlock label="Active Users" value={2847} delta={-3.2} deltaLabel="vs last week" />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <KPIBlock label="Conversion" value="3.24%" delta={0.5} />
              </Grid>
            </Grid>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">ProgressRing (4 sizes + colors)</Typography>
            <Stack direction="row" flexWrap="wrap" gap={4} alignItems="center">
              <ProgressRing value={78} size={80} showValue label="Performance" />
              <ProgressRing value={45} size={100} showValue label="Completion" color={theme.palette.warning.main} />
              <ProgressRing value={92} size={120} showValue label="Satisfaction" color={theme.palette.success.main} />
              <ProgressRing value={61} size={140} showValue label="Progress" color={theme.palette.info.main} />
            </Stack>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">GaugeChart</Typography>
            <GaugeChart
              value={68}
              size={220}
              label="Performance Score"
              ranges={[
                { from: 0, to: 40, color: theme.palette.error.main, label: 'Low' },
                { from: 40, to: 75, color: theme.palette.warning.main, label: 'Medium' },
                { from: 75, to: 100, color: theme.palette.success.main, label: 'High' },
              ]}
            />
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">ComparisonBar</Typography>
            <Box sx={{ maxWidth: 500 }}>
              <ComparisonBar
                leftLabel="Desktop"
                rightLabel="Mobile"
                leftValue={65}
                rightValue={35}
                showLabels
                showValues
                showPercentages
              />
            </Box>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">Heatmap (365 days)</Typography>
            <Heatmap data={heatmapData} showMonthLabels showDayLabels />
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">Timeline (5 events, alternating)</Typography>
            <Timeline items={timelineEvents} alternating />
          </Box>
        </Stack>
      </Section>

      {/* ── 11. DATA TABLE ── */}
      <Section title="11. Data Table">
        <DataTable
          title="Users"
          columns={tableColumns}
          data={tableData}
          rowKey="id"
          state={tableState}
          onStateChange={setTableState}
          bulkActions={bulkActions}
          renderExpanded={(row) => (
            <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
              <Typography variant="body2"><strong>Expanded:</strong> {row.name} — {row.email} — {row.department}</Typography>
            </Box>
          )}
          actions={
            <Button startIcon={<Plus size={16} />} onClick={() => showToast({ variant: 'success', title: 'Add User clicked' })}>
              Add User
            </Button>
          }
          emptyState={{ title: 'No users found', description: 'Try adjusting your search or filters.' }}
        />
      </Section>

      {/* ── 12. NAVIGATION ── */}
      <Section title="12. Navigation Components">
        <Stack spacing={4}>
          <Box>
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">Tabs — underline</Typography>
            <Tabs
              variant="underline"
              items={[
                { label: 'Overview', value: 'overview' },
                { label: 'Analytics', value: 'analytics', badge: 3 },
                { label: 'Reports', value: 'reports' },
                { label: 'Settings', value: 'settings' },
              ]}
              value={tab1}
              onChange={setTab1}
            />
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">Tabs — pill</Typography>
            <Tabs
              variant="pill"
              items={[
                { label: 'Tab 1', value: 'tab1' },
                { label: 'Tab 2', value: 'tab2' },
                { label: 'Tab 3', value: 'tab3' },
                { label: 'Tab 4', value: 'tab4' },
              ]}
              value={tab2}
              onChange={setTab2}
            />
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">Tabs — contained</Typography>
            <Tabs
              variant="contained"
              items={[
                { label: 'Tab 1', value: 'tab1' },
                { label: 'Tab 2', value: 'tab2' },
                { label: 'Tab 3', value: 'tab3' },
                { label: 'Tab 4', value: 'tab4' },
              ]}
              value={tab3}
              onChange={setTab3}
            />
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">Breadcrumb</Typography>
            <Breadcrumb items={[
              { label: 'Home', href: '/' },
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Users', href: '/users' },
              { label: 'Edit User' },
            ]} />
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">Stepper — horizontal (step 2 active)</Typography>
            <Stepper
              steps={[
                { label: 'Account Info', description: 'Basic details' },
                { label: 'Profile Setup', description: 'Preferences' },
                { label: 'Confirmation', description: 'Review' },
                { label: 'Complete', description: 'Done!' },
              ]}
              activeStep={1}
            />
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">Stepper — vertical (step 1 active)</Typography>
            <Stepper
              orientation="vertical"
              steps={[
                { label: 'Select plan', description: 'Choose a subscription' },
                { label: 'Add payment', description: 'Credit card or PayPal' },
                { label: 'Confirm', description: 'Review and submit' },
              ]}
              activeStep={0}
            />
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">Menu</Typography>
            <Menu
              trigger={<Button>Open Menu</Button>}
              items={[
                { label: 'New File', icon: <Plus size={16} />, shortcut: '⌘N' },
                { label: 'Edit', icon: <Edit size={16} />, shortcut: '⌘E' },
                { label: 'View Details', icon: <Eye size={16} /> },
                { label: 'Delete', divider: true, icon: <Trash2 size={16} />, variant: 'destructive', shortcut: '⌫' },
              ]}
            />
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">BackButton</Typography>
            <BackButton onClick={() => showToast({ variant: 'info', title: 'Back clicked' })} />
          </Box>
        </Stack>
      </Section>

      {/* ── 13. OVERLAYS ── */}
      <Section title="13. Overlays (Interactive)">
        <Stack direction="row" flexWrap="wrap" gap={2} alignItems="center">
          <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
          <Button color="error" onClick={() => setConfirmOpen(true)}>Confirm Dialog</Button>
          <Button variant="outlined" onClick={() => setDrawerOpen(true)}>Open Drawer</Button>
          <Popover title="Quick Info" trigger={<Button variant="outlined">Open Popover</Button>}>
            <Typography variant="body2" gutterBottom>This is a popover with a title and some helpful content.</Typography>
            <Button size="sm">Got it</Button>
          </Popover>
        </Stack>

        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Edit Profile"
          subtitle="Update your personal information below."
          size="md"
          footer={<FormActions onSubmit={() => setModalOpen(false)} onCancel={() => setModalOpen(false)} />}
        >
          <FormSection title="Personal Information" columns={2}>
            <FormField label="First name" required><Input placeholder="Sarah" /></FormField>
            <FormField label="Last name" required><Input placeholder="Johnson" /></FormField>
            <FormField label="Email" required><Input placeholder="sarah@example.com" /></FormField>
          </FormSection>
        </Modal>

        <ConfirmDialog
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={() => { setConfirmOpen(false); showToast({ variant: 'success', title: 'Confirmed' }) }}
          title="Delete Record?"
          description="This action is permanent and cannot be undone. All associated data will be lost."
          confirmLabel="Delete"
          variant="destructive"
        />

        <Drawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          title="User Details"
          subtitle="Full profile and recent activity"
          footer={<Button fullWidth onClick={() => setDrawerOpen(false)}>Close</Button>}
        >
          <Stack spacing={3}>
            <SummaryCard
              title="Sarah Johnson"
              fields={[
                { label: 'Role', value: 'Senior Designer' },
                { label: 'Email', value: 'sarah@example.com' },
                { label: 'Department', value: 'Design' },
                { label: 'Joined', value: 'Jan 2023' },
              ]}
            />
            <ActivityFeed items={activities} maxItems={3} />
          </Stack>
        </Drawer>

      </Section>

      {/* ── 14. RESPONSIVE GRID ── */}
      <Section title="14. Responsive Grid">
        <Grid container spacing={1.5}>
          {Array.from({ length: 12 }).map((_, i) => {
            const stops = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950, 500] as const
            const stop = stops[i]
            const lightText = stop > 400
            return (
              <Grid key={i} size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}>
                <Box
                  sx={{
                    height: 80,
                    bgcolor: primary[stop],
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    textAlign="center"
                    sx={{ color: lightText ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.7)', lineHeight: 1.5 }}
                  >
                    {`xs:12 sm:6\nmd:4 lg:3 xl:2`}
                  </Typography>
                </Box>
              </Grid>
            )
          })}
        </Grid>
      </Section>

    </Box>
  )
}
