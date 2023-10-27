import {useState} from 'react'
import ReactDOM from 'react-dom'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Typography from '@mui/material/Typography'
import AddIcon from '@mui/icons-material/Add'
import Alert from '@mui/material/Alert'

import {useTheme, styled} from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

import Form from '../CustomForm/Form'
import apiClient from '../../utils/apiClient'

const BootstrapDialog = styled(Dialog)(({theme}) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  }
}))

const AddNewAppDialog = ({apps, setApps}) => {
  /**
   * Determines whether the AddAppDialog should be set to full screen mode or not based on the current breakpoint.
   * @returns {boolean} A boolean value indicating whether the screen is in full screen mode or not.
   */
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

  /**
   * Sets the `open` state to `true` when the dialog is clicked.
   */
  const [open, setOpen] = useState(false)
  const handleClickOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  const FormInitialState = {
    name: '',
    description: '',
    icon: '',
    type: '',
    category: '',
    url: '',
    showInPortal: true,
    showInSideBar: false
  }
  const [appData, setAppData] = useState(FormInitialState)

  /**
   * Adds a new app by making a POST request to the '/apps' endpoint based on the user inputs.
   * If the request is successful, a success message is displayed and the app is added to the list of apps.
   * If the app already exists, an error message is displayed.
   */
  const addNewApp = async e => {
    e.preventDefault()
    appData.name = appData.name.trim()
    appData.description = appData.description.trim()
    appData.url = appData.url.trim()
    try {
      const response = await apiClient.post('/apps', appData)
      const SuccessMessage = (
        <div>
          <Alert severity="success">App was registered successfully</Alert>
        </div>
      )
      ReactDOM.render(
        SuccessMessage,
        document.getElementById('DialogAlertSection')
      )
      setApps([...apps, response.data])
      setAppData(FormInitialState)
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.error.includes('E11000')
      ) {
        const alertMessage = (
          <div>
            <Alert severity="error">App already exists</Alert>
          </div>
        )
        ReactDOM.render(
          alertMessage,
          document.getElementById('DialogAlertSection')
        )
      } else {
        console.log('Error adding app')
        console.log(error.response.data.error)
      }
    }
  }

  return (
    <div>
      <IconButton aria-label="add app" onClick={handleClickOpen}>
        <AddIcon />
      </IconButton>
      <BootstrapDialog
        onClose={handleClose}
        open={open}
        color="#1976d21a"
        aria-labelledby="customized-dialog-title"
        fullScreen={fullScreen}
      >
        <DialogTitle sx={{m: 0, p: 2}} id="customized-dialog-title">
          <Typography align="center" variant="h5">
            Add Portal Item
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            Use the form below to add your portal item.
          </Typography>
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme => theme.palette.text.primary
          }}
        >
          <CloseIcon />
        </IconButton>
        <div id="DialogAlertSection"></div>
        <DialogContent dividers>
          <Form formInputs={appData} setAppData={setAppData}></Form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={addNewApp}>
            Save
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  )
}

export default AddNewAppDialog
