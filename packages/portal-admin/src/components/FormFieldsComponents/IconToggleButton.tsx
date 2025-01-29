import * as React from 'react'
import DashboardIcon from '@mui/icons-material/Dashboard'
import AppsIcon from '@mui/icons-material/Apps'
import CloudIcon from '@mui/icons-material/Cloud'
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation'
import ExtensionIcon from '@mui/icons-material/Extension'
import Stack from '@mui/material/Stack'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'

export interface IconToggleButtonProps {
  icon?: string
  updateIcon: (icon: string) => void
}

const IconToggleButton: React.FC<IconToggleButtonProps> = (
  props: IconToggleButtonProps
) => {
  const [icon, setIcon] = React.useState(props.icon ?? 'AppsIcon')

  const handleToggleChange = (
    event: React.MouseEvent<HTMLElement>,
    newIcon: string
  ) => {
    setIcon(newIcon)
    props.updateIcon(newIcon)
  }

  const children = [
    <ToggleButton
      value="https://fonts.gstatic.com/s/i/materialicons/dashboard/v12/24px.svg"
      key="DashboardIcon"
      selected={
        icon ===
        'https://fonts.gstatic.com/s/i/materialicons/dashboard/v12/24px.svg'
      }
    >
      <DashboardIcon />
    </ToggleButton>,
    <ToggleButton
      value="https://fonts.gstatic.com/s/i/materialicons/apps/v12/24px.svg"
      key="AppsIcon"
      selected={
        icon === 'https://fonts.gstatic.com/s/i/materialicons/apps/v12/24px.svg'
      }
    >
      <AppsIcon />
    </ToggleButton>,
    <ToggleButton
      value="https://fonts.gstatic.com/s/i/materialicons/medical_information/v1/24px.svg"
      key="MedicalInformationIcon"
      selected={
        icon ===
        'https://fonts.gstatic.com/s/i/materialicons/medical_information/v1/24px.svg'
      }
    >
      <MedicalInformationIcon />
    </ToggleButton>,
    <ToggleButton
      value="https://fonts.gstatic.com/s/i/materialicons/cloud/v12/24px.svg"
      key="CloudIcon"
      selected={
        icon ===
        'https://fonts.gstatic.com/s/i/materialicons/cloud/v12/24px.svg'
      }
    >
      <CloudIcon />
    </ToggleButton>,
    <ToggleButton
      value="https://fonts.gstatic.com/s/i/materialicons/extension/v12/24px.svg"
      key="ExtensionIcon"
      className="ExtensionIcon"
      selected={
        icon ===
        'https://fonts.gstatic.com/s/i/materialicons/extension/v12/24px.svg'
      }
    >
      <ExtensionIcon />
    </ToggleButton>
  ]

  const control = {
    value: icon,
    onChange: handleToggleChange,
    exclusive: true,
    name: 'icon'
  }

  return (
    <Stack spacing={2} alignItems="center">
      <ToggleButtonGroup size="large" {...control}>
        {children}
      </ToggleButtonGroup>
    </Stack>
  )
}

export default IconToggleButton
