import type { RequirementMasterFormData } from '@/shared/types/requirementMaster'
import { createEmptyRequirementQuestion } from '../utils/requirementQuestionUtils'

export function emptyRequirementForm(): RequirementMasterFormData {
  return {
    name: '',
    description: '',
    status: 'active',
    questions: [createEmptyRequirementQuestion()],
    documents: [],
  }
}
