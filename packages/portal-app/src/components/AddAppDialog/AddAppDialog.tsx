import * as React from 'react'
import Button from '@mui/material/Button'
import {styled} from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Typography from '@mui/material/Typography'
import AddIcon from '@mui/icons-material/Add'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import {Alert, Radio, RadioGroup} from '@mui/material'

import {useState, useEffect} from 'react'
import apiClient from '../../utils/apiClient'
import ReactDOM from 'react-dom'

import {useTheme} from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

const BootstrapDialog = styled(Dialog)(({theme}) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  }
}))

export default function AddNewAppDialog(apps, setApps) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  const [appData, setAppData] = useState({
    name: 'Grafana Dashboard',
    description: 'Monitor Cluster metrics and logs',
    icon: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIxLjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTQyLjUgMTQ1LjYiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDE0Mi41IDE0NS42OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe2ZpbGw6IzU2NTY1Njt9Cgkuc3Qxe2ZpbGw6dXJsKCNTVkdJRF8xXyk7fQo8L3N0eWxlPgo8Zz4KCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0yOC43LDEzMS41Yy0wLjMsNy45LTYuNiwxNC4xLTE0LjQsMTQuMUM2LjEsMTQ1LjYsMCwxMzksMCwxMzAuOXM2LjYtMTQuNywxNC43LTE0LjdjMy42LDAsNy4yLDEuNiwxMC4yLDQuNCAgIGwtMi4zLDIuOWMtMi4zLTItNS4xLTMuNC03LjktMy40Yy01LjksMC0xMC44LDQuOC0xMC44LDEwLjhjMCw2LjEsNC42LDEwLjgsMTAuNCwxMC44YzUuMiwwLDkuMy0zLjgsMTAuMi04LjhIMTIuNnYtMy41aDE2LjEgICBWMTMxLjV6Ii8+Cgk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDIuMywxMjkuNWgtMi4yYy0yLjQsMC00LjQsMi00LjQsNC40djExLjRoLTMuOXYtMTkuNkgzNXYxLjZjMS4xLTEuMSwyLjctMS42LDQuNi0xLjZoNC4yTDQyLjMsMTI5LjV6Ii8+Cgk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNjMuNywxNDUuM2gtMy40di0yLjVjLTIuNiwyLjUtNi42LDMuNy0xMC43LDEuOWMtMy0xLjMtNS4zLTQuMS01LjktNy40Yy0xLjItNi4zLDMuNy0xMS45LDkuOS0xMS45ICAgYzIuNiwwLDUsMS4xLDYuNywyLjh2LTIuNWgzLjRWMTQ1LjN6IE01OS43LDEzN2MwLjktNC0yLjEtNy42LTYtNy42Yy0zLjQsMC02LjEsMi44LTYuMSw2LjFjMCwzLjgsMy4zLDYuNyw3LjIsNi4xICAgQzU3LjEsMTQxLjIsNTkuMSwxMzkuMyw1OS43LDEzN3oiLz4KCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik03MS41LDEyNC43djEuMWg2LjJ2My40aC02LjJ2MTYuMWgtMy44di0yMC41YzAtNC4zLDMuMS02LjgsNy02LjhoNC43bC0xLjYsMy43aC0zLjEgICBDNzIuOSwxMjEuNiw3MS41LDEyMyw3MS41LDEyNC43eiIvPgoJPHBhdGggY2xhc3M9InN0MCIgZD0iTTk4LjUsMTQ1LjNoLTMuM3YtMi41Yy0yLjYsMi41LTYuNiwzLjctMTAuNywxLjljLTMtMS4zLTUuMy00LjEtNS45LTcuNGMtMS4yLTYuMywzLjctMTEuOSw5LjktMTEuOSAgIGMyLjYsMCw1LDEuMSw2LjcsMi44di0yLjVoMy40djE5LjZIOTguNXogTTk0LjUsMTM3YzAuOS00LTIuMS03LjYtNi03LjZjLTMuNCwwLTYuMSwyLjgtNi4xLDYuMWMwLDMuOCwzLjMsNi43LDcuMiw2LjEgICBDOTIsMTQxLjIsOTMuOSwxMzkuMyw5NC41LDEzN3oiLz4KCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0xMTkuNCwxMzMuOHYxMS41aC0zLjl2LTExLjZjMC0yLjQtMi00LjQtNC40LTQuNGMtMi41LDAtNC40LDItNC40LDQuNHYxMS42aC0zLjl2LTE5LjZoMy4ydjEuNyAgIGMxLjQtMS4zLDMuMy0yLDUuMi0yQzExNS44LDEyNS41LDExOS40LDEyOS4yLDExOS40LDEzMy44eiIvPgoJPHBhdGggY2xhc3M9InN0MCIgZD0iTTE0Mi40LDE0NS4zaC0zLjN2LTIuNWMtMi42LDIuNS02LjYsMy43LTEwLjcsMS45Yy0zLTEuMy01LjMtNC4xLTUuOS03LjRjLTEuMi02LjMsMy43LTExLjksOS45LTExLjkgICBjMi42LDAsNSwxLjEsNi43LDIuOHYtMi41aDMuNHYxOS42SDE0Mi40eiBNMTM4LjQsMTM3YzAuOS00LTIuMS03LjYtNi03LjZjLTMuNCwwLTYuMSwyLjgtNi4xLDYuMWMwLDMuOCwzLjMsNi43LDcuMiw2LjEgICBDMTM1LjksMTQxLjIsMTM3LjgsMTM5LjMsMTM4LjQsMTM3eiIvPgo8L2c+CjxsaW5lYXJHcmFkaWVudCBpZD0iU1ZHSURfMV8iIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4MT0iNzEuMjUiIHkxPSIxMC40ODkzIiB4Mj0iNzEuMjUiIHkyPSIxMTMuMzQxNSIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxIDAgMCAtMSAwIDE0OC42KSI+Cgk8c3RvcCBvZmZzZXQ9IjAiIHN0eWxlPSJzdG9wLWNvbG9yOiNGQ0VFMUYiLz4KCTxzdG9wIG9mZnNldD0iMSIgc3R5bGU9InN0b3AtY29sb3I6I0YxNUIyQSIvPgo8L2xpbmVhckdyYWRpZW50Pgo8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTIyLjksNDkuOWMtMC4yLTEuOS0wLjUtNC4xLTEuMS02LjVjLTAuNi0yLjQtMS42LTUtMi45LTcuOGMtMS40LTIuNy0zLjEtNS42LTUuNC04LjMgIGMtMC45LTEuMS0xLjktMi4xLTIuOS0zLjJjMS42LTYuMy0xLjktMTEuOC0xLjktMTEuOGMtNi4xLTAuNC05LjksMS45LTExLjMsMi45Yy0wLjItMC4xLTAuNS0wLjItMC43LTAuM2MtMS0wLjQtMi4xLTAuOC0zLjItMS4yICBjLTEuMS0wLjMtMi4yLTAuNy0zLjMtMC45Yy0xLjEtMC4zLTIuMy0wLjUtMy41LTAuN2MtMC4yLDAtMC40LTAuMS0wLjYtMC4xQzgzLjUsMy42LDc1LjksMCw3NS45LDBjLTguNyw1LjYtMTAuNCwxMy4xLTEwLjQsMTMuMSAgczAsMC4yLTAuMSwwLjRjLTAuNSwwLjEtMC45LDAuMy0xLjQsMC40Yy0wLjYsMC4yLTEuMywwLjQtMS45LDAuN2MtMC42LDAuMy0xLjMsMC41LTEuOSwwLjhjLTEuMywwLjYtMi41LDEuMi0zLjgsMS45ICBjLTEuMiwwLjctMi40LDEuNC0zLjUsMi4yYy0wLjItMC4xLTAuMy0wLjItMC4zLTAuMmMtMTEuNy00LjUtMjIuMSwwLjktMjIuMSwwLjljLTAuOSwxMi41LDQuNywyMC4zLDUuOCwyMS43ICBjLTAuMywwLjgtMC41LDEuNS0wLjgsMi4zYy0wLjksMi44LTEuNSw1LjctMS45LDguN2MtMC4xLDAuNC0wLjEsMC45LTAuMiwxLjNjLTEwLjgsNS4zLTE0LDE2LjMtMTQsMTYuM2M5LDEwLjQsMTkuNiwxMSwxOS42LDExICBsMCwwYzEuMywyLjQsMi45LDQuNyw0LjYsNi44YzAuNywwLjksMS41LDEuNywyLjMsMi42Yy0zLjMsOS40LDAuNSwxNy4zLDAuNSwxNy4zYzEwLjEsMC40LDE2LjctNC40LDE4LjEtNS41YzEsMC4zLDIsMC42LDMsMC45ICBjMy4xLDAuOCw2LjMsMS4zLDkuNCwxLjRjMC44LDAsMS42LDAsMi40LDBoMC40SDgwaDAuNUg4MWwwLDBjNC43LDYuOCwxMy4xLDcuNywxMy4xLDcuN2M1LjktNi4zLDYuMy0xMi40LDYuMy0xMy44bDAsMCAgYzAsMCwwLDAsMC0wLjFzMC0wLjIsMC0wLjJsMCwwYzAtMC4xLDAtMC4yLDAtMC4zYzEuMi0wLjksMi40LTEuOCwzLjYtMi44YzIuNC0yLjEsNC40LTQuNiw2LjItNy4yYzAuMi0wLjIsMC4zLTAuNSwwLjUtMC43ICBjNi43LDAuNCwxMS40LTQuMiwxMS40LTQuMmMtMS4xLTctNS4xLTEwLjQtNS45LTExbDAsMGMwLDAsMCwwLTAuMS0wLjFsLTAuMS0wLjFsMCwwbC0wLjEtMC4xYzAtMC40LDAuMS0wLjgsMC4xLTEuMyAgYzAuMS0wLjgsMC4xLTEuNSwwLjEtMi4zdi0wLjZ2LTAuM3YtMC4xYzAtMC4yLDAtMC4xLDAtMC4ydi0wLjV2LTAuNmMwLTAuMiwwLTAuNCwwLTAuNnMwLTAuNC0wLjEtMC42bC0wLjEtMC42bC0wLjEtMC42ICBjLTAuMS0wLjgtMC4zLTEuNS0wLjQtMi4zYy0wLjctMy0xLjktNS45LTMuNC04LjRjLTEuNi0yLjYtMy41LTQuOC01LjctNi44Yy0yLjItMS45LTQuNi0zLjUtNy4yLTQuNmMtMi42LTEuMi01LjItMS45LTcuOS0yLjIgIGMtMS4zLTAuMi0yLjctMC4yLTQtMC4yaC0wLjVoLTAuMWgtMC4yaC0wLjJoLTAuNWMtMC4yLDAtMC40LDAtMC41LDBjLTAuNywwLjEtMS40LDAuMi0yLDAuM2MtMi43LDAuNS01LjIsMS41LTcuNCwyLjggIGMtMi4yLDEuMy00LjEsMy01LjcsNC45cy0yLjgsMy45LTMuNiw2LjFjLTAuOCwyLjEtMS4zLDQuNC0xLjQsNi41YzAsMC41LDAsMS4xLDAsMS42YzAsMC4xLDAsMC4zLDAsMC40djAuNGMwLDAuMywwLDAuNSwwLjEsMC44ICBjMC4xLDEuMSwwLjMsMi4xLDAuNiwzLjFjMC42LDIsMS41LDMuOCwyLjcsNS40czIuNSwyLjgsNCwzLjhzMywxLjcsNC42LDIuMmMxLjYsMC41LDMuMSwwLjcsNC41LDAuNmMwLjIsMCwwLjQsMCwwLjUsMCAgYzAuMSwwLDAuMiwwLDAuMywwczAuMiwwLDAuMywwYzAuMiwwLDAuMywwLDAuNSwwaDAuMWgwLjFjMC4xLDAsMC4yLDAsMC4zLDBjMC4yLDAsMC40LTAuMSwwLjUtMC4xYzAuMiwwLDAuMy0wLjEsMC41LTAuMSAgYzAuMy0wLjEsMC43LTAuMiwxLTAuM2MwLjYtMC4yLDEuMi0wLjUsMS44LTAuN2MwLjYtMC4zLDEuMS0wLjYsMS41LTAuOWMwLjEtMC4xLDAuMy0wLjIsMC40LTAuM2MwLjUtMC40LDAuNi0xLjEsMC4yLTEuNiAgYy0wLjQtMC40LTEtMC41LTEuNS0wLjNDODgsNzQsODcuOSw3NCw4Ny43LDc0LjFjLTAuNCwwLjItMC45LDAuNC0xLjMsMC41Yy0wLjUsMC4xLTEsMC4zLTEuNSwwLjRjLTAuMywwLTAuNSwwLjEtMC44LDAuMSAgYy0wLjEsMC0wLjMsMC0wLjQsMGMtMC4xLDAtMC4zLDAtMC40LDBzLTAuMywwLTAuNCwwYy0wLjIsMC0wLjMsMC0wLjUsMGMwLDAtMC4xLDAsMCwwaC0wLjFoLTAuMWMtMC4xLDAtMC4xLDAtMC4yLDAgIHMtMC4zLDAtMC40LTAuMWMtMS4xLTAuMi0yLjMtMC41LTMuNC0xYy0xLjEtMC41LTIuMi0xLjItMy4xLTIuMWMtMS0wLjktMS44LTEuOS0yLjUtMy4xYy0wLjctMS4yLTEuMS0yLjUtMS4zLTMuOCAgYy0wLjEtMC43LTAuMi0xLjQtMC4xLTIuMWMwLTAuMiwwLTAuNCwwLTAuNmMwLDAuMSwwLDAsMCwwdi0wLjF2LTAuMWMwLTAuMSwwLTAuMiwwLTAuM2MwLTAuNCwwLjEtMC43LDAuMi0xLjFjMC41LTMsMi01LjksNC4zLTguMSAgYzAuNi0wLjYsMS4yLTEuMSwxLjktMS41YzAuNy0wLjUsMS40LTAuOSwyLjEtMS4yYzAuNy0wLjMsMS41LTAuNiwyLjMtMC44czEuNi0wLjQsMi40LTAuNGMwLjQsMCwwLjgtMC4xLDEuMi0wLjEgIGMwLjEsMCwwLjIsMCwwLjMsMGgwLjNoMC4yYzAuMSwwLDAsMCwwLDBoMC4xaDAuM2MwLjksMC4xLDEuOCwwLjIsMi42LDAuNGMxLjcsMC40LDMuNCwxLDUsMS45YzMuMiwxLjgsNS45LDQuNSw3LjUsNy44ICBjMC44LDEuNiwxLjQsMy40LDEuNyw1LjNjMC4xLDAuNSwwLjEsMC45LDAuMiwxLjR2MC4zVjY2YzAsMC4xLDAsMC4yLDAsMC4zYzAsMC4xLDAsMC4yLDAsMC4zdjAuM3YwLjNjMCwwLjIsMCwwLjYsMCwwLjggIGMwLDAuNS0wLjEsMS0wLjEsMS41Yy0wLjEsMC41LTAuMSwxLTAuMiwxLjVzLTAuMiwxLTAuMywxLjVjLTAuMiwxLTAuNiwxLjktMC45LDIuOWMtMC43LDEuOS0xLjcsMy43LTIuOSw1LjMgIGMtMi40LDMuMy01LjcsNi05LjQsNy43Yy0xLjksMC44LTMuOCwxLjUtNS44LDEuOGMtMSwwLjItMiwwLjMtMywwLjNIODFoLTAuMmgtMC4zSDgwaC0wLjNjMC4xLDAsMCwwLDAsMGgtMC4xICBjLTAuNSwwLTEuMSwwLTEuNi0wLjFjLTIuMi0wLjItNC4zLTAuNi02LjQtMS4yYy0yLjEtMC42LTQuMS0xLjQtNi0yLjRjLTMuOC0yLTcuMi00LjktOS45LTguMmMtMS4zLTEuNy0yLjUtMy41LTMuNS01LjQgIHMtMS43LTMuOS0yLjMtNS45Yy0wLjYtMi0wLjktNC4xLTEtNi4ydi0wLjR2LTAuMXYtMC4xdi0wLjJWNjB2LTAuMXYtMC4xdi0wLjJ2LTAuNVY1OWwwLDB2LTAuMmMwLTAuMywwLTAuNSwwLTAuOCAgYzAtMSwwLjEtMi4xLDAuMy0zLjJjMC4xLTEuMSwwLjMtMi4xLDAuNS0zLjJjMC4yLTEuMSwwLjUtMi4xLDAuOC0zLjJjMC42LTIuMSwxLjMtNC4xLDIuMi02YzEuOC0zLjgsNC4xLTcuMiw2LjgtOS45ICBjMC43LTAuNywxLjQtMS4zLDIuMi0xLjljMC4zLTAuMywxLTAuOSwxLjgtMS40YzAuOC0wLjUsMS42LTEsMi41LTEuNGMwLjQtMC4yLDAuOC0wLjQsMS4zLTAuNmMwLjItMC4xLDAuNC0wLjIsMC43LTAuMyAgYzAuMi0wLjEsMC40LTAuMiwwLjctMC4zYzAuOS0wLjQsMS44LTAuNywyLjctMWMwLjItMC4xLDAuNS0wLjEsMC43LTAuMmMwLjItMC4xLDAuNS0wLjEsMC43LTAuMmMwLjUtMC4xLDAuOS0wLjIsMS40LTAuNCAgYzAuMi0wLjEsMC41LTAuMSwwLjctMC4yYzAuMiwwLDAuNS0wLjEsMC43LTAuMWMwLjIsMCwwLjUtMC4xLDAuNy0wLjFsMC40LTAuMWwwLjQtMC4xYzAuMiwwLDAuNS0wLjEsMC43LTAuMSAgYzAuMywwLDAuNS0wLjEsMC44LTAuMWMwLjIsMCwwLjYtMC4xLDAuOC0wLjFjMC4yLDAsMC4zLDAsMC41LTAuMWgwLjNoMC4yaDAuMmMwLjMsMCwwLjUsMCwwLjgtMC4xaDAuNGMwLDAsMC4xLDAsMCwwaDAuMWgwLjIgIGMwLjIsMCwwLjUsMCwwLjcsMGMwLjksMCwxLjgsMCwyLjcsMGMxLjgsMC4xLDMuNiwwLjMsNS4zLDAuNmMzLjQsMC42LDYuNywxLjcsOS42LDMuMmMyLjksMS40LDUuNiwzLjIsNy44LDUuMSAgYzAuMSwwLjEsMC4zLDAuMiwwLjQsMC40YzAuMSwwLjEsMC4zLDAuMiwwLjQsMC40YzAuMywwLjIsMC41LDAuNSwwLjgsMC43YzAuMywwLjIsMC41LDAuNSwwLjgsMC43YzAuMiwwLjMsMC41LDAuNSwwLjcsMC44ICBjMSwxLDEuOSwyLjEsMi43LDMuMWMxLjYsMi4xLDIuOSw0LjIsMy45LDYuMmMwLjEsMC4xLDAuMSwwLjIsMC4yLDAuNGMwLjEsMC4xLDAuMSwwLjIsMC4yLDAuNHMwLjIsMC41LDAuNCwwLjcgIGMwLjEsMC4yLDAuMiwwLjUsMC4zLDAuN2MwLjEsMC4yLDAuMiwwLjUsMC4zLDAuN2MwLjQsMC45LDAuNywxLjgsMSwyLjdjMC41LDEuNCwwLjgsMi42LDEuMSwzLjZjMC4xLDAuNCwwLjUsMC43LDAuOSwwLjcgIGMwLjUsMCwwLjgtMC40LDAuOC0wLjlDMTIzLDUyLjcsMTIzLDUxLjQsMTIyLjksNDkuOXoiLz4KPC9zdmc+',
    type: 'link',
    category: 'Operations',
    access_roles: ['admin'],
    url: 'http://localhost:3000',
    showInPortal: true,
    showInSideBar: false
  })

  const AddNewApp = async () => {
    apiClient
      .post('/apps', appData)
      .then(response => {
        setApps([...apps, response.data])
      })
      .catch(error => {
        if (
          error.response &&
          error.response.status === 400 &&
          error.response.data.error.includes('E11000')
        ) {
          console.log('App already exists')
          const alertMessage = (
            <div>
              <Alert severity="error">App already exists</Alert>
            </div>
          )
          ReactDOM.render(alertMessage, document.getElementById('DialogalertSection'))
        } else {
          console.log('Error adding app')
          console.log(error)
        }
      })
  }

  return (
    <div>
      <IconButton aria-label="add app 2" onClick={handleClickOpen}>
        <AddIcon />
      </IconButton>
      <BootstrapDialog
        onClose={handleClose}
        open={open}
        color="#1976d21a"
        aria-labelledby="customized-dialog-title"
        fullScreen={fullScreen}
      >
        <DialogTitle sx={{m: 0, p: 2}} id="customized-dialog-title">
          Add Portal Item
          <Typography variant="subtitle2" color="text.secondary">
            Use the form below to add your portal item.
          </Typography>
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
        <div id="DialogalertSection"></div>
        <DialogContent dividers>
          <FormControl fullWidth={true}>
            <RadioGroup row>
              <FormControlLabel
                value="1"
                control={<Radio />}
                label="Internal"
              />
              <FormControlLabel
                value="0"
                control={<Radio />}
                label="External"
              />
            </RadioGroup>
          </FormControl>
          <TextField
            autoFocus
            margin="dense"
            id="category"
            label="Category"
            type="text"
            fullWidth
            variant="outlined"
            required
          />
          <TextField
            margin="dense"
            id="name"
            label="App Title"
            type="text"
            fullWidth
            variant="outlined"
            required
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
          />
          <TextField
            margin="dense"
            multiline
            id="icon"
            label="Icon"
            type="url"
            fullWidth
            variant="outlined"
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={AddNewApp}>
            Save
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  )
}
