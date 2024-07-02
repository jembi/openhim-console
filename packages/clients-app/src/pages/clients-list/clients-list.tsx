import { Button } from "@mui/material";
import { Client } from "../../types";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { FC, useState } from 'react';

const columns: GridColDef[] = [
  { field: "clientID", headerName: "ID", width: 90,  },
  { field: "name", headerName: "Name", width: 150 },
  { field: "organization", headerName: "Organization", width: 150 },
  { field: "softwareName", headerName: "Software Name", width: 150 },
  { field: "description", headerName: "Description", width: 150 },
  { field: "contactPerson", headerName: "Contact Person", width: 150 },
  { field: "clientDomain", headerName: "Domain", width: 150 },
  { field: "roles", headerName: "Roles", width: 150 },
  {
    field: "actions",
    headerName: "Actions",
    width: 150,
    renderCell: (params) => (
      <button type="button" onClick={() => (params.row.clientID)}>
        Edit
      </button>
    ),
  },
];

interface ClientsListProps {
  addClient: () => void;
  editClient: (id: string) => void;
}

const ClientsList: FC<ClientsListProps> = ({addClient, editClient}) => {

  const columns: GridColDef[] = [
    { field: "clientID", headerName: "ID", width: 90,  },
    { field: "name", headerName: "Name", width: 150 },
    { field: "organization", headerName: "Organization", width: 150 },
    { field: "softwareName", headerName: "Software Name", width: 150 },
    { field: "description", headerName: "Description", width: 150 },
    { field: "contactPerson", headerName: "Contact Person", width: 150 },
    { field: "clientDomain", headerName: "Domain", width: 150 },
    { field: "roles", headerName: "Roles", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <button type="button" onClick={() => editClient(params.row.clientID)}>
          Edit
        </button>
      ),
    },
  ];


  const [clients, setClients] = useState<Client[]>([
    {
      clientID: "dev1",
      clientDomain: "client.com",
      name: "Dev Tech",
      roles: ["kafka"],
      organization: "Client",
      location: "USA",
      softwareName: "Client Software",
      description: "Client Description",
      contactPerson: "Client Person",
      contactEmail: "",
    },
    {
      clientID: "aero1",
      clientDomain: "client2.com",
      name: "Aero Health",
      roles: ["fhir"],
      organization: "Client",
      location: "USA",
      softwareName: "Client Software",
      description: "Client Description",
      contactPerson: "Client Person",
      contactEmail: "",
    },
  ]);

  return (
    <>
      <h1>Clients List</h1>
      <p>
        Control client systems and their access roles. Add clients to enable
        their request routing and group them by roles for streamlined channel
        access management
      </p>
      <Button color="success" variant="contained" onClick={addClient}>+ Add</Button>
      <DataGrid
        getRowId={(row) => row.clientID}
        rows={clients}
        columns={columns}
        slots={{toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            printOptions: { disableToolbarButton: true },
            csvOptions: { disableToolbarButton: true },
          },
        
        }}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
      />
    </>
  );
};

export default ClientsList;
