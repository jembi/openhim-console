import {
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  Switch
} from '@mui/material';
import React, { useEffect } from 'react';
import { Permission, Role } from '../types/index';
import { PermissionChip } from '../components/helpers/permission.chip.component';

export type ViewRoleProps = {
  role: Role;
  isReadOnly?: boolean;
}

function ViewRole(props: ViewRoleProps): React.ReactElement {
  const selectedRole = props.role;

  useEffect(() => {
   
  }, []);

  const handlePermissionSwitchChange = (key: keyof Permission) => {
    // @ts-ignore
    selectedRole.permissions[key] = !selectedRole.permissions[key];
  }

  const handlePermissionListChange = (key: keyof Permission, values: string[]) => {
    // @ts-ignore
    selectedRole.permissions[key] = values;
  }

  return (
    <div style={{ minWidth: '800px', margin: '0 auto' }}>
      <FormControl aria-readonly={true} disabled={true} component="fieldset" style={{ width: '100%' }}>
        
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
                <PermissionChip data={props.role.permissions['channel-view-specified']} />
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
                <PermissionChip data={props.role.permissions['channel-manage-specified']} />
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
                <PermissionChip data={props.role.permissions['client-view-specified']} />
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
                <PermissionChip data={props.role.permissions['client-manage-specified']} />
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
                <PermissionChip data={props.role.permissions['client-role-view-specified']} />
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
                <PermissionChip data={props.role.permissions['client-role-manage-specified']} />
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
                <PermissionChip data={props.role.permissions['transaction-view-specified']} />
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
                <PermissionChip data={props.role.permissions['transaction-view-body-specified']} />
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
                <PermissionChip data={props.role.permissions['mediator-manage-specified']} />
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
                <PermissionChip data={props.role.permissions['app-view-specified']} />
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

      </FormControl>
    </div>
  );
};

export default ViewRole;
