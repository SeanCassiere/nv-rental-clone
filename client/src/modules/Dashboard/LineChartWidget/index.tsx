import React, { useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, selectDashboard, selectFetchSalesStatusStatistics } from "../../../shared/redux/store";
import { fetchSalesStatuses } from "../../../shared/redux/thunks/allProcessesThunks/fetchSalesStatusStatistics";
import { WIDGET_MEDIUM_HEIGHT } from "../BeautifulDNDGrid";

export default function LineChartWidget() {
	const dispatch = useDispatch<AppDispatch>();
	const { salesStatusData } = useSelector(selectDashboard);
	const { isProcessing } = useSelector(selectFetchSalesStatusStatistics);

	useEffect(() => {
		const promise = dispatch(fetchSalesStatuses());

		return () => {
			promise.abort();
		};
	}, [dispatch]);

	if (isProcessing) {
		return <div style={{ minHeight: WIDGET_MEDIUM_HEIGHT }}></div>;
	}

	return (
		<ResponsiveContainer width='100%' height={WIDGET_MEDIUM_HEIGHT}>
			<AreaChart
				data={salesStatusData}
				margin={{
					top: 5,
					right: 30,
					left: 20,
					bottom: 5,
				}}
			>
				<defs>
					<linearGradient id='colorUv' x1='0' y1='0' x2='0' y2='1'>
						<stop offset='5%' stopColor='#30D0B6' stopOpacity={0.8} />
						<stop offset='95%' stopColor='#30D0B6' stopOpacity={0} />
					</linearGradient>
					<linearGradient id='colorUv2' x1='0' y1='0' x2='0' y2='1'>
						<stop offset='5%' stopColor='#1E649E' stopOpacity={0.8} />
						<stop offset='95%' stopColor='#1E649E' stopOpacity={0} />
					</linearGradient>
				</defs>
				<CartesianGrid vertical={false} stroke='#DDD' />
				<XAxis dataKey='monthName' />
				<YAxis />
				<Tooltip />

				<Area
					type='monotone'
					dataKey='previousTotal'
					name='Previous Total'
					dot={false}
					stroke='#1E649E'
					fill='url(#colorUv2)'
					fillOpacity={1}
					strokeWidth={1.5}
				/>
				<Area
					type='monotone'
					dataKey='total'
					name='Total'
					dot={false}
					stroke='#30D0B6'
					fill='url(#colorUv)'
					fillOpacity={1}
					strokeWidth={1.5}
				/>
			</AreaChart>
		</ResponsiveContainer>
	);
}
