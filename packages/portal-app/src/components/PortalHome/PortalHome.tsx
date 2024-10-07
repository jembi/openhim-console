import {useState, useEffect, useMemo} from 'react'
import {Box, Grid, Typography, Divider, Button} from '@mui/material'
import green from '@mui/material/colors/green'
import {useSnackbar} from 'notistack'
import {Settings} from '@mui/icons-material'
import EmptyState from '../EmptyState/EmptyState'
import AppsShelfSkeleton from '../AppsShelfSkeleton/AppsShelfSkeleton'
import AppsShelf from '../AppsShelf/AppsShelf'
import {fetchApps} from '@jembi/openhim-core-api'

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
      setApps(updatedPortalApps)
    } catch (error) {
      enqueueSnackbar('Unable to fetch apps', {variant: 'error'})
      setApps([]) // Clear the apps list on error
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadContent()
  }, [])

  return (
    <Box
      mt={'5%'}
      ml={'10%'}
      mr={'10%'}
    >
      <section id="PortalHeader">
        <Grid sx={{ml: 0, mt: 0}}>
          <Box width="100%" display="flex" justifyContent="space-between">
            <Typography variant="h2" color={green[700]}>
              Portal
            </Typography>
            <Button href="#!/portal-admin" startIcon={<Settings />}>
              Manage
            </Button>
          </Box>
        </Grid>
        <Divider sx={{mb: 3, borderBlockColor: 'rgba(0, 0, 0, 0.50)'}} />
      </section>
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
    </Box>
  )
}

export default PortalHome
