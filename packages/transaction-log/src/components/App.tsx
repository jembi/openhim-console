import React, { useState, useEffect } from 'react';
import { Container, Tab, Tabs, Box, Typography, Card } from '@mui/material';
import CustomFilters from './CustomFilters';
import BasicFilters from './BasicFilters';
import TransactionLogTable from './TransactionLogTable';
import { fetchTransactions, fetchChannelById, fetchClientById } from '@jembi/openhim-core-api';

const App: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [limit, setLimit] = useState(10);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchTransactionLogs();
  }, [limit]);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue);
  };

  const fetchTransactionLogs = async () => {
    try {
      const transactions = await fetchTransactions({
        filterLimit: limit,
        filterPage: 0,
        filters: {},
      });

      const transactionsWithChannelDetails = await Promise.all(
        transactions.map(async transaction => {
          const channelName = await fetchChannelDetails(transaction.channelID);
          const clientName = await fetchClientDetails(transaction.clientID);
          return { ...transaction, channelName, clientName };
        })
      );

      setTransactions(transactionsWithChannelDetails);
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  const fetchChannelDetails = async (channelID: string) => {
    try {
      const response = await fetchChannelById(channelID);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const channel = await response.json();
      return channel.name;
    } catch (error) {
      console.error('Error fetching logs:', error);
      return 'Unknown';
    }
  };

  const fetchClientDetails = async (clientID: string) => {
    try {
      const response = await fetchClientById(clientID);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const client = await response.json();
      return client.name;
    } catch (error) {
      console.error('Error fetching logs:', error);
      return 'Unknown';
    }
  };

  const loadMore = () => {
    setLimit(prevLimit => prevLimit + 20);
  };

  return (
    <Container
      sx={{
        backgroundColor: '#F1F1F1',
        maxWidth: '100% !important'
      }}
    >
      <Box sx={{}}>
        <Typography
          variant='h4'
          sx={{
            fontFamily: 'Roboto',
            fontSize: '34px',
            fontWeight: 400,
            lineHeight: '41.99px',
            letterSpacing: '0.25px',
            textAlign: 'left'
          }}
        >
          Transactions Log
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            fontFamily: 'Roboto',
            fontSize: '16px',
            fontWeight: 400,
            lineHeight: '28px',
            letterSpacing: '0.15px',
            textAlign: 'left',
            marginTop: '8px'
          }}
        >
          A log of the recent transactions through the system. Use Basic or
          Advanced filters to find specific transactions to investigate or
          rerun. Use settings to modify the list behaviour.
        </Typography>
      </Box>
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: 2 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="basic tabs"
            TabIndicatorProps={{ style: { backgroundColor: '#54C4A4' } }}
          >
            <Tab
              label="Basic Filters"
              sx={{ color: tabValue === 0 ? '#54C4A4' : '#54C4A4' }}
            />
            <Tab
              label="Custom Filters"
              sx={{ color: tabValue === 1 ? '#54C4A4' : 'inherit' }}
            />
          </Tabs>
        </Box>

        {tabValue === 0 && <BasicFilters limit={limit} setLimit={setLimit} />}
        {tabValue === 1 && <CustomFilters limit={limit} setLimit={setLimit} />}
        <TransactionLogTable transactions={transactions} loadMore={loadMore} />
      </Card>
    </Container>
  );
};

export default App;
