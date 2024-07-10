import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowParams
} from '@mui/x-data-grid'
import {
  Avatar,
  Box,
  Checkbox,
  LinearProgress,
  Stack,
  styled,
  Button,
  Dialog,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
  Stepper,
  Step,
  StepLabel,
  DialogContent,
  DialogActions,
  Divider
} from '@mui/material'
import WarningIcon from '@mui/icons-material/Warning'
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import ErrorIcon from '@mui/icons-material/Error'
import AddIcon from '@mui/icons-material/Add'
import RefreshIcon from '@mui/icons-material/Refresh'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import {useEffect, useRef, useState} from 'react'
import {
  getAllApps,
  deleteApp,
  editApp,
  addApp,
  addImportMap,
  getImportMapByAppId,
  deleteImportMap,
  editImportMap
} from '@jembi/openhim-core-api'
import {enqueueSnackbar} from 'notistack'
import CloseIcon from '@mui/icons-material/Close'
import {Formik} from 'formik'
import ActiveStepZero from './ActiveStepZero'
import ActiveStepOne from './ActiveStepOne'
import ActiveStepTwo from './ActiveStepTwo'
import {AppProps} from './FormInputProps'
import { countdown } from './utils'

const StyledGridOverlay = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%'
}))

const steps = ['Add App details', 'Add App Configuration', 'Choose Icon']

