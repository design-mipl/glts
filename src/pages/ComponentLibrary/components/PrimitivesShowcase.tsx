import { useState } from 'react'
import { Box, Typography, Stack, Grid } from '@mui/material'
import {
  Button, IconButton, Input, Textarea, Select, MultiSelect,
  Checkbox, RadioGroup, Toggle, DatePicker, DateRangePicker,
  FileUpload, Divider, Tooltip,
} from '@/design-system/components'
import { Search, Plus, Trash2, Edit, Download } from 'lucide-react'

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
      <Grid container spacing={4}>
        {/* Button */}
        <Grid size={12}>
          <Typography variant="h3" sx={{ mb: 1.5 }}>Button</Typography>
          <Stack direction="row" gap={1.5} flexWrap="wrap" alignItems="center">
            <Button variant="contained">Primary</Button>
            <Button variant="outlined">Secondary</Button>
            <Button variant="text">Text</Button>
            <Button variant="soft">Soft</Button>
            <Button variant="contained" size="sm">Small</Button>
            <Button variant="contained" size="lg">Large</Button>
            <Button variant="contained" startIcon={<Plus size={14} />}>Add Item</Button>
            <Button variant="contained" disabled>Disabled</Button>
            <Button variant="contained" loading>Loading</Button>
          </Stack>
        </Grid>

        <Grid size={12}><Divider /></Grid>

        {/* IconButton */}
        <Grid size={12}>
          <Typography variant="h3" sx={{ mb: 1.5 }}>IconButton</Typography>
          <Stack direction="row" gap={1.5} flexWrap="wrap" alignItems="center">
            <IconButton icon={<Search size={16} />} />
            <IconButton icon={<Edit size={16} />} variant="outlined" />
            <IconButton icon={<Trash2 size={16} />} variant="soft" color="error" />
            <IconButton icon={<Download size={14} />} size="sm" />
            <IconButton icon={<Plus size={20} />} size="lg" />
          </Stack>
        </Grid>

        <Grid size={12}><Divider /></Grid>

        {/* Input & Textarea */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h3" sx={{ mb: 1.5 }}>Input</Typography>
          <Stack gap={2}>
            <Input label="Text Input" placeholder="Enter text..." />
            <Input label="With helper" helperText="This is a hint" placeholder="Hint below" />
            <Input label="Error state" error helperText="This field is required" placeholder="Required" />
            <Input label="Disabled" disabled placeholder="Not editable" />
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h3" sx={{ mb: 1.5 }}>Textarea</Typography>
          <Stack gap={2}>
            <Textarea label="Description" placeholder="Enter description..." rows={3} />
            <Textarea label="Disabled" disabled placeholder="Not editable" rows={3} />
          </Stack>
        </Grid>

        <Grid size={12}><Divider /></Grid>

        {/* Select & MultiSelect */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h3" sx={{ mb: 1.5 }}>Select</Typography>
          <Stack gap={2}>
            <Select label="Single Select" options={selectOptions} value={selectVal} onChange={setSelectVal} placeholder="Choose one..." />
            <Select label="Disabled" options={selectOptions} value="" onChange={() => {}} disabled />
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h3" sx={{ mb: 1.5 }}>MultiSelect</Typography>
          <MultiSelect label="Multi Select" options={selectOptions} value={multiVal} onChange={setMultiVal} placeholder="Choose multiple..." />
        </Grid>

        <Grid size={12}><Divider /></Grid>

        {/* Checkbox, RadioGroup, Toggle */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="h3" sx={{ mb: 1.5 }}>Checkbox</Typography>
          <Stack gap={1}>
            <Checkbox label="Unchecked" checked={false} onChange={() => {}} />
            <Checkbox label="Checked" checked={checked} onChange={setChecked} />
            <Checkbox label="Disabled" checked={false} onChange={() => {}} disabled />
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="h3" sx={{ mb: 1.5 }}>RadioGroup</Typography>
          <RadioGroup options={radioOptions} value={radio} onChange={setRadio} />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="h3" sx={{ mb: 1.5 }}>Toggle</Typography>
          <Stack gap={2}>
            <Toggle label="Off state" checked={false} onChange={() => {}} />
            <Toggle label="On state" checked={toggled} onChange={setToggled} />
            <Toggle label="Disabled" checked={false} onChange={() => {}} disabled />
          </Stack>
        </Grid>

        <Grid size={12}><Divider /></Grid>

        {/* DatePicker & DateRangePicker */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h3" sx={{ mb: 1.5 }}>DatePicker</Typography>
          <DatePicker label="Pick a date" value={date} onChange={setDate} />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h3" sx={{ mb: 1.5 }}>DateRangePicker</Typography>
          <DateRangePicker label="Date range" value={[null, null]} onChange={() => {}} />
        </Grid>

        <Grid size={12}><Divider /></Grid>

        {/* FileUpload & Tooltip */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h3" sx={{ mb: 1.5 }}>FileUpload</Typography>
          <FileUpload onUpload={() => {}} />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h3" sx={{ mb: 1.5 }}>Tooltip</Typography>
          <Stack direction="row" gap={2}>
            <Tooltip content="Top tooltip" placement="top">
              <Button variant="outlined" size="sm">Top</Button>
            </Tooltip>
            <Tooltip content="Bottom tooltip" placement="bottom">
              <Button variant="outlined" size="sm">Bottom</Button>
            </Tooltip>
            <Tooltip content="Right tooltip" placement="right">
              <Button variant="outlined" size="sm">Right</Button>
            </Tooltip>
          </Stack>
        </Grid>

        <Grid size={12}><Divider /></Grid>

        {/* Divider */}
        <Grid size={12}>
          <Typography variant="h3" sx={{ mb: 1.5 }}>Divider</Typography>
          <Stack gap={2}>
            <Divider />
            <Divider label="With Label" />
            <Divider label="Inset" variant="inset" />
          </Stack>
        </Grid>
      </Grid>
    </Box>
  )
}

