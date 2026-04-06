import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'

import App from './App'

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows todays date and allows adding a task', async () => {
    const user = userEvent.setup()
    render(<App today="2026-04-06" />)

    expect(screen.getByText(/4월/)).toBeInTheDocument()

    await user.type(screen.getByPlaceholderText('할 일 추가...'), '발표 자료 만들기')
    await user.click(screen.getByRole('button', { name: '추가' }))

    expect(screen.getByText('발표 자료 만들기')).toBeInTheDocument()
  })

  it('shows all active tasks in a single task list', async () => {
    const user = userEvent.setup()
    render(<App today="2026-04-06" />)

    const input = screen.getByPlaceholderText('할 일 추가...')
    const addBtn = screen.getByRole('button', { name: '추가' })

    const addTask = async (title: string) => {
      await user.clear(input)
      await user.type(input, title)
      await user.click(addBtn)
    }

    await addTask('늦은 일')
    await addTask('오늘 일')
    await addTask('중요한 일')

    expect(screen.getByText('늦은 일')).toBeInTheDocument()
    expect(screen.getByText('오늘 일')).toBeInTheDocument()
    expect(screen.getByText('중요한 일')).toBeInTheDocument()
  })

  it('edits task details and marks a task complete', async () => {
    const user = userEvent.setup()
    render(<App today="2026-04-06" />)

    await user.type(screen.getByPlaceholderText('할 일 추가...'), '상세 작업')
    await user.click(screen.getByRole('button', { name: '추가' }))

    await user.click(screen.getByRole('button', { name: '상세 작업' }))
    await user.clear(screen.getByLabelText('메모'))
    await user.type(screen.getByLabelText('메모'), '세부 메모')
    await user.click(screen.getByRole('button', { name: '단계 템플릿 추천' }))
    await user.click(screen.getByRole('button', { name: '저장' }))

    expect(screen.getByText('세부 메모')).toBeInTheDocument()

    await user.click(screen.getByRole('checkbox', { name: '상세 작업 완료' }))
    expect(screen.getByText('오늘 완료한 일')).toBeInTheDocument()
    expect(screen.getByText('상세 작업')).toBeInTheDocument()
  })

  it('updates settings tone', async () => {
    const user = userEvent.setup()
    render(<App today="2026-04-06" />)

    await user.click(screen.getByRole('button', { name: '설정 열기' }))
    await user.selectOptions(screen.getByLabelText('문구 톤'), 'plain')
    await user.click(screen.getByRole('button', { name: '설정 저장' }))

    expect(screen.getByText('차분하게 하나씩 해나가면 돼요.')).toBeInTheDocument()
  })

  it('shows visible UI copy in Korean', async () => {
    const user = userEvent.setup()
    render(<App today="2026-04-06" />)

    expect(screen.getByText('오늘 집중')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '설정 열기' }))
    expect(screen.getByRole('option', { name: '응원형' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: '담백형' })).toBeInTheDocument()
  })

  it('shows today-completed wording and updates achievement after completing a task', async () => {
    const user = userEvent.setup()
    render(<App today="2026-04-06" />)

    await user.type(screen.getByPlaceholderText('할 일 추가...'), '오늘 마무리')
    await user.click(screen.getByRole('button', { name: '추가' }))

    await user.click(screen.getByRole('checkbox', { name: '오늘 마무리 완료' }))

    expect(screen.getByText('오늘 완료한 일')).toBeInTheDocument()
    expect(screen.getByText('오늘 마무리')).toBeInTheDocument()
    expect(screen.getByText('오늘 1개 완료')).toBeInTheDocument()
  })
})
