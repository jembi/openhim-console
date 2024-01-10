import {registerApplication, start} from 'single-spa'
import {
  constructApplications,
  constructRoutes,
  constructLayoutEngine
} from 'single-spa-layout'
import microfrontendLayout from './microfrontend-layout.html'

import axios from 'axios'
export const apiClient = axios.create({
  withCredentials: true,
  baseURL: 'https://localhost:8080/'
})

export interface PortalApp {
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
/**
 * Fetches the portal apps from the OpenHIM Core.
 * @returns A promise that resolves to an array of PortalApp objects.
 */
async function fetchApps(): Promise<PortalApp[]> {
  const response = await apiClient.get('/apps')
  /* filter out apps that are not to be shown in the portal */
  const portalApps = response.data.filter(app => app.showInPortal)
  DEBUG: console.log('fetchApps returned: ', portalApps)
  return portalApps
}

/**
 * Generates a routing path from a given URL.
 *
 * @param url - The URL to generate the routing path from.
 * @returns The generated routing path.
 */
function generateRoutingPathFromURL(url: string): string {
  const urlObj = new URL(url)
  const path = urlObj.pathname
  const appName = path.split('/').pop()?.replace('.js', '') || ''
  return appName
}

// Extract the common code into a separate function
/**
 * Registers applications and starts the layout engine.
 *
 * @param layout The layout configuration.
 * @returns A promise that resolves when the applications are registered and the layout engine is started.
 */
async function registerAndStartApps(layout: string) {
  const routes = constructRoutes(layout)
  const applications = constructApplications({
    routes,
    loadApp({name}) {
      return System.import(name)
    }
  })
  const layoutEngine = constructLayoutEngine({routes, applications})
  applications.forEach(registerApplication)
  layoutEngine.activate()
  start()
}

/**
 * Fetches the import map and starts the application.
 *
 * @returns {Promise<void>} A promise that resolves when the import map is fetched and the application is started.
 */
async function loadAndStartMicrofrontends(): Promise<void> {
  try {
    const esmodules: PortalApp[] = await fetchApps()
    const importMap = esmodules.filter(app => app.type === 'esmodule')
    let newMicrofrontendLayout = ''
    for (const app of importMap) {
      const path = generateRoutingPathFromURL(app.url)
      newMicrofrontendLayout += `<route path="#!/${path}">`
      newMicrofrontendLayout += `<div style="width: 100%" id="${path}">`
      newMicrofrontendLayout += `<application name="${app.name}"></application>`
      newMicrofrontendLayout += `</div>`
      newMicrofrontendLayout += '</route>'
    }
    const updatedMicrofrontendLayout = microfrontendLayout.replace(
      '<div style="flex-grow: 1" id="openhim-console-ems-container"></div>',
      `<div style="flex-grow: 1" id="openhim-console-ems-container">${newMicrofrontendLayout}</div>`
    )
    await registerAndStartApps(updatedMicrofrontendLayout)
  } catch (error) {
    console.error('Fetching external modules failed : ', error)
    await registerAndStartApps(microfrontendLayout)
  }
}

loadAndStartMicrofrontends()
