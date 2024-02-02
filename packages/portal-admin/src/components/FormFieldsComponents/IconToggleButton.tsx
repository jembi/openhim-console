import * as React from 'react'
import DashboardIcon from '@mui/icons-material/Dashboard'
import AppsIcon from '@mui/icons-material/Apps'
import CloudIcon from '@mui/icons-material/Cloud'
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation'
import ExtensionIcon from '@mui/icons-material/Extension'
import Stack from '@mui/material/Stack'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'

interface IconToggleButtonProps {
  updateIcon: (icon: string) => void
}

const IconToggleButton: React.FC<IconToggleButtonProps> = ({ updateIcon }) => {
  const [icon, setIcon] = React.useState('AppsIcon')

  const handleToggleChange = (
    event: React.MouseEvent<HTMLElement>,
    newIcon: string
  ) => {
    setIcon(newIcon)
    updateIcon(newIcon)
  }

  const children = [
    <ToggleButton
      value="https://fonts.gstatic.com/s/i/materialicons/dashboard/v12/24px.svg"
      key="DashboardIcon"
    >
      <DashboardIcon />
    </ToggleButton>,
    <ToggleButton
      value="https://fonts.gstatic.com/s/i/materialicons/apps/v12/24px.svg"
      key="AppsIcon"
    >
      <AppsIcon />
    </ToggleButton>,
    <ToggleButton
      value="https://fonts.gstatic.com/s/i/materialicons/medical_information/v1/24px.svg"
      key="MedicalInformationIcon"
    >
      <MedicalInformationIcon />
    </ToggleButton>,
    <ToggleButton
      value="https://fonts.gstatic.com/s/i/materialicons/cloud/v12/24px.svg"
      key="CloudIcon"
    >
      <CloudIcon />
    </ToggleButton>,
    <ToggleButton
      value="https://fonts.gstatic.com/s/i/materialicons/extension/v12/24px.svg"
      key="ExtensionIcon"
      className='ExtensionIcon'

    >
      <ExtensionIcon />
    </ToggleButton>
  ]

  const control = {
    value: icon,
    onChange:handleToggleChange,
    exclusive: true,
    name: 'icon',
  }

  return (
    <Stack spacing={2} alignItems="center">
      <ToggleButtonGroup size="large" {...control} aria-label="Large sizes">
        {children}
      </ToggleButtonGroup>
    </Stack>
  )
}


export default IconToggleButton
