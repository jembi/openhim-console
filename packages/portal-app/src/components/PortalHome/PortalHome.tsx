import {useState, useEffect} from 'react'
import {Box, Grid, Typography, Divider} from '@mui/material'
import green from '@mui/material/colors/green'
import EmptyState from '../EmptyState/EmptyState'
import AppsShelfSkeleton from '../AppsShelfSkeleton/AppsShelfSkeleton'
import AppsShelf from '../AppsShelf/AppsShelf'
import {fetchApps} from '../../utils/apiClient'

function PortalHome() {
  const [isLoading, setLoading] = useState(true)
  const [portalApps, setApps] = useState([])

  /* extract unique categories */
  const uniqueCategories = Array.from(
    new Set(portalApps.map(app => app.category))
  )
  /* group apps by category */
  const appsGroupedByCat = uniqueCategories.reduce(
    (acc: {[key: string]: any}, category) => {
      const appsToDisplay = portalApps.filter(app => app.category === category)
      return {...acc, [category.toString()]: appsToDisplay}
    },
    {}
  )

  async function loadContent() {
    try {
      const updatedPortalApps = await fetchApps()
      setApps(updatedPortalApps)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadContent()
  }, [])

  return (
    <Box mt={'5%'} ml={'10%'} mr={'10%'}>
      <section id="alertSection" />
      <section id="PortalHeader">
        <Grid sx={{ml: 0, mt: 0}}>
          <Box width="100%" display="flex" justifyContent="space-between">
            <Typography variant="h2" color={green[700]}>
              Portal
            </Typography>
          </Box>
        </Grid>
        <Divider sx={{mb: 3}} />
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
