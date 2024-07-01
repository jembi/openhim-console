import {
  Button,
  ButtonGroup,
  Grid,
  SelectChangeEvent,
  Typography,
  Select,
  MenuItem,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import {
  getApps,
  getChannels,
  getClients,
  getMediators,
  getRoles,
  getTransactions,
  deleteRoleByName,
  editRoleByName,
  createNewRole,
} from '../services/api';
import { Permission, Role } from '../types';
import { defaultRole } from '../utils';
import { BasicDialog } from './basic.dialog.component';
import { ConfirmationDialog } from './confirmation.dialog.component';
import CreateRole from './role-crud/create.role.component';
import Loader from './loader.component';
import ViewRole from './role-crud/view.role.component';
import EditRole from './role-crud/edit.role.component';

const RBACManagement: React.FC = () => {
  const [isFetchingData, setIsFetchData] = useState(true);
  const [isAddNewRole, setIsAddNewRole] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [canDelete, setCanDelete] = useState(true);
  const [canEdit, setCanEdit] = useState(true)
  const [selectedRole, setSelectedRole] = useState<Role | undefined>(undefined);
  const [isShowDeleteDialog, setIsShowDeleteDialog] = useState(false);

  const [roles, setRoles] = useState<Role[]>([]);
  const [apps, setApps] = useState<any[]>([]);
  const [channels, setChannels] = useState<any[]>([]);
  const [mediators, setMediators] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);


  useEffect(() => {
    setIsFetchData(true);

    Promise.all([
      getRoles(),
      getApps(),
      getChannels(),
      getMediators(),
      getClients(),
      getTransactions(),
    ])
      .then(([roles, apps, channels, mediators, clients, transactions]) => {
        setRoles(roles);
        setSelectedRole(structuredClone(roles[0]));
        setApps(apps);
        setChannels(channels);
        setMediators(mediators);
        setClients(clients);
        setTransactions(transactions);
      })
      .catch(err => {
        console.error(err);
        alert('Error loading data');
      })
      .finally(() => {
        setIsFetchData(false);
      })
  }, []);


  const onAttemptToEditRole = () => {
    setIsEditing(true);
  };

  const onCancelEditRole = () => {
    setIsEditing(false);
  };

  const submitEditRole = async (role: Role) => {
    try {
      await editRoleByName(role.name, role);
      alert('Role successfully edited');
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert('Error editing role');
    }
  }

  const onAttemptToAddRole = () => {
    setIsAddNewRole(true);
  };

  const submitAddNewRole = async (role: Role) => {
    try {
      await createNewRole(role);
      alert('Role successfully created');
      setIsAddNewRole(false);
    } catch(err) {
      console.error(err);
      alert('Error submitting new role');
    }
  };

  const onCancelAddNewRole = () => {
    setIsAddNewRole(false);
  };

  const onSelectedRoleChange = (event: SelectChangeEvent) => {
    const name = event.target.value;
    const currentRole = roles.find(role => role.name == name);

    if (!currentRole) {
      alert('Could not find current role.');
      return;
    }
    
    setSelectedRole(structuredClone(currentRole));
    setCanEdit(currentRole.name.toLowerCase() != 'admin');
    setCanDelete(currentRole.name.toLowerCase() != 'admin');
  };

  const submitDeleteRole = async () => {
    try {
      await deleteRoleByName('');
    } catch (err) {
      console.error(err);
      alert('Error deleting role');
    }

    setIsShowDeleteDialog(false);
  };

  const onAttemptToDeleteRole = () => {
    setIsShowDeleteDialog(true);
  };



  if (isFetchingData) return <Loader />;

  if (!selectedRole) {
    return <div>No role selected</div>;
  }


  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      {JSON.stringify(selectedRole)}
      <Typography variant="h4" gutterBottom>
        Add or Edit a User Role
      </Typography>
      <Typography variant="h6" gutterBottom>
        Select an existing role to edit or click Add New Role to create a new one
      </Typography>


      <Grid container style={{ marginTop: '20px' }}>
          <ButtonGroup variant="contained" size="large">
            <Button
              color="secondary"
              onClick={onAttemptToEditRole}
              disabled={!canEdit}
              >
              Edit Role
            </Button>
            <Button
              color="primary"
              onClick={onAttemptToAddRole}
            >
              Add New Role
            </Button>
            <Button
              color="error"
              onClick={onAttemptToDeleteRole}
              disabled={!canDelete}
            >
              Delete Role
            </Button>
          </ButtonGroup>
      </Grid>

      <BasicDialog
        title='Add New Role'
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
        title='Edit Role'
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
        title="Delete Role"
        message="Are you sure you want to delete this role?"
        open={isShowDeleteDialog}
        onNo={() => setIsShowDeleteDialog(false)}
        onYes={submitDeleteRole}
      />


      <Grid container spacing={2} style={{ marginTop: '20px' }}>
        <Grid item xs={10}>
        <Select
          fullWidth
          multiple={false}
          value={selectedRole?.name ?? undefined}
          onChange={onSelectedRoleChange}
        >
          {
            roles.map(role => (
              <MenuItem key={role.name} value={role.name}>{role.name}</MenuItem>
            ))
          }
        </Select>
        </Grid>
      </Grid>

      <ViewRole role={selectedRole} isReadOnly={true} />

    </div>
  );
};

export default RBACManagement;
