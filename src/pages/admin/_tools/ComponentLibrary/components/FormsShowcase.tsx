import { useState } from 'react'
import { Box, Typography, Grid, Divider as MuiDivider } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import {
  FormField, FormSection, FormActions, RichTextEditor,
  SearchInput, TagInput, Input, Select, Toggle, Divider, Tag, FileUpload,
} from '@/design-system/UIComponents'
import Textarea from '@/design-system/UIComponents/Primitives/Textarea'
import DatePicker from '@/design-system/UIComponents/Primitives/DatePicker'
import DateRangePicker from '@/design-system/UIComponents/Primitives/DateRangePicker'
import type { TagVariant } from '@/design-system/UIComponents/Display/Tag'
import { Users, Briefcase, Globe, Lock } from 'lucide-react'

function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <Box sx={{ mb: 2.5 }}>
      <Typography variant="h3" sx={{ mb: 0.5, fontSize: '15px', fontWeight: 700 }}>{title}</Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px' }}>
          {description}
        </Typography>
      )}
    </Box>
  )
}

function StateGrid({ children }: { children: React.ReactNode }) {
  return (
    <Grid container spacing={2}>
      {children}
    </Grid>
  )
}

export function FormsShowcase() {
  const theme = useTheme()
  const [richText, setRichText] = useState('<p>Start editing here...</p>')
  const [search, setSearch] = useState('')
  const [tags, setTags] = useState<string[]>(['react', 'typescript'])
  const [toggle, setToggle] = useState(false)
  const [selectVal, setSelectVal] = useState<string | number>('')
  const [avatarSelectVal, setAvatarSelectVal] = useState<string | number>('')
  const [date, setDate] = useState<Date | null>(null)
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null])
  const [inputVal, setInputVal] = useState('')

  const tagVariants: Array<{ variant: TagVariant; label: string }> = [
    { variant: 'default', label: 'Default' },
    { variant: 'success', label: 'Success' },
    { variant: 'warning', label: 'Warning' },
    { variant: 'error', label: 'Error' },
    { variant: 'info', label: 'Info' },
    { variant: 'neutral', label: 'Neutral' },
  ]

  return (
    <Box>
      <Grid container spacing={5}>

        {/* ── Input ── */}
        <Grid size={12}>
          <SectionHeader
            title="Input"
            description="Text input with focus, hover, error, and disabled states."
          />
          <StateGrid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormField label="Normal">
                <Input placeholder="Enter value..." value={inputVal} onChange={setInputVal} fullWidth />
              </FormField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormField label="With helper text" hint="optional">
                <Input placeholder="Enter email..." type="email" fullWidth />
              </FormField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormField label="Error state" required error helperText="This field is required">
                <Input placeholder="Enter value..." error fullWidth />
              </FormField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormField label="Disabled">
                <Input placeholder="Cannot edit..." disabled fullWidth value="Disabled value" />
              </FormField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormField label="With icon adornments">
                <Input
                  placeholder="Search..."
                  startAdornment={<Users size={14} color={theme.palette.text.secondary} />}
                  fullWidth
                />
              </FormField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormField label="Small size">
                <Input placeholder="Compact input..." size="sm" fullWidth />
              </FormField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 6 }}>
              <FormField label="Character count" hint="max 100 chars">
                <Input
                  placeholder="Type here..."
                  value={inputVal}
                  onChange={setInputVal}
                  maxLength={100}
                  showCount
                  fullWidth
                />
              </FormField>
            </Grid>
          </StateGrid>
        </Grid>

        <Grid size={12}><Divider /></Grid>

        {/* ── Textarea ── */}
        <Grid size={12}>
          <SectionHeader
            title="Textarea"
            description="Multi-line text input. Min height 120px, vertically resizable."
          />
          <StateGrid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormField label="Normal">
                <Textarea placeholder="Enter description..." fullWidth />
              </FormField>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormField label="Error state" error helperText="Description cannot be empty">
                <Textarea placeholder="Enter description..." error fullWidth />
              </FormField>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormField label="Auto-resize with count" hint="500 char max">
                <Textarea placeholder="Write something..." autoResize maxLength={500} showCount fullWidth />
              </FormField>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormField label="Disabled">
                <Textarea value="This textarea is disabled and cannot be edited." disabled fullWidth />
              </FormField>
            </Grid>
          </StateGrid>
        </Grid>

        <Grid size={12}><Divider /></Grid>

        {/* ── Select ── */}
        <Grid size={12}>
          <SectionHeader
            title="Select"
            description="Dropdown with icon/avatar option support, focus ring, and helper text."
          />
          <StateGrid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <FormField label="Basic select" required>
                <Select
                  options={[
                    { value: 'eng', label: 'Engineering' },
                    { value: 'design', label: 'Design' },
                    { value: 'product', label: 'Product' },
                    { value: 'marketing', label: 'Marketing' },
                  ]}
                  value={selectVal}
                  onChange={setSelectVal}
                  placeholder="Select department"
                  fullWidth
                />
              </FormField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <FormField label="With icons">
                <Select
                  options={[
                    { value: 'public', label: 'Public', icon: <Globe size={14} /> },
                    { value: 'private', label: 'Private', icon: <Lock size={14} /> },
                    { value: 'team', label: 'Team only', icon: <Users size={14} /> },
                    { value: 'org', label: 'Organisation', icon: <Briefcase size={14} /> },
                  ]}
                  value=""
                  onChange={() => {}}
                  placeholder="Select visibility"
                  fullWidth
                />
              </FormField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <FormField label="Assign to (with avatars)">
                <Select
                  options={[
                    { value: 'alice', label: 'Alice Martin', avatar: '', description: 'Frontend Engineer' },
                    { value: 'bob', label: 'Bob Chen', avatar: '', description: 'Backend Engineer' },
                    { value: 'carol', label: 'Carol White', avatar: '', description: 'Product Designer' },
                  ]}
                  value={avatarSelectVal}
                  onChange={setAvatarSelectVal}
                  placeholder="Select assignee"
                  fullWidth
                />
              </FormField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <FormField label="Error state" error helperText="Please select a department">
                <Select
                  options={[{ value: 'eng', label: 'Engineering' }]}
                  value=""
                  onChange={() => {}}
                  placeholder="Select..."
                  error
                  fullWidth
                />
              </FormField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <FormField label="Clearable">
                <Select
                  options={[
                    { value: 'eng', label: 'Engineering' },
                    { value: 'design', label: 'Design' },
                  ]}
                  value={selectVal}
                  onChange={setSelectVal}
                  placeholder="Select department"
                  clearable
                  fullWidth
                />
              </FormField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <FormField label="Disabled">
                <Select
                  options={[{ value: 'eng', label: 'Engineering' }]}
                  value="eng"
                  onChange={() => {}}
                  disabled
                  fullWidth
                />
              </FormField>
            </Grid>
          </StateGrid>
        </Grid>

        <Grid size={12}><Divider /></Grid>

        {/* ── DatePicker ── */}
        <Grid size={12}>
          <SectionHeader
            title="DatePicker & DateRangePicker"
            description="Date selection with Lucide Calendar icon and polished popup."
          />
          <StateGrid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <FormField label="Date picker">
                <DatePicker
                  label="Select date"
                  value={date}
                  onChange={setDate}
                  fullWidth
                />
              </FormField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <FormField label="Error state" error helperText="Please select a valid date">
                <DatePicker
                  label="Select date"
                  value={null}
                  onChange={() => {}}
                  error
                  fullWidth
                />
              </FormField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <FormField label="Disabled">
                <DatePicker
                  label="Select date"
                  value={new Date()}
                  onChange={() => {}}
                  disabled
                  fullWidth
                />
              </FormField>
            </Grid>
            <Grid size={12}>
              <FormField label="Date range picker">
                <DateRangePicker
                  value={dateRange}
                  onChange={setDateRange}
                />
              </FormField>
            </Grid>
          </StateGrid>
        </Grid>

        <Grid size={12}><Divider /></Grid>

        {/* ── Tags ── */}
        <Grid size={12}>
          <SectionHeader
            title="Tag"
            description="Semantic color variants with optional remove button."
          />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {tagVariants.map(({ variant, label }) => (
              <Tag key={variant} label={label} variant={variant} />
            ))}
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {tagVariants.map(({ variant, label }) => (
              <Tag key={variant} label={label} variant={variant} size="sm" />
            ))}
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {tagVariants.map(({ variant, label }) => (
              <Tag key={variant} label={label} variant={variant} onDelete={() => {}} />
            ))}
          </Box>
        </Grid>

        <Grid size={12}><Divider /></Grid>

        {/* ── Tag Input ── */}
        <Grid size={12}>
          <SectionHeader title="TagInput" description="Add tags by typing and pressing Enter or comma." />
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TagInput
                label="Tags"
                value={tags}
                onChange={setTags}
                placeholder="Type and press Enter..."
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TagInput
                label="Max 3 tags"
                value={['design', 'ui']}
                onChange={() => {}}
                placeholder="Max 3 tags..."
                maxTags={3}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid size={12}><Divider /></Grid>

        {/* ── File Upload ── */}
        <Grid size={12}>
          <SectionHeader
            title="FileUpload"
            description="Drag & drop zone with Browse Files button. Hover and drag-over states included."
          />
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <FileUpload
                label="Attachments"
                accept=".pdf,.docx,.xlsx,.png,.jpg"
                maxSize={50 * 1024 * 1024}
                multiple
                onUpload={(files) => console.log('Uploaded:', files)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FileUpload
                label="Image only (with preview)"
                accept="image/*"
                preview
                onUpload={(files) => console.log('Uploaded:', files)}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid size={12}><Divider /></Grid>

        {/* ── SearchInput ── */}
        <Grid size={{ xs: 12, md: 6 }}>
          <SectionHeader title="SearchInput" description="Debounced search with clear button." />
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search anything..."
          />
        </Grid>

        {/* ── Toggle ── */}
        <Grid size={{ xs: 12, md: 6 }}>
          <SectionHeader title="Toggle" description="Switch with label and helper text." />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Toggle checked={toggle} onChange={setToggle} label="Enable notifications" description="Receive email and push notifications" />
            <Toggle checked={true} onChange={() => {}} label="Always enabled" disabled />
            <Toggle checked={false} onChange={() => {}} label="Always disabled" disabled />
          </Box>
        </Grid>

        <Grid size={12}><Divider /></Grid>

        {/* ── FormField ── */}
        <Grid size={12}>
          <SectionHeader
            title="FormField"
            description="Wrapper with label (bold, 600 weight), required indicator, helper text, and error icon."
          />
          <StateGrid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormField label="Full Name" required helperText="Enter your legal name as it appears on your ID">
                <Input placeholder="John Doe" fullWidth />
              </FormField>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormField label="Email address" hint="optional" helperText="We'll send a confirmation to this address">
                <Input placeholder="you@example.com" type="email" fullWidth />
              </FormField>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormField label="Password" required error helperText="Password must be at least 8 characters">
                <Input placeholder="Enter password" type="password" error fullWidth />
              </FormField>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormField label="Status notifications">
                <Toggle checked={toggle} onChange={setToggle} label="Enable notifications" />
              </FormField>
            </Grid>
          </StateGrid>
        </Grid>

        <Grid size={12}><Divider /></Grid>

        {/* ── FormSection ── */}
        <Grid size={12}>
          <SectionHeader title="FormSection" description="Grouped form fields with title and description." />
          <FormSection title="Personal Information" description="Basic profile details used across your account">
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Input label="First Name" placeholder="John" fullWidth />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Input label="Last Name" placeholder="Doe" fullWidth />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Input label="Email" placeholder="john@example.com" type="email" fullWidth />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Input label="Phone" placeholder="+1 (555) 000-0000" type="tel" fullWidth />
              </Grid>
            </Grid>
          </FormSection>
        </Grid>

        <Grid size={12}><Divider /></Grid>

        {/* ── RichTextEditor ── */}
        <Grid size={12}>
          <SectionHeader title="RichTextEditor" description="TipTap-based WYSIWYG with formatting toolbar." />
          <RichTextEditor
            value={richText}
            onChange={setRichText}
            placeholder="Write something..."
          />
        </Grid>

        <Grid size={12}><Divider /></Grid>

        {/* ── FormActions ── */}
        <Grid size={12}>
          <SectionHeader title="FormActions" description="Consistent action bar with primary, secondary, and ghost buttons." />
          <Box
            sx={{
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '8px',
              p: 3,
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontSize: '13px' }}>
              Form content goes here…
            </Typography>
            <MuiDivider sx={{ mb: 2 }} />
            <FormActions
              submitLabel="Save Changes"
              cancelLabel="Cancel"
              onSubmit={() => {}}
              onCancel={() => {}}
            />
          </Box>
        </Grid>

      </Grid>
    </Box>
  )
}
