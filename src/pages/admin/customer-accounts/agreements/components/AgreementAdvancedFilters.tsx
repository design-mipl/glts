import { Box } from '@mui/material'
import { Button, Input, Select } from '@/design-system/UIComponents'
import { companyMasterService } from '@/shared/services/companyMasterService'
import type { AgreementAdvancedFilterState } from '../utils/agreementListingUtils'
import { AGREEMENT_WORKFLOW_OPTIONS } from '../config/agreementStatusConfig'

interface AgreementAdvancedFiltersProps {
  filters: AgreementAdvancedFilterState
  onFiltersChange: (filters: AgreementAdvancedFilterState) => void
  onClearFilters: () => void
  hasActiveFilters: boolean
}

export function AgreementAdvancedFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  hasActiveFilters,
}: AgreementAdvancedFiltersProps) {
  const patch = (partial: Partial<AgreementAdvancedFilterState>) =>
    onFiltersChange({ ...filters, ...partial })

  const companyOptions = companyMasterService.getSelectOptions()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)',
          },
          gap: 1.5,
        }}
      >
        <Select
          value={filters.agreementType}
          onChange={(v) => patch({ agreementType: String(v) })}
          options={[
            { value: 'all', label: 'All agreement types' },
            { value: 'agreemented', label: 'Agreemented' },
            { value: 'non_agreemented', label: 'Non-agreemented' },
          ]}
          placeholder="Agreement type"
          size="sm"
          fullWidth
        />
        <Select
          value={filters.billingType}
          onChange={(v) => patch({ billingType: String(v) })}
          options={[
            { value: 'all', label: 'All billing types' },
            { value: 'advance', label: 'Advance' },
            { value: 'credit', label: 'Credit' },
            { value: 'mixed', label: 'Mixed' },
          ]}
          placeholder="Billing type"
          size="sm"
          fullWidth
        />
        <Select
          value={filters.workflowType}
          onChange={(v) => patch({ workflowType: String(v) })}
          options={[
            { value: 'all', label: 'All workflow types' },
            ...AGREEMENT_WORKFLOW_OPTIONS,
          ]}
          placeholder="Workflow type"
          size="sm"
          fullWidth
        />
        <Select
          value={filters.status}
          onChange={(v) => patch({ status: String(v) })}
          options={[
            { value: 'all', label: 'All statuses' },
            { value: 'draft', label: 'Draft' },
            { value: 'submitted', label: 'Pending Approval' },
            { value: 'approved', label: 'Approved' },
            { value: 'rejected', label: 'Rejected' },
            { value: 'expired', label: 'Expired' },
            { value: 'inactive', label: 'Inactive' },
          ]}
          placeholder="Status"
          size="sm"
          fullWidth
        />
        <Select
          value={filters.companyId}
          onChange={(v) => patch({ companyId: String(v) })}
          options={[
            { value: 'all', label: 'All companies' },
            ...companyOptions.map((c) => ({ value: c.value, label: c.label })),
          ]}
          placeholder="Company"
          size="sm"
          fullWidth
        />
        <Input
          value={filters.entityName}
          onChange={(v) => patch({ entityName: v })}
          placeholder="Entity name"
          size="sm"
          fullWidth
        />
        <Input
          type="date"
          value={filters.dateFrom}
          onChange={(v) => patch({ dateFrom: v })}
          placeholder="Updated from"
          size="sm"
          fullWidth
        />
        <Input
          type="date"
          value={filters.dateTo}
          onChange={(v) => patch({ dateTo: v })}
          placeholder="Updated to"
          size="sm"
          fullWidth
        />
      </Box>
      {hasActiveFilters ? (
        <Box>
          <Button label="Clear filters" variant="outlined" color="secondary" size="sm" onClick={onClearFilters} />
        </Box>
      ) : null}
    </Box>
  )
}
