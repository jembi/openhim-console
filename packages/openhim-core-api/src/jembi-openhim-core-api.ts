import axios from 'axios'

/* ****************************************************************************************************************
if running locally set REACT_APP_OPENHIM_API_BASE_URL environment variable to point to OpenHIM Core API base URL
 **************************************************************************************************************** */

let API_URL =
  process.env.REACT_APP_OPENHIM_API_BASE_URL || 'http://localhost:8080/'
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
  protocol: string;
  host: string;
  port: number;
  hostPath?: string;
}

async function initializeApiClient(): Promise<void> {
  try {
    const response = await fetch('/config/default.json');
    const config: Config = await response.json();
    // Initialize apiClient with the correct baseURL
    apiClient = axios.create({
      withCredentials: true,
      baseURL: `${config.protocol}://${config.host}:${config.port}`
    });
  } catch (error) {
    console.error('Error initializing the API client:', error);
    throw error;
  }
}
// Variable to hold the initialized apiClient
let apiClient = axios.create();

// Call initializeApiClient to setup apiClient before using it
const initializationPromise = initializeApiClient().catch(console.error);

export async function fetchApps(): Promise<App[]> {
  await initializationPromise;
  
  if (!apiClient) {
    throw new Error('API client not initialized');
  }
  const response = await apiClient.get('/apps')
  /* filter out apps that are not to be shown in the portal */
  const portalApps = response.data.filter((app: App) => app.showInPortal)
  return portalApps
}

export async function getAllApps(): Promise<App[]> {
  const response = await apiClient.get('/apps')
  return response.data
}

export async function fetchApp(id: string): Promise<App> {
  const response = await apiClient.get(`/apps/${id}`)
  return response.data
}

export async function editApp(id: string, data: App): Promise<App> {
  const response = await apiClient.put(`/apps/${id}`, data)
  return response.data
}

export async function deleteApp(id: string) {
  const response = await apiClient.delete(`/apps/${id}`)
  return response.data
}

export async function fetchCategories() {
  const response = await apiClient.get('/apps')
  const categories = Array.from(
    new Set(response.data.map((app: App) => app.category))
  )
  return categories
}

export async function fetchAppsByCategory(category: string) {
  const response = await apiClient.get('/apps')
  const apps = response.data.filter((app: App) => app.category === category)
  return apps
}

export async function fetchAppsGroupedByCategory() {
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

export async function addApp(app: App) {
  const response = await apiClient.post('/apps', app)
  return response.data
}

export async function getImportMap() {
  const response = await apiClient.get('/importmaps')
  return response.data
}
