import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { TaskComposer } from './TaskComposer'

describe('TaskComposer', () => {
  it('opens a custom calendar and applies the selected date', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(<TaskComposer defaultDate="2026-04-06" onSubmit={onSubmit} />)

    await user.click(screen.getByPlaceholderText('할 일 추가...'))
    await user.click(screen.getByRole('button', { name: '날짜 선택' }))

    const calendar = screen.getByRole('dialog', { name: '날짜 선택 달력' })
    await user.click(within(calendar).getByRole('button', { name: '4월 18일' }))

    expect(screen.getByRole('button', { name: '4. 18.' })).toBeInTheDocument()
  })

  it('moves to another month in the custom calendar', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(<TaskComposer defaultDate="2026-04-06" onSubmit={onSubmit} />)

    await user.click(screen.getByPlaceholderText('할 일 추가...'))
    await user.click(screen.getByRole('button', { name: '날짜 선택' }))
    await user.click(screen.getByRole('button', { name: '다음 달' }))

    expect(screen.getByRole('button', { name: '2026년 선택' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '5월 선택' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '5월 10일' }))

    expect(screen.getByRole('button', { name: '5. 10.' })).toBeInTheDocument()
  })

  it('opens a year picker when the year is clicked', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(<TaskComposer defaultDate="2026-04-06" onSubmit={onSubmit} />)

    await user.click(screen.getByPlaceholderText('할 일 추가...'))
    await user.click(screen.getByRole('button', { name: '날짜 선택' }))
    await user.click(screen.getByRole('button', { name: '2026년 선택' }))

    expect(screen.getByRole('dialog', { name: '연도 선택' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '2029년' }))

    expect(screen.getByRole('button', { name: '2029년 선택' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '4월 선택' })).toBeInTheDocument()
  })

  it('opens a month picker when the month is clicked', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(<TaskComposer defaultDate="2026-04-06" onSubmit={onSubmit} />)

    await user.click(screen.getByPlaceholderText('할 일 추가...'))
    await user.click(screen.getByRole('button', { name: '날짜 선택' }))
    await user.click(screen.getByRole('button', { name: '4월 선택' }))

    expect(screen.getByRole('dialog', { name: '월 선택' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '11월' }))

    expect(screen.getByRole('button', { name: '2026년 선택' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '11월 선택' })).toBeInTheDocument()
  })
})
