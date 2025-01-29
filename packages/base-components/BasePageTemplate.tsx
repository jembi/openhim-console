import React from 'react'
import {
  Box,
  Grid,
  Typography,
  Button,
  Card,
  Divider,
  alpha
} from '@mui/material'

interface BasePageTemplateProps {
  children: React.ReactNode | React.ReactNode[]
  title: string
  subtitle: string | React.ReactNode
  button?: React.ReactNode
}

export function BasePageTemplate({
  children,
  title,
  subtitle,
  button
}: BasePageTemplateProps) {
  return (
    <Box padding={1}>
      <Grid container padding={2} spacing={2}>
        <Grid item xs={12}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              width: '100%',
              position: 'relative',
              fontSize: '34px',
              letterSpacing: '0.25px',
              lineHeight: '123.5%',
              fontFamily: 'Fira Sans, Roboto, Helvetica, Arial, sans-serif',
              color: alpha('#000', 0.87),
              textAlign: 'left',
              display: 'inline-block',
              fontSmooth: 'never',
              '-webkit-font-smoothing': 'antialiased',
              '-moz-osx-font-smoothing': 'grayscale'
            }}
          >
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
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{
                  color: 'grey',
                  fontSmooth: 'never',
                  '-webkit-font-smoothing': 'antialiased',
                  '-moz-osx-font-smoothing': 'grayscale'
                }}
              >
                {subtitle}
              </Typography>
            </Grid>
            <Grid item>{button}</Grid>
          </Grid>
          <Divider sx={{marginTop: '10px', marginBottom: '20px'}} />
        </Grid>
        <Grid item xs={12}>
          {children}
        </Grid>
      </Grid>
    </Box>
  )
}
