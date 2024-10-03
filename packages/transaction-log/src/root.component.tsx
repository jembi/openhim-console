import {ThemeProvider} from '@emotion/react'
import theme from '@jembi/openhim-theme'
import React from 'react'
import App from './components/common/app.main.component'
import {AlertProvider} from './contexts/alert.context'
import {BasicBackdropProvider} from './contexts/backdrop.context'
import {ConfirmationProvider} from './contexts/confirmation.context'
import {BasicDialogProvider} from './contexts/dialog.context'
import {TransactionRerunProvider} from './contexts/rerun.transasctions.confirmation.context'

export default function TransactionsLogRootApp() {
  return (
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <TransactionRerunProvider>
          <BasicDialogProvider>
            <BasicBackdropProvider>
              <AlertProvider>
                <ConfirmationProvider>
                  <App />
                </ConfirmationProvider>
              </AlertProvider>
            </BasicBackdropProvider>
          </BasicDialogProvider>
        </TransactionRerunProvider>
      </ThemeProvider>
    </React.StrictMode>
  )
}
