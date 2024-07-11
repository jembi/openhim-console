import React from 'react'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ThemeProvider } from '@emotion/react'
import theme from '@jembi/openhim-theme'
import { AlertProvider } from './contexts/alert.context';
import { ConfirmationProvider } from './contexts/confirmation.context';
import { BasicDialogProvider } from './contexts/dialog.context';
import UserRoleList from './screens/list.role.screen';
import { getRoles } from './services/api';


const router = createBrowserRouter([
  {
    path: "/",
    element: <UserRoleList />,
    loader: getRoles,
  },
], {
});


export default function Root() {
  return (
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <BasicDialogProvider>
          <AlertProvider>
            <ConfirmationProvider>
              <RouterProvider router={router} />
            </ConfirmationProvider>
          </AlertProvider>
        </BasicDialogProvider>
      </ThemeProvider>
    </React.StrictMode>
  )
}

