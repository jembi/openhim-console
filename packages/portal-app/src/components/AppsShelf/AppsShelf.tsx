import React from 'react'
import {Grid, Typography} from '@mui/material'
import AppCard from '../AppCard/AppCard'

const AppsShelf = ({appsGroupedByCat}: any) => {
  return (
    <div>
      <Grid container spacing={2}>
        {Object.entries(appsGroupedByCat).map(([category, apps]) => (
          <React.Fragment key={category}>
            {category.length > 0 && (
              <Grid item xs={12} sx={{mt: '10px', pl: 0}}>
                <Typography variant="overline">{category}</Typography>
              </Grid>
            )}
            {(apps as any[]).map((app: any) => (
              <React.Fragment key={app.name}>
                <Grid item xs={12} md={4} sm={8} sx={{m: 0}}>
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

export default AppsShelf
