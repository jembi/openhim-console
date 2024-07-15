import {InputAdornment as MuiInputAdornment} from '@mui/material'
import Search from '@mui/icons-material/Search'

export type InputAdornmentProps = {
  position?: 'start' | 'end'
}

export function InputAdornment(props?: InputAdornmentProps) {
  return (
    <MuiInputAdornment position={props.position ?? 'start'}>
      <Search />
    </MuiInputAdornment>
  )
}
