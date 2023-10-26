import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import {
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup
} from '@mui/material'
import Select from '@mui/material/Select'

const Form = ({ formInputs, setAppData }) => {
    /**
   * Handles input change event and updates app data state accordingly.
   * @param event - The input change event.
   */
    const handleInputsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newInputs = {...formInputs}
      newInputs[event.target.name] = event.target.value
      setAppData(newInputs)
    }
  return (
    <div>
      <FormControl required>
        <FormLabel>What is the type of your app?</FormLabel>
        <RadioGroup
          row
          name="type"
          value={formInputs.type}
          onChange={handleInputsChange}
        >
          <FormControlLabel
            label="Internal"
            value="embedded"
            control={<Radio id="type" />}
          />
          <FormControlLabel
            id="type"
            label="External"
            value="link"
            control={<Radio id="type" />}
          />
        </RadioGroup>
      </FormControl>
      <FormControl fullWidth id="category">
        <InputLabel id="category">Category</InputLabel>
        <Select
          labelId="category"
          id="category"
          value={formInputs.category}
          label="Category"
          onChange={handleInputsChange}
          name="category"
        >
          <MenuItem id="category" value={'OpenHIM'}>
            OpenHIM
          </MenuItem>
          <MenuItem id="category" value={'Reports'}>
            Reports
          </MenuItem>
          <MenuItem id="category" value={'Operations'}>
            Operations
          </MenuItem>
          <MenuItem id="category" value={'Other'}>
            Other
          </MenuItem>
        </Select>
      </FormControl>
      <TextField
        margin="dense"
        id="name"
        label="App Title"
        type="text"
        fullWidth
        variant="outlined"
        required
        value={formInputs.name}
        onChange={handleInputsChange}
        name="name"
      />
      <TextField
        margin="dense"
        multiline
        id="description"
        label="Description"
        type="text"
        fullWidth
        variant="outlined"
        required
        value={formInputs.description}
        onChange={handleInputsChange}
        name="description"
      />
      <TextField
        margin="dense"
        multiline
        id="url"
        label="URL"
        type="url"
        fullWidth
        variant="outlined"
        required
        value={formInputs.url}
        onChange={handleInputsChange}
        name="url"
      />
      <TextField
        margin="dense"
        multiline
        id="icon"
        label="Icon"
        type="url"
        fullWidth
        variant="outlined"
        value={formInputs.icon}
        onChange={handleInputsChange}
        name="icon"
      />
    </div>
  )
}

export default Form
