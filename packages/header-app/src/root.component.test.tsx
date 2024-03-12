import { render, fireEvent } from '@testing-library/react'
import ButtonAppBar from './root.component'
import { OpenHIMMenu } from '@jembi/openhim-sidebar'
import React from 'react'

jest.mock('@jembi/openhim-sidebar', () => ({
  OpenHIMMenu: jest.fn(() => null)
}))

describe('ButtonAppBar component', () => {
  it('should render without errors', () => {
    const { getByLabelText } = render(<ButtonAppBar />)
    expect(getByLabelText('open drawer')).toBeInTheDocument()
    expect(getByLabelText('account of current user')).toBeInTheDocument()
  })

  it('should open the menu on button click', () => {
    const { getByLabelText, getByRole } = render(<ButtonAppBar />)
    const menuButton = getByLabelText('account of current user')
    fireEvent.click(menuButton)
    const menu = getByRole('menu')
    expect(menu).toBeInTheDocument()
  })
})