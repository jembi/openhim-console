import {useEffect, useState} from 'react'
import {useForm, FormProvider, Control} from 'react-hook-form'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  styled,
  useMediaQuery,
  useTheme
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import HorizontalLinearStepper from './FormFieldsComponents/FormStepper'
const FormDialog = ({
  edit,
  setOpenEditDialog,
  openDialog,
  setOpenDialog,
  handleApp,
  selectedApp
}) => {
  const [formInputsValues, setInputsValues] = useState(selectedApp || {})
  const [activeStep, setActiveStep] = useState(0)
  const {reset, ...methods} = useForm({
    defaultValues: formInputsValues
  })

  useEffect(() => {
    reset(selectedApp || {})
  }, [selectedApp])

  const onSubmit = async event => {
    event.preventDefault()
    handleApp(methods.getValues())
  }

  const handleDialogClose = () => {
    setOpenDialog(false)
    setOpenEditDialog(false)
    setInputsValues(null)
  }

  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
  const BootstrapDialog = styled(Dialog)(({theme}) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2)
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1)
    }
  }))

  return (
    <>
      <BootstrapDialog
        maxWidth={'lg'}
        open={openDialog}
        onClose={handleDialogClose}
        color="primary"
        aria-labelledby="customized-dialog-title"
        fullScreen={fullScreen}
      >
        <DialogTitle
          sx={{m: 0, p: 2}}
          id="customized-dialog-title"
          width={'480px'}
        >
          <Typography align="center" variant="h5">
            {edit ? 'Edit Portal Item' : 'Add Portal Item'}
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            {edit
              ? 'Use the form below to edit your portal item.'
              : 'Use the form below to add your portal item.'}
          </Typography>
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleDialogClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme => theme.palette.text.primary
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <FormProvider {...methods} reset={reset}>
            <form onSubmit={onSubmit} id="AppForm">
              <HorizontalLinearStepper
                activeStep={activeStep}
                setActiveStep={setActiveStep}
              />
            </form>
          </FormProvider>
        </DialogContent>
        <DialogActions>
          {activeStep === 3 && (
            <>
              <Button variant="outlined" onClick={handleDialogClose}>
                Cancel
              </Button>
              <Button form="AppForm" type="submit" variant="contained">
                {edit ? 'Update App' : 'Add App'}
              </Button>
            </>
          )}
        </DialogActions>
      </BootstrapDialog>
    </>
  )
}
export default FormDialog
