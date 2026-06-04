import { Box, IconButton, Stack, Typography } from '@mui/material'
import { Plus, Trash2 } from 'lucide-react'
import { Button, FormField, Input } from '@/design-system/UIComponents'
import { AdminFullPageFormFieldSpan } from '@/pages/admin/components/AdminFullPageFormShell'
import type { PassportIssueLocation } from '@/shared/types/countryMaster'

interface CountryPassportIssueLocationsEditorProps {
  locations: PassportIssueLocation[]
  onChange: (locations: PassportIssueLocation[]) => void
}

function generateLocationId(): string {
  return `loc-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

export function CountryPassportIssueLocationsEditor({
  locations,
  onChange,
}: CountryPassportIssueLocationsEditorProps) {
  const patchRow = (index: number, partial: Partial<PassportIssueLocation>) => {
    onChange(locations.map((row, i) => (i === index ? { ...row, ...partial } : row)))
  }

  const removeRow = (index: number) => {
    onChange(locations.filter((_, i) => i !== index))
  }

  const addRow = () => {
    onChange([
      ...locations,
      {
        id: generateLocationId(),
        label: '',
        jurisdiction: '',
        active: true,
      },
    ])
  }

  return (
    <AdminFullPageFormFieldSpan>
      <FormField
        label="Passport issue locations"
        helperText="Passport issuing cities shown in customer applications; jurisdiction auto-fills for the applicant."
      >
        <Stack spacing={1.5}>
          {locations.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No locations configured. Add at least one location and jurisdiction mapping.
            </Typography>
          ) : (
            locations.map((row, index) => (
              <Stack
                key={row.id}
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1}
                alignItems={{ xs: 'stretch', sm: 'flex-start' }}
              >
                <Box sx={{ flex: 1 }}>
                  <Input
                    value={row.label}
                    onChange={(value) => patchRow(index, { label: value })}
                    placeholder="Location (e.g. Mumbai)"
                    fullWidth
                  />
                </Box>
                <Box sx={{ flex: 1.5 }}>
                  <Input
                    value={row.jurisdiction}
                    onChange={(value) => patchRow(index, { jurisdiction: value })}
                    placeholder="Jurisdiction (e.g. Mumbai — China Consulate)"
                    fullWidth
                  />
                </Box>
                <IconButton
                  aria-label="Remove location"
                  onClick={() => removeRow(index)}
                  size="small"
                  sx={{ mt: { sm: 0.25 } }}
                >
                  <Trash2 size={16} />
                </IconButton>
              </Stack>
            ))
          )}
          <Box>
            <Button
              label="Add location"
              startIcon={<Plus size={14} />}
              onClick={addRow}
            />
          </Box>
        </Stack>
      </FormField>
    </AdminFullPageFormFieldSpan>
  )
}

export function formatPassportIssueLocationsSummary(locations: PassportIssueLocation[]): string {
  if (!locations.length) return '—'
  return locations
    .map((loc) => `${loc.label || 'Untitled'} → ${loc.jurisdiction || '—'}`)
    .join('\n')
}
