import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  TextField
} from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import React, {useEffect, useState} from 'react'
import {BasicInfoModel} from '../../interfaces'
import {fetchRoles} from '@jembi/openhim-core-api'

interface BasicInfoProps {
  basicInfo: BasicInfoModel
  setBasicInfo: React.Dispatch<React.SetStateAction<BasicInfoModel>>
  onBasicInfoChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  hidden?: boolean
}

export const BasicInfo: React.FC<BasicInfoProps> = ({
  basicInfo,
  onBasicInfoChange,
  setBasicInfo,
  hidden
}) => {
  const [roles, setRoles] = useState<string[]>([])

  useEffect(() => {
    fetchRoles().then(roles => {
      setRoles(roles.map(role => role.name))
    })
  }, [])

  return (
    <div hidden={hidden}>
      <Box sx={{marginLeft: 10, marginRight: 10, marginBottom: 3}}>
        <h1>Basic Info</h1>
        <p>
          Provide the required client information and assign existing roles for
          access management
        </p>
        <Divider />
        <br />
        <TextField
          id="clientID"
          label="Client ID"
          placeholder="Enter client ID"
          onChange={onBasicInfoChange}
          value={basicInfo.clientID}
        />
        <TextField
          id="clientName"
          label="Client Name"
          placeholder="Enter client name"
          value={basicInfo.clientName}
          onChange={onBasicInfoChange}
        />
        <h2>Assign Existing Roles</h2>
        <FormControl>
          {roles.map(role => (
            <FormControlLabel
              key={role}
              control={
                <Checkbox
                  id={role}
                  checked={basicInfo.roles.includes(role)}
                  onChange={e => {
                    if (e.target.checked) {
                      setBasicInfo({
                        ...basicInfo,
                        roles: [...basicInfo.roles, e.target.id]
                      })
                    } else {
                      setBasicInfo({
                        ...basicInfo,
                        roles: basicInfo.roles.filter(
                          role => role !== e.target.id
                        )
                      })
                    }
                  }}
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
            />
            <TextField
              fullWidth
              id="softwareName"
              label="Software Name"
              value={basicInfo.softwareName}
              onChange={onBasicInfoChange}
            />
            <TextField
              fullWidth
              id="description"
              label="Description"
              value={basicInfo.description}
              onChange={onBasicInfoChange}
            />
            <TextField
              fullWidth
              id="location"
              label="Location"
              value={basicInfo.location}
              onChange={onBasicInfoChange}
            />
            <TextField
              id="contactPerson"
              label="Contact Person"
              value={basicInfo.contactPerson}
              onChange={onBasicInfoChange}
            />
            <TextField
              id="contactPersonEmail"
              label="Contact Person Email"
              value={basicInfo.contactPersonEmail}
              onChange={onBasicInfoChange}
            />
          </AccordionDetails>
        </Accordion>
      </Box>
    </div>
  )
}
