import { useState, useEffect } from 'react'
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
    Dialog,
    Button,
    useMediaQuery,
    useTheme,
    DialogTitle,
    DialogActions,
    DialogContent,
    Grid,
    Typography,
    Switch,
    IconButton,
    FormControl,
    FormGroup,
    FormControlLabel,
    FormLabel,
    Select,
    InputLabel,
    MenuItem,
    Radio,
    RadioGroup,
    FormHelperText

} from '@mui/material'
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import ErrorIcon from '@mui/icons-material/Error'
import AddIcon from '@mui/icons-material/Add'
import RefreshIcon from '@mui/icons-material/Refresh'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { enqueueSnackbar } from 'notistack'
import CloseIcon from '@mui/icons-material/Close'
import { useFormContext } from 'react-hook-form'
import { useFromState } from '../hooks/useFormType'
import TextField from '@mui/material/TextField'
import { Controller } from 'react-hook-form'

//For stepper
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'

import { ModuleTypes } from '../components/FormFieldsComponents/FormInputProps'

import { getAllApps, deleteApp, editApp, addApp } from '@jembi/openhim-core-api'
import HorizontalLinearStepper from './FormFieldsComponents/FormStepper'
import FormFields from './FormFieldsComponents/FormFields'
import FormInputRadioGroup from './FormFieldsComponents/FormInputRadio'
import { FormInputDropdown } from './FormFieldsComponents/FormInputDropDown'
import IconToggleButton from './FormFieldsComponents/IconToggleButton'
const steps = ['Add App details', 'Add App Configuration', 'Choose Icon']

