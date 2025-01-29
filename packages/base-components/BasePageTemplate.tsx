import React from 'react'
import {
  Box,
  Grid,
  Typography,
  Button,
  Card,
  Divider,
  alpha,
  Link
} from '@mui/material'
import Breadcrumbs from '@mui/material/Breadcrumbs'

interface BasePageTemplateProps {
  children: React.ReactNode | React.ReactNode[]
  title: string
  subtitle: string | React.ReactNode
  button?: React.ReactNode
  breadcrumbs?: Breadcrumb[]
}

interface Breadcrumb {
  label: string
  href?: string
}

export function BasePageTemplate({
  children,
  title,
  subtitle,
  button,
  breadcrumbs
}: BasePageTemplateProps) {
  return (
    <Box padding={1}>
      <Grid container padding={2} spacing={2}>
        <Grid item xs={12}>
          <Breadcrumbs aria-label="breadcrumb" sx={{marginBottom: '24px'}}>
            {breadcrumbs?.map(breadcrumb => {
              if (breadcrumb.href) {
                return (
                  <Link
                    underline="hover"
                    sx={{
                      color: '#049D84'
                    }}
                    key={breadcrumb.label}
                    href={breadcrumb.href}
                  >
                    {breadcrumb.label}
                  </Link>
                )
              }
              return (
                <Typography key={breadcrumb.label}>
                  {breadcrumb.label}
                </Typography>
              )
            })}
          </Breadcrumbs>
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
              ...(breadcrumbs && {
                marginBottom: '24px'
              }),
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
