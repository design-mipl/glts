import { useState } from 'react'
import { Box, Grid, Link, Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import {
  Button,
  Modal,
} from '@/design-system/UIComponents'
import {
  AdminFullPageFormFooter,
  AdminFullPageFormHeaderSave,
} from '@/pages/admin/components/AdminFullPageFormFooter'
import { AdminDrawerFormShell } from '@/pages/admin/components/AdminDrawerFormShell'
import { AdminFullPageFormShell } from '@/pages/admin/components/AdminFullPageFormShell'
import { AdminStepperFormFooter } from '@/pages/admin/components/AdminStepperFormFooter'
import { AdminStepperFormShell } from '@/pages/admin/components/AdminStepperFormShell'
import {
  ADMIN_DRAWER_FORM_GUIDANCE,
  ADMIN_DRAWER_FORM_LAYOUT,
  ADMIN_MODAL_FORM_GUIDANCE,
  ADMIN_MODAL_FORM_LAYOUT,
  ADMIN_STEPPER_FORM_GUIDANCE,
} from '@/pages/admin/components/adminOverlayFormLayout'
import {
  ADMIN_FULL_PAGE_FORM_LAYOUT,
  ADMIN_FULL_PAGE_FORM_SECTION_GUIDANCE,
  getAdminFullPageFormSectionCardSx,
  getAdminFullPageFormSectionTitleColor,
  type AdminFullPageFormSectionImportance,
} from '@/pages/admin/components/adminFullPageFormLayout'
import {
  EMPTY_TEMPLATE_DEMO_FORM,
  type TemplateDemoFormData,
} from '@/pages/admin/_tools/TemplateShowcase/config/demoEntity'
import { TemplateDemoFormFields } from '@/pages/admin/_tools/TemplateShowcase/components/TemplateDemoFormFields'
import { buildTemplateStepperDemoSteps } from '@/pages/admin/_tools/TemplateShowcase/config/stepperDemoSteps'

function SectionSwatch({ importance }: { importance: AdminFullPageFormSectionImportance }) {
  const theme = useTheme()
  const guidance = ADMIN_FULL_PAGE_FORM_SECTION_GUIDANCE[importance]
  const cardSx = getAdminFullPageFormSectionCardSx(importance, theme)

  return (
    <Box
      sx={{
        borderRadius: ADMIN_FULL_PAGE_FORM_LAYOUT.sectionBorderRadius,
        p: ADMIN_FULL_PAGE_FORM_LAYOUT.sectionPadding,
        ...cardSx,
      }}
    >
      <Typography
        variant="subtitle2"
        fontWeight={600}
        color={getAdminFullPageFormSectionTitleColor(importance)}
        sx={{ mb: 1 }}
      >
        {guidance.label} section
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12 }}>
        {guidance.useFor}
      </Typography>
    </Box>
  )
}

function PatternRules({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        p: 2,
        bgcolor: 'background.paper',
      }}
    >
      <Stack component="ul" sx={{ m: 0, pl: 2.5, gap: 0.75 }}>
        {children}
      </Stack>
    </Box>
  )
}

function Rule({ children }: { children: React.ReactNode }) {
  return (
    <Typography component="li" variant="body2" sx={{ fontSize: 13 }}>
      {children}
    </Typography>
  )
}

function PatternHeader({
  title,
  description,
  templateHref,
}: {
  title: string
  description: React.ReactNode
  templateHref: string
}) {
  return (
    <Box>
      <Typography variant="h3" sx={{ mb: 0.5, fontSize: '15px', fontWeight: 700 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '13px', maxWidth: 800 }}>
        {description}{' '}
        <Link href={templateHref} underline="hover">
          Live template
        </Link>
      </Typography>
    </Box>
  )
}

