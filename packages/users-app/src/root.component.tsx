import {ThemeProvider} from '@emotion/react'
import theme from '@jembi/openhim-theme'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import {RouterProvider} from 'react-router-dom'
import {AlertProvider} from './contexts/alert.context'
import {BasicBackdropProvider} from './contexts/backdrop.context'
import {ConfirmationProvider} from './contexts/confirmation.context'
import {BasicDialogProvider} from './contexts/dialog.context'
import router from './router'
import { Routes } from './types'
import UsersList from './screens/list.users.screen'
import AddUser from './screens/create.user.component'
import EditUser from './screens/edit.user.component'

const queryClient = new QueryClient()

export default function Root() {
  const [currentRoute, setRoute] = useState<Routes>(Routes.USERS);
  const [editUser, setEditUser] = useState();

  useEffect(() => {
    const handleLocationChange = (event) => {
      const url = window.location.toString()
      setEditUser(null);
      if (url.includes('create')) {
        setRoute(Routes.CREATE_USER)
        return
      }
      else if (url.includes('edit')) {
        setEditUser(event.state);
        setRoute(Routes.EDIT_USER)
        return
      }
      setRoute(Routes.USERS)
    }

    window.addEventListener('popstate', handleLocationChange)

    return () => {
      window.removeEventListener('popstate', handleLocationChange)
    }
  }, []);
  

  return (
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <BasicDialogProvider>
            <BasicBackdropProvider>
              <AlertProvider>
                <ConfirmationProvider>
                  {currentRoute === Routes.USERS && <UsersList />}
                  {currentRoute === Routes.CREATE_USER && <AddUser />}
                  {currentRoute === Routes.EDIT_USER && <EditUser editUser={editUser}/>}
                </ConfirmationProvider>
              </AlertProvider>
            </BasicBackdropProvider>
          </BasicDialogProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </React.StrictMode>
  )
}
