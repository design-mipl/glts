import { Box, Divider, Grid, Stack, Typography } from '@mui/material'
import { Pencil } from 'lucide-react'
import { useMemo, useState } from 'react'
import {
  BackButton,
  Badge,
  BaseCard,
  Button,
  Breadcrumb,
  Tabs,
} from '@/design-system/UIComponents'
import { getTemplateRecipeById } from '../config/templateRegistry'
import { TEMPLATE_DEMO_DETAIL } from '../config/demoEntity'
import { TemplateShowcaseBanner } from '../components/TemplateShowcaseBanner'

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" display="block">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600}>
        {value}
      </Typography>
    </Box>
  )
}

export function DetailTemplatePage() {
  const recipe = getTemplateRecipeById('detail')!
  const record = TEMPLATE_DEMO_DETAIL
  const [activeTab, setActiveTab] = useState('company')

  const tabs = useMemo(
    () => [
      { value: 'company', label: 'Company profile' },
      { value: 'billing', label: 'Billing & agreement' },
      { value: 'personal', label: 'Personal profile' },
    ],
    [],
  )

  return (
    <Box>
      <TemplateShowcaseBanner components={recipe.components} />
      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 1.5 }}>
        <BackButton label="Back" href="/admin/tools/templates" sx={{ mr: 0 }} />
        <Breadcrumb
          items={[
            { label: 'Templates', href: '/admin/tools/templates' },
            { label: 'Detail module' },
          ]}
        />
      </Stack>

      <BaseCard sx={{ mb: 2 }}>
        <Box sx={{ p: 2.5 }}>
          <Stack spacing={2}>
            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {record.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Enterprise · Mumbai · Updated {record.updatedAt}
                </Typography>
              </Box>
              <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', alignSelf: { xs: 'stretch', md: 'flex-start' } }}>
                <Button label="Edit details" variant="contained" startIcon={<Pencil size={14} />} />
              </Stack>
            </Stack>
            <Stack direction="row" spacing={0.75} flexWrap="wrap">
              <Badge label="Active" color="success" />
              <Badge label="Agreement active" color="info" />
            </Stack>
          </Stack>
        </Box>
      </BaseCard>

      <BaseCard>
        <Box sx={{ px: 2.5, pt: 1.5, borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={setActiveTab} variant="underline" size="sm" items={tabs} />
        </Box>

        <Box sx={{ p: 2.5 }}>
          {activeTab === 'company' && (
            <>
              <Typography variant="overline" color="text.secondary">
                Billing information
              </Typography>
              <Grid container spacing={2} sx={{ mt: 0.5 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <ReadOnlyField label="Billing entity name" value="GLTS Corporate Travel Pvt. Ltd." />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <ReadOnlyField label="Billing email" value="billing@glts.com" />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <ReadOnlyField label="Billing contact number" value="+91 22 4000 1200" />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <ReadOnlyField label="PAN number" value="AABCU9603R" />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <ReadOnlyField label="Billing address" value="Level 12, One BKC, Mumbai 400051" />
                </Grid>
              </Grid>
              <Divider sx={{ my: 2.5 }} />
              <Typography variant="overline" color="text.secondary">
                Supported operations
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.75 }}>
                Countries: Kenya, UAE, Schengen, Japan, Singapore
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Visa types: Tourist, Business, Crew/Marine, Transit
              </Typography>
            </>
          )}

          {activeTab === 'billing' && (
            <Stack spacing={1.5}>
              <Typography variant="overline" color="text.secondary">
                Agreement summary
              </Typography>
              <ReadOnlyField label="Agreement type" value="Corporate credit agreement" />
              <ReadOnlyField label="Credit terms" value="Net 30 days · INR 25,00,000 limit" />
              <ReadOnlyField label="SLA summary" value="Priority handling for business and marine lanes" />
              <ReadOnlyField label="Tax profile" value="GST applicable · TDS applicable" />
            </Stack>
          )}

          {activeTab === 'personal' && (
            <Stack spacing={1.5}>
              <Typography variant="overline" color="text.secondary">
                Personal profile
              </Typography>
              <ReadOnlyField label="Primary contact" value={record.assignee} />
              <ReadOnlyField label="Role" value="Operations manager" />
              <ReadOnlyField label="Last login" value="Today, 09:10 AM" />
              <ReadOnlyField label="Active sessions" value="2 active devices" />
            </Stack>
          )}

          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
              Activity (slot)
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Timeline, notes, and audit events are passed as optional slots on the detail recipe.
            </Typography>
          </Box>
        </Box>
      </BaseCard>
    </Box>
  )
}
