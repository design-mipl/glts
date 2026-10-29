import type { RequirementMasterFormData } from '@/shared/types/requirementMaster'

export function emptyRequirementForm(): RequirementMasterFormData {
  return {
    name: '',
    description: '',
    status: 'active',
    questions: [],
  }
}
