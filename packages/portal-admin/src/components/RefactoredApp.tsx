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
    FormControl,
    FormLabel,
    FormControlLabel,
    Radio,
    RadioGroup,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    FormGroup,
    Switch,
    Icon,
    FormHelperText,
    Divider

} from '@mui/material'
import WarningIcon from '@mui/icons-material/Warning';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import ErrorIcon from '@mui/icons-material/Error'
import AddIcon from '@mui/icons-material/Add'
import RefreshIcon from '@mui/icons-material/Refresh'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { useEffect, useRef, useState } from 'react'
import { getAllApps, deleteApp, editApp, addApp } from '@jembi/openhim-core-api'
import { enqueueSnackbar } from 'notistack'
import CloseIcon from '@mui/icons-material/Close'
import { Formik } from 'formik'
// import { Controller, useFormContext } from 'react-hook-form'
import IconToggleButton from './FormFieldsComponents/IconToggleButton'
import { z } from 'zod';

const StyledGridOverlay = styled('div')(() => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
}))

const steps = ['Add App details', 'Add App Configuration', 'Choose Icon']
type ModuleTypes = "internal" | "esmodule" | "external"

interface AppProps {
    name: string,
    description: string,
    category: string,
    type: ModuleTypes,
    url: string,
    showInPortal: boolean,
    showInSideBar: boolean,
    access_roles: string[]
}

