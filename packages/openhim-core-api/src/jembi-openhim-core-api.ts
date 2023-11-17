import axios from 'axios'

/* if running locally set REACT_APP_OPENHIM_API_BASE_URL environment variable to point to OpenHIM Core API
For example  https://localhost:8080/
*/

const API_URL =
  process.env.REACT_APP_OPENHIM_API_BASE_URL || 'https://localhost:8080/'
if (!API_URL) {
  throw new Error('REACT_APP_OPENHIM_API_BASE_URL is not set')
}

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

// Anything exported from this file is importable by other in-browser modules.

export const apiClient = axios.create({
  withCredentials: true,
  baseURL: API_URL
})

export async function fetchApps(): Promise<App[]> {
  try {
    const response = await apiClient.get('/apps')
    /* filter out apps that are not to be shown in the portal */
    const portalApps = response.data.filter(app => app.showInPortal)
    return portalApps
  } catch (error) {
    throw error
  }
}

export async function getAllApps(): Promise<App[]> {
  try {
    const response = await apiClient.get('/apps')
    return response.data
  } catch (error) {
    throw error
  }
}

export async function fetchApp(id): Promise<App> {
  try {
    const response = await apiClient.get(`/apps/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}

async function editApp(id, data): Promise<App> {
  try {
    const response = await apiClient.put(`/apps/${id}`, data)
    return response.data
  } catch (error) {
    throw error
  }
}

export {editApp}

async function deleteApp(id) {
  try {
    const response = await apiClient.delete(`/apps/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}

export {deleteApp}

async function fetchCategories() {
  try {
    const response = await apiClient.get('/apps')
    const categories = Array.from(
      new Set(response.data.map(app => app.category))
    )
    return categories
  } catch (error) {
    throw error
  }
}
export {fetchCategories}

async function fetchAppsByCategory(category) {
  try {
    const response = await apiClient.get('/apps')
    const apps = response.data.filter(app => app.category === category)
    return apps
  } catch (error) {
    throw error
  }
}
export {fetchAppsByCategory}

async function fetchAppsGroupedByCategory() {
  try {
    const response = await apiClient.get('/apps')
    const categories = Array.from(
      new Set(response.data.map(app => app.category))
    )
    const appsGroupedByCategory = categories.map(category => {
      const apps = response.data.filter(app => app.category === category)
      return {category, apps}
    })
    return appsGroupedByCategory
  } catch (error) {
    throw error
  }
}
export {fetchAppsGroupedByCategory}
