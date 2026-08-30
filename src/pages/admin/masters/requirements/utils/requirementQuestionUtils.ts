import type { RequirementQuestion, RequirementQuestionOption } from '@/shared/types/requirementMaster'

export function createRequirementOption(label = ''): RequirementQuestionOption {
  return { id: `opt-${crypto.randomUUID()}`, label }
}

export function createEmptyRequirementQuestion(): RequirementQuestion {
  return {
    id: `q-${crypto.randomUUID()}`,
    prompt: '',
    type: 'multiple_choice',
    required: false,
    options: [createRequirementOption(), createRequirementOption(), createRequirementOption()],
  }
}

export function validateRequirementForm(data: {
  name: string
  questions: RequirementQuestion[]
}): string[] {
  const issues: string[] = []
  if (!data.name.trim()) issues.push('Name is required')
  if (data.questions.length === 0) {
    issues.push('Add at least one question')
    return issues
  }
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
