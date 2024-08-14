import {render} from '@testing-library/react'
// import Root from './root.component'
import TransactionsLogRootApp from './root.component'
import React from 'react'

describe('Root component', () => {
  it('should be in the document', () => {
    const {getByText} = render(<TransactionsLogRootApp name="Testapp" />)
    expect(getByText(/Testapp is mounted!/i)).toBeInTheDocument()
  })
})