const RefactoredApp = () => {
    const formInitialState: AppProps = {
        name: '',
        description: '',
        category: '',
        type: 'internal',
        url: '',
        showInPortal: true,
        showInSideBar: false,
        access_roles: ['admin']
    }

    const [openDialog, setOpenDialog] = useState(false)
    const [loading, setLoading] = useState(true)
    const [apps, setApps] = useState([])
    const [selectedApp, setSelectedApp] = useState(formInitialState)
    const [activeStep, setActiveStep] = useState(0)
    const [skipped, setSkipped] = useState(new Set<number>())
    const [openEditDialog, setOpenEditDialog] = useState(false)
    const [typeCheck, setTypeCheck] = useState<ModuleTypes>("internal")
    const [displayIcon, setDisplayIcon] = useState(false)
    const [appIcon, setAppIcon] = useState(null)
    const [appValues, setAppValues] = useState<AppProps>(formInitialState)
    const [deleteAppData, setDeleteApp] = useState<any>()
    //Validation
    //Check app text
    const [appTitleHelperMessage, setAppTitleHelperMessage] = useState('')
    const appTitleLengthSchema = z.string().min(3, 'Application title should be at least 3 characters long').max(25, 'Application title should be at most 25 characters long');
    const appTitleFieldRef = useRef<HTMLInputElement>(null);

    //Check app types
    const [appCategoryHelperMessage, setAppCategoryHelperMessage] = useState('')
    const appCategoryFieldRef = useRef<HTMLInputElement>(null);

    //Check description
    const [appDescriptionHelperMessage, setAppDescriptionHelperMessage] = useState('')
    const appDescriptionFieldRef = useRef<HTMLInputElement>(null);

    //Check for the link
    const [appLinkHelperMessage, setAppLinkHelperMessage] = useState('')
    const appLinkFieldRef = useRef<HTMLInputElement>(null);

    //Check access role
    const [appAccessRoleHelperMessage, setAppAccessRoleHelperMessage] = useState('')
    const appAccessRoleieldRef = useRef<HTMLInputElement>(null);


    //Warning dialog
    const [openWarningDialog, setOpenWarningDialog] = useState<boolean>(false)
    const theme = useTheme()
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

    const columns: GridColDef[] = [
        { field: '_id', headerName: 'ID' },
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
                    sx={{ backgroundColor: 'gray', width: 32, height: 32 }}
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
                    inputProps={{ 'aria-label': 'Show In Side Bar' }}
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
                    inputProps={{ 'aria-label': 'Show In Side Bar' }}
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
                        setOpenEditDialog(true)
                        setOpenDialog(true)
                        setSelectedApp(params.row)
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
                    <Box sx={{ m: 1 }}>No apps found</Box>
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

    const loadContent = async () => {
        try {
            setLoading(true)
            await getAllApps().then(apps => {
                setApps(apps)
            })
        } catch (error) {
            enqueueSnackbar('Unable to fetch Apps', { variant: 'error' })
            setApps([])
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteApp = async id => {
        try {
            await deleteApp(id)
            loadContent()
            enqueueSnackbar('App was deleted successfully', { variant: 'success' })
        } catch (error) {
            enqueueSnackbar('Failed to delete app', { variant: 'error' })
        }
    }

    const handleDialogClose = () => {
        setOpenDialog(false)
        setOpenEditDialog(false)
        setSelectedApp(null)
    }

    const handleEditApp = async data => {
        try {
            await editApp(data._id, data)
            loadContent()
            enqueueSnackbar('App was updated successfully', { variant: 'success' })
            setSelectedApp(formInitialState)
        } catch (error) {
            enqueueSnackbar('Failed to edit app! ' + error.response.data.error, {
                variant: 'error'
            })
            console.error(error)
        } finally {
            setOpenDialog(false)
            setOpenEditDialog(false)
        }
    }

    const handleAddApp = async data => {
        try {
            data.name = data.name.trim()
            data.description = data.description.trim()
            data.url = data.url.trim()

            await addApp(data)
            enqueueSnackbar('App was registered successfully', { variant: 'success' })
            setOpenDialog(false)
            setSelectedApp(formInitialState)
            loadContent()
        } catch (error) {
            if (
                error.response &&
                error.response.status === 400 &&
                error.response.data.error.includes('E11000')
            ) {
                enqueueSnackbar('App already exists', { variant: 'error' })
            } else {
                enqueueSnackbar('Failed to add app ! ' + error.response.data?.error, {
                    variant: 'error'
                })
            }
        }
    }

    const handleApp = async () => {
        if (openEditDialog) {
            handleEditApp(appValues)
        } else {
            handleAddApp(appValues)
        }
    }

    //STEPPER - START
    const isStepOptional = (step: number) => {
        return step === 2
    }

    const isStepSkipped = (step: number) => {
        return skipped.has(step)
    }

    const handleNext = () => {
        let newSkipped = skipped
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values())
            newSkipped.delete(activeStep)
        }

        if (activeStep === 0) {
            try {
                const apptileValue = appTitleFieldRef.current.value
                const appCategoryValue = appCategoryFieldRef.current.value
                const appDescriptionValue = appDescriptionFieldRef.current.value

                if (!appCategoryValue) {
                    setAppCategoryHelperMessage("Category is required. Select one of the categories")
                }
                else if (!apptileValue) {
                    setAppTitleHelperMessage('App Title is required. Type a title between 3-25 characters')
                }
                else if (appDescriptionValue.length > 70) {
                    setAppDescriptionHelperMessage('Description should be at most 70 characters long')
                }
                else {
                    appTitleLengthSchema.parse(apptileValue)
                    setActiveStep(activeStep + 1)
                    setSkipped(newSkipped)
                }


            } catch (e) {
                setAppTitleHelperMessage(JSON.parse(e.message)[0].message)
            }
        }

        if (activeStep === 1) {

            const appLinkValue = appLinkFieldRef.current.value.trim()
            const regExp = /^(?:https?:\/\/)?(?:localhost|www\.\w+|(?:[\w-]+(?:\.\w+){1,2}))(?::\d+)?(?:\/.*)?$/

            const accessRoleValue = Array.from(appAccessRoleieldRef.current.value)

            console.log("Type: " + accessRoleValue)

            if (!appLinkValue) {
                setAppLinkHelperMessage('App Link is required')
            }
            else if (!regExp.test(appLinkValue)) {
                console.log(regExp.test(appLinkValue))
                setAppLinkHelperMessage('Invalid URL')

            }
            else if (accessRoleValue.length === 0) {
                setAppAccessRoleHelperMessage('User Access Role is required')
            }
            else {
                console.log("Here")
                setActiveStep(activeStep + 1)
                setSkipped(newSkipped)
            }

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
            // You probably want to guard against something like this,
            // it should never occur unless someone's actively trying to break something.
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

    //STEPPER - END

    useEffect(() => {
        loadContent()
    }, [])

    const handleFormChanges = (values: AppProps) => {
        setAppValues(values)
    }

    const radioButtonOptions = [
        {
            label: 'Local App',
            value: 'internal'
        },
        {
            label: 'External App',
            value: 'external'
        },
        {
            label: 'Micro-frontend',
            value: 'esmodule'
        }
    ]

    const categoryOptions = [
        {
            label: 'OpenHIM',
            value: 'OpenHIM'
        },
        {
            label: 'Operations',
            value: 'Operations'
        },
        {
            label: 'HIE Configuration',
            value: 'HIE Configuration'
        },
        {
            label: 'Other',
            value: 'Other'
        }
    ]

    const accessRoleOptions = [
        {
            label: 'Super Admin',
            value: 'admin'
        },
        {
            label: 'Basic User',
            value: 'user'
        }
    ]

    const generateRadioOptions = options =>
        options.map(option => {
            return (
                <FormControlLabel
                    key={option.value}
                    value={option.value}
                    label={option.label}
                    control={<Radio />}
                />
            )
        })
    const generateSingleOptions = (options) => {
        if (!options) {
            return null
        }
        return options.map((option: any) => {
            return (
                <MenuItem key={option.value} value={option.value as string}>
                    {option.label}
                </MenuItem>
            )
        })
    }


    //WATCH OUT THIS MIGHT NOT WORK

    const handleFileRead = async ({ target }) => {
        const file = target.files[0]
        if (!file) {
            enqueueSnackbar('No file selected', { variant: 'error' })
            return
        }
        if (file && file.size > 50000) {
            // Handle error when file size exceeds 3kb
            enqueueSnackbar('File size exceeds 50kb', { variant: 'error' })
            return
        }
        try {
            const base64 = await convertBase64(file)
            // Set the value of the 'icon' field using react-hook-form
            setAppIcon(base64)
        } catch (error) {
            console.error('Error reading file:', error)
            enqueueSnackbar('Error reading file', { variant: 'error' })
            // handle error in input component
        }
    }

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
                <Box sx={{ height: '100%', width: '100%' }}>
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
                fullScreen={fullScreen}>
                <DialogTitle
                    sx={{ m: 0, p: 2 }}
                    id="customized-dialog-title"
                    minWidth={"480px"}
                >
                    <Stack direction={"row"}>
                        <Grid container direction={"column"} justifyContent={'center'} alignItems={'center'} sx={{ flexGrow: 1 }}>
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

                    <Stepper activeStep={activeStep} alternativeLabel sx={{ mt: 2 }}>
                        {steps.map((label, index) => {
                            const stepProps: { completed?: boolean } = {}
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

                    <Formik
                        initialValues={
                            formInitialState
                        }
                        onSubmit={handleApp}
                    >

                        {({ values, handleChange }) => {
                            return (
                                <>
                                    <Stack spacing={2}>
                                        {activeStep === 0 && (
                                            <>
                                                <FormControl fullWidth component="fieldset" required>
                                                    <FormLabel required component="legend">
                                                        {'What is the type of your app?'}
                                                    </FormLabel>
                                                    <RadioGroup
                                                        id={"type"}
                                                        name={"type"}
                                                        row
                                                        value={values.type}
                                                        onChange={(e) => {
                                                            handleChange(e)
                                                            handleFormChanges(values)
                                                        }}
                                                    >
                                                        {generateRadioOptions(radioButtonOptions)}

                                                    </RadioGroup>
                                                </FormControl>
                                                <FormControl fullWidth required sx={{ mt: 1 }}>
                                                    <InputLabel>{"category"}</InputLabel>
                                                    <Select
                                                        margin="dense"
                                                        fullWidth
                                                        inputRef={appCategoryFieldRef}
                                                        onChange={(e) => {
                                                            handleChange(e)
                                                            handleFormChanges(values)
                                                            setAppCategoryHelperMessage('')
                                                        }}
                                                        id={"category"}
                                                        error={appCategoryHelperMessage ? true : false}
                                                        name={"category"}
                                                        value={values.category}
                                                        label={"category"}
                                                    >
                                                        {generateSingleOptions(categoryOptions)}

                                                    </Select>
                                                    <FormHelperText error={appCategoryHelperMessage ? true : false}>{appCategoryHelperMessage}</FormHelperText>
                                                </FormControl>
                                                <TextField
                                                    margin="dense"
                                                    value={values.name}
                                                    id="name"
                                                    inputRef={appTitleFieldRef}
                                                    label="App Title"
                                                    type="text"
                                                    fullWidth
                                                    variant="outlined"
                                                    required
                                                    name="name"
                                                    onChange={(e) => {
                                                        handleChange(e)
                                                        handleFormChanges(values)
                                                        setAppTitleHelperMessage('')
                                                    }}
                                                    error={appTitleHelperMessage ? true : false}
                                                    helperText={appTitleHelperMessage}
                                                />
                                                <TextField
                                                    margin="dense"
                                                    multiline
                                                    inputRef={appDescriptionFieldRef}
                                                    id="description"
                                                    label="Description"
                                                    type="text"
                                                    fullWidth
                                                    variant="outlined"
                                                    name="description"
                                                    value={values.description}
                                                    onChange={(e) => {
                                                        handleChange(e)
                                                        handleFormChanges(values)
                                                        setAppDescriptionHelperMessage('')
                                                    }}
                                                    error={appDescriptionHelperMessage ? true : false}
                                                    helperText={appDescriptionHelperMessage}
                                                />
                                            </>
                                        )
                                        }

                                        {activeStep === 1 && (
                                            <>
                                                {values.type === 'esmodule' && (
                                                    <TextField
                                                        margin="dense"
                                                        multiline
                                                        id="url"
                                                        label="Bundle URL"
                                                        type="url"
                                                        required
                                                        inputRef={appLinkFieldRef}
                                                        fullWidth
                                                        variant="outlined"
                                                        name="url"
                                                        value={values.url}
                                                        onChange={(e) => {
                                                            handleChange(e)
                                                            handleFormChanges(values)
                                                            setAppLinkHelperMessage('')
                                                        }}
                                                        error={appLinkHelperMessage ? true : false}
                                                        helperText={appLinkHelperMessage}
                                                    />
                                                )}
                                                {(values.type === 'internal' || values.type === 'external') && (
                                                    <TextField
                                                        margin="dense"
                                                        multiline
                                                        id="page"
                                                        inputRef={appLinkFieldRef}
                                                        label="Link"
                                                        value={values.url}
                                                        fullWidth
                                                        required
                                                        variant="outlined"
                                                        name="url"
                                                        onChange={(e) => {
                                                            handleChange(e)
                                                            handleFormChanges(values)
                                                            setAppLinkHelperMessage('')
                                                        }}
                                                        error={appLinkHelperMessage ? true : false}
                                                        helperText={appLinkHelperMessage}
                                                    />
                                                )}
                                                <FormControl fullWidth required sx={{ mt: 1 }}>
                                                    <InputLabel>{"Access Roles"}</InputLabel>
                                                    <Select
                                                        margin="dense"
                                                        fullWidth
                                                        inputRef={appAccessRoleieldRef}
                                                        onChange={(e) => {
                                                            handleChange(e)
                                                            handleFormChanges(values)
                                                            setAppAccessRoleHelperMessage('')
                                                        }}
                                                        id={"access_roles"}
                                                        name={"access_roles"}
                                                        value={values.access_roles}
                                                        label={"Access Roles"}
                                                        multiple
                                                        error={appAccessRoleHelperMessage ? true : false}

                                                    >
                                                        {generateSingleOptions(accessRoleOptions)}
                                                    </Select>
                                                    <FormHelperText error={appAccessRoleHelperMessage ? true : false}>{appAccessRoleHelperMessage}</FormHelperText>
                                                </FormControl>

                                                <FormGroup sx={{ mt: 2 }}>
                                                    <FormLabel component="legend">Visibility Settings</FormLabel>
                                                    <FormControlLabel
                                                        control={
                                                            <Switch
                                                                name="showInPortal"
                                                                id="showInPortal"
                                                                sx={{ '& .MuiSvgIcon-root': { fontSize: 18 } }}
                                                                onChange={(e) => {
                                                                    handleChange(e)
                                                                    handleFormChanges(values)
                                                                }}
                                                                value={values.showInPortal}
                                                            />
                                                        }
                                                        label="Display in Portal Apps Shelf"
                                                    />
                                                    <FormControlLabel
                                                        control={
                                                            <Switch
                                                                name="showInSideBar"
                                                                id="showInSideBar"
                                                                sx={{ '& .MuiSvgIcon-root': { fontSize: 18 } }}
                                                                onChange={(e) => {
                                                                    handleChange(e)
                                                                    handleFormChanges(values)
                                                                }}
                                                                value={values.showInSideBar}
                                                            />
                                                        }
                                                        label="Display in Sidebar Menu"
                                                    />
                                                </FormGroup>
                                            </>
                                        )}

                                        {activeStep === 2 && (
                                            <Stack id="step-3">
                                                <FormControl
                                                    sx={{ m: 1, alignItems: 'center' }}
                                                    component="fieldset"
                                                    variant="standard"
                                                >
                                                    <FormLabel component="label">Icon Settings</FormLabel>
                                                    <IconToggleButton setAppIcon={setAppIcon} />
                                                </FormControl>
                                                <Button
                                                    variant="text"
                                                    onClick={() => {
                                                        setDisplayIcon(true)
                                                    }}
                                                >
                                                    Or upload your own custom icon
                                                </Button>
                                                {displayIcon ? (
                                                    <div>
                                                        <input
                                                            hidden
                                                            id="icon"
                                                            type="url"
                                                            name="icon"
                                                        // {...register('icon')}
                                                        />
                                                        <TextField
                                                            focused
                                                            margin="dense"
                                                            id="icon-file"
                                                            name="icon-file"
                                                            type="file"
                                                            label="Application Icon"
                                                            size="small"
                                                            variant="outlined"
                                                            fullWidth
                                                            inputProps={{ accept: 'image/*' }}
                                                            onChange={e => handleFileRead(e)}
                                                        />
                                                    </div>
                                                ) : null}
                                            </Stack>
                                        )}

                                        {activeStep === steps.length && (
                                            <>
                                                <Typography
                                                    sx={{ mt: 2, mb: 1, alignContent: 'center', textAlign: 'center' }}
                                                >
                                                    All steps completed
                                                </Typography>
                                                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                                    <Box sx={{ flex: '1 1 auto' }} />
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

                <DialogActions style={{ display: 'flex', justifyContent: 'space-between' }}>

                    {activeStep < steps.length && (
                        <>
                            <Button
                                disabled={activeStep === 0}
                                onClick={handleBack}
                                sx={{ mr: 1 }}
                                variant="outlined"
                            >
                                Back
                            </Button>
                            <Box>
                                {isStepOptional(activeStep) && (
                                    <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
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
                            </Box></>
                    )}

                    {/* An empty box outside of the button box is needed to enforce the right position of the box belo */}
                    {activeStep === 3 && (
                        <Box />
                    )}

                    {activeStep === 3 && (

                        <Box>
                            <Button variant="outlined" onClick={handleDialogClose} sx={{ mr: 1 }}>
                                Cancel
                            </Button>
                            <Button form="AppForm" type="submit" variant="contained" onClick={handleApp}>
                                {openEditDialog ? 'Update App' : 'Add App'}
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
                    <Stack direction={"row"} spacing={1}>
                        <WarningIcon sx={{ color: 'red', width: 30, height: 30}} />
                        <Typography sx={{ fontWeight: 'bold', fontSize: '20px' }}>
                            Delete Application
                        </Typography>
                    </Stack>
                </DialogTitle>

                <Divider/>

                <DialogContent sx={{p: 2}}>
                <Typography variant='h6'>
                    {`Are you sure you want to delete the application ${deleteAppData?.name}? This action is irreversible and will permanently remove all associated data.`}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant='text'
                        onClick={() => {
                            setOpenWarningDialog(false)
                        }}
                        sx={{ mr: 1, color: "black" }}>
                        Cancel
                    </Button>
                    <Button
                        variant='contained'
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

export default RefactoredApp
