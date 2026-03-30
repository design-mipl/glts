import { useState, useMemo } from 'react'
import {
  Box, Grid, Stack, Divider, Paper, Typography,
  Button, IconButton,
  TextField, Select, MenuItem, InputLabel, FormControl,
  FormControlLabel, Checkbox, RadioGroup, Radio, Switch, Slider,
  Alert, LinearProgress, CircularProgress, Chip, Badge, Tooltip, Skeleton,
  Card, CardContent, CardActions,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  List, ListItem, ListItemIcon, ListItemText,
  Accordion, AccordionSummary, AccordionDetails,
  Tabs, Tab, Breadcrumbs, Link, Pagination,
  Stepper, Step, StepLabel,
  BottomNavigation, BottomNavigationAction,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Snackbar,
  Drawer as MuiDrawer,
} from '@mui/material'
import AddIcon              from '@mui/icons-material/Add'
import ArrowForwardIcon     from '@mui/icons-material/ArrowForward'
import SettingsIcon         from '@mui/icons-material/Settings'
import EditIcon             from '@mui/icons-material/Edit'
import DeleteIcon           from '@mui/icons-material/Delete'
import HomeIcon             from '@mui/icons-material/Home'
import ExpandMoreIcon       from '@mui/icons-material/ExpandMore'
import PersonIcon           from '@mui/icons-material/Person'
import InboxIcon            from '@mui/icons-material/Inbox'
import FavoriteIcon         from '@mui/icons-material/Favorite'
import LocationOnIcon       from '@mui/icons-material/LocationOn'
import CloseIcon            from '@mui/icons-material/Close'
import FolderIcon           from '@mui/icons-material/Folder'
import StarIcon             from '@mui/icons-material/Star'
import MailIcon             from '@mui/icons-material/Mail'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { useFoundationTheme } from '../../design-system/ThemeContext'
import { generateScale, generateNeutralScale, tokens } from '../../design-system/tokens'

// ─── Constants ────────────────────────────────────────────────────────────────

const SHADE_STOPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const
type ShadeStop = typeof SHADE_STOPS[number]

