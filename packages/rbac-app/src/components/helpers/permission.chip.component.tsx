import {Chip, Stack} from '@mui/material'

export type PermissionChipProps = {
  data: string[]
}

export const PermissionChip = (props: PermissionChipProps) => {
  return (
    <Stack sx={{display: 'flex'}} direction="row" spacing={1}>
      {Array.isArray(props.data) &&
        props.data.map(channel => <Chip key={channel} label={channel} />)}
    </Stack>
  )
}
