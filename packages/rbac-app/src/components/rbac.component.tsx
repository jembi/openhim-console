import React, { useEffect, useState } from 'react';
import {
  FormControlLabel,
  FormGroup,
  FormControl,
  FormLabel,
  Button,
  Select,
  MenuItem,
  Typography,
  Grid,
  Switch,
  TextField,
  SelectChangeEvent,
  DialogTitle,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  ButtonGroup,
} from '@mui/material';
import {
  getRoles,
  getApps,
  getChannels,
  getMediators,
  getClients,
  getTransactions,
} from '../services/api';
import { Permission, Role } from '../types';
import Loader from './loader.component';
import { defaultRole } from '../utils';
import CreateRole from './create.role.component';
import ViewRole from './view.role.component';
import { BasicDialog } from './basic.dialog.component';
import { ConfirmationDialog } from './confirmation.dialog.component';

const RBACManagement: React.FC = () => {
  const [formState, setFormState] = useState<Role[]>([]);
  const [isAddNewRole, setIsAddNewRole] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | undefined>(undefined);
  const [isShowDeleteDialog, setIsShowDeleteDialog] = useState(false);

  const [apps, setApps] = useState<any[]>([]);
  const [channels, setChannels] = useState<any[]>([]);
  const [mediators, setMediators] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);


  useEffect(() => {

    Promise.all([
      getRoles(),
      getApps(),
      getChannels(),
      getMediators(),
      getClients(),
      getTransactions(),
    ])
      .then(([roles, apps, channels, mediators, clients, transactions]) => {
        roles[0].permissions['channel-view-specified'] = ['test 1', 'test 4', 'test 7'];
        setSelectedRole(structuredClone(roles[0]));
        setFormState(roles);
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
  }, []);


  const onEditRole = () => {
    setIsEditing(true);
  };

  const onCancelEditRole = () => {
    setIsEditing(false);
  };

  const onAddNewRole = () => {
    const newRole = defaultRole;
    const roles = structuredClone([ ...formState, newRole ]);

    setFormState(roles);
    setSelectedRole(roles.at(-1));
    setIsAddNewRole(true);
  };

  const onCancelAddNewRole = () => {
    formState.pop();
    setIsAddNewRole(false);
    setSelectedRole(formState.length > 0 ? formState.at(-1) : undefined);
  };

  const handleSelectedRoleChange = (event: SelectChangeEvent) => {
    const name = event.target.value;
    
    setSelectedRole(structuredClone(formState.find(role => role.name == name)));
  };

  const handleSave = () => {
    console.log('Permissions saved:', formState);
    getRoles();
  };

  const handleCancel = () => {
    console.log('Action cancelled');
  };

  const onAttemptToDeleteRole = () => {
    setIsShowDeleteDialog(true);
  };


  // TODO: Fix this up.
  if (!selectedRole) return <Loader />;

  const handlePermissionSwitchChange = (key: keyof Permission) => {
    // @ts-ignore
    selectedRole.permissions[key] = !selectedRole.permissions[key];
    setSelectedRole(structuredClone(selectedRole));

    // const ref = formState.find(f => selectedRole.name == f.name);
  }

  const handlePermissionListChange = (key: keyof Permission, values: string[]) => {
    // @ts-ignore
    selectedRole.permissions[key] = values;
    setSelectedRole(structuredClone(selectedRole));
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
              color="warning"
              onClick={onCancelAddNewRole}
            >
              Cancel Adding Role
            </Button>
            <Button
              color="warning"
              onClick={onCancelEditRole}
            >
              Cancel Editing Role
            </Button>    
            <Button
              color="secondary"
              onClick={onEditRole}
              >
              Edit Role
            </Button>
            <Button
              color="primary"
              onClick={onAddNewRole}
            >
              Add New Role
            </Button>
            <Button
              color="error"
              onClick={onAttemptToDeleteRole}
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
          onSubmit={() => 1}
          onCancel={onCancelAddNewRole}
      />
      </BasicDialog>

      <ConfirmationDialog
        title="Delete Role"
        message="Are you sure you want to delete this role?"
        open={isShowDeleteDialog}
        onNo={() => setIsShowDeleteDialog(false)}
        onYes={() => setIsShowDeleteDialog(true)}
      />

      <ViewRole role={selectedRole} />

    </div>
  );
};

export default RBACManagement;
