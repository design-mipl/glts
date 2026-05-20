import { useState } from 'react'
import { Box, Typography, Grid } from '@mui/material'
import {
  FormField, FormSection, FormActions, RichTextEditor,
  SearchInput, TagInput, Input, Select, Toggle, Divider,
} from '@/design-system/components'

export function FormsShowcase() {
  const [richText, setRichText] = useState('<p>Start editing here...</p>')
  const [search, setSearch] = useState('')
  const [tags, setTags] = useState<string[]>(['react', 'typescript'])
  const [toggle, setToggle] = useState(false)

  return (
    <Box>
      <Grid container spacing={4}>
        {/* FormField */}
        <Grid size={12}>
          <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>FormField</Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormField label="Full Name" required helperText="Enter your legal name">
                <Input placeholder="John Doe" />
              </FormField>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormField label="Department" required>
                <Select
                  options={[
                    { value: 'eng', label: 'Engineering' },
                    { value: 'design', label: 'Design' },
                    { value: 'product', label: 'Product' },
                  ]}
                  value=""
                  onChange={() => {}}
                  placeholder="Select department"
                />
              </FormField>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormField label="Email" error helperText="Please enter a valid email">
                <Input placeholder="user@example.com" error />
              </FormField>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormField label="Notifications" helperText="Receive email notifications">
                <Toggle checked={toggle} onChange={setToggle} label="Enable notifications" />
              </FormField>
            </Grid>
          </Grid>
        </Grid>

        <Grid size={12}><Divider /></Grid>

        {/* FormSection */}
        <Grid size={12}>
          <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>FormSection</Typography>
          <FormSection title="Personal Information" description="Basic profile details">
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Input label="First Name" placeholder="John" />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Input label="Last Name" placeholder="Doe" />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Input label="Email" placeholder="john@example.com" />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Input label="Phone" placeholder="+1 (555) 000-0000" />
              </Grid>
            </Grid>
          </FormSection>
        </Grid>

        <Grid size={12}><Divider /></Grid>

        {/* SearchInput */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>SearchInput</Typography>
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search anything..."
          />
        </Grid>

        {/* TagInput */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>TagInput</Typography>
          <TagInput
            label="Tags"
            value={tags}
            onChange={setTags}
            placeholder="Type and press Enter..."
          />
        </Grid>

        <Grid size={12}><Divider /></Grid>

        {/* RichTextEditor */}
        <Grid size={12}>
          <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>RichTextEditor</Typography>
          <RichTextEditor
            value={richText}
            onChange={setRichText}
            placeholder="Write something..."
          />
        </Grid>

        <Grid size={12}><Divider /></Grid>

        {/* FormActions */}
        <Grid size={12}>
          <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>FormActions</Typography>
          <FormActions
            submitLabel="Save Changes"
            cancelLabel="Cancel"
            onSubmit={() => {}}
            onCancel={() => {}}
          />
        </Grid>
      </Grid>
    </Box>
  )
}
