import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { createDefaultSettings } from '../types/settings'
import { SettingsPanel } from './SettingsPanel'

describe('SettingsPanel', () => {
  it('normalizes cleared numeric inputs before saving', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()

    render(<SettingsPanel settings={createDefaultSettings()} onClose={vi.fn()} onSave={onSave} />)

    const todayThreshold = screen.getByLabelText('오늘 기준 일수')
    await user.clear(todayThreshold)
    await user.click(screen.getByRole('button', { name: '설정 저장' }))

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        todayThresholdDays: 0,
      }),
    )
  })

  it('saves label and tone changes from the draft', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()

    render(<SettingsPanel settings={createDefaultSettings()} onClose={vi.fn()} onSave={onSave} />)

    const todayLabel = screen.getByLabelText('오늘 라벨')
    await user.clear(todayLabel)
    await user.type(todayLabel, 'Now')
    await user.clear(screen.getByLabelText('마감 라벨'))
    await user.type(screen.getByLabelText('마감 라벨'), '늦은 일')
    await user.selectOptions(screen.getByRole('combobox', { name: '코치 말투' }), 'strict')
    await user.click(screen.getByRole('button', { name: '설정 저장' }))

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        labels: expect.objectContaining({
          today: 'Now',
          late: '늦은 일',
        }),
        tone: 'strict',
      }),
    )
  })

  it('does not persist draft changes when closing without saving', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()
    const onClose = vi.fn()

    render(<SettingsPanel settings={createDefaultSettings()} onClose={onClose} onSave={onSave} />)

    const todayLabel = screen.getByLabelText('오늘 라벨')
    await user.clear(todayLabel)
    await user.type(todayLabel, 'Later')
    await user.click(screen.getByRole('button', { name: '닫기' }))

    expect(onClose).toHaveBeenCalledTimes(1)
    expect(onSave).not.toHaveBeenCalled()
  })
})
