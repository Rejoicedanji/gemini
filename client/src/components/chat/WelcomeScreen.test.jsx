import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test, vi } from 'vitest'
import WelcomeScreen from './WelcomeScreen'

describe('WelcomeScreen', () => {
  test('calls the prompt callback with the selected prompt', async () => {
    const onPromptSelect = vi.fn()

    render(<WelcomeScreen onPromptSelect={onPromptSelect} />)

    await userEvent.click(screen.getByRole('button', { name: /Explain a concept/i }))

    expect(onPromptSelect).toHaveBeenCalledWith('Explain how neural networks work in simple terms')
  })
})
