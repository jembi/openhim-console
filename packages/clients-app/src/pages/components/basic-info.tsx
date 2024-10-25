import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardHeader,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import React, {useEffect, useState} from 'react'
import {BasicInfoModel} from '../../interfaces'
import {fetchRoles, createRole, fetchClientRoles} from '@jembi/openhim-core-api'
import {Client} from '../../types'
import {useSnackbar} from 'notistack'

const styleForTextAreas = {
  marginBottom: 2
}

interface BasicInfoProps {
  basicInfo: Client
  setBasicInfo: React.Dispatch<React.SetStateAction<Client>>
  onBasicInfoChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  validationErrors?: {[key: string]: string}
  validateBasicInfoField?: (field: string, newBasicInfoState?: object) => void
  hidden?: boolean
  editMode?: boolean
}

export const BasicInfo: React.FC<BasicInfoProps> = ({
  basicInfo,
  onBasicInfoChange,
  setBasicInfo,
  validationErrors,
  validateBasicInfoField,
  hidden,
  editMode = false
}) => {
  const [roles, setRoles] = useState<string[]>([])
  const {enqueueSnackbar, closeSnackbar} = useSnackbar()

  useEffect(() => {
    //@ts-ignore
    fetchClientRoles()
      .then(roles => {
        //@ts-ignore
        if (roles.length === 0) {
          setRoles(['instant'])
        } else {
          setRoles(roles.map(role => role.roleName))
        }
      })
      .catch(error => {
        if (error?.response && error?.response?.data) {
          enqueueSnackbar(error.response.data, {variant: 'error'})
        } else {
          console.log(JSON.stringify(error))
          enqueueSnackbar('Error fetching roles', {variant: 'error'})
        }
      })
  }, [])

  const onBlurValidation = (e: React.FocusEvent<HTMLInputElement>) => {
    if (
      e.currentTarget.id === 'contactPersonEmail' &&
      e.currentTarget.value === ''
    ) {
      setBasicInfo({
        ...basicInfo,
        [e.currentTarget.id]: null
      })
    }
    validateBasicInfoField(e.currentTarget.id)
  }

  const onCheckBoxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const newBasicInfoState = {
        ...basicInfo,
        roles: [...basicInfo.roles, e.target.id]
      }
      setBasicInfo(newBasicInfoState)
      validateBasicInfoField('roles', newBasicInfoState)
    } else {
      const newBasicInfoState = {
        ...basicInfo,
        roles: basicInfo.roles.filter(role => role !== e.target.id)
      }
      setBasicInfo(newBasicInfoState)
      validateBasicInfoField('roles', newBasicInfoState)
    }
  }

  return (
    <div hidden={hidden}>
      <Box sx={{marginLeft: 2, marginRight: 2, marginBottom: 3}}>
        <br />
        <Typography variant="h5">Basic Info</Typography>
        <Typography variant="subtitle1" sx={{fontSize: 13}}>
          Provide the required client information and assign existing roles for
          access management
        </Typography>
        <br />
        <Divider style={{marginLeft: -100, marginRight: -100}} />
        <br />
        <Stack direction="row" spacing={2}>
          <TextField
            id="clientID"
            label="Client ID"
            fullWidth
            placeholder="Enter client ID"
            onChange={onBasicInfoChange}
            value={basicInfo.clientID}
            error={validationErrors?.clientID ? true : false}
            helperText={validationErrors?.clientID}
            onBlur={onBlurValidation}
            disabled={editMode}
          />
          <TextField
            id="name"
            label="Client Name"
            fullWidth
            placeholder="Enter client name"
            value={basicInfo.name}
            onChange={onBasicInfoChange}
            error={validationErrors?.name ? true : false}
            helperText={validationErrors?.name}
            onBlur={onBlurValidation}
            sx={{marginLeft: 1}}
          />
        </Stack>
        <br />
        <Typography variant="h6" sx={{fontWeight: 'bold'}}>Assign Existing Roles</Typography>
        <Card elevation={0}>
          {validationErrors?.roles && (
            <p style={{color: '#FF0000'}}>No Role Selected for Client</p>
          )}
          <FormControl
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: 150,
              overflow: 'auto'
            }}
          >
            <br />
            {roles.map(role => (
              <FormControlLabel
                
                key={role}
                control={
                  <Checkbox
                    id={role}
                    checked={basicInfo.roles.includes(role)}
                    onChange={onCheckBoxChange}
                  />
                }
                label={<Typography sx={{fontSize: 13}} variant="body1">{role}</Typography>}
              />
            ))}
            {roles.length === 0 && <p>No roles available</p>}
          </FormControl>
        </Card>
        <Divider />
        <br />
        <Accordion square={false}>
          <AccordionSummary
            expandIcon={<ArrowDropDownIcon />}
            aria-controls="panel2-content"
            id="panel2-header"
          >
            Options Details
          </AccordionSummary>
          <AccordionDetails>
            <TextField
              fullWidth
              id="organization"
              label="Organization"
              value={basicInfo.organization}
              onChange={onBasicInfoChange}
              error={validationErrors?.organization ? true : false}
              helperText={validationErrors?.organization}
              onBlur={onBlurValidation}
              sx={styleForTextAreas}
            />
            <TextField
              fullWidth
              id="softwareName"
              label="Software Name"
              value={basicInfo.softwareName}
              onChange={onBasicInfoChange}
              error={validationErrors?.softwareName ? true : false}
              helperText={validationErrors?.softwareName}
              onBlur={onBlurValidation}
              sx={styleForTextAreas}
            />
            <TextField
              fullWidth
              id="description"
              label="Description"
              value={basicInfo.description}
              onChange={onBasicInfoChange}
              error={validationErrors?.description ? true : false}
              helperText={validationErrors?.description}
              onBlur={onBlurValidation}
              sx={styleForTextAreas}
            />
            <TextField
              fullWidth
              id="location"
              label="Location"
              value={basicInfo.location}
              onChange={onBasicInfoChange}
              error={validationErrors?.location ? true : false}
              helperText={validationErrors?.location}
              onBlur={onBlurValidation}
              sx={styleForTextAreas}
            />
            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth
                id="contactPerson"
                label="Contact Person"
                value={basicInfo.contactPerson}
                onChange={onBasicInfoChange}
                error={validationErrors?.contactPerson ? true : false}
                helperText={validationErrors?.contactPerson}
                onBlur={onBlurValidation}
                sx={styleForTextAreas}
              />
              <TextField
                fullWidth
                id="contactPersonEmail"
                label="Contact Person Email"
                value={basicInfo.contactPersonEmail}
                onChange={onBasicInfoChange}
                error={validationErrors?.contactPersonEmail ? true : false}
                helperText={validationErrors?.contactPersonEmail}
                onBlur={onBlurValidation}
                sx={{...styleForTextAreas, marginLeft: 1}}
              />
            </Stack>
          </AccordionDetails>
        </Accordion>
      </Box>
    </div>
  )
}
