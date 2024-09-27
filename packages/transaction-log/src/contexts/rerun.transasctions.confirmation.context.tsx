import React, {createContext, useContext, useState, ReactNode} from 'react'
import {
  ReRunTransactionsConfirmationDialog,
  TransactionRerunProps
} from '../components/dialogs/reruntransactions.confirmation.dialog'

type _TransactionRerunProps = Omit<TransactionRerunProps, 'close' | 'open'>

interface TransactionRerunContextProps {
  showReRunDialog: (props: _TransactionRerunProps) => void
  closeReRunDialog: () => void
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
    batchSize: '',
    paused: false,
    onConfirmReRun: () => {},
    open: false,
    onClose: () => {}
  })

  const showReRunDialog = (props: _TransactionRerunProps) =>
    setData({...props, open: true})
  const closeReRunDialog = () => setData({...data, open: false})

  const confirmRerun = () => {
    console.log('Rerun confirmed')
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
        batchSize={data.batchSize}
        paused={data.paused}
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
