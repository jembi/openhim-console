import {registerApplication, start} from 'single-spa'
import {
  constructApplications,
  constructRoutes,
  constructLayoutEngine
} from 'single-spa-layout'
import microfrontendLayout from './microfrontend-layout.html'
import {fetchApps} from '@jembi/openhim-core-api'

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
async function fetchApps_(): Promise<PortalApp[]> {
  const portalApps = await fetchApps()
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

function generateImportMap(esmodules) {
  return {
    imports: esmodules
      .filter(app => app.type === 'esmodule')
      .reduce((imports, app) => {
        const urlWithoutProtocol = app.url.replace(/^https?:/, '')
        imports[app.name] = urlWithoutProtocol
        return imports
      }, {})
  }
}
/**
 * Register and start applications using the layout engine.
 *
 * @param layout The layout configuration.
 * @returns A promise that resolves when the applications are registered and the layout engine is started.
 */
async function registerAndStartApps(layout: string) {
  const routes = constructRoutes(layout)
  const applications = constructApplications({
    routes,
    async loadApp({name}): Promise<any> {
      return System.import(name).catch(err => {
        console.error(`Error loading application ${name}:`, err)
        window.alert(`Error loading application ${name}: ${err}`)
        // Handle the error appropriately here
        return {
          bootstrap: () => Promise.resolve(),
          mount: () => Promise.resolve(),
          unmount: () => Promise.resolve()
        }
      })
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
    const apps: PortalApp[] = await fetchApps_()
    const esmodules = apps.filter(app => app.type === 'esmodule')
    /* ----------------------------------------------------------*/
    // TODO: This is a temporary solution to dynamically load the import map
    // Generate the import map
    const importMap = generateImportMap(esmodules)
    // Convert the import map to a JSON string
    const importMapJson = JSON.stringify(importMap, null, 2)

    // Find the script tag with id 'esm-importmap'
    //const scriptTag = document.getElementById('esm-importmap');

    const scriptTag = document.createElement('script')
    scriptTag.type = 'systemjs-importmap'
    scriptTag.textContent = importMapJson

    // Inject the import map into the script tag
    if (scriptTag) {
      document.head.appendChild(scriptTag)
    } else {
      console.error('Could not find script tag with id "esm-importmap"')
    }
    /* ----------------------------------------------------------*/
    // Generate the new microfrontend layout
    let newMicrofrontendLayout = ''
    for (const app of esmodules) {
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

try {
  await loadAndStartMicrofrontends()
} catch (error) {
  console.error('Failed to load and start core microfrontend modules: ', error)
  // TODO Handle the error appropriately
}