export function AdminFormPatternsGuide() {
  const [formData, setFormData] = useState<TemplateDemoFormData>(EMPTY_TEMPLATE_DEMO_FORM)
  const [modalOpen, setModalOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [stepperStep, setStepperStep] = useState(0)
  const stepperSteps = buildTemplateStepperDemoSteps(formData, setFormData)

  return (
    <Stack spacing={5}>
      <Box>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13, maxWidth: 800 }}>
          All admin forms use <strong>FormField</strong> + <strong>Input</strong> / <strong>Select</strong> /{' '}
          <strong>Textarea</strong> (default <code>size="sm"</code>, 34px). Choose the shell by complexity.
        </Typography>
      </Box>

      {/* ── Full page ── */}
      <Stack spacing={3}>
        <PatternHeader
          title="Full-page form"
          description={
            <>
              <strong>AdminFullPageFormShell</strong> — breadcrumb + back, page card, 2-col section grid, sticky footer.
            </>
          }
          templateHref="/admin/tools/templates/forms/page"
        />
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <SectionSwatch importance="primary" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <SectionSwatch importance="secondary" />
          </Grid>
        </Grid>
        <PatternRules>
          <Rule>
            <strong>Navigation:</strong> parent breadcrumb must include <code>href</code> (enables back control).
          </Rule>
          <Rule>
            <strong>Section cards:</strong> primary + secondary surfaces (see swatches above).
          </Rule>
          <Rule>
            <strong>Footer:</strong> <code>AdminFullPageFormFooter</code> (Cancel neutral · draft · Save).
          </Rule>
        </PatternRules>
        <AdminFullPageFormShell
          breadcrumbs={[
            { label: 'Templates', href: '/admin/tools/templates' },
            { label: 'Full-page' },
          ]}
          title="Form — Full page"
          headerActions={<AdminFullPageFormHeaderSave />}
          footer={<AdminFullPageFormFooter onCancel={() => {}} onDraft={() => {}} onSave={() => {}} />}
          sections={[
            {
              id: 'primary',
              title: 'Record details',
              importance: 'primary',
              columns: 2,
              children: <TemplateDemoFormFields data={formData} onChange={setFormData} bare />,
            },
            {
              id: 'secondary',
              title: 'Additional details',
              importance: 'secondary',
              columns: 1,
              children: (
                <TemplateDemoFormFields data={formData} onChange={setFormData} variant="secondary" bare />
              ),
            },
          ]}
        />
      </Stack>

      {/* ── Modal ── */}
      <Stack spacing={3}>
        <PatternHeader
          title="Modal form"
          description={
            <>
              <strong>{ADMIN_MODAL_FORM_GUIDANCE.shell}</strong> — {ADMIN_MODAL_FORM_GUIDANCE.whenToUse}
            </>
          }
          templateHref="/admin/tools/templates/forms/modal"
        />
        <PatternRules>
          <Rule>
            <strong>Layout:</strong> {ADMIN_MODAL_FORM_GUIDANCE.fieldPattern}. Size{' '}
            <code>{ADMIN_MODAL_FORM_LAYOUT.recommendedSize}</code> (~{ADMIN_MODAL_FORM_LAYOUT.maxWidthPx}px).
          </Rule>
          <Rule>
            <strong>Section cards:</strong> do not use primary/secondary tinted cards inside modals.
          </Rule>
          <Rule>
            <strong>Footer:</strong> {ADMIN_MODAL_FORM_GUIDANCE.footer}.
          </Rule>
        </PatternRules>
        <Button variant="outlined" color="secondary" onClick={() => setModalOpen(true)}>
          Preview modal form
        </Button>
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Create record"
          subtitle="Modal pattern preview"
          size={ADMIN_MODAL_FORM_LAYOUT.recommendedSize}
          footer={
            <AdminFullPageFormFooter
              onCancel={() => setModalOpen(false)}
              onSave={() => setModalOpen(false)}
            />
          }
        >
          <TemplateDemoFormFields data={formData} onChange={setFormData} variant="modal" />
        </Modal>
      </Stack>

      {/* ── Drawer ── */}
      <Stack spacing={3}>
        <PatternHeader
          title="Drawer form"
          description={
            <>
              <strong>{ADMIN_DRAWER_FORM_GUIDANCE.shell}</strong> — {ADMIN_DRAWER_FORM_GUIDANCE.whenToUse}
            </>
          }
          templateHref="/admin/tools/templates/forms/drawer"
        />
        <PatternRules>
          <Rule>
            <strong>Layout:</strong> {ADMIN_DRAWER_FORM_GUIDANCE.fieldPattern}.
          </Rule>
          <Rule>
            <strong>Section cards:</strong> primary + secondary stacked ({ADMIN_DRAWER_FORM_LAYOUT.recommendedWidth}px
            width).
          </Rule>
          <Rule>
            <strong>Footer:</strong> {ADMIN_DRAWER_FORM_GUIDANCE.footer}.
          </Rule>
        </PatternRules>
        <Button variant="outlined" color="secondary" onClick={() => setDrawerOpen(true)}>
          Preview drawer form
        </Button>
        <AdminDrawerFormShell
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          title="Edit record"
          subtitle="Same sections as full-page form, stacked vertically"
          footer={
            <AdminFullPageFormFooter
              onCancel={() => setDrawerOpen(false)}
              onSave={() => setDrawerOpen(false)}
            />
          }
          sections={[
            {
              id: 'primary',
              title: 'Record details',
              columns: ADMIN_DRAWER_FORM_LAYOUT.primarySectionColumns,
              children: <TemplateDemoFormFields data={formData} onChange={setFormData} bare />,
            },
            {
              id: 'secondary',
              title: 'Additional details',
              importance: 'secondary',
              columns: ADMIN_DRAWER_FORM_LAYOUT.secondarySectionColumns,
              children: (
                <TemplateDemoFormFields data={formData} onChange={setFormData} variant="secondary" bare />
              ),
            },
          ]}
        />
      </Stack>

      {/* ── Stepper ── */}
      <Stack spacing={3}>
        <PatternHeader
          title="Stepper form"
          description={
            <>
              <strong>{ADMIN_STEPPER_FORM_GUIDANCE.shell}</strong> — {ADMIN_STEPPER_FORM_GUIDANCE.whenToUse}
            </>
          }
          templateHref="/admin/tools/templates/forms/stepper"
        />
        <PatternRules>
          <Rule>
            <strong>Layout:</strong> {ADMIN_STEPPER_FORM_GUIDANCE.fieldPattern}.
          </Rule>
          <Rule>
            <strong>Details step:</strong> both primary + secondary section cards (same as full-page form).
          </Rule>
          <Rule>
            <strong>Review step:</strong> neutral summary panel, not editable fields.
          </Rule>
          <Rule>
            <strong>Footer:</strong> {ADMIN_STEPPER_FORM_GUIDANCE.footer}.
          </Rule>
        </PatternRules>
        <AdminStepperFormShell
          breadcrumbs={[
            { label: 'Templates', href: '/admin/tools/templates' },
            { label: 'Stepper' },
          ]}
          steps={stepperSteps}
          activeStep={stepperStep}
          onActiveStepChange={setStepperStep}
          footer={
            <AdminStepperFormFooter
              activeStep={stepperStep}
              isLastStep={stepperStep >= stepperSteps.length - 1}
              onCancel={() => setStepperStep(0)}
              onBack={() => setStepperStep((s) => Math.max(0, s - 1))}
              onNext={() => setStepperStep((s) => s + 1)}
              onSubmit={() => setStepperStep(0)}
            />
          }
        />
      </Stack>
    </Stack>
  )
}

/** @deprecated Use AdminFormPatternsGuide */
export { AdminFormPatternsGuide as AdminFormLayoutGuide }
