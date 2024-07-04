import React, { useState } from 'react';
import { Grid, Typography, Card } from '@mui/material';
import MediatorBarChart from "./charts/mediator-bar-chart.component";
import MediatorLineChart from "./charts/mediator-line-chart.component";
import { getTransactions } from '../services/api';
import { Transaction } from '../types';
import BasicFilter, { BasicFilterObj } from './filters/basic.filter.component';
import Loader from './ux/loader.component';

export default function Charts() {
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [isFetchingTransactions, setIsFetchingTransactions] = useState(true);

	const getFilteredTransactions = () => {
		setIsFetchingTransactions(true);
		getTransactions()
			.then(transactions => {
				setIsFetchingTransactions(false);
				setTransactions(transactions)
			})
			.catch(err => {
				setIsFetchingTransactions(false);
				console.error(err)
			});
	}

	React.useEffect(() => {
		getFilteredTransactions();
	}, []);

	const onFilterChange = (filter: BasicFilterObj) => {
		getFilteredTransactions();
	};


	if (isFetchingTransactions) {
		return <Loader />
	}

	return (
		<Grid container spacing={2} padding={2}>
			<Grid item xs={12}>
				<Typography variant="h3">Charts</Typography>
				<p>
					An overview of recent transactions through your mediator. 
				</p>
			</Grid>
			<Grid item xs={12}>
				<BasicFilter onFilterChange={onFilterChange} />
			</Grid>
			<Grid item>
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<Card>
							<MediatorBarChart data={transactions} />
						</Card>
					</Grid>
					{/* <Grid item>
						<Card>
							<MediatorLineChart />
						</Card>
					</Grid> */}
				</Grid>
			</Grid>
		</Grid>
	);
}

