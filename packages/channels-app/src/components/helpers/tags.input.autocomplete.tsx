import React, {useState} from 'react'
import {Autocomplete, TextField, Chip} from '@mui/material'

export type TagInputAutocompleteProps = {
  label?: string
  options?: string[]
  tags?: string[]
  onChange?: (tags: string[]) => unknown
  helperText?: string
  error?: boolean
}

export function TagInputAutocomplete(props: TagInputAutocompleteProps) {
  const [tags, setTags] = useState<string[]>(props.tags ?? [])

  React.useEffect(() => {
    props.onChange?.(tags)
  }, [tags])

  return (
    <Autocomplete
      multiple
      freeSolo
      options={props.options ?? []}
      value={tags}
      onChange={(_event, newValue) => {
        setTags(newValue)
      }}
      renderTags={(value: string[], getTagProps) =>
        value.map((option: string, index: number) => (
          <Chip
            variant="outlined"
            label={option}
            key={index}
            {...getTagProps({index})}
          />
        ))
      }
      renderInput={params => (
        <TextField
          {...params}
          label={props.label}
          helperText={props.helperText}
          error={props.error}
          variant="outlined"
          placeholder="Type and press Enter"
        />
      )}
    />
  )
}
