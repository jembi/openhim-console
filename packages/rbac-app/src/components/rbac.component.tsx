import {
  Button,
  ButtonGroup,
  Grid,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography
} from '@mui/material'
import React, {useEffect, useState} from 'react'
import {
  createNewRole,
  deleteRoleByName,
  editRoleByName,
  getApps,
  getChannels,
  getClients,
  getMediators,
  getRoles,
  getTransactions
} from '../services/api'
import {Role} from '../types'
import {BasicDialog} from './dialogs/basic.dialog.component'
import {ConfirmationDialog} from './dialogs/confirmation.dialog.component'
import Loader from './helpers/loader.component'
import CreateRole from '../screens/create.role.component'
import EditRole from '../screens/edit.role.component'
import ViewRole from '../screens/view.role.component'
import {AlertDialog, AlertDialogProps} from './dialogs/alert.dialog.component'
import {useAlert} from '../contexts/alert.context'

type Alert = {
  severity: AlertDialogProps['severity']
  isOpen: boolean
  title: string
  message: string
}

type Confirm = {
  isOpen: boolean
  title: string
  message: string
}

const RBACManagement: React.FC = () => {
  const [isFetchingData, setIsFetchData] = useState(true)
  const [isAddNewRole, setIsAddNewRole] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [canDelete, setCanDelete] = useState(true)
  const [canEdit, setCanEdit] = useState(true)
  const [selectedRole, setSelectedRole] = useState<Role | undefined>(undefined)
  const [alert, setAlert] = useState<Alert>({
    isOpen: false,
    title: '',
    message: '',
    severity: 'info'
  })
  const [confirm, setConfirm] = useState<Confirm>({
    isOpen: false,
    title: '',
    message: ''
  })
  const {showAlert, hideAlert} = useAlert()

  const [roles, setRoles] = useState<Role[]>([])
  const [apps, setApps] = useState<any[]>([])
  const [channels, setChannels] = useState<any[]>([])
  const [mediators, setMediators] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])

  useEffect(() => {
    setIsFetchData(true)

    Promise.all([
      getRoles(),
      getApps(),
      getChannels(),
      getMediators(),
      getClients(),
      getTransactions()
    ])
      .then(([roles, apps, channels, mediators, clients, transactions]) => {
        setRoles(roles)
        setSelectedRole(structuredClone(roles[0]))
        setApps(apps)
        setChannels(channels)
        setMediators(mediators)
        setClients(clients)
        setTransactions(transactions)
      })
      .catch(err => {
        console.error(err)
        setAlert({
          isOpen: true,
          title: 'Error ',
          severity: 'error',
          message: 'Error loading data'
        })
      })
      .finally(() => {
        setIsFetchData(false)
      })
  }, [])

  const onAttemptToEditRole = () => {
    setIsEditing(true)
  }

  const onCancelEditRole = () => {
    setIsEditing(false)
  }

  const submitEditRole = async (role: Role) => {
    try {
      await editRoleByName(role.name, role)
      setAlert({
        isOpen: true,
        title: 'Error',
        severity: 'error',
        message: 'Role successfully edited'
      })
      setIsEditing(false)
    } catch (err) {
      console.error(err)
      setIsEditing(false)
      setAlert({
        isOpen: true,
        title: 'Error',
        severity: 'error',
        message: 'Error editing role'
      })
    }
  }

  const onAttemptToAddRole = () => {
    setIsAddNewRole(true)
  }

  const submitAddNewRole = async (role: Role) => {
    try {
      await createNewRole(role)
      setAlert({
        isOpen: true,
        title: 'Error',
        severity: 'error',
        message: 'Role successfully created'
      })
      setIsAddNewRole(false)
    } catch (err) {
      console.error(err)
      setIsAddNewRole(false)
      setAlert({
        isOpen: true,
        title: 'Error',
        severity: 'error',
        message: 'Error submitting new role'
      })
    }
  }

  const onCancelAddNewRole = () => {
    setIsAddNewRole(false)
  }

  const onSelectedRoleChange = (event: SelectChangeEvent) => {
    const name = event.target.value
    const currentRole = roles.find(role => role.name == name)

    if (!currentRole) {
      setAlert({
        isOpen: true,
        title: 'Error',
        severity: 'error',
        message: 'Could not find current role.'
      })
      return
    }

    setSelectedRole(structuredClone(currentRole))
    setCanEdit(currentRole.name.toLowerCase() != 'admin')
    setCanDelete(currentRole.name.toLowerCase() != 'admin')
  }

  const submitDeleteRole = async () => {
    try {
      await deleteRoleByName(selectedRole.name)
    } catch (err) {
      console.error(err)
      setAlert({
        isOpen: true,
        title: 'Error',
        severity: 'error',
        message: 'Error deleting role'
      })
    }
  }

  const onAttemptToDeleteRole = () => {}

  if (isFetchingData) return <Loader />

  if (!selectedRole) {
    return <div>No role selected</div>
  }

  return (
    <div style={{padding: '20px', maxWidth: '800px', margin: '0 auto'}}>
      <section id="dialogs">
        <BasicDialog
          title="Add New Role"
          open={isAddNewRole}
          onClose={onCancelAddNewRole}
        >
          <CreateRole
            apps={apps}
            channels={channels}
            mediators={mediators}
            clients={clients}
            transactions={transactions}
            onSubmit={submitAddNewRole}
            onCancel={onCancelAddNewRole}
          />
        </BasicDialog>

        <BasicDialog
          title="Edit Role"
          open={isEditing}
          onClose={onCancelEditRole}
        >
          <EditRole
            role={selectedRole}
            apps={apps}
            channels={channels}
            mediators={mediators}
            clients={clients}
            transactions={transactions}
            onSubmit={submitEditRole}
            onCancel={onCancelEditRole}
          />
        </BasicDialog>

        <ConfirmationDialog
          title={confirm.title}
          message={confirm.message}
          open={confirm.isOpen}
          onNo={() => setConfirm({...confirm, isOpen: false})}
          onYes={submitDeleteRole}
        />

        <AlertDialog
          severity={alert.severity}
          title={alert.title}
          message={alert.message}
          open={alert.isOpen}
          onClose={() => setAlert({...alert, isOpen: false})}
        />
      </section>
    </div>
  )
}

export default RBACManagement
