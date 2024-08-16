import {
  BasicFilterProps,
  CustomFilterProps,
  CustomizeDialogProps,
  SettingsDialogProps
} from './index.interface'
import {Channel, Client} from '../types'

const mockChannel: Channel = {_id: '1', name: 'Test Channel'}
const mockClient: Client = {_id: '1', name: 'Test Client'}

const basicFilterProps: BasicFilterProps = {
  status: 'active',
  setStatus: (value: string) => {},
  searchQuery: 'test',
  setSearchQuery: (value: string) => {},
  channel: 'channel-1',
  setChannel: (value: string) => {},
  startDate: new Date(),
  setStartDate: (value: Date | null) => {},
  endDate: new Date(),
  setEndDate: (value: Date | null) => {},
  limit: 10,
  setLimit: (value: number) => {},
  reruns: 'none',
  setReruns: (value: string) => {},
  channels: [mockChannel]
}

const customFilterProps: CustomFilterProps = {
  status: 'active',
  setStatus: (value: string) => {},
  statusCode: 200,
  setStatusCode: (value: number | null) => {},
  channel: 'channel-1',
  setChannel: (value: string) => {},
  startDate: new Date(),
  setStartDate: (value: Date | null) => {},
  endDate: new Date(),
  setEndDate: (value: Date | null) => {},
  limit: 20,
  setLimit: (value: number) => {},
  reruns: 'all',
  setReruns: (value: string) => {},
  channels: [mockChannel],
  host: 'localhost',
  setHost: (value: string) => {},
  port: 8080,
  setPort: (value: number | null) => {},
  path: '/api',
  setPath: (value: string) => {},
  param: 'param',
  setParam: (value: string) => {},
  client: 'client-1',
  setClient: (value: string) => {},
  clients: [mockClient],
  method: 'GET',
  setMethod: (value: string) => {}
}

const customizeDialogProps: CustomizeDialogProps = {
  open: true,
  onClose: () => {},
  onApply: () => {},
  visibleFilters: {status: true, channel: false},
  handleFilterVisibilityChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {}
}

const settingsDialogProps: SettingsDialogProps = {
  open: true,
  onClose: () => {},
  onApply: () => {},
  openInNewTab: true,
  setOpenInNewTab: (value: boolean) => {},
  autoUpdate: false,
  setAutoUpdate: (value: boolean) => {}
}

describe('Interface Conformance Tests', () => {
  it('should conform to BasicFilterProps interface', () => {
    expect(basicFilterProps.status).toBe('active')
    expect(typeof basicFilterProps.setStatus).toBe('function')
    expect(Array.isArray(basicFilterProps.channels)).toBe(true)
    expect(basicFilterProps.channels[0]._id).toBe('1')
  })

  it('should conform to CustomFilterProps interface', () => {
    expect(customFilterProps.statusCode).toBe(200)
    expect(customFilterProps.host).toBe('localhost')
    expect(customFilterProps.clients[0].name).toBe('Test Client')
    expect(typeof customFilterProps.setClient).toBe('function')
  })

  it('should conform to CustomizeDialogProps interface', () => {
    expect(customizeDialogProps.open).toBe(true)
    expect(typeof customizeDialogProps.onClose).toBe('function')
    expect(customizeDialogProps.visibleFilters.status).toBe(true)
  })

  it('should conform to SettingsDialogProps interface', () => {
    expect(settingsDialogProps.openInNewTab).toBe(true)
    expect(settingsDialogProps.autoUpdate).toBe(false)
    expect(typeof settingsDialogProps.setAutoUpdate).toBe('function')
  })
})
