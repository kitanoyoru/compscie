import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'

import { App } from './App'

it('renders the Compscie learning workspace', () => {
  render(<App />)

  expect(screen.getByRole('banner', { name: /compscie/i })).toBeInTheDocument()
})
