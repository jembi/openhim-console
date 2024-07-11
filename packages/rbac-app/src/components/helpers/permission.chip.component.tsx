import {
  Chip,
  Stack
} from '@mui/material';

export type PermissionChipProps = {
  data: string[]
}

export const PermissionChip = (props: PermissionChipProps) => {
  return (
    <Stack direction="row" spacing={1}>
      { 
        props.data.map(channel => (
          <Chip key={channel} label={channel} />
        ))
      }
    </Stack>
  );
}
