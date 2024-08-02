import axios from 'axios'
import { start } from 'repl'
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

export async function deleteRole(roleName: string): Promise<void> {
  await ensureApiClientInitialized()
  await apiClient.delete('/roles/' + roleName)
}

export async function editRole(roleName: string, role: any): Promise<void> {
  await ensureApiClientInitialized()
  await apiClient.put('/roles/' + roleName, role)
}

export async function createRole(role: any): Promise<void> {
  await ensureApiClientInitialized()
  await apiClient.post('/roles', role)
}

export async function fetchChannels(): Promise<any> {
  await ensureApiClientInitialized()
  const response = await apiClient.get('/channels')
  return response.data
}

export async function fetchMediators(): Promise<any> {
  await ensureApiClientInitialized()
  const response = await apiClient.get('/mediators')
  return response.data
}

export async function fetchClients(): Promise<any> {
  await ensureApiClientInitialized()
  const response = await apiClient.get('/clients')
  return response.data
}

export async function fetchTransactions(): Promise<any> {
  await ensureApiClientInitialized()
  const response = await apiClient.get('/transactions')
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


export async function fetchTimeSeries(period: 'minute' | 'month' | 'day' | 'year', filter: {startDate: Date; endDate: Date}): Promise<any> {
  await ensureApiClientInitialized()
  const url = `/metrics/timeseries/${period}`
  const response = await apiClient.get(
    url,
    { params: {
      startDate: filter.startDate.toISOString(),
      endDate: filter.endDate.toISOString(),
    } }
  )
  return response.data
}
