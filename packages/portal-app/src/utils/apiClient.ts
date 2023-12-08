import axios from 'axios'

// set REACT_APP_OPENHIM_API_BASE_URL Env var to https://localhost:8080/ if running locally
const API_URL = process.env.REACT_APP_OPENHIM_API_BASE_URL

const apiClient = axios.create({
  withCredentials: true,
  baseURL: API_URL
})

export default apiClient

async function fetchApps() {
  try {
    const response = await apiClient.get('/apps')
    /* filter out apps that are not to be shown in the portal */
    const portalApps = response.data.filter(app => app.showInPortal)
    return portalApps
  } catch (error) {
    console.error('Unable to fetch apps', error)
  }
}
export {fetchApps}

const registerNewApp = async appData => {
  appData.name = appData.name.trim()
  appData.description = appData.description.trim()
  appData.url = appData.url.trim()
  appData.icon = appData.icon.trim()
  try {
    const response = await apiClient.post('/apps', appData)
    return response.data
  } catch (error) {
    throw error
  }
}
export {registerNewApp}

const deleteApp = async appId => {
  try {
    const response = await apiClient.delete(`/apps/${appId}`)
    return response.data
  } catch (error) {
    throw error
  }
}
export {deleteApp}

const updateApp = async (appId, appData) => {
  try {
    const response = await apiClient.put(`/apps/${appId}`, appData)
    return response.data
  } catch (error) {
    throw error
  }
}
export {updateApp}
