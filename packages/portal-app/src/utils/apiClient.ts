import axios from 'axios'

const API_URL = 'https://localhost:8080/'

const apiClient = axios.create({
  withCredentials: true,
  baseURL: API_URL
})

export default apiClient

async function fetchApps() {
  try {
    const response = await apiClient.get('/apps')
    /* filter apps that are not shown in portal */
    const ShowInPortalApps = response.data.filter(app => app.showInPortal)
    /* extract unique categories */
    const uniqueCategories = Array.from(
      new Set(ShowInPortalApps.map(app => app.category))
    )
    /* Group Apps by their category */
    const appsGroupedByCat = uniqueCategories.reduce(
      (acc: {[key: string]: any}, category) => {
        const appsToDisplay = []
        for (let i = 0; i < ShowInPortalApps.length; i++) {
          const app = ShowInPortalApps[i]
          if (app.category === category) {
            appsToDisplay.push(app)
          }
        }
        return {...acc, [category.toString()]: appsToDisplay}
      },
      {}
    )
    return [ShowInPortalApps, appsGroupedByCat]
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
