import { useParams } from 'react-router-dom'
import { RequirementFormPage } from './RequirementFormPage'

export function EditRequirementPage() {
  const { requirementId } = useParams<{ requirementId: string }>()
  return <RequirementFormPage mode="edit" requirementId={requirementId} />
}
