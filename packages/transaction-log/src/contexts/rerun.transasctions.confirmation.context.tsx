import React, {createContext, useContext, useState, ReactNode} from 'react'
import {
  ReRunTransactionsConfirmationDialog,
  TransactionRerunProps,
  TransactionRerunEvent
} from '../components/dialogs/reruntransactions.confirmation.dialog'

type _TransactionRerunProps = Omit<
  TransactionRerunProps,
  'close' | 'open' | 'onClose'
> & {
  onConfirmReRun: (event: TransactionRerunEvent) => unknown
}

interface TransactionRerunContextProps {
  showReRunDialog: (props: _TransactionRerunProps) => unknown
  closeReRunDialog: () => unknown
}

const TransactionRerunConfirmationDialogContext = createContext<
  TransactionRerunContextProps | undefined
>(undefined)

export const TransactionRerunProvider: React.FC<{children: ReactNode}> = ({
  children
}) => {
  const [data, setData] = useState<TransactionRerunProps>({
    selectedTransactions: [],
    transactions: [],
    onConfirmReRun: (event: TransactionRerunEvent) => {},
    open: false,
    onClose: () => {}
  })

  const showReRunDialog = (props: _TransactionRerunProps) =>
    setData({...props, open: true})
  const closeReRunDialog = () => {
    setData({...data, open: false})
  }

  const confirmRerun = (event: TransactionRerunEvent) => {
    // would've been set when showReRunDialog() gets
    data.onConfirmReRun(event)
    closeReRunDialog()
  }

  return (
    <TransactionRerunConfirmationDialogContext.Provider
      value={{showReRunDialog, closeReRunDialog}}
    >
      {children}
      <ReRunTransactionsConfirmationDialog
        open={data.open}
        selectedTransactions={data.selectedTransactions}
        transactions={data.transactions}
        onConfirmReRun={confirmRerun}
        onClose={closeReRunDialog}
      />
    </TransactionRerunConfirmationDialogContext.Provider>
  )
}

export const useTransactionRerunConfirmationDialog = () => {
  const context = useContext(TransactionRerunConfirmationDialogContext)
  if (!context) {
    throw new Error(
      'useTransactionRerun must be used within a TransactionRerunProvider'
    )
  }
  return context
}
