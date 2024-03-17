import axios from 'axios'

/* ****************************************************************************************************************
if running locally set REACT_APP_OPENHIM_API_BASE_URL environment variable to point to OpenHIM Core API base URL
 **************************************************************************************************************** */

const API_URL =
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

export const apiClient = axios.create({
  withCredentials: true,
  baseURL: API_URL
})

export async function fetchApps(): Promise<App[]> {
  const response = await apiClient.get('/apps')
  /* filter out apps that are not to be shown in the portal */
  const portalApps = response.data.filter(app => app.showInPortal)
  return portalApps
}

export async function getAllApps(): Promise<App[]> {
  const response = await apiClient.get('/apps')
  return response.data
}

export async function fetchApp(id): Promise<App> {
  const response = await apiClient.get(`/apps/${id}`)
  return response.data
}

export async function editApp(id, data): Promise<App> {
  const response = await apiClient.put(`/apps/${id}`, data)
  return response.data
}

export async function deleteApp(id) {
  const response = await apiClient.delete(`/apps/${id}`)
  return response.data
}

export async function fetchCategories() {
  const response = await apiClient.get('/apps')
  const categories = Array.from(new Set(response.data.map(app => app.category)))
  return categories
}

export async function fetchAppsByCategory(category) {
  const response = await apiClient.get('/apps')
  const apps = response.data.filter(app => app.category === category)
  return apps
}

export async function fetchAppsGroupedByCategory() {
  const response = await apiClient.get('/apps')
  const categories = Array.from(new Set(response.data.map(app => app.category)))
  const appsGroupedByCategory = categories.map(category => {
    const apps = response.data.filter(app => app.category === category)
    return {category, apps}
  })
  return appsGroupedByCategory
}

export async function addApp(app: App) {
  const response = await apiClient.post('/apps', app)
  return response.data
}

export async function getImportMap(app: App){
  const response = await apiClient.get('/importmaps')
  return response.data
}
