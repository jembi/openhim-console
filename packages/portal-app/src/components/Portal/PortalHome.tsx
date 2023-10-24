import {useState, useEffect} from 'react'
import {Box, Grid, Typography, Divider} from '@mui/material'
import {green} from '@mui/material/colors'

import apiClient from '../../utils/apiClient'

import AddNewAppDialog from '../AddAppDialog/AddAppDialog'
import CustomSkeleton from '../CustomSkeleton/CustomSkeleton'
import AppList from '../AppsList/AppsList'

function PortalHome() {
  const [apps, setApps] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiClient.get('/apps').then(response => {
      setApps(response.data)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    const uniqueCategories = Array.from(new Set(apps.map(app => app.category)))
    setCategories(uniqueCategories)
  }, [apps])

  return (
    <div>
      <section id="alertSection"></section>
      <section id="PortalHeader">
        <Grid sx={{ml: 5, mt: 5}}>
          <Box width="100%" display="flex" justifyContent="space-between">
            <Typography variant="h2" color={green[700]}>
              Portal
            </Typography>
            <AddNewAppDialog apps={apps} setApps={setApps} />
          </Box>
        </Grid>
        <Divider sx={{mb: 3}}></Divider>
      </section>
      <section id="CategoriesSection">
        {loading ? (
          <CustomSkeleton />
        ) : (
          <AppList categories={categories} apps={apps} />
        )}
      </section>
    </div>
  )
}

export default PortalHome
