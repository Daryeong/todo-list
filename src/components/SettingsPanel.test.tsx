import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { createDefaultSettings } from '../types/settings'
import { SettingsPanel } from './SettingsPanel'

describe('SettingsPanel', () => {
  it('does not persist NaN when a number field is cleared', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()

    render(<SettingsPanel settings={createDefaultSettings()} onClose={vi.fn()} onSave={onSave} />)

    const input = screen.getByLabelText('오늘 마감 기준')
    await user.clear(input)
    await user.click(screen.getByRole('button', { name: '설정 저장' }))

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        todayThresholdDays: 0,
      }),
    )
  })
})