const AppDataGridTwo = () => {
    const formInitialState = {
        name: '',
        description: '',
        category: '',
        type: 'link',
        url: '',
        showInPortal: true,
        showInSideBar: false,
        access_roles: ['admin']
    }
    const [apps, setApps] = useState([])
    const [openEditDialog, setOpenEditDialog] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)
    const [selectedApp, setSelectedApp] = useState(formInitialState)
    const [loading, setLoading] = useState(true)
    const theme = useTheme()
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
    const [activeStep, setActiveStep] = useState(0)


    //For stepper

    const [skipped, setSkipped] = useState(new Set<number>())
    // const [typeCheck, setTypeCheck] = useState<ModuleTypes>("internal")

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
        setActiveStep(activeStep + 1)
        setSkipped(newSkipped)
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

    //Above Stepper


    //For Form Field 
    const { register, control, formState, setValue } = useFormContext()
    const { errors } = formState
    const [displayIcon, setDisplayIcon] = useState(false)

    const { typeCheck, setTypeCheck } = useFromState()

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
            setValue('icon', base64)
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

    const handleTypeChange = (type: ModuleTypes) => {
        setTypeCheck(type)
    }

    //Above form fields

    async function loadContent() {
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

    useEffect(() => {
        loadContent()
    }, [])

    const handleApp = async data => {
        if (openEditDialog) {
            handleEditApp(data)
        } else {
            handleAddApp(data)
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

    const handleDeleteApp = async id => {
        try {
            await deleteApp(id)
            loadContent()
            enqueueSnackbar('App was deleted successfully', { variant: 'success' })
        } catch (error) {
            enqueueSnackbar('Failed to delete app', { variant: 'error' })
        }
    }

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
                        handleDeleteApp(params.row._id)
                    }}
                />
            ]
        }
    ]
    const StyledGridOverlay = styled('div')(() => ({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
    }))
    function CustomNoRowsOverlay() {
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

    const handleDialogClose = () => {
        setOpenDialog(false)
        setOpenEditDialog(false)
        setSelectedApp(null)
    }

    const generateSingleOptions = () => {
        const options =
            [
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



        if (!options) {
            return null
        }
        return options.map((option: any) => {
            return (
                <MenuItem key={option.value} value={option.value}>
                    {option.label}
                </MenuItem>
            )
        })
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        handleTypeChange(event.target.value as ModuleTypes)
    }

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
                fullScreen={fullScreen}
            >
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

                </DialogTitle>
                <DialogContent>
                    {/* 
                        1. Stepper
                        2. Radio button 
                        3. Form 
                        4. Action buttons 
                    */}
                    <Box sx={{ width: '100%' }}>
                        <Stepper activeStep={activeStep} alternativeLabel>
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
                        {activeStep === steps.length ? (
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
                        ) : (
                            <>
                                <Stack spacing={2}>
                                    {activeStep === 0 && (
                                        <div id="step-1">
                                            {/* <FormInputRadioGroup
                                                name={'type'}
                                                id={'type'}
                                                label={'What is the type of your app?'}
                                                control={control}
                                                errors={errors}
                                                handleTypeChange={handleTypeChange}
                                                typeCheck={typeCheck}
                                                options={[
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
                                                ]}
                                            /> */}

                                            <FormControl fullWidth component="fieldset" required error={!!errors.type}>
                                                <FormLabel required component="legend">
                                                    {'What is the type of your app?'}
                                                </FormLabel>
                                                <Controller
                                                    name={"type"}
                                                    control={control}
                                                    defaultValue={'internal'}
                                                    rules={{ required: 'This field is required' }}
                                                    render={({ fieldState: { error } }) => {
                                                        return (
                                                            <RadioGroup
                                                                id={"type"}
                                                                name={"type"}
                                                                row
                                                                value={typeCheck}
                                                                onChange={handleChange}
                                                            >
                                                                {generateRadioOptions([
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
                                                                ])}
                                                                {error && <FormHelperText>{error.message}</FormHelperText>}
                                                            </RadioGroup>
                                                        )
                                                    }}
                                                />
                                            </FormControl>
                                            <FormControl fullWidth required sx={{ mt: 1 }}>
                                                <InputLabel>{"category"}</InputLabel>
                                                <Controller
                                                    render={({ field: { onChange, value } }) => (
                                                        <>
                                                            <Select
                                                                margin="dense"
                                                                fullWidth
                                                                onChange={onChange}
                                                                id={"category"}
                                                                name={"category"}
                                                                value={value}
                                                                label={"category"}
                                                            >
                                                                {generateSingleOptions()}
                                                            </Select>
                                                        </>
                                                    )}
                                                    control={control}
                                                    name={"category"}
                                                    rules={{ required: true }}
                                                />
                                            </FormControl>

                                            <TextField
                                                margin="dense"
                                                id="name"
                                                label="App Title"
                                                type="text"
                                                fullWidth
                                                variant="outlined"
                                                required
                                                name="name"
                                                error={!!errors.name}
                                                helperText={errors.name?.message}
                                                {...register('name', {
                                                    required: true,
                                                    minLength: {
                                                        value: 3,
                                                        message:
                                                            'Application title should be at least 3 characters long'
                                                    },
                                                    maxLength: {
                                                        value: 25,
                                                        message:
                                                            'Application title should be at most 25 characters long'
                                                    }
                                                })}
                                            />
                                            <TextField
                                                margin="dense"
                                                multiline
                                                id="description"
                                                label="Description"
                                                type="text"
                                                fullWidth
                                                variant="outlined"
                                                name="description"
                                                error={!!errors.description}
                                                helperText={errors.description?.message}
                                                {...register('description', {
                                                    maxLength: {
                                                        value: 70,
                                                        message: 'Description should be at most 70 characters long'
                                                    }
                                                })}
                                            />
                                        </div>
                                    )}
                                    {activeStep === 1 && (
                                        <div id="step-2">
                                            {typeCheck === 'esmodule' && (
                                                <TextField
                                                    margin="dense"
                                                    multiline
                                                    id="url"
                                                    label="Bundle URL"
                                                    type="url"
                                                    fullWidth
                                                    variant="outlined"
                                                    name="url"
                                                    required
                                                    error={!!errors.url}
                                                    helperText={errors.url?.message}
                                                    {...register('url', {
                                                        required: true,
                                                        pattern: {
                                                            value:
                                                                /^(?:https?:\/\/)?(?:localhost|www\.\w+|(?:[\w-]+(?:\.\w+){1,2}))(?::\d+)?(?:\/.*)?$/,
                                                            message: 'Invalid URL'
                                                        }
                                                    })}
                                                />
                                            )}
                                            {(typeCheck === 'internal' || typeCheck === 'external') && (
                                                <TextField
                                                    margin="dense"
                                                    multiline
                                                    id="page"
                                                    label="Link"
                                                    fullWidth
                                                    variant="outlined"
                                                    name="page"
                                                    error={!!errors.url}
                                                    helperText={errors.url?.message}
                                                    {...register('url', {
                                                        required: true,
                                                        pattern: {
                                                            value:
                                                                /^(?:https?:\/\/)?(?:localhost|www\.\w+|(?:[\w-]+(?:\.\w+){1,2}))(?::\d+)?(?:\/.*)?$/,
                                                            message: 'Invalid URL'
                                                        }
                                                    })}
                                                />
                                            )}
                                            <FormInputDropdown
                                                name={'access_roles'}
                                                id={'access_roles'}
                                                label={'Access Roles'}
                                                control={control}
                                                options={[
                                                    {
                                                        label: 'Super Admin',
                                                        value: 'admin'
                                                    },
                                                    {
                                                        label: 'Basic User',
                                                        value: 'user'
                                                    }
                                                ]}
                                            />
                                            <FormGroup sx={{ mt: 2 }}>
                                                <FormLabel component="legend">Visibility Settings</FormLabel>
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            name="showInPortal"
                                                            id="showInPortal"
                                                            {...register('showInPortal')}
                                                            sx={{ '& .MuiSvgIcon-root': { fontSize: 18 } }}
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
                                                            {...register('showInSideBar')}
                                                        />
                                                    }
                                                    label="Display in Sidebar Menu"
                                                />
                                            </FormGroup>
                                        </div>
                                    )}
                                    {activeStep === 2 && (
                                        <Stack id="step-3">
                                            <FormControl
                                                sx={{ m: 1, alignItems: 'center' }}
                                                component="fieldset"
                                                variant="standard"
                                            >
                                                <FormLabel component="label">Icon Settings</FormLabel>
                                                <IconToggleButton />
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
                                                        {...register('icon')}
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
                                </Stack>
                            </>
                        )}
                    </Box>

                </DialogContent>
                <DialogActions>
                    {activeStep === 3 && (
                        <>
                            <Button variant="outlined" onClick={handleDialogClose}>
                                Cancel
                            </Button>
                            <Button form="AppForm" type="submit" variant="contained">
                                {openEditDialog ? 'Update App' : 'Add App'}
                            </Button>
                        </>
                    )}

                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Button
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            sx={{ mr: 1 }}
                            variant="outlined"
                        >
                            Back
                        </Button>
                        <Box sx={{ flex: '1 1 auto' }} />
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
                    </Box>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default AppDataGridTwo
