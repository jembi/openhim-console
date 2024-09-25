import {Channel, Client} from '../types'

export interface BasicFilterProps {
  status: string
  setStatus: (value: string) => void
  searchQuery: string
  setSearchQuery: (value: string) => void
  channel: string
  setChannel: (value: string) => void
  startDate: Date | null
  setStartDate: (value: Date | null) => void
  endDate: Date | null
  setEndDate: (value: Date | null) => void
  limit: number
  setLimit: (value: number) => void
  reruns: string
  setReruns: (value: string) => void
  channels: Channel[],
  fetchTransactionLogs: (timestampFilter?: string, filteredResults?: boolean) => Promise<void>
}

export interface CustomFilterProps {
  status: string
  setStatus: (value: string) => void
  statusCode: number | null
  setStatusCode: (value: number | null) => void
  channel: string
  setChannel: (value: string) => void
  startDate: Date | null
  setStartDate: (value: Date | null) => void
  endDate: Date | null
  setEndDate: (value: Date | null) => void
  limit: number
  setLimit: (value: number) => void
  reruns: string
  setReruns: (value: string) => void
  channels: Channel[]
  host: string
  setHost: (value: string) => void
  port: number | null
  setPort: (value: number | null) => void
  path: string
  setPath: (value: string) => void
  param: string
  setParam: (value: string) => void
  client: string
  setClient: (value: string) => void
  clients: Client[]
  method: string
  setMethod: (value: string) => void,
  fetchTransactionLogs: (timestampFilter?: string, filteredResults?: boolean) => Promise<void>
}

export interface CustomizeDialogProps {
  open: boolean
  onClose: () => void
  onApply: () => void
  visibleFilters: {[key: string]: boolean}
  handleFilterVisibilityChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void
}

export interface SettingsDialogProps {
  open: boolean
  onClose: () => void
  onApply: () => void
  openInNewTab: boolean
  setOpenInNewTab: (value: boolean) => void
  autoUpdate: boolean
  setAutoUpdate: (value: boolean) => void
}

export interface StatusButtonProps {
  status: string
  buttonText: string
}
