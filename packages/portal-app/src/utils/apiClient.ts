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