const TABLE_ROWS = [
  { name: 'Alice Chen',  role: 'Engineer',  status: 'active',   joined: 'Jan 2023' },
  { name: 'Bob Smith',   role: 'Designer',  status: 'active',   joined: 'Mar 2023' },
  { name: 'Carol Park',  role: 'Product',   status: 'inactive', joined: 'Nov 2022' },
  { name: 'David Kim',   role: 'Engineer',  status: 'active',   joined: 'Feb 2024' },
  { name: 'Eva Torres',  role: 'Marketing', status: 'inactive', joined: 'Jul 2023' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function SectionHeader({ title }: { title: string }) {
  return (
    <Box>
      <Typography variant="overline" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
        {title}
      </Typography>
      <Divider sx={{ mb: 3 }} />
    </Box>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PreviewPage() {
  const { config } = useFoundationTheme()

  const primary = useMemo(() => generateScale(config.brandColor),        [config.brandColor])
  const neutral = useMemo(() => generateNeutralScale(config.brandColor), [config.brandColor])

  // Interactive state
  const [tabValue,       setTabValue]       = useState(1)
  const [radioValue,     setRadioValue]     = useState('option1')
  const [selectValue,    setSelectValue]    = useState('engineer')
  const [dialogOpen,     setDialogOpen]     = useState(false)
  const [snackbarOpen,   setSnackbarOpen]   = useState(false)
  const [navDrawerOpen,  setNavDrawerOpen]  = useState(false)
  const [bottomNavValue, setBottomNavValue] = useState(0)
  const [paginationPage, setPaginationPage] = useState(3)

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 2, md: 4 }, pb: 10 }}>

      {/* ── 1 · Theme Info Bar ──────────────────────────────────────────────── */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          py: 1.5,
          px: { xs: 2, md: 4 },
          mx: { xs: -2, md: -4 },
          mb: 5,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{
            width: 20, height: 20, borderRadius: '50%',
            bgcolor: config.brandColor,
            border: '1px solid', borderColor: 'divider',
          }} />
          <Typography variant="body2" fontWeight={600}>{config.brandColor}</Typography>
        </Box>
        <Divider orientation="vertical" flexItem />
        <Typography variant="body2">{config.fontFamily}</Typography>
        <Divider orientation="vertical" flexItem />
        <Chip
          label={config.mode === 'dark' ? 'Dark mode' : 'Light mode'}
          size="small"
          color={config.mode === 'dark' ? 'default' : 'primary'}
          variant={config.mode === 'dark' ? 'outlined' : 'filled'}
        />
      </Box>

      {/* ── 2 · Typography ──────────────────────────────────────────────────── */}
      <Box sx={{ mb: 6 }}>
        <SectionHeader title="Typography" />
        {(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const).map(v => (
          <Box key={v} sx={{ display: 'flex', alignItems: 'baseline', gap: 2, mb: 0.5 }}>
            <Typography variant="caption" color="text.disabled" sx={{ minWidth: 56, flexShrink: 0 }}>{v}</Typography>
            <Typography variant={v}>The quick brown fox</Typography>
          </Box>
        ))}
        {(['body1', 'body2', 'caption', 'overline', 'button'] as const).map(v => (
          <Box key={v} sx={{ display: 'flex', alignItems: 'baseline', gap: 2, mb: 0.5 }}>
            <Typography variant="caption" color="text.disabled" sx={{ minWidth: 56, flexShrink: 0 }}>{v}</Typography>
            <Typography variant={v}>The quick brown fox jumps over the lazy dog</Typography>
          </Box>
        ))}
      </Box>

      {/* ── 3 · Colors ──────────────────────────────────────────────────────── */}
      <Box sx={{ mb: 6 }}>
        <SectionHeader title="Colors" />

        <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: 'block' }}>Primary scale</Typography>
        <Stack direction="row" flexWrap="wrap" gap={1.5} sx={{ mb: 3 }}>
          {SHADE_STOPS.map(stop => (
            <Tooltip key={stop} title={primary[stop as ShadeStop]} placement="top" arrow>
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ width: 48, height: 48, borderRadius: tokens.borderRadius.md, bgcolor: primary[stop as ShadeStop] }} />
                <Typography variant="caption" color="text.secondary">{stop}</Typography>
              </Box>
            </Tooltip>
          ))}
        </Stack>

        <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: 'block' }}>Neutral scale</Typography>
        <Stack direction="row" flexWrap="wrap" gap={1.5} sx={{ mb: 3 }}>
          {SHADE_STOPS.map(stop => (
            <Tooltip key={stop} title={neutral[stop as ShadeStop]} placement="top" arrow>
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ width: 48, height: 48, borderRadius: tokens.borderRadius.md, bgcolor: neutral[stop as ShadeStop] }} />
                <Typography variant="caption" color="text.secondary">{stop}</Typography>
              </Box>
            </Tooltip>
          ))}
        </Stack>

        <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: 'block' }}>Semantic</Typography>
        <Stack direction="row" flexWrap="wrap" gap={2}>
          {[
            { label: 'Error',   color: tokens.color.error[500]   },
            { label: 'Success', color: tokens.color.success[500] },
            { label: 'Warning', color: tokens.color.warning[500] },
            { label: 'Info',    color: tokens.color.info[500]    },
          ].map(({ label, color }) => (
            <Box key={label} sx={{ textAlign: 'center' }}>
              <Box sx={{ width: 48, height: 48, borderRadius: tokens.borderRadius.md, bgcolor: color }} />
              <Typography variant="caption" color="text.secondary">{label}</Typography>
            </Box>
          ))}
        </Stack>
      </Box>

      {/* ── 4 · Buttons ─────────────────────────────────────────────────────── */}
      <Box sx={{ mb: 6 }}>
        <SectionHeader title="Buttons" />
        <Stack direction="row" flexWrap="wrap" gap={2} alignItems="center">
          <Button variant="contained">Contained</Button>
          <Button variant="outlined">Outlined</Button>
          <Button variant="text">Text</Button>
          <Button variant="contained" color="inherit">Secondary</Button>
          <Button variant="contained" color="error">Error</Button>
          <Button variant="contained" color="success">Success</Button>
          <Button variant="contained" color="warning">Warning</Button>
          <Button variant="contained" disabled>Disabled</Button>
          <Button variant="contained" startIcon={<CircularProgress size={16} color="inherit" />}>
            Loading
          </Button>
          <Button variant="contained" size="small">Small</Button>
          <Button variant="contained" size="large">Large</Button>
          <Button variant="contained" startIcon={<AddIcon />}>Add Item</Button>
          <Button variant="contained" endIcon={<ArrowForwardIcon />}>Next</Button>
          <IconButton color="primary"><SettingsIcon /></IconButton>
        </Stack>
      </Box>

      {/* ── 5 · Form Inputs ─────────────────────────────────────────────────── */}
      <Box sx={{ mb: 6 }}>
        <SectionHeader title="Form Inputs" />
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth label="Default field" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth label="With placeholder" placeholder="Enter something…" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth label="With helper text" helperText="Helpful hint below the field" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth label="Error state" error helperText="This field is required" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth label="Disabled" disabled value="Cannot edit this" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth label="Password" type="password" defaultValue="secret123" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth label="Multiline" multiline rows={3} placeholder="Enter long text…" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Role</InputLabel>
              <Select value={selectValue} label="Role" onChange={e => setSelectValue(e.target.value)}>
                <MenuItem value="engineer">Engineer</MenuItem>
                <MenuItem value="designer">Designer</MenuItem>
                <MenuItem value="product">Product Manager</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={0.5}>
              <FormControlLabel control={<Checkbox />} label="Unchecked" />
              <FormControlLabel control={<Checkbox defaultChecked />} label="Checked" />
              <FormControlLabel control={<Checkbox indeterminate />} label="Indeterminate" />
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <RadioGroup value={radioValue} onChange={e => setRadioValue(e.target.value)}>
              <FormControlLabel value="option1" control={<Radio />} label="Option 1" />
              <FormControlLabel value="option2" control={<Radio />} label="Option 2" />
              <FormControlLabel value="option3" control={<Radio />} label="Option 3" />
            </RadioGroup>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={0.5}>
              <FormControlLabel control={<Switch />} label="Switch off" />
              <FormControlLabel control={<Switch defaultChecked />} label="Switch on" />
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>Slider</Typography>
            <Slider defaultValue={30} valueLabelDisplay="auto" aria-label="Preview slider" />
          </Grid>
        </Grid>
      </Box>

      {/* ── 6 · Feedback ────────────────────────────────────────────────────── */}
      <Box sx={{ mb: 6 }}>
        <SectionHeader title="Feedback" />
        <Stack spacing={2.5}>
          <Stack spacing={1}>
            <Alert severity="success">Success — your changes have been saved.</Alert>
            <Alert severity="error">Error — something went wrong.</Alert>
            <Alert severity="warning">Warning — please review before continuing.</Alert>
            <Alert severity="info">Info — here is some useful information.</Alert>
          </Stack>

          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>Linear Progress</Typography>
            <Stack spacing={1}>
              <LinearProgress variant="determinate" value={60} />
              <LinearProgress />
            </Stack>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>Circular Progress</Typography>
            <Stack direction="row" spacing={3} alignItems="center">
              <CircularProgress variant="determinate" value={75} />
              <CircularProgress />
            </Stack>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>Chips</Typography>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              <Chip label="Default" />
              <Chip label="Outlined" variant="outlined" />
              <Chip label="Primary" color="primary" />
              <Chip icon={<CheckCircleOutlineIcon />} label="With Icon" color="success" />
              <Chip label="Deletable" onDelete={() => {}} />
              <Chip label="Error" color="error" variant="outlined" />
            </Stack>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>Badge</Typography>
            <Stack direction="row" spacing={4} alignItems="center">
              <Badge badgeContent={4} color="primary"><MailIcon /></Badge>
              <Badge badgeContent={99} color="error"><MailIcon /></Badge>
              <Badge variant="dot" color="success"><MailIcon /></Badge>
            </Stack>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>Tooltip</Typography>
            <Tooltip title="I'm a tooltip!" arrow>
              <Button variant="outlined">Hover me</Button>
            </Tooltip>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>Skeleton</Typography>
            <Stack spacing={1} sx={{ maxWidth: 360 }}>
              <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
              <Skeleton variant="text" sx={{ fontSize: '1rem' }} width="80%" />
              <Skeleton variant="text" sx={{ fontSize: '1rem' }} width="60%" />
              <Stack direction="row" spacing={2}>
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton variant="rectangular" width={200} height={40} sx={{ borderRadius: 1 }} />
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Box>

      {/* ── 7 · Cards ───────────────────────────────────────────────────────── */}
      <Box sx={{ mb: 6 }}>
        <SectionHeader title="Cards" />
        <Grid container spacing={3}>

          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Basic Card</Typography>
                <Typography variant="body2" color="text.secondary">
                  A simple card for grouping related content. No actions, minimal chrome.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Card with Actions</Typography>
                <Typography variant="body2" color="text.secondary">
                  Action buttons sit at the bottom in a dedicated row.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Learn More</Button>
                <Button size="small" variant="contained">Get Started</Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <Card>
              <Box sx={{
                height: 140,
                bgcolor: 'primary.light',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Typography variant="body2" color="primary.contrastText" fontWeight={600}>
                  Media Placeholder
                </Typography>
              </Box>
              <CardContent>
                <Typography variant="h6" gutterBottom>Card with Media</Typography>
                <Typography variant="body2" color="text.secondary">
                  A colored header stands in for an image or video element.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>Outlined Card</Typography>
                <Typography variant="body2" color="text.secondary">
                  Uses a border instead of shadow. Works well in high-contrast layouts.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <Card elevation={3}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography variant="h6">Elevated Card</Typography>
                  <Chip label="Featured" size="small" color="primary" />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Higher elevation creates stronger perceived depth.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <Card
              onClick={() => {}}
              sx={{
                cursor: 'pointer',
                transition: 'transform 150ms ease, box-shadow 150ms ease',
                '&:hover': { transform: 'translateY(-3px)', boxShadow: 4 },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6">Interactive Card</Typography>
                  <ArrowForwardIcon color="action" fontSize="small" />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Hover to see the lift effect. Entire surface is clickable.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

        </Grid>
      </Box>

      {/* ── 8 · Data Display ────────────────────────────────────────────────── */}
      <Box sx={{ mb: 6 }}>
        <SectionHeader title="Data Display" />

        <Box sx={{ overflowX: 'auto', mb: 4 }}>
          <TableContainer component={Paper} variant="outlined" sx={{ minWidth: 600 }}>
            <Table>
              <TableHead>
                <TableRow>
                  {['Name', 'Role', 'Status', 'Joined', 'Actions'].map(col => (
                    <TableCell key={col}><strong>{col}</strong></TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {TABLE_ROWS.map(row => (
                  <TableRow key={row.name} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.role}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.status}
                        size="small"
                        color={row.status === 'active' ? 'success' : 'default'}
                      />
                    </TableCell>
                    <TableCell>{row.joined}</TableCell>
                    <TableCell>
                      <IconButton size="small" color="primary"><EditIcon fontSize="small" /></IconButton>
                      <IconButton size="small" color="error"><DeleteIcon fontSize="small" /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Typography variant="body2" color="text.secondary" gutterBottom>List</Typography>
        <Paper variant="outlined" sx={{ mb: 3 }}>
          <List dense>
            {[
              { icon: <InboxIcon />,   primary: 'Inbox',   secondary: '4 new messages'    },
              { icon: <StarIcon />,    primary: 'Starred', secondary: '12 items'           },
              { icon: <MailIcon />,    primary: 'Sent',    secondary: 'Last sent yesterday' },
              { icon: <FolderIcon />,  primary: 'Drafts',  secondary: '3 unsaved drafts'   },
              { icon: <DeleteIcon />,  primary: 'Trash',   secondary: 'Auto-empties in 7d' },
            ].map(item => (
              <ListItem key={item.primary}>
                <ListItemIcon sx={{ color: 'primary.main' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.primary} secondary={item.secondary} />
              </ListItem>
            ))}
          </List>
        </Paper>

        <Typography variant="body2" color="text.secondary" gutterBottom>Accordion</Typography>
        {[
          {
            q: 'What is this design system?',
            a: 'A foundation layer on MUI v7 and React that provides consistent tokens, theming, and components across all projects.',
          },
          {
            q: 'How do I customize the theme?',
            a: 'Use the floating settings button (bottom-right) to change brand color, font family, and light/dark mode. Preferences persist via localStorage.',
          },
          {
            q: 'Can I add my own components?',
            a: 'Yes — add them to src/design-system/components/. Consume tokens and useFoundationTheme for full theme integration.',
          },
        ].map((item, i) => (
          <Accordion key={item.q} defaultExpanded={i === 0}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="body2" fontWeight={600}>{item.q}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary">{item.a}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      {/* ── 9 · Navigation ──────────────────────────────────────────────────── */}
      <Box sx={{ mb: 6 }}>
        <SectionHeader title="Navigation" />

        <Typography variant="body2" color="text.secondary" gutterBottom>Tabs</Typography>
        <Paper variant="outlined" sx={{ mb: 3 }}>
          <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
            <Tab label="Overview" />
            <Tab label="Details" />
            <Tab label="Settings" />
          </Tabs>
        </Paper>

        <Typography variant="body2" color="text.secondary" gutterBottom>Breadcrumbs</Typography>
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link
            href="#"
            underline="hover"
            color="inherit"
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
          >
            <HomeIcon fontSize="inherit" /> Home
          </Link>
          <Link href="#" underline="hover" color="inherit">Dashboard</Link>
          <Typography color="text.primary">Settings</Typography>
        </Breadcrumbs>

        <Typography variant="body2" color="text.secondary" gutterBottom>Pagination</Typography>
        <Pagination
          count={10}
          page={paginationPage}
          onChange={(_, v) => setPaginationPage(v)}
          color="primary"
          sx={{ mb: 3 }}
        />

        <Typography variant="body2" color="text.secondary" gutterBottom>Stepper</Typography>
        <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
          <Stepper activeStep={1}>
            {['Account Info', 'Profile Setup', 'Confirmation'].map(label => (
              <Step key={label}><StepLabel>{label}</StepLabel></Step>
            ))}
          </Stepper>
        </Paper>

        <Typography variant="body2" color="text.secondary" gutterBottom>Bottom Navigation</Typography>
        <Paper variant="outlined" sx={{ maxWidth: 400 }}>
          <BottomNavigation value={bottomNavValue} onChange={(_, v) => setBottomNavValue(v)}>
            <BottomNavigationAction label="Home"      icon={<HomeIcon />} />
            <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
            <BottomNavigationAction label="Profile"   icon={<PersonIcon />} />
            <BottomNavigationAction label="Location"  icon={<LocationOnIcon />} />
          </BottomNavigation>
        </Paper>
      </Box>

      {/* ── 10 · Overlays ───────────────────────────────────────────────────── */}
      <Box sx={{ mb: 6 }}>
        <SectionHeader title="Overlays (interactive)" />
        <Stack direction="row" flexWrap="wrap" gap={2}>
          <Button variant="outlined" onClick={() => setDialogOpen(true)}>Open Dialog</Button>
          <Button variant="outlined" onClick={() => setSnackbarOpen(true)}>Show Snackbar</Button>
          <Button variant="outlined" onClick={() => setNavDrawerOpen(true)}>Open Drawer</Button>
        </Stack>

        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>Confirm Action</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to continue? This action cannot be undone.</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={() => setDialogOpen(false)}>Confirm</Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          message="Changes saved successfully"
          action={
            <IconButton size="small" color="inherit" onClick={() => setSnackbarOpen(false)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />

        <MuiDrawer anchor="left" open={navDrawerOpen} onClose={() => setNavDrawerOpen(false)}>
          <Box sx={{ width: 240, pt: 2 }}>
            <Typography variant="h6" fontWeight={700} sx={{ px: 2, mb: 1 }}>Navigation</Typography>
            <Divider sx={{ mb: 1 }} />
            <List>
              {[
                { icon: <HomeIcon />,   label: 'Home'    },
                { icon: <InboxIcon />,  label: 'Inbox'   },
                { icon: <StarIcon />,   label: 'Starred' },
                { icon: <PersonIcon />, label: 'Profile' },
              ].map(item => (
                <ListItem
                  key={item.label}
                  onClick={() => setNavDrawerOpen(false)}
                  sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                >
                  <ListItemIcon sx={{ color: 'primary.main' }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItem>
              ))}
            </List>
          </Box>
        </MuiDrawer>
      </Box>

      {/* ── 11 · Responsive Grid ────────────────────────────────────────────── */}
      <Box sx={{ mb: 6 }}>
        <SectionHeader title="Responsive Grid" />
        <Grid container spacing={1.5}>
          {Array.from({ length: 12 }).map((_, i) => {
            const stop = SHADE_STOPS[i % SHADE_STOPS.length] as ShadeStop
            const lightText = i >= 5
            return (
              <Grid key={i} size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2, xxl: 2 }}>
                <Box
                  sx={{
                    height: 80,
                    bgcolor: primary[stop],
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    px: 1,
                  }}
                >
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    textAlign="center"
                    sx={{ color: lightText ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.7)', lineHeight: 1.5 }}
                  >
                    xs:12 sm:6 md:4<br />lg:3 xl:2 xxl:2
                  </Typography>
                </Box>
              </Grid>
            )
          })}
        </Grid>
      </Box>

    </Box>
  )
}
