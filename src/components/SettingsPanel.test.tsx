import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { createDefaultSettings } from '../types/settings'
import { SettingsPanel } from './SettingsPanel'

describe('SettingsPanel', () => {
  it('lets you edit the today label', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()

    render(<SettingsPanel settings={createDefaultSettings()} onClose={vi.fn()} onSave={onSave} />)

    const todayLabel = screen.getByLabelText('오늘 라벨')
    await user.clear(todayLabel)
    await user.type(todayLabel, '오늘')
    await user.click(screen.getByRole('button', { name: '설정 저장' }))

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        todayLabel: '오늘',
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

  it('keeps tone control available', () => {
    render(<SettingsPanel settings={createDefaultSettings()} onClose={vi.fn()} onSave={vi.fn()} />)

    expect(screen.getByRole('combobox', { name: '리스트 말투' })).toBeInTheDocument()
  })
})
