import React, { useEffect, useState } from 'react';
import {
  Button,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  MenuItem,
  Select,
  Switch,
  TextField,
} from '@mui/material';
import { Permission, Role } from '../../types';
import { defaultRole } from '../../utils';

export type CreateRoleProps = {
  onSubmit: (role: Role) => unknown;
  onCancel: () => unknown;
  channels: any[];
  apps: any[];
  mediators: any[];
  clients: any[];
  transactions: any[];
}

function CreateRole(props: CreateRoleProps): React.ReactElement {
  const [selectedRole, setSelectedRole] = useState<Role>(structuredClone(defaultRole));

  useEffect(() => {
   
  }, []);

  const handleSave = () => {
    props.onSubmit(structuredClone(selectedRole))
  };

  const handleCancel = () => {
    props.onCancel();
  };

  const handlePermissionSwitchChange = (key: keyof Permission) => {
    // @ts-ignore
    selectedRole.permissions[key] = !selectedRole.permissions[key];
    setSelectedRole(structuredClone(selectedRole));
  }

  const handlePermissionListChange = (key: keyof Permission, values: string[]) => {
    // @ts-ignore
    selectedRole.permissions[key] = values;
    setSelectedRole(structuredClone(selectedRole));
  }

  return (
    <div style={{ minWidth: '800px', margin: '0 auto' }}>
      <FormControl component="fieldset" style={{ width: '100%' }}>
        <Grid container spacing={2} style={{ marginTop: '20px' }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="New Role Name"
              value={selectedRole.name}
              onChange={evt => setSelectedRole({ ...selectedRole, name: evt.target.value })}
              style={{ marginBottom: '20px' }}
              error={selectedRole.name.trim().length == 0}
              helperText={selectedRole.name.trim().length == 0 && 'Role name is required'}
            />
          </Grid>
        </Grid>

        <section id="permissions">
          <Grid container spacing={2} style={{ marginTop: '20px' }}>
            <Grid item xs={6}>
              <FormGroup>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={selectedRole.permissions['channel-view-all']}
                          onChange={() => handlePermissionSwitchChange('channel-view-all')}
                        />
                      }
                      label="Channel View All"
                    />
                  </Grid>
                </Grid>
              </FormGroup>
            </Grid>
            
            <Grid item xs={6}>
              <FormControl fullWidth>
                <FormLabel>Channel View Specified</FormLabel>
                <Select
                  disabled={selectedRole.permissions['channel-view-all']}
                  multiple
                  value={selectedRole.permissions['channel-view-specified']}
                  onChange={evt => handlePermissionListChange('channel-view-specified', evt.target.value as string[])}
                >
                  {
                    props.channels.map(channel => (
                      <MenuItem key={channel.name} value={channel.name}>{channel.name}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Grid container spacing={2} style={{ marginTop: '20px' }}>
            <Grid item xs={6}>
              <FormGroup>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={selectedRole.permissions['channel-manage-all']}
                          onChange={() => handlePermissionSwitchChange('channel-manage-all')}
                        />
                      }
                      label="Channel Manage All"
                    />
                  </Grid>
                </Grid>
              </FormGroup>
            </Grid>
            
            <Grid item xs={6}>
              <FormControl fullWidth>
                <FormLabel>Channel Manage Specified</FormLabel>
                <Select
                  multiple
                  disabled={selectedRole.permissions['channel-manage-all']}
                  value={selectedRole.permissions['channel-manage-specified']}
                  onChange={evt => handlePermissionListChange('channel-manage-specified', evt.target.value as string[])}
                >
                  {
                    props.channels.map(channel => (
                      <MenuItem key={channel.name} value={channel.name}>{channel.name}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Grid container spacing={2} style={{ marginTop: '20px' }}>
            <Grid item xs={6}>
              <FormGroup>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={selectedRole.permissions['client-view-all']}
                          onChange={() => handlePermissionSwitchChange('client-view-all')}
                        />
                      }
                      label="Client View All"
                    />
                  </Grid>
                </Grid>
              </FormGroup>
            </Grid>
            
            <Grid item xs={6}>
              <FormControl fullWidth>
                <FormLabel>Client View Specified</FormLabel>
                <Select
                  multiple
                  disabled={selectedRole.permissions['client-view-all']}
                  value={selectedRole.permissions['client-view-specified']}
                  onChange={evt => handlePermissionListChange('client-view-specified', evt.target.value as string[])}
                >
                  {
                    props.clients.map(client => (
                      <MenuItem key={client._id} value={client._id}>{client._id}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Grid container spacing={2} style={{ marginTop: '20px' }}>
            <Grid item xs={6}>
              <FormGroup>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={selectedRole.permissions['client-manage-all']}
                          onChange={() => handlePermissionSwitchChange('client-manage-all')}
                        />
                      }
                      label="Client Manage All"
                    />
                  </Grid>
                </Grid>
              </FormGroup>
            </Grid>
            
            <Grid item xs={6}>
              <FormControl fullWidth>
                <FormLabel>Client Manage Specified</FormLabel>
                <Select
                  multiple
                  value={selectedRole.permissions['client-manage-specified']}
                  onChange={evt => handlePermissionListChange('client-manage-specified', evt.target.value as string[])}
                >
                  {
                    props.clients.map(client => (
                      <MenuItem key={client.name} value={client.name}>{client.name}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Grid container spacing={2} style={{ marginTop: '20px' }}>
            <Grid item xs={6}>
              <FormGroup>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={selectedRole.permissions['client-role-view-all']}
                          onChange={() => handlePermissionSwitchChange('client-role-view-all')}
                        />
                      }
                      label="Client Role View All"
                    />
                  </Grid>
                </Grid>
              </FormGroup>
            </Grid>
            
            <Grid item xs={6}>
              <FormControl fullWidth>
                <FormLabel>Client Role View Specified</FormLabel>
                <Select
                  multiple
                  value={selectedRole.permissions['client-role-view-specified']}
                  onChange={evt => handlePermissionListChange('client-role-view-specified', evt.target.value as string[])}
                >
                  {/* {
                    channels.map(channel => (
                      <MenuItem key={channel.name} value={channel.name}>{channel.name}</MenuItem>
                    ))
                  } */}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Grid container spacing={2} style={{ marginTop: '20px' }}>
            <Grid item xs={6}>
              <FormGroup>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={selectedRole.permissions['client-role-manage-all']}
                          onChange={() => handlePermissionSwitchChange('client-role-manage-all')}
                        />
                      }
                      label="Client Role Manage All"
                    />
                  </Grid>
                </Grid>
              </FormGroup>
            </Grid>
            
            <Grid item xs={6}>
              <FormControl fullWidth>
                <FormLabel>Client Role Manage Specified</FormLabel>
                <Select
                  multiple
                  value={selectedRole.permissions['client-role-manage-specified']}
                  onChange={evt => handlePermissionListChange('client-role-manage-specified', evt.target.value as string[])}
                >
                  {
                    // channels.map(channel => (
                    //   <MenuItem key={channel.name} value={channel.name}>{channel.name}</MenuItem>
                    // ))
                  }
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Grid container spacing={2} style={{ marginTop: '20px' }}>
            <Grid item xs={6}>
              <FormGroup>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={selectedRole.permissions['transaction-view-all']}
                          onChange={() => handlePermissionSwitchChange('transaction-view-all')}
                        />
                      }
                      label="Transaction View All"
                    />
                  </Grid>
                </Grid>
              </FormGroup>
            </Grid>
            
            <Grid item xs={6}>
              <FormControl fullWidth>
                <FormLabel>Transaction View All Specified</FormLabel>
                <Select
                  multiple
                  value={selectedRole.permissions['transaction-view-specified']}
                  onChange={evt => handlePermissionListChange('transaction-view-specified', evt.target.value as string[])}
                >
                  {
                    props.transactions.map(transaction => (
                      <MenuItem key={transaction.name} value={transaction.name}>{transaction.name}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Grid container spacing={2} style={{ marginTop: '20px' }}>
            <Grid item xs={6}>
              <FormGroup>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={selectedRole.permissions['transaction-view-body-all']}
                          onChange={() => handlePermissionSwitchChange('transaction-view-body-all')}
                        />
                      }
                      label="Transaction View Body All"
                    />
                  </Grid>
                </Grid>
              </FormGroup>
            </Grid>
            
            <Grid item xs={6}>
              <FormControl fullWidth>
                <FormLabel>Transaction View Body All Specified</FormLabel>
                <Select
                  multiple
                  value={selectedRole.permissions['transaction-view-body-specified']}
                  onChange={evt => handlePermissionListChange('transaction-view-body-specified', evt.target.value as string[])}
                >
                  {
                    props.transactions.map(transaction => (
                      <MenuItem key={transaction.name} value={transaction.name}>{transaction.name}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Grid container spacing={2} style={{ marginTop: '20px' }}>
            <Grid item xs={6}>
              <FormGroup>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={selectedRole.permissions['mediator-manage-all']}
                          onChange={() => handlePermissionSwitchChange('mediator-manage-all')}
                        />
                      }
                      label="Mediator Manage All"
                    />
                  </Grid>
                </Grid>
              </FormGroup>
            </Grid>
            
            <Grid item xs={6}>
              <FormControl fullWidth>
                <FormLabel>Mediator Manage Specified</FormLabel>
                <Select
                  multiple
                  value={selectedRole.permissions['mediator-manage-specified']}
                  onChange={evt => handlePermissionListChange('mediator-manage-specified', evt.target.value as string[])}
                >
                  {
                    props.mediators.map(mediator => (
                      <MenuItem key={mediator.name} value={mediator.name}>{mediator.name}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Grid container spacing={2} style={{ marginTop: '20px' }}>
            <Grid item xs={6}>
              <FormGroup>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={selectedRole.permissions['app-view-all']}
                          onChange={() => handlePermissionSwitchChange('app-view-all')}
                        />
                      }
                      label="App View All"
                    />
                  </Grid>
                </Grid>
              </FormGroup>
            </Grid>
            
            <Grid item xs={6}>
              <FormControl fullWidth>
                <FormLabel>App View Specified</FormLabel>
                <Select
                  multiple
                  value={selectedRole.permissions['app-view-specified']}
                  onChange={evt => handlePermissionListChange('app-view-specified', evt.target.value as string[])}
                >
                  {
                    props.apps.map(app => (
                      <MenuItem key={app.name} value={app.name}>{app.name}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Grid container spacing={2} style={{ marginTop: '20px' }}>
            <Grid item xs={6}>
              <FormGroup>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={selectedRole.permissions['app-manage-all']}
                          onChange={() => handlePermissionSwitchChange('app-manage-all')}
                        />
                      }
                      label="App Manage All"
                    />
                  </Grid>
                </Grid>
              </FormGroup>
            </Grid>
          </Grid>

          <Grid container spacing={2} style={{ marginTop: '20px' }}>
            <Grid item xs={6}>
              <FormGroup>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={selectedRole.permissions['user-view']}
                          onChange={() => handlePermissionSwitchChange('user-view')}
                        />
                      }
                      label="User View"
                    />
                  </Grid>
                </Grid>
              </FormGroup>
            </Grid>
            
            <Grid item xs={6}>
              <FormControl fullWidth>
                <FormControlLabel
                  control={
                    <Switch
                      checked={selectedRole.permissions['user-manage']}
                      onChange={() => handlePermissionSwitchChange('user-manage')}
                    />
                  }
                  label="User Manage"
                />
              </FormControl>
            </Grid>
          </Grid>

          <Grid container spacing={2} style={{ marginTop: '20px' }}>
            <Grid item xs={6}>
              <FormGroup>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={selectedRole.permissions['user-role-view']}
                          onChange={() => handlePermissionSwitchChange('user-role-view')}
                        />
                      }
                      label="User Role View"
                    />
                  </Grid>
                </Grid>
              </FormGroup>
            </Grid>
            
            <Grid item xs={6}>
              <FormControl fullWidth>
                <FormControlLabel
                  control={
                    <Switch
                      checked={selectedRole.permissions['user-role-manage']}
                      onChange={() => handlePermissionSwitchChange('user-role-manage')}
                    />
                  }
                  label="User Role Manage"
                />
              </FormControl>
            </Grid>
          </Grid>

          <Grid container spacing={2} style={{ marginTop: '20px' }}>
            <Grid item xs={6}>
              <FormGroup>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={selectedRole.permissions['audit-trail-view']}
                          onChange={() => handlePermissionSwitchChange('audit-trail-view')}
                        />
                      }
                      label="Audit Trail View"
                    />
                  </Grid>
                </Grid>
              </FormGroup>
            </Grid>
            
            <Grid item xs={6}>
              <FormControl fullWidth>
                <FormControlLabel
                  control={
                    <Switch
                      checked={selectedRole.permissions['audit-trail-manage']}
                      onChange={() => handlePermissionSwitchChange('audit-trail-manage')}
                    />
                  }
                  label="Audit Trail Manage"
                />
              </FormControl>
            </Grid>
          </Grid>

          <Grid container spacing={2} style={{ marginTop: '20px' }}>
            <Grid item xs={6}>
              <FormGroup>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={selectedRole.permissions['contact-list-view']}
                          onChange={() => handlePermissionSwitchChange('contact-list-view')}
                        />
                      }
                      label="Contact List View"
                    />
                  </Grid>
                </Grid>
              </FormGroup>
            </Grid>
            
            <Grid item xs={6}>
              <FormControl fullWidth>
                <FormControlLabel
                  control={
                    <Switch
                      checked={selectedRole.permissions['contact-list-manage']}
                      onChange={() => handlePermissionSwitchChange('contact-list-manage')}
                    />
                  }
                  label="Contact List Manage"
                />
              </FormControl>
            </Grid>
          </Grid>

          <Grid container spacing={2} style={{ marginTop: '20px' }}>
            <Grid item xs={6}>
              <FormGroup>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={selectedRole.permissions['certificates-view']}
                          onChange={() => handlePermissionSwitchChange('certificates-view')}
                        />
                      }
                      label="Certificates View"
                    />
                  </Grid>
                </Grid>
              </FormGroup>
            </Grid>
            
            <Grid item xs={6}>
              <FormControl fullWidth>
                <FormControlLabel
                  control={
                    <Switch
                      checked={selectedRole.permissions['certificates-manage']}
                      onChange={() => handlePermissionSwitchChange('certificates-manage')}
                    />
                  }
                  label="Certificates Manage"
                />
              </FormControl>
            </Grid>
          </Grid>

          <Grid container spacing={2} style={{ marginTop: '20px' }}>
            <Grid item xs={6}>
              <FormGroup>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={selectedRole.permissions['logs-view']}
                          onChange={() => handlePermissionSwitchChange('logs-view')}
                        />
                      }
                      label="Logs View"
                    />
                  </Grid>
                </Grid>
              </FormGroup>
            </Grid>
            
            <Grid item xs={6}>
              <FormControl fullWidth>
                <FormControlLabel
                  control={
                    <Switch
                      checked={selectedRole.permissions['import-export']}
                      onChange={() => handlePermissionSwitchChange('import-export')}
                    />
                  }
                  label="Import Export"
                />
              </FormControl>
            </Grid>
          </Grid>

        </section>

        <Grid container spacing={2} style={{ marginTop: '20px' }}>
          <Grid item xs={6}>
            <Button variant="outlined" fullWidth onClick={handleCancel} style={{ backgroundColor: 'white' }}>
              Cancel
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button disabled={selectedRole.name.trim().length == 0} variant="contained" fullWidth color="primary" onClick={handleSave} style={{ backgroundColor: 'green', color: 'white' }}>
              Save
            </Button>
          </Grid>
        </Grid>

      </FormControl>
    </div>
  );
};

export default CreateRole;
