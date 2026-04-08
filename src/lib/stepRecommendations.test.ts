import { describe, expect, it, vi } from 'vitest'

import { getSuggestedSteps, requestTaskStepTemplates } from './stepRecommendations'

describe('stepRecommendations', () => {
  it('uses the API response when request succeeds', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ steps: ['정리하기', '실행하기'] }),
    })

    const steps = await requestTaskStepTemplates(
      { title: '그림', memo: '', importance: 'medium' },
      { endpoint: '/api/step-templates', fetchImpl: fetchMock },
    )

    expect(steps).toEqual(['정리하기', '실행하기'])
  })

  it('falls back to local suggestions when the API fails', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('network error'))

    const steps = await requestTaskStepTemplates(
      { title: '운동', memo: '', importance: 'medium' },
      { endpoint: '/api/step-templates', fetchImpl: fetchMock },
    )

    expect(steps).toEqual(getSuggestedSteps('운동', ''))
  })
})
