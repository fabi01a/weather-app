import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import InputButton from './InputButton'

describe('InputButton', () => {
  it('renders a search button', () => {
    render(<InputButton onClick={() => {}} />)
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument()
  })

  it('calls onClick when the button is pressed', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<InputButton onClick={onClick} />)

    await user.click(screen.getByRole('button', { name: /search/i }))

    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
