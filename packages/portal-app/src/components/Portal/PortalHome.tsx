import React, {useState, useEffect} from 'react'
import apiClient from './apiClient'
import {
  Box,
  Grid,
  Card,
  Typography,
  Divider,
  IconButton,
  Skeleton,
  CardHeader
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import {green} from '@mui/material/colors'
import AppCard from '../AppCard/AppCard'

const PortalHome = () => {
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

  const renderAppList = () => {
    const groupedApps = {}
    categories.forEach(category => {
      groupedApps[category] = apps.filter(
        app => app.category === category && app.showInPortal
      )
    })

    return (
      <div>
        <Grid container spacing={2} sx={{m: 5}}>
          {categories.map(category => (
            <React.Fragment key={category}>
              {groupedApps[category].length > 0 && (
                <Grid item xs={12}>
                  <Typography>{category}</Typography>
                </Grid>
              )}
              {groupedApps[category].map((app: any) => (
                <React.Fragment key={app.name}>
                  <Grid item xs={8} sm={4} md={4} sx={{mb: 3}}>
                    <AppCard
                      applicationIcon={app.icon}
                      applicationDescription={app.description}
                      applicationType={app.type}
                      applicationName={app.name}
                      applicationUrl={app.url}
                    />
                  </Grid>
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
        </Grid>
      </div>
    )
  }

  return (
    <div>
      <section id="PortalHeader">
        <Grid sx={{ml: 5, mt: 5}}>
          <Box width="100%" display="flex" justifyContent="space-between">
            <Typography variant="h2" color={green[700]}>
              Portal
            </Typography>
            <IconButton aria-label="add app">
              <AddIcon />
            </IconButton>
          </Box>
        </Grid>
        <Divider sx={{mb: 3}}></Divider>
      </section>
      <section id="CategoriesSection">
        {loading ? (
          <Grid container spacing={2} sx={{ml: 5, mt: 5}}>
            <Grid item xs={12}>
              <Skeleton
                animation="wave"
                height={10}
                width="20%"
                style={{marginBottom: 6}}
              />
            </Grid>
            {[0, 1].map(value => (
              <Grid item xs={8} sm={4} md={4} sx={{mb: 3}} key={value}>
                <Card sx={{maxWidth: 345, m: 1}}>
                  <CardHeader
                    avatar={
                      <Skeleton
                        animation="wave"
                        variant="rounded"
                        width={40}
                        height={40}
                      />
                    }
                    title={
                      <Skeleton
                        animation="wave"
                        height={10}
                        width="80%"
                        style={{marginBottom: 6}}
                      />
                    }
                    subheader={
                      <Skeleton animation="wave" height={10} width="40%" />
                    }
                  ></CardHeader>
                </Card>
                <Skeleton />
                <Skeleton />
              </Grid>
            ))}
          </Grid>
        ) : (
          renderAppList()
        )}
      </section>
    </div>
  )
}

export default PortalHome