const AppsDataGrid = () => {
  const formInitialState: AppProps = {
    name: '',
    description: '',
    category: '',
    type: 'internal',
    url: '',
    showInPortal: true,
    showInSideBar: false,
    access_roles: ['admin'],
    icon: ''
  }
  //seconds for countdown
  const seconds = 5;

  const [openDialog, setOpenDialog] = useState(false)
  const [loading, setLoading] = useState(true)
  //List of apps saved in mongoDB
  const [apps, setApps] = useState([])
  //Selected app in the data grid.
  const [selectedApp, setSelectedApp] = useState(formInitialState)
  //Steps 0, 1, 2, 3
  const [activeStep, setActiveStep] = useState(0)
  const [skipped, setSkipped] = useState(new Set<number>())
  const [openEditDialog, setOpenEditDialog] = useState(false)
  //Current application in the form when adding or editing
  const [appValues, setAppValues] = useState<AppProps>(formInitialState)
  const [deleteAppData, setDeleteApp] = useState<any>()

  //Get app title
  const [appTitleHelperMessage, setAppTitleHelperMessage] = useState('')
  const appTitleFieldRef = useRef<HTMLInputElement>(null)

  //Get app types
  const [appCategoryHelperMessage, setAppCategoryHelperMessage] = useState('')
  const appCategoryFieldRef = useRef<HTMLInputElement>(null)

  //Get description
  const [appDescriptionHelperMessage, setAppDescriptionHelperMessage] =
    useState('')
  const appDescriptionFieldRef = useRef<HTMLInputElement>(null)

  //Get for the link
  const [appLinkHelperMessage, setAppLinkHelperMessage] = useState('')
  const appLinkFieldRef = useRef<HTMLInputElement>(null)

  //Get access role
  const [appAccessRoleHelperMessage, setAppAccessRoleHelperMessage] =
    useState('')
  const appAccessRoleieldRef = useRef<HTMLInputElement>(null)

  //Warning dialog
  const [openWarningDialog, setOpenWarningDialog] = useState<boolean>(false)
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

  var showInPortal = true
  var showInSideBar = false

  const columns: GridColDef[] = [
    {field: '_id', headerName: 'ID'},
    {
      field: 'icon',
      headerName: 'Icon',
      type: 'string',
      align: 'center',
      width: 35,
      renderCell: params => (
        <Avatar
          variant="rounded"
          aria-label="application icon"
          alt="application icon"
          sx={{backgroundColor: 'gray', width: 32, height: 32}}
        >
          {params.value ? (
            <img
              src={params.value}
              alt={params.row.name.substring(0, 2)}
              width={24}
            />
          ) : (
            <ImageNotSupportedIcon />
          )}
        </Avatar>
      )
    },
    {
      field: 'name',
      headerName: 'Application Name'
    },
    {
      field: 'description',
      headerName: 'Description'
    },
    {
      field: 'category',
      headerName: 'Category',
      type: 'singleSelect',
      valueOptions: ['OpenHIM', 'Operations', 'Reports', 'Other']
    },
    {
      field: 'type',
      headerName: 'Type',
      type: 'singleSelect',
      valueOptions: ['internal', 'external', 'esmodule']
    },
    {
      field: 'url',
      headerName: 'URL'
    },
    {
      field: 'access_roles',
      headerName: 'Access Roles',
      type: 'singleSelect',
      valueOptions: ['admin', 'user']
    },
    {
      field: 'showInPortal',
      headerName: 'Show In Portal',
      type: 'boolean',
      renderCell: params => (
        <Checkbox
          disabled
          checked={params.value}
          icon={<VisibilityOffIcon />}
          checkedIcon={<VisibilityIcon />}
          name="showInPortal"
          inputProps={{'aria-label': 'Show In Side Bar'}}
        />
      )
    },
    {
      field: 'showInSideBar',
      headerName: 'Show In Side Bar',
      type: 'boolean',
      renderCell: params => (
        <Checkbox
          disabled
          checked={params.value}
          icon={<VisibilityOffIcon />}
          checkedIcon={<VisibilityIcon />}
          name="showInSideBar"
          inputProps={{'aria-label': 'Show In Side Bar'}}
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      type: 'actions',
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          id="edit"
          label="Edit"
          onClick={() => {
            setSelectedApp(params.row)
            setOpenEditDialog(true)
            setOpenDialog(true)
          }}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          id="delete"
          label="Delete"
          onClick={() => {
            setDeleteApp(params.row)
            setOpenWarningDialog(true)
          }}
        />
      ]
    }
  ]

  const CustomNoRowsOverlay = () => {
    return (
      <>
        <StyledGridOverlay>
          <ErrorIcon fontSize="large" color="disabled" />
          <Box sx={{m: 1}}>No apps found</Box>
          <Button
            startIcon={<AddIcon />}
            onClick={() => {
              setOpenDialog(true)
              setSelectedApp(formInitialState)
            }}
          >
            Add
          </Button>
        </StyledGridOverlay>
      </>
    )
  }

  // Get all apps from mongoDB
  const loadContent = async () => {
    try {
      setLoading(true)
      await getAllApps().then(apps => {
        setApps(apps)
      })
    } catch (error) {
      enqueueSnackbar('Unable to fetch Apps', {variant: 'error'})
      setApps([])
    } finally {
      setLoading(false)
    }
  }

  // Delete a selected app in mongoDB based on the id.
  // Will reload the window
  const handleDeleteApp = async id => {
    try {
      await deleteApp(id)

      loadContent()
      enqueueSnackbar('App was deleted successfully', {variant: 'success'})
      if (deleteAppData.type === 'esmodule') {
        await countdown(seconds, (remainingSeconds) => {
          enqueueSnackbar(
            `The app will have to reload in ${remainingSeconds} seconds.`,
            {
              variant: 'info'
            }
          )
        }
        );
        
        window.location.reload()
      }
    } catch (error) {
      enqueueSnackbar('Failed to delete app', {variant: 'error'})
    }
  }

  // Called when closing the form dialog
  // Reset active step
  // Reset initial form value
  const handleDialogClose = () => {
    setOpenDialog(false)
    setOpenEditDialog(false)
    setActiveStep(0)
    setSelectedApp(formInitialState)
  }

  // Edit selected application
  // Will reload window
  const handleEditApp = async data => {
    if (validateData()) {
      try {
        const editDataResult = await editApp(data._id, data)

        loadContent()
        enqueueSnackbar('App was updated successfully', {variant: 'success'})
        setSelectedApp(formInitialState)
        if (data.type === 'esmodule') {
          await countdown(seconds, (remainingSeconds) => {
            enqueueSnackbar(
              `The app will have to reload in ${remainingSeconds} seconds.`,
              {
                variant: 'info'
              }
            )
          });
          window.location.reload()
        }
      } catch (error) {
        enqueueSnackbar('Failed to edit app! ' + error.response.data.error, {
          variant: 'error'
        })
        console.error('Error editing app', error)
      } finally {
        setOpenDialog(false)
        setOpenEditDialog(false)
        setActiveStep(0)
      }
    } else {
      enqueueSnackbar('Invalidate Data ', {
        variant: 'error'
      })
      setOpenDialog(false)
      setOpenEditDialog(false)
      setActiveStep(0)
    }
  }

  // Add new aplication
  // Will reload the window
  // Reset active step to 0
  // Close the form dialog
  const handleAddApp = async data => {
    try {
      data.name = data.name.trim()
      data.description = data.description.trim()
      data.url = data.url.trim()

      await addApp(data)

      enqueueSnackbar('App was registered successfully', {variant: 'success'})
      setOpenDialog(false)
      setActiveStep(0)
      setSelectedApp(formInitialState)
      loadContent()
      if (data.type === 'esmodule') {
        await countdown(seconds, (remainingSeconds) =>
          enqueueSnackbar(
            `The app will have to reload in ${remainingSeconds} seconds.`,
            {
              variant: 'info'
            }
          ));
        window.location.reload()
      }
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.error.includes('E11000')
      ) {
        enqueueSnackbar('App already exists', {variant: 'error'})
      } else {
        enqueueSnackbar('Failed to add app ! ' + error.response.data?.error, {
          variant: 'error'
        })
      }
    }
  }

  // Check for actions: Edit or Add
  const handleApp = async () => {
    if (openEditDialog) {
      handleEditApp(selectedApp)
    } else {
      handleAddApp(appValues)
    }
  }

  // UseState is not updating the state imediately for our use case.
  // We are currently using our own setter function to get data immediately.
  // UseState is not updating the state imediately for our use case.
  // We are currently using our own setter function to get data immediately.
  // Function is called inside ActiveStepTwo to set the icon url on button toggle
  // In addition it is used to set the url when adding custom icon.
  const updateIcon = (icon: any) => {
    
    appValues.icon = icon as string

    if(openEditDialog){
      selectedApp.icon = icon as string
    }
    

  }

  const isStepOptional = (step: number) => {
    return step === 2
  }

  const isStepSkipped = (step: number) => {
    return skipped.has(step)
  }

  const validateData = () => {

    if (activeStep === 0) {
      const apptTitleValue = appTitleFieldRef.current.value
      const appCategoryValue = appCategoryFieldRef.current.value
      const appDescriptionValue = appDescriptionFieldRef.current.value

      if (!appCategoryValue) {
        setAppCategoryHelperMessage(
          'Category is required. Select one of the categories'
        )
        return false
      } else if (!apptTitleValue) {
        setAppTitleHelperMessage(
          'App Title is required. Type a title between 3-25 characters'
        )
        return false
      } else if (apptTitleValue.length < 3) {
        setAppTitleHelperMessage(
          'Application title should be at least 3 characters long'
        )
      } else if (apptTitleValue.length > 25) {
        setAppTitleHelperMessage(
          'Application title should be at most 25 characters long'
        )
        return false
      } else if (appDescriptionValue.length > 70) {
        setAppDescriptionHelperMessage(
          'Description should be at most 70 characters long'
        )
        return false
      } else {
        appValues.description = appDescriptionValue
        return true
      }
    }

    if (activeStep === 1) {
      const appLinkValue = appLinkFieldRef?.current?.value?.trim()
      const regExp =
        /^(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(:[0-9]+)?(\/[a-zA-Z0-9-._~:\/?#[\]@!$&'()*+,;=]*)*$/

      const accessRoleValue = Array.from(appAccessRoleieldRef.current.value)

      if (!appLinkValue) {
        setAppLinkHelperMessage('App Link is required')
        return false
      } else if (!regExp.test(appLinkValue)) {
        setAppLinkHelperMessage('Invalid URL')
        return false
      } else if (accessRoleValue.length === 0) {
        setAppAccessRoleHelperMessage('User Access Role is required')
        return false
      } else {
        appValues.url = appLinkValue
        return true
      }
    }
    if(activeStep === 3){
      return true;
    }
  }
  // Function is called to increment activeStep
  // Validate the form before going to the next steps
  // Validation is performed with the actual input value from the DOM. Hence we use "useRef"
  // Set the app URL to avoid delay with useState.
  const handleNext = () => {
    let newSkipped = skipped
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values())
      newSkipped.delete(activeStep)
    }

    if (validateData()) {
      setActiveStep(activeStep + 1)
      setSkipped(newSkipped)
    }

    if (activeStep === 2) {
      setActiveStep(activeStep + 1)
      setSkipped(newSkipped)
    }
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      throw new Error("You can't skip a step that isn't optional.")
    }

    setActiveStep(prevActiveStep => prevActiveStep + 1)
    setSkipped(prevSkipped => {
      const newSkipped = new Set(prevSkipped.values())
      newSkipped.add(activeStep)
      return newSkipped
    })
  }

  const handleReset = () => {
    setActiveStep(0)
  }

  useEffect(() => {
    loadContent()
    if (activeStep === steps.length) {
      setActiveStep(0)
    }
  }, [])

  // UseState is not updating the state imediately for our use case.
  // We are currently using our own setter function to get data immediately.
  const setShowInPortalValue = (value: boolean) => {
    showInPortal = value
    return showInPortal
  }

  const setShowInSideBarValue = (value: boolean) => {
    showInSideBar = value
    return showInSideBar
  }

  // TODO: Handle formik onChange function better
  // PROBLEM: Formik is not updating state on change imediately. In our context we ware using data right after inputing it.
  // Which cause data value to reflext previous data instead of current data in the DOM.
  // SOLUTION: Create another function that update the state immediately.
  // Once a change is performed in the DOM we make the change to the state manually.
  const handleFormChanges = (values: AppProps) => {
    values.showInPortal = showInPortal
    values.showInSideBar = showInSideBar

    //sometime user copy and paste the URL
    //We want to get the exact url without waiting for the state to rerender
    if (openEditDialog) {
      setSelectedApp(values)
    } else {
      setAppValues(values)
    }
  }

  // When adding a custom icon than what provided in the form this function is called to set the icon url.
  const handleFileRead = async ({target}) => {
    const file = target.files[0]
    if (!file) {
      enqueueSnackbar('No file selected', {variant: 'error'})
      return
    }
    if (file && file.size > 50000) {
      // Handle error when file size exceeds 3kb
      enqueueSnackbar('File size exceeds 50kb', {variant: 'error'})
      return
    }
    try {
      const base64 = await convertBase64(file)
      updateIcon(base64)
    } catch (error) {
      console.error('Error reading file:', error)
      enqueueSnackbar('Error reading file', {variant: 'error'})
      // handle error in input component
    }
  }

  // Convert the image uploaded to base64 and save it.
  const convertBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.readAsDataURL(file)
      fileReader.onload = () => {
        resolve(fileReader.result)
      }
      fileReader.onerror = error => {
        reject(error)
      }
    })
  }

  return (
    <>
      <Box paddingX={0}>
        <section id="apps-toolbar">
          <Stack direction="row" spacing={2} p={2} justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={loadContent}
              startIcon={<RefreshIcon />}
            >
              Refresh
            </Button>
            <Button
              aria-label="add app"
              onClick={() => {
                setOpenDialog(true)
                setSelectedApp(formInitialState)
              }}
              size="small"
              color="primary"
              variant="contained"
              startIcon={<AddIcon />}
            >
              ADD
            </Button>
          </Stack>
        </section>
        <Box sx={{height: '100%', width: '100%'}}>
          <DataGrid
            columnVisibilityModel={{
              // Hide _id column, the other columns will remain visible
              _id: false
            }}
            getRowId={(row: any) => row._id}
            autoHeight
            rows={apps}
            columns={columns}
            slots={{
              loadingOverlay: LinearProgress,
              noRowsOverlay: CustomNoRowsOverlay
            }}
            loading={loading}
            disableRowSelectionOnClick
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10
                }
              }
            }}
            pageSizeOptions={[10]}
          />
        </Box>
      </Box>

      <Dialog
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
          minWidth={'480px'}
        >
          <Stack direction={'row'}>
            <Grid
              container
              direction={'column'}
              justifyContent={'center'}
              alignItems={'center'}
              sx={{flexGrow: 1}}
            >
              <Typography align="center" variant="h5">
                {openEditDialog ? 'Edit Portal Item' : 'Add Portal Item'}
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                {openEditDialog
                  ? 'Use the form below to edit your portal item.'
                  : 'Use the form below to add your portal item.'}
              </Typography>
            </Grid>

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
          </Stack>

          <Stepper activeStep={activeStep} alternativeLabel sx={{mt: 2}}>
            {steps.map((label, index) => {
              const stepProps: {completed?: boolean} = {}
              const labelProps: {
                optional?: React.ReactNode
              } = {}
              if (isStepOptional(index)) {
                labelProps.optional = (
                  <Typography variant="caption">Optional</Typography>
                )
              }
              if (isStepSkipped(index)) {
                stepProps.completed = false
              }
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              )
            })}
          </Stepper>
        </DialogTitle>
        <DialogContent>
          {/*
                            ActiveStep 0:
                                1. Radio button
                                2. Text Fields
                                3. Select display
                            ActiveStep 1:
                                1. Text Fields
                                2. Visibilty Setting: portal and sidebar
                            ActiveStep 2:
                                1. Icons
                            ActiveStep 3:
                                1. Completion message and reset button
                        */}

          <Formik initialValues={selectedApp} onSubmit={handleApp}>
            {({values, handleChange}) => {
              return (
                <>
                  <Stack spacing={2}>
                    {activeStep === 0 && (
                      <>
                        <ActiveStepZero
                          values={values}
                          handleChange={handleChange}
                          handleFormChanges={handleFormChanges}
                          setAppCategoryHelperMessage={
                            setAppCategoryHelperMessage
                          }
                          setAppTitleHelperMessage={setAppTitleHelperMessage}
                          setAppDescriptionHelperMessage={
                            setAppDescriptionHelperMessage
                          }
                          appCategoryFieldRef={appCategoryFieldRef}
                          appCategoryHelperMessage={appCategoryHelperMessage}
                          appTitleFieldRef={appTitleFieldRef}
                          appTitleHelperMessage={appTitleHelperMessage}
                          appDescriptionHelperMessage={
                            appDescriptionHelperMessage
                          }
                          appDescriptionFieldRef={appDescriptionFieldRef}
                        />
                      </>
                    )}

                    {activeStep === 1 && (
                      <>
                        <ActiveStepOne
                          appLinkFieldRef={appLinkFieldRef}
                          values={values}
                          handleChange={handleChange}
                          handleFormChanges={handleFormChanges}
                          setAppLinkHelperMessage={setAppLinkHelperMessage}
                          setAppAccessRoleHelperMessage={
                            setAppAccessRoleHelperMessage
                          }
                          appLinkHelperMessage={appLinkHelperMessage}
                          appAccessRoleieldRef={appAccessRoleieldRef}
                          appAccessRoleHelperMessage={
                            appAccessRoleHelperMessage
                          }
                          setShowInPortalValue={setShowInPortalValue}
                          setShowInSideBarValue={setShowInSideBarValue}
                        />
                      </>
                    )}

                    {activeStep === 2 && (
                      <ActiveStepTwo
                        updateIcon={updateIcon}
                        handleFileRead={handleFileRead}
                      />
                    )}

                    {activeStep === steps.length && (
                      <>
                        <Typography
                          sx={{
                            mt: 2,
                            mb: 1,
                            alignContent: 'center',
                            textAlign: 'center'
                          }}
                        >
                          All steps completed
                        </Typography>
                        <Box
                          sx={{display: 'flex', flexDirection: 'row', pt: 2}}
                        >
                          <Box sx={{flex: '1 1 auto'}} />
                          <Button onClick={handleReset} variant="text">
                            Reset
                          </Button>
                        </Box>
                      </>
                    )}
                  </Stack>
                </>
              )
            }}
          </Formik>
        </DialogContent>

        <DialogActions
          style={{display: 'flex', justifyContent: 'space-between'}}
        >
          {activeStep < steps.length && (
            <>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{mr: 1}}
                variant="outlined"
              >
                Back
              </Button>
              <Box>
                {isStepOptional(activeStep) && (
                  <Button color="inherit" onClick={handleSkip} sx={{mr: 1}}>
                    Skip
                  </Button>
                )}
                {activeStep === steps.length ? (
                  <Button form="AppForm" type="submit" variant="contained">
                    Confirm
                  </Button>
                ) : (
                  <Button onClick={handleNext} variant="outlined">
                    Continue
                  </Button>
                )}

                {openEditDialog && activeStep < 2 && (
                  <Button onClick={handleApp} variant="contained" sx={{ml: 1}}>
                    Update
                  </Button>
                )}
              </Box>
            </>
          )}

          {/* An empty box outside of the button box is needed to enforce the right position of the box belo */}
          {activeStep === 3 && <Box />}

          {activeStep === 3 && (
            <Box>
              <Button
                variant="outlined"
                onClick={handleDialogClose}
                sx={{mr: 1}}
              >
                Cancel
              </Button>
              <Button
                form="AppForm"
                type="submit"
                variant="contained"
                onClick={handleApp}
              >
                {openEditDialog ? 'Update' : 'Add App'}
              </Button>
            </Box>
          )}
        </DialogActions>
      </Dialog>

      <Dialog
        open={openWarningDialog}
        onClose={() => {
          setOpenWarningDialog(false)
        }}
        color="primary"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth={'sm'}
        fullWidth={true}
      >
        <DialogTitle>
          <Stack direction={'row'} spacing={1}>
            <WarningIcon sx={{color: 'red', width: 30, height: 30}} />
            <Typography sx={{fontWeight: 'bold', fontSize: '20px'}}>
              Delete Application
            </Typography>
          </Stack>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{p: 2}}>
          <Typography variant="h6">
            {`Are you sure you want to delete the application ${deleteAppData?.name}? This action is irreversible and will permanently remove all associated data.`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="text"
            onClick={() => {
              setOpenWarningDialog(false)
            }}
            sx={{mr: 1, color: 'black'}}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              setOpenWarningDialog(false)
              handleDeleteApp(deleteAppData?._id)
            }}
          >
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default AppsDataGrid
