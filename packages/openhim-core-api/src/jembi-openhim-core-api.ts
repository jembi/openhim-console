import axios from 'axios'

interface App {
  _id: string
  name: string
  description: string
  icon: string
  type: string
  category: string
  access_roles: string[]
  url: string
  showInPortal: boolean
  showInSideBar: boolean
  __v: number
}

interface Config {
  protocol: string
  host: string
  port: number
  hostPath?: string
}

interface Transactions {
  _id: string
  method: string
  host: string
  port: string
  path: string
  querystring: string
  channel: {
    _id: string
    name: string
  }
  timestamp: Date
}

async function initializeApiClient(): Promise<void> {
  try {
    const response = await fetch('/config/default.json')
    const config: Config = await response.json()
    let hostPath = config.hostPath || ''
    if (hostPath) {
      hostPath = '/' + hostPath.replace(/(^\/)|(\/$)/g, '')
    }
    // Initialize apiClient with the correct baseURL
    apiClient = axios.create({
      withCredentials: true,
      baseURL: `${config.protocol}://${config.host}:${config.port}${hostPath}`
    })

    // Add interceptors
    apiClient.interceptors.response.use(
      response => response,
      error => {
        // Add a response interceptor to redirect to login page if the user is not authenticated and not already logged out.
        if (error.response.status == 401) {
          if (
            !window.location.href.includes('/login') &&
            !window.location.href.includes('/logout')
          ) {
            window.location.href = '/#!/logout'
          }
          return Promise.reject(error)
        }
        return Promise.reject(error)
      }
    )
  } catch (error) {
    console.error('Error initializing the API client:', error)
    throw error
  }
}
// Variable to hold the initialized apiClient
let apiClient = axios.create()

// Call initializeApiClient to setup apiClient before using it
const initializationPromise = initializeApiClient().catch(console.error)

async function ensureApiClientInitialized(): Promise<void> {
  await initializationPromise
}
export async function fetchApps(): Promise<App[]> {
  await ensureApiClientInitialized()
  const response = await apiClient.get('/apps')
  return response.data.filter((app: App) => app.showInPortal)
}

export async function fetchServerHeartBeat(): Promise<{
  master: number
  now: number
}> {
  await ensureApiClientInitialized()
  const response = await apiClient.get('/heartbeat')
  return response.data
}

export async function getAllApps(): Promise<App[]> {
  await ensureApiClientInitialized()
  const response = await apiClient.get('/apps')
  return response.data
}

export async function fetchApp(id: string): Promise<App> {
  await ensureApiClientInitialized()
  const response = await apiClient.get(`/apps/${id}`)
  return response.data
}

export async function editApp(id: string, data: App): Promise<App> {
  await ensureApiClientInitialized()
  const response = await apiClient.put(`/apps/${id}`, data)
  return response.data
}

export async function deleteApp(id: string): Promise<void> {
  await ensureApiClientInitialized()
  await apiClient.delete(`/apps/${id}`)
}

export async function fetchCategories(): Promise<string[]> {
  await ensureApiClientInitialized()
  const response = await apiClient.get('/apps')
  return Array.from(new Set(response.data.map((app: App) => app.category)))
}

export async function fetchAppsByCategory(category: string): Promise<App[]> {
  await ensureApiClientInitialized()
  const response = await apiClient.get('/apps')
  return response.data.filter((app: App) => app.category === category)
}

export async function fetchAppsGroupedByCategory() {
  await ensureApiClientInitialized()
  const response = await apiClient.get('/apps')
  const categories = Array.from(
    new Set(response.data.map((app: App) => app.category))
  )
  const appsGroupedByCategory = categories.map(category => {
    const apps = response.data.filter((app: App) => app.category === category)
    return {category, apps}
  })
  return appsGroupedByCategory
}

export async function addApp(app: App): Promise<App> {
  await ensureApiClientInitialized()
  const response = await apiClient.post('/apps', app)
  return response.data
}

export async function getImportMap(): Promise<any> {
  await ensureApiClientInitialized()
  const response = await apiClient.get('/importmaps')
  return response.data
}

/**
 * Transactions
 * @returns
 */
export async function fetchTransactions(filters: {
  filterLimit: string
  filterPage: number
  filters: {}
}): Promise<Transactions[]> {
  await ensureApiClientInitialized()
  const response = await apiClient.get('/transactions', {
    params: filters
  })
  return response.data
}

export async function fetchTransaction(id: string) {
  await ensureApiClientInitialized()
  const response = await apiClient.get(`/transactions/${id}`)
  return response.data
}

/**
 * Channels
 * @returns
 */
export async function fetchChannels(): Promise<any> {
  await ensureApiClientInitialized()
  const response = await apiClient.get('/channels')
  return response.data
}

export async function createChannel(channel: any): Promise<any> {
  await ensureApiClientInitialized()
  const response = await apiClient.post('/channels', channel)

  return response.data
}

export async function fetchChannelById(id: String): Promise<any> {
  await ensureApiClientInitialized()
  const response = await apiClient.get(`/channels/${id}`)
  return response.data
}

export async function editChannel(channel: any) {
  await ensureApiClientInitialized()
  const response = await apiClient.put(`/channels/${channel._id}`, channel)
  return response.data
}

/**
 * Clients
 */
