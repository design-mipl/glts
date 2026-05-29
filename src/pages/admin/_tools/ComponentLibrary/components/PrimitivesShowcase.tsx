import { useState, type ReactNode } from 'react'
import { Box, Typography, Stack, Grid } from '@mui/material'
import {
  Button,
  IconButton,
  FormField,
  Input,
  Textarea,
  Select,
  MultiSelect,
  Checkbox,
  RadioGroup,
  Toggle,
  DatePicker,
  DateRangePicker,
  FileUpload,
  Divider,
  Tooltip,
} from '@/design-system/UIComponents'
import { Search, Plus, Trash2, Edit, Download } from 'lucide-react'

function ShowcaseSection({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <Box
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        bgcolor: 'background.paper',
        p: { xs: 2, md: 3 },
        height: '100%',
      }}
    >
      <Typography variant="subtitle1" fontWeight={700} color="text.primary" sx={{ mb: description ? 0.5 : 2 }}>
        {title}
      </Typography>
      {description ? (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '13px' }}>
          {description}
        </Typography>
      ) : null}
      {children}
    </Box>
  )
}

export function PrimitivesShowcase() {
  const [selectVal, setSelectVal] = useState<string | number>('')
  const [multiVal, setMultiVal] = useState<(string | number)[]>([])
  const [checked, setChecked] = useState(false)
  const [radio, setRadio] = useState<string | number>('a')
  const [toggled, setToggled] = useState(false)
  const [date, setDate] = useState<Date | null>(null)

  const selectOptions = [
    { value: 'a', label: 'Option A' },
    { value: 'b', label: 'Option B' },
    { value: 'c', label: 'Option C' },
  ]

  const radioOptions = [
    { value: 'a', label: 'Choice A' },
    { value: 'b', label: 'Choice B' },
    { value: 'c', label: 'Choice C' },
  ]

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 720, fontSize: '13px' }}>
        Enterprise primitives use shared field spec (40px / 34px height, 10px radius, 13px type) and button tokens
        (36px md default, 32px sm, 10px radius).
      </Typography>

      <Grid container spacing={2.5}>
        <Grid size={12}>
          <ShowcaseSection
            title="Button"
            description="Primary, secondary, text, and soft variants with consistent sizing and focus rings."
          >
            <Stack gap={2}>
              <Stack direction="row" gap={1.5} flexWrap="wrap" alignItems="center">
                <Button variant="contained">Primary</Button>
                <Button variant="outlined">Secondary</Button>
                <Button variant="text">Text</Button>
                <Button variant="soft">Soft</Button>
                <Button variant="soft" color="primary">
                  Save draft
                </Button>
              </Stack>
              <Stack direction="row" gap={1.5} flexWrap="wrap" alignItems="center">
                <Button variant="contained" size="sm">
                  Small
                </Button>
                <Button variant="contained" size="md">
                  Medium
                </Button>
                <Button variant="contained" size="lg">
                  Large
                </Button>
                <Button variant="contained" startIcon={<Plus size={14} />}>
                  Add item
                </Button>
                <Button variant="contained" disabled>
                  Disabled
                </Button>
                <Button variant="contained" loading>
                  Loading
                </Button>
              </Stack>
              <Stack direction="row" gap={1.5} flexWrap="wrap" alignItems="center">
                <Button variant="outlined" color="secondary">
                  Cancel
                </Button>
                <Button variant="contained" color="primary">
                  Save
                </Button>
                <Button variant="contained" color="error">
                  Delete
                </Button>
                <Button variant="contained" color="info">
                  Info
                </Button>
              </Stack>
            </Stack>
          </ShowcaseSection>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <ShowcaseSection title="IconButton" description="Default, outlined, soft, and contained icon actions.">
            <Stack direction="row" gap={1.5} flexWrap="wrap" alignItems="center">
              <IconButton icon={<Search size={16} />} tooltip="Search" />
              <IconButton icon={<Edit size={16} />} variant="outlined" tooltip="Edit" />
              <IconButton icon={<Trash2 size={16} />} variant="soft" color="error" tooltip="Delete" />
              <IconButton icon={<Download size={14} />} size="sm" />
              <IconButton icon={<Plus size={18} />} variant="contained" color="primary" size="md" />
            </Stack>
          </ShowcaseSection>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <ShowcaseSection title="Tooltip" description="Contextual hints on interactive targets.">
            <Stack direction="row" gap={1.5} flexWrap="wrap">
              <Tooltip content="Top tooltip" placement="top">
                <Button variant="outlined">
                  Top
                </Button>
              </Tooltip>
              <Tooltip content="Bottom tooltip" placement="bottom">
                <Button variant="outlined">
                  Bottom
                </Button>
              </Tooltip>
              <Tooltip content="Right tooltip" placement="right">
                <Button variant="outlined">
                  Right
                </Button>
              </Tooltip>
            </Stack>
          </ShowcaseSection>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <ShowcaseSection title="Input" description="Label above field; flat 1px border; 10px radius.">
            <Stack gap={2}>
              <FormField label="Text input">
                <Input placeholder="Enter text…" fullWidth />
              </FormField>
              <FormField label="With helper" helperText="This is a hint">
                <Input placeholder="Hint below" fullWidth />
              </FormField>
              <FormField label="Error state" required error helperText="This field is required">
                <Input error placeholder="Required" fullWidth />
              </FormField>
              <Grid container spacing={2}>
                <Grid size={6}>
                  <FormField label="Default (sm)">
                    <Input placeholder="34px" fullWidth />
                  </FormField>
                </Grid>
                <Grid size={6}>
                  <FormField label="Size md">
                    <Input size="md" placeholder="40px" fullWidth />
                  </FormField>
                </Grid>
              </Grid>
              <FormField label="Disabled">
                <Input disabled placeholder="Not editable" fullWidth />
              </FormField>
            </Stack>
          </ShowcaseSection>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <ShowcaseSection title="Textarea">
            <Stack gap={2}>
              <FormField label="Description">
                <Textarea placeholder="Enter description…" rows={3} fullWidth />
              </FormField>
              <FormField label="Disabled">
                <Textarea disabled placeholder="Not editable" rows={3} fullWidth />
              </FormField>
            </Stack>
          </ShowcaseSection>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <ShowcaseSection title="Select">
            <Stack gap={2}>
              <FormField label="Single select">
                <Select
                  options={selectOptions}
                  value={selectVal}
                  onChange={setSelectVal}
                  placeholder="Choose one…"
                  fullWidth
                />
              </FormField>
              <FormField label="Disabled">
                <Select options={selectOptions} value="" onChange={() => {}} disabled fullWidth />
              </FormField>
            </Stack>
          </ShowcaseSection>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <ShowcaseSection title="MultiSelect">
            <FormField label="Multi select">
              <MultiSelect
                options={selectOptions}
                value={multiVal}
                onChange={setMultiVal}
                placeholder="Choose multiple…"
                fullWidth
              />
            </FormField>
          </ShowcaseSection>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <ShowcaseSection title="Checkbox">
            <Stack gap={1.5}>
              <Checkbox label="Unchecked" checked={false} onChange={() => {}} />
              <Checkbox label="Checked" checked={checked} onChange={setChecked} />
              <Checkbox label="Disabled" checked={false} onChange={() => {}} disabled />
            </Stack>
          </ShowcaseSection>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <ShowcaseSection title="RadioGroup">
            <RadioGroup options={radioOptions} value={radio} onChange={setRadio} />
          </ShowcaseSection>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <ShowcaseSection title="Toggle">
            <Stack gap={2}>
              <Toggle label="Off state" checked={false} onChange={() => {}} />
              <Toggle
                label="On state"
                description="Optional supporting line"
                checked={toggled}
                onChange={setToggled}
              />
              <Toggle label="Disabled" checked={false} onChange={() => {}} disabled />
            </Stack>
          </ShowcaseSection>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <ShowcaseSection title="DatePicker">
            <FormField label="Pick a date">
              <DatePicker value={date} onChange={setDate} placeholder="DD/MM/YYYY" fullWidth />
            </FormField>
          </ShowcaseSection>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <ShowcaseSection title="DateRangePicker">
            <DateRangePicker value={[null, null]} onChange={() => {}} fullWidth />
          </ShowcaseSection>
        </Grid>

        <Grid size={12}>
          <ShowcaseSection title="FileUpload">
            <FileUpload onUpload={() => {}} />
          </ShowcaseSection>
        </Grid>

        <Grid size={12}>
          <ShowcaseSection title="Divider">
            <Stack gap={2}>
              <Divider />
              <Divider label="With label" />
              <Divider label="Inset" variant="inset" />
            </Stack>
          </ShowcaseSection>
        </Grid>
      </Grid>
    </Box>
  )
}
