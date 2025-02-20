import { render, screen } from '@testing-library/react'
import { Card } from '../Card'
import { createMockCard } from '../../test/helpers'

describe('Card', () => {
  const mockCard = createMockCard()

  test('renders card name', () => {
    render(<Card {...mockCard} />)
    expect(screen.getByText(mockCard.name)).toBeInTheDocument()
  })
})import { render, screen } from '@testing-library/react'
import { Card } from '../Card'
import { createMockCard } from '../../test/helpers'

describe('Card', () => {
  const mockCard = createMockCard()

  test('renders card name', () => {
    render(<Card {...mockCard} />)
    expect(screen.getByText(mockCard.name)).toBeInTheDocument()
  })
})