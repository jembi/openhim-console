import {useState, useEffect, useMemo} from 'react'
import {Box, Grid, Typography, Divider, Button} from '@mui/material'
import green from '@mui/material/colors/green'
import {useSnackbar} from 'notistack'
import {Settings} from '@mui/icons-material'
import EmptyState from '../EmptyState/EmptyState'
import AppsShelfSkeleton from '../AppsShelfSkeleton/AppsShelfSkeleton'
import AppsShelf from '../AppsShelf/AppsShelf'
import {fetchApps} from '@jembi/openhim-core-api'
import {BasePageTemplate} from '../../../../base-components'

const preloadedPortalApps = [
  {
    _id: '66f6ab7dd13af5ffa0d8aef7',
    name: 'OpenHIM Docs',
    description: 'Documentation for the OpenHIM',
    icon: 'https://fonts.gstatic.com/s/i/materialicons/cloud/v12/24px.svg',
    type: 'external',
    category: 'Documentation',
    access_roles: ['admin'],
    url: 'https://openhim.org/docs/introduction/about',
    showInPortal: true,
    showInSideBar: false,
    __v: 0
  },
  {
    _id: '671621d593a136387ce3048c',
    name: 'OpenHIM Platform Docs',
    description: 'Documentation for the OpenHIM Platform',
    icon: 'https://fonts.gstatic.com/s/i/materialicons/dashboard/v12/24px.svg',
    type: 'external',
    category: 'Documentation',
    access_roles: ['admin'],
    url: `https://jembi.gitbook.io/openhim-platform`,
    showInPortal: true,
    showInSideBar: false,
    __v: 0
  },
  {
    _id: '671621d593a136387ce3048c',
    name: 'Transactions',
    description: 'View incoming API requests',
    icon: 'https://fonts.gstatic.com/s/i/materialicons/dashboard/v12/24px.svg',
    type: 'internal',
    category: 'OpenHIM',
    access_roles: ['admin'],
    url: `${window.location.origin}/#!/transactions`,
    showInPortal: true,
    showInSideBar: false,
    __v: 0
  },
  {
    _id: '671621d593a136387ce3048c',
    name: 'Manage Channels',
    description: 'View and manage channels',
    icon: 'https://fonts.gstatic.com/s/i/materialicons/dashboard/v12/24px.svg',
    type: 'internal',
    category: 'OpenHIM',
    access_roles: ['admin'],
    url: `${window.location.origin}/#!/channels`,
    showInPortal: true,
    showInSideBar: false,
    __v: 0
  },
  {
    _id: '671621d593a136387ce3048c',
    name: 'Manage Clients',
    description: 'View and manage clients',
    icon: 'https://fonts.gstatic.com/s/i/materialicons/dashboard/v12/24px.svg',
    type: 'internal',
    category: 'OpenHIM',
    access_roles: ['admin'],
    url: `${window.location.origin}/#!/clients`,
    showInPortal: true,
    showInSideBar: false,
    __v: 0
  },
  {
    _id: '671621d593a136387ce3048c',
    name: 'Manage Users',
    description: 'View and manage users',
    icon: 'https://fonts.gstatic.com/s/i/materialicons/dashboard/v12/24px.svg',
    type: 'internal',
    category: 'OpenHIM',
    access_roles: ['admin'],
    url: `${window.location.origin}/#!/users`,
    showInPortal: true,
    showInSideBar: false,
    __v: 0
  }
]

function PortalHome() {
  const [isLoading, setLoading] = useState(true)
  const [portalApps, setApps] = useState([])
  const {enqueueSnackbar} = useSnackbar()

  /* extract unique categories */

  const uniqueCategories = useMemo(
    () => Array.from(new Set(portalApps.map(app => app.category))),
    [portalApps]
  )
  /* group apps by category */

  const appsGroupedByCat = useMemo(
    () =>
      uniqueCategories.reduce((acc: {[key: string]: any}, category) => {
        const appsToDisplay = portalApps.filter(
          app => app.category === category
        )
        return {...acc, [category.toString()]: appsToDisplay}
      }, {}),
    [uniqueCategories, portalApps]
  )

  async function loadContent() {
    try {
      const updatedPortalApps = await fetchApps()
      setApps([...preloadedPortalApps, ...updatedPortalApps])
    } catch (error) {
      enqueueSnackbar('Unable to fetch apps', {variant: 'error'})
      setApps([...preloadedPortalApps]) // Clear the apps list on error
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadContent()
  }, [])

  return (
    <BasePageTemplate
      title="Portal"
      subtitle="Setup and Manage your apps"
      button={
        <Button href="#!/portal-admin" startIcon={<Settings />}>
          Manage
        </Button>
      }
    >
      <section id="CategoriesSection">
        {isLoading ? (
          <AppsShelfSkeleton />
        ) : Object.keys(appsGroupedByCat).length === 0 ? (
          <EmptyState
            header="You don't have any registered apps to display yet"
            description="Start by adding a new app to your portal."
          />
        ) : (
          <AppsShelf appsGroupedByCat={appsGroupedByCat} />
        )}
      </section>
    </BasePageTemplate>
  )
}

export default PortalHome
