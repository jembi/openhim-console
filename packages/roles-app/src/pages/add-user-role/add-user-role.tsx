import {
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography
} from '@mui/material'
import React, {useState} from 'react'

interface AddUserRoleProps {
  returnToRolesList: () => void
}

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
}

const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder'
]

const channels = [
  'fhir',
  'kafka',
  'dhis2',
  'fhir',
  'kafka',
  'dhis2',
  'fhir',
  'kafka',
  'dhis2',
  'fhir',
  'kafka',
  'dhis2',
  'fhir',
  'kafka'
]

export const AddUserRole: React.FC<AddUserRoleProps> = ({
  returnToRolesList
}) => {
  const [personName, setPersonName] = React.useState<string[]>([])

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: {value}
    } = event
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    )
  }

  return (
    <Grid container spacing={2} padding={2}>
      <Typography variant='h3' component='h3'>Add User Role</Typography>
      <Typography variant="caption">Control client systems and their access roles. Add client to enable their request routing and group them by roles for streamlined channel access management</Typography>
      <Card variant="outlined" sx={{margin: 'auto', maxWidth: 610}}>
        <FormControl sx={{m: 1, width: 580}}>
          <TextField
            id="role-name"
            label="Role Name"
            variant="outlined"
            helperText="Choose a short but descriptive name"
          />
        </FormControl>
        <FormControl sx={{m: 1, width: 580}}>
          <Typography variant="h5" component="h5">
            Clients
          </Typography>
          <Typography variant="caption">please choose at least one.</Typography>
        </FormControl>
        <FormControl sx={{m: 1, width: 580}}>
          <InputLabel id="selected-clients-label">Clients</InputLabel>
          <Select
            id="selected-clients"
            multiple
            value={personName}
            onChange={handleChange}
            input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
            renderValue={selected => (
              <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
                {selected.map(value => (
                  <Button key={value} variant="contained">
                    {value}
                  </Button>
                ))}
              </Box>
            )}
          >
            {names.map(name => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>
            Search for clients and select from an autocomplete list
          </FormHelperText>
        </FormControl>

        <FormControl sx={{m: 1, width: 580}}>
          <Typography variant="h5" component="h5">
            Channels
          </Typography>
          <Typography variant="caption">Please choose at least one</Typography>
          <FormGroup
            sx={{display: 'flex', flexDirection: 'column', height: 200, overflow: 'auto'}}
          >
            {channels.map(channel => (
              <FormControlLabel
                key={channel}
                control={<Checkbox />}
                label={channel}
              />
            ))}
          </FormGroup>
        </FormControl>
        <Divider />
        <Box sx={{display: 'flex', justifyContent: 'flex-start', p: 1}}>
          <Button onClick={returnToRolesList} variant="outlined">
            Cancel
          </Button>
          <Button sx={{ml: 1}} variant="contained">
            Save
          </Button>
        </Box>
      </Card>
    </Grid>
  )
}
