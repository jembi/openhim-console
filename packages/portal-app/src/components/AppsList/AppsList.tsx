import React from 'react'
import {Grid, Typography} from '@mui/material'
import AppCard from '../AppCard/AppCard'

const AppsList = ({categories, apps}: any) => {
  const groupedApps = {}
  categories.forEach(category => {
    groupedApps[category] = apps.filter(
      app => app.category === category && app.showInPortal
    )
  })

  return (
    <div>
      <Grid container spacing={2} sx={{mt: 5, pl:10}}>
        {categories.map(category => (
          <React.Fragment key={category}>
            {groupedApps[category].length > 0 && (
              <Grid item xs={12}>
                <Typography>{category}</Typography>
              </Grid>
            )}
            {groupedApps[category].map((app: any) => (
              <React.Fragment key={app.name}>
              <Grid item xs={12} sm={4} md={3} sx={{m: 1}}>
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

export default AppsList
