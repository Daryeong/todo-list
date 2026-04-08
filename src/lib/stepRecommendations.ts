import type { Importance } from '../types/task'

export interface StepRecommendationInput {
  title: string
  memo?: string
  importance?: Importance
}

export interface StepRecommendationOptions {
  endpoint?: string
  fetchImpl?: typeof fetch
}

const normalizeSteps = (value: unknown) => {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((step) => (typeof step === 'string' ? step.trim() : ''))
    .filter((step) => step.length > 0)
}

const hasKeyword = (text: string, keywords: string[]) => keywords.some((keyword) => text.includes(keyword))

export const getSuggestedSteps = (title: string, memo = '') => {
  const text = `${title} ${memo}`.trim()

  if (hasKeyword(text, ['운동', '헬스', '스트레칭', '러닝'])) {
    return ['준비 운동', '운동하기', '정리 운동']
  }

  if (hasKeyword(text, ['그림', '드로잉', '스케치', '디자인'])) {
    return ['자료 모으기', '초안 그리기', '세부 수정']
  }

  if (hasKeyword(text, ['공부', '학습', '리서치', '읽기'])) {
    return ['자료 정리', '핵심 정리', '복습하기']
  }

  return ['작업 나누기', '첫 단계 시작하기', '마무리 점검']
}

const extractRemoteSteps = (payload: unknown) => {
  if (!payload || typeof payload !== 'object') {
    return []
  }

  const data = payload as {
    steps?: unknown
    suggestions?: unknown
    output_text?: unknown
    output?: unknown
  }

  const directSteps = normalizeSteps(data.steps ?? data.suggestions)
  if (directSteps.length > 0) {
    return directSteps
  }

  if (typeof data.output_text === 'string') {
    try {
      return normalizeSteps(JSON.parse(data.output_text))
    } catch {
      return data.output_text
        .split('\n')
        .map((step) => step.replace(/^\s*[-*•\d.]+\s*/, '').trim())
        .filter(Boolean)
    }
  }

  if (Array.isArray(data.output)) {
    const extracted = data.output
      .flatMap((item) => {
        if (!item || typeof item !== 'object') {
          return []
        }

        const typed = item as { content?: unknown; text?: unknown; output_text?: unknown }
        if (typeof typed.text === 'string') {
          return [typed.text]
        }
        if (typeof typed.output_text === 'string') {
          return [typed.output_text]
        }
        if (Array.isArray(typed.content)) {
          return typed.content.flatMap((contentItem) => {
            if (!contentItem || typeof contentItem !== 'object') {
              return []
            }
            const content = contentItem as { text?: unknown; output_text?: unknown; value?: unknown }
            if (typeof content.text === 'string') {
              return [content.text]
            }
            if (typeof content.output_text === 'string') {
              return [content.output_text]
            }
            if (typeof content.value === 'string') {
              return [content.value]
            }
            return []
          })
        }
        return []
      })
      .join('\n')

    if (extracted) {
      try {
        return normalizeSteps(JSON.parse(extracted))
      } catch {
        return extracted
          .split('\n')
          .map((step) => step.replace(/^\s*[-*•\d.]+\s*/, '').trim())
          .filter(Boolean)
      }
    }
  }

  return []
}

export async function requestTaskStepTemplates(
  input: StepRecommendationInput,
  options: StepRecommendationOptions = {},
) {
  const fetchImpl = options.fetchImpl ?? fetch
  const endpoint = options.endpoint?.trim() || import.meta.env.VITE_STEP_TEMPLATE_API_URL?.trim() || '/api/step-templates'

  try {
    const response = await fetchImpl(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    })

    if (!response.ok) {
      throw new Error(`Step template request failed: ${response.status}`)
    }

    const payload = (await response.json()) as unknown
    const remoteSteps = extractRemoteSteps(payload)
    return remoteSteps.length > 0 ? remoteSteps : getSuggestedSteps(input.title, input.memo ?? '')
  } catch {
    return getSuggestedSteps(input.title, input.memo ?? '')
  }
}
