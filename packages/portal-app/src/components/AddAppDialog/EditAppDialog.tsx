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
import EditIcon from '@mui/icons-material/Edit'
import Alert from '@mui/material/Alert'
import {Box, Stack} from '@mui/material'
import {useTheme, styled} from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import {useForm, FormProvider} from 'react-hook-form'
import {updateApp} from '../../utils/apiClient'
import FormFields from '../FormFields/FormFields'
import AlertSection from '../AlertSection/AlertSection'
import {forwardRef, useImperativeHandle, useRef} from 'react'

const BootstrapDialog = styled(Dialog)(({theme}) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  }
}))

const EditNewAppDialog = forwardRef((app: any, ref) => {
  /**
   * Determines whether the AddAppDialog should be set to full screen mode or not based on the current breakpoint.
   * @returns {boolean} A boolean value indicating whether the screen is in full screen mode or not.
   */
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

  const [open_, setOpen] = useState(Boolean(false))
  const handleClickOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  const actionsMenuRef = useRef()
  useImperativeHandle(
    ref,
    () => {
      return {
        handleClickOpen: handleClickOpen
      }
    },
    []
  )

  const [alertState, setAlertState] = useState(null)
  const FormInitialState = app.app

  const [appData, setAppData] = useState(FormInitialState)

  const editApp = async appData => {
    try {
      const updatedApp = await updateApp(appData._id, appData)
      setAlertState(null)
      const SuccessMessage = (
        <Box paddingBottom={5}>
          <Alert severity="success">App was registered successfully</Alert>
        </Box>
      )
      ReactDOM.render(SuccessMessage, document.getElementById('alertSection'))
      setOpen(false)
      setAppData(FormInitialState)
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.error.includes('E11000')
      ) {
        setAlertState({
          severity: 'error',
          message: 'App already exists'
        })
      } else {
        setAlertState({
          severity: 'error',
          message: 'Failed to Edit app. Please try again.'
        })
      }
    }
  }

  const methods = useForm({
    defaultValues: FormInitialState
  })
  const onSubmit = data => {
    editApp(data)
  }

  return (
    <div>
      <EditIcon fontSize="small" onClick={handleClickOpen} />
      <BootstrapDialog
        onClose={handleClose}
        open={open_}
        color="#1976d21a"
        aria-labelledby="customized-dialog-title"
        fullScreen={fullScreen}
        {...app}
        ref={actionsMenuRef}
      >
        <DialogTitle sx={{m: 0, p: 2}} id="customized-dialog-title">
          <Typography align="center" variant="h5">
            Edit Portal Item
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            Use the form below to edit your portal item.
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
        {alertState && <AlertSection {...alertState} />}
        <DialogContent dividers>
          <FormProvider {...methods}>
            <form id="EditAppForm" onSubmit={methods.handleSubmit(onSubmit)}>
              <Stack spacing={2} minWidth={538}>
                <FormFields />
              </Stack>
            </form>
          </FormProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button form="EditAppForm" type="submit" variant="contained">
            Update
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  )
})

export default EditNewAppDialog
