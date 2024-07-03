import React from 'react';
import { Grid, Typography } from '@mui/material';
import MediatorBarChart from "./charts/mediator-bar-chart.component";
import MediatorLineChart from "./charts/mediator-line-chart.component";

export default function Charts() {
	return (
		<Grid container spacing={2} padding={2}>
			<Grid item xs={12}>
				<Typography variant="h3">Charts</Typography>
				<p>
					An overview of recent transactions through your mediator. 
				</p>
			</Grid>
			<Grid item>
				<Grid container spacing={2}>
					<Grid item xs={6}>
						<MediatorBarChart />
					</Grid>
					<Grid item>
						<MediatorLineChart />
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	);
}

