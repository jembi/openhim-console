import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  Stack,
  TextField
} from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import React, {useEffect, useState} from 'react'
import {BasicInfoModel} from '../../interfaces'
import {fetchRoles, createRole} from '@jembi/openhim-core-api'
import {Client} from '../../types'

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
  editMode = false,
}) => {
  const [roles, setRoles] = useState<string[]>([])

  useEffect(() => {
    //@ts-ignore
    fetchRoles().then(roles => {
      //@ts-ignore
      setRoles(roles.map(role => role.name))
    });
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
        
        <p style={{fontSize: 24, marginBottom: -10}}>Basic Info</p>
        <p style={{opacity: '0.6', fontSize: 11}}>
          Provide the required client information and assign existing roles for
          access management
        </p>
        <Divider style={{marginLeft: -100, marginRight: -100}} />
        <br />
        <TextField
          id="clientID"
          label="Client ID"
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
          placeholder="Enter client name"
          value={basicInfo.name}
          onChange={onBasicInfoChange}
          error={validationErrors?.name ? true : false}
          helperText={validationErrors?.name}
          onBlur={onBlurValidation}
        />
        <h2>Assign Existing Roles</h2>
        {validationErrors?.roles && (
          <p style={{color: '#FF0000'}}>No Role Selected for Client</p>
        )}
        <FormControl>
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
              label={role}
            />
          ))}
          {roles.length === 0 && <p>No roles available</p>}
        </FormControl>
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
            />
            <TextField
              id="contactPerson"
              label="Contact Person"
              value={basicInfo.contactPerson}
              onChange={onBasicInfoChange}
              error={validationErrors?.contactPerson ? true : false}
              helperText={validationErrors?.contactPerson}
              onBlur={onBlurValidation}
            />
            <TextField
              id="contactPersonEmail"
              label="Contact Person Email"
              value={basicInfo.contactPersonEmail}
              onChange={onBasicInfoChange}
              error={validationErrors?.contactPersonEmail ? true : false}
              helperText={validationErrors?.contactPersonEmail}
              onBlur={onBlurValidation}
            />
          </AccordionDetails>
        </Accordion>
      </Box>
    </div>
  )
}
