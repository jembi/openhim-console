import React from 'react'
import {Box, Grid, Typography,Button,Card,Divider} from '@mui/material'

interface BasePageTemplateProps {
  children: React.ReactNode
  title: string
  subtitle: string
  button?: React.ReactNode
}

export function BasePageTemplate({children, title, subtitle, button}: BasePageTemplateProps) {
  return (
    <Box padding={1}>
      <Grid container padding={2} spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            {title}
          </Typography>
          <Grid
            container
            direction="row"
            sx={{
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Grid item>
              <Typography variant="subtitle1" gutterBottom>
                {subtitle}
              </Typography>
            </Grid>
            <Grid item>
              {button}
            </Grid>
          </Grid>
          <Divider sx={{marginTop: '10px', marginBottom: '30px'}} />
        </Grid>
        <Grid item xs={12}>
          {children}
        </Grid>
      </Grid>
    </Box>
  )
}

