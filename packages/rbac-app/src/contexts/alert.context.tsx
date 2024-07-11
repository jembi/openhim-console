import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AlertColor } from '@mui/material/Alert';
import { AlertDialog } from '../components/dialogs/alert.dialog.component';

interface AlertContextProps {
  showAlert: (message: string, title: string, severity?: AlertColor) => void;
  hideAlert: () => void;
}

const AlertContext = createContext<AlertContextProps | undefined>(undefined);

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [alert, setAlert] = useState<{ message: string; title?: string; severity?: AlertColor; open: boolean }>({
    message: '',
    title: '',
    severity: 'info',
    open: false,
  });

  const showAlert = (message: string, title: string, severity: AlertColor = 'info') => {
    setAlert({ message, title, severity, open: true });
  };

  const hideAlert = () => {
    setAlert((prevAlert) => ({ ...prevAlert, open: false }));
  };

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      <AlertDialog
        message={alert.message}
        title={alert.title}
        severity={alert.severity}
        open={alert.open}
        onClose={hideAlert}
      />
    </AlertContext.Provider>
  );
};

export const useAlert = (): AlertContextProps => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};
