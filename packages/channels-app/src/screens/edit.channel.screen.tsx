import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import {Box, Button, Divider, Grid, Paper, Typography} from '@mui/material'
import Tab from '@mui/material/Tab'
import {useMutation} from '@tanstack/react-query'
import React from 'react'
import {useNavigate} from 'react-router-dom'
import Loader from '../components/helpers/loader.component'
import {useAlert} from '../contexts/alert.context'
import {useBasicBackdrop} from '../contexts/backdrop.context'
import {modifyChannel} from '../services/api'
import {Channel, Routes} from '../types'
import {BasicInfo} from './steps/BasicInfo'
import {RequestMatching} from './steps/RequestMatching'
import {ChannelRoutes} from './steps/routes/ChannelRoutes'
import {BasePageTemplate} from '../../../base-components'

function EditChannelScreen() {
  const navigate = useNavigate()
  const originalChannel = window.history.state as Channel
  const {showAlert, hideAlert} = useAlert()
  const {showBackdrop, hideBackdrop} = useBasicBackdrop()
  const [activeTab, setActiveTab] = React.useState('0')
  const [isFormValid, setIsFormValid] = React.useState(false)
  const [channel, setChannel] = React.useState(structuredClone(originalChannel))
  const mutation = useMutation({
    mutationFn: modifyChannel,
    onMutate: () => {
      showBackdrop(<Loader />, true)
    },
    onSuccess: () => {
      hideBackdrop()
      window.location.href = `/#${Routes.MANAGE_CHANNELS}`
    },
    onError: (error: any) => {
      console.error(error)
      hideBackdrop()
      showAlert(
        'Error editing channel. ' + error?.response?.data,
        'Error',
        'error'
      )
    }
  })

  const handleEditChannel = () => {
    const numOfPrimaryRoutes = channel.routes?.filter(
      route => !!route.primary
    ).length

    if (numOfPrimaryRoutes !== 1) {
      showAlert(
        'Channel must have exactly only 1 primary route.',
        'Error',
        'error'
      )
      return
    }

    mutation.mutate(channel)
  }

  return (
    <BasePageTemplate
      title="Edit Channel"
      subtitle="Control client systems and their access roles. Add clients to enable their request routing and group them by roles for streamlined channel accesss managment."
      breadcrumbs={[{label: 'Channels', href: '/#!/channels'}, {label: 'Edit'}]}
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
                <Tab label="Basic Info" value="0" />
                <Tab label="Request Matching" value="1" />
                <Tab label="Routes" value="2" />
              </TabList>
              <TabPanel value="0">
                <BasicInfo
                  channel={channel}
                  onChange={({channel, isValid}) => {
                    setIsFormValid(isValid)
                    setChannel(channel)
                  }}
                />
              </TabPanel>
              <TabPanel value="1">
                <RequestMatching
                  channel={channel}
                  onChange={({channel, isValid}) => {
                    setIsFormValid(isValid)
                    setChannel(channel)
                  }}
                />
              </TabPanel>
              <TabPanel value="2">
                <ChannelRoutes
                  channel={channel}
                  onChange={({channel, isValid}) => {
                    setIsFormValid(isValid)
                    setChannel(channel)
                  }}
                />
              </TabPanel>
            </TabContext>

            <Divider
              style={{
                marginTop: '10px',
                marginBottom: '10px',
                width: 'calc(100% + 1px)', // Assuming the parent has 0.5px padding on both sides
                marginLeft: '-1px'
              }}
            />

            <Box style={{padding: '10px'}}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => navigate(-1)}
              >
                CANCEL
              </Button>

              <span style={{marginRight: '10px'}}></span>

              <Button
                variant="contained"
                color="primary"
                disabled={
                  mutation.isLoading ||
                  !isFormValid ||
                  JSON.stringify(channel) === JSON.stringify(originalChannel)
                }
                onClick={handleEditChannel}
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

export default EditChannelScreen