export async function fetchClients(): Promise<any> {
  await ensureApiClientInitialized()
  const response = await apiClient.get('/clients')
  return response.data
}

export async function fetchClientById(id: String): Promise<any> {
  await ensureApiClientInitialized()
  const response = await apiClient.get(`/clients/${id}`)
  return response.data
}

// get specific client
export async function fetchClient(clientId: string): Promise<any> {
  await ensureApiClientInitialized()
  const response = await apiClient.get(`/clients/${clientId}`)
  return response.data
}

// add clients
export async function addClient(client: any): Promise<any> {
  await ensureApiClientInitialized()
  const response = await apiClient.post('/clients', client)
  return response.data
}

// edit clients
export async function editClient(clientId: string, client: any): Promise<any> {
  await ensureApiClientInitialized()
  const response = await apiClient.put(`/clients/${clientId}`, client)
  return response.data
}

// delete clients
export async function deleteClient(clientId: string): Promise<void> {
  await ensureApiClientInitialized()
  await apiClient.delete(`/clients/${clientId}`)
}

/**
 *
 * Roles
 */
export async function fetchRoles(): Promise<any> {
  await ensureApiClientInitialized()
  const response = await apiClient.get('/roles')
  return response.data
}

export async function editRole(roleName: string, role: any): Promise<void> {
  await ensureApiClientInitialized()
  await apiClient.put('/roles/' + roleName, role)
}

export async function createRole(role: any): Promise<void> {
  await ensureApiClientInitialized()
  await apiClient.post('/roles', role)
}
export async function deleteRole(roleName: string): Promise<void> {
  await ensureApiClientInitialized()
  await apiClient.delete('/roles/' + roleName)
}

export async function fetchMediators(): Promise<any> {
  await ensureApiClientInitialized()
  const response = await apiClient.get('/mediators')
  return response.data
}

// fetch certificate
export async function fetchCertificate(): Promise<any> {
  await ensureApiClientInitialized()
  const response = await apiClient.get(`/keystore/ca`)
  return response.data
}

// fetch authentication types
export async function fetchAuthTypes(): Promise<any> {
  await ensureApiClientInitialized()
  const response = await apiClient.get(`/authentication/types`)
  return response.data
}

export async function fetchTimeSeries(
  period: 'minute' | 'month' | 'day' | 'year',
  filter: {startDate: Date; endDate: Date}
): Promise<any> {
  await ensureApiClientInitialized()
  const url = `/metrics/timeseries/${period}`
  const response = await apiClient.get(url, {
    params: {
      startDate: filter.startDate.toISOString(),
      endDate: filter.endDate.toISOString()
    }
  })
  return response.data
}

export async function fetchAbout(): Promise<any> {
  await ensureApiClientInitialized()
  const response = await apiClient.get('/about')
  return response.data
}

export async function fetchUsers(): Promise<any[]> {
  await ensureApiClientInitialized()
  const response = await apiClient.get('/users')
  return response.data
}

export async function createUser(user: any): Promise<any> {
  await ensureApiClientInitialized()
  const response = await apiClient.post('/users', user)
  return response.data
}

export async function updateUser(email: string, user: any): Promise<any> {
  await ensureApiClientInitialized()
  const response = await apiClient.put('/users/' + email, user)
  return response.data
}

interface ClientRole {
  roleName: string
  clients: string[]
  channels: string[]
}

interface Client {
  _id?: string
  clientID: string
  roles: string[]
}
interface Channel {
  _id?: string
  name: string
  allow: string[]
}

export async function fetchClientRoles() {
  const clients = (await fetchClients()) as Client[]
  const channels = (await fetchChannels()) as Channel[]

  const roles: ClientRole[] = []
  clients.forEach(client => {
    client.roles.forEach(role => {
      // check if role exists in roles array
      const roleIndex = roles.findIndex(r => r.roleName === role)
      if (roleIndex === -1) {
        roles.push({
          roleName: role,
          clients: [client.clientID],
          channels: []
        })
      } else {
        roles[roleIndex].clients.push(client.clientID)
      }
    })
  })
  channels.forEach(channel => {
    channel.allow.forEach(role => {
      // check if role exists in roles array
      const roleIndex = roles.findIndex(r => r.roleName === role)
      if (roleIndex === -1) {
        roles.push({
          roleName: role,
          clients: [],
          channels: [channel.name]
        })
      } else {
        roles[roleIndex].channels.push(channel.name)
      }
    })
  })

  return roles
}

export async function addToTaskQueue(payload: {
  tids: Array<string>
  batchSize: number
  paused: boolean
}) {
  await ensureApiClientInitialized()
  const response = await apiClient.post('/tasks', payload)
  return response.data
}

export async function addToBulkReRunTaskQueue(payload: {
  batchSize: number
  filterLimit: number
  filterPage: number
  filters: {}
  pauseQueue: boolean
}) {
  await ensureApiClientInitialized()
  const response = await apiClient.post('/bulkrerun', payload)
  return response.data
}

export async function fetchBulkRunFilterCount(params: {
  filterLimit: number
  filterPage: number
  filterRepresentation: string
  filters: {}
}): Promise<number> {
  await ensureApiClientInitialized()
  const response = await apiClient.get('/transactions', {params})
  return response.data
}
