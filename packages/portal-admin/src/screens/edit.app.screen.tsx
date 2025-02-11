import {editApp} from '@jembi/openhim-core-api'
import {TabContext, TabList, TabPanel} from '@mui/lab'
import {Box, Button, Grid, Paper, Tab} from '@mui/material'
import React from 'react'
import {BasePageTemplate} from '../../../base-components'
import ActiveStepOne from './steps/ActiveStepOne'
import ActiveStepTwo from './steps/ActiveStepTwo'
import ActiveStepZero from './steps/ActiveStepZero'
import {useAlert} from '../contexts/alert.context'
import {App, Routes} from '../types'

export default function EditAppScreen() {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isFormValid, setIsFormValid] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState('0')
  const {showAlert} = useAlert()
  const originalApp = window.history.state as App
  const [app, setApp] = React.useState(structuredClone(originalApp))

  const onAppChange = (event: {app: App; isValid: boolean}) => {
    setApp(event.app)
    setIsFormValid(event.isValid)
  }

  const handleEditApp = async () => {
    try {
      setIsSubmitting(true)

      await editApp(originalApp._id, app)

      showAlert('App was registered successfully', 'Success', 'success')

      setTimeout(() => {
        window.location.href = `/#${Routes.MANAGE_APPS}`
      }, 500)
    } catch (error) {
      console.error(error)
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.error.includes('E11000')
      ) {
        showAlert('App already exists', 'Error', 'error')
      } else {
        showAlert(
          'Failed to add app ! ' + error.response?.data?.error,
          'Error',
          'error'
        )
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <BasePageTemplate
      title="Edit App"
      subtitle="Use the form below to edit your portal app."
      breadcrumbs={[{label: 'Apps', href: '/#!/apps'}, {label: 'Edit'}]}
    >
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Grid item xs={12}>
          <Paper style={{width: '680px', borderRadius: '15px'}} elevation={4}>
            <TabContext value={activeTab}>
              <TabList
                onChange={(e, newValue) => setActiveTab(newValue)}
                centered
                variant="fullWidth"
              >
                <Tab label="Add App details" value="0" />
                <Tab label="Add App Configuration" value="1" />
                <Tab label="Choose Icon" value="2" />
              </TabList>
              <TabPanel value="0">
                <ActiveStepZero app={app} onChange={onAppChange} />
              </TabPanel>
              <TabPanel value="1">
                <ActiveStepOne app={app} onChange={onAppChange} />
              </TabPanel>
              <TabPanel value="2">
                <ActiveStepTwo app={app} onChange={onAppChange} />
              </TabPanel>
            </TabContext>

            <Box style={{padding: '10px'}}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() =>
                  (window.location.href = `/#${Routes.MANAGE_APPS}`)
                }
              >
                CANCEL
              </Button>

              <span style={{marginRight: '10px'}}></span>

              <Button
                variant="contained"
                color="primary"
                disabled={
                  isSubmitting ||
                  !isFormValid ||
                  JSON.stringify(app) === JSON.stringify(originalApp)
                }
                onClick={handleEditApp}
              >
                SAVE
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </BasePageTemplate>
  )
}
