import type {
  RequirementQuestion,
  RequirementQuestionOption,
} from '@/shared/types/requirementMaster'

export function createRequirementOption(label = ''): RequirementQuestionOption {
  return { id: `opt-${crypto.randomUUID()}`, label, documentIds: [] }
}

export function createEmptyRequirementQuestion(): RequirementQuestion {
  return {
    id: `q-${crypto.randomUUID()}`,
    prompt: '',
    required: false,
    options: [createRequirementOption(), createRequirementOption()],
  }
}

export function formatDocumentCount(count: number): string {
  return count === 1 ? '1 document' : `${count} documents`
}

export function validateRequirementForm(data: {
  name: string
  questions: RequirementQuestion[]
}): string[] {
  const issues: string[] = []
  if (!data.name.trim()) issues.push('Name is required')

  data.questions.forEach((question, index) => {
    const n = index + 1
    if (!question.prompt.trim()) issues.push(`Question ${n}: enter a question`)
    if (question.options.length < 2) issues.push(`Question ${n}: add at least two options`)
    question.options.forEach((option, optionIndex) => {
      if (!option.label.trim()) {
        issues.push(`Question ${n}: enter a label for option ${optionIndex + 1}`)
      }
    })
  })

  return [...new Set(issues)]
}

export function moveItem<T>(items: T[], fromIndex: number, direction: 'up' | 'down'): T[] {
  const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1
  if (toIndex < 0 || toIndex >= items.length) return items
  const next = [...items]
  ;[next[fromIndex], next[toIndex]] = [next[toIndex], next[fromIndex]]
  return next
}
