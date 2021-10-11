// import "./styles.css";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
	{ total: 84994.53, monthName: "Nov", previousTotal: 5760.0 },
	{ total: 8004.62, monthName: "Dec", previousTotal: 8000.0 },
	{ total: 4810.89, monthName: "Jan", previousTotal: 15900.0 },
	{ total: 53512.7, monthName: "Feb", previousTotal: 18550.0 },
	{ total: 9847.4, monthName: "Mar", previousTotal: 29150.0 },
	{ total: 38406.9, monthName: "Apr", previousTotal: 39845.4 },
	{ total: 25689.65, monthName: "May", previousTotal: 18597.7 },
	{ total: 87141.23, monthName: "Jun", previousTotal: 47960.76 },
	{ total: 15456.26, monthName: "Jul", previousTotal: 88234.46 },
	{ total: 52464.44, monthName: "Aug", previousTotal: 50779.4 },
	{ total: 50550.82, monthName: "Sep", previousTotal: 63670.71 },
	{ total: 43747.68, monthName: "Oct", previousTotal: 17764.11 },
];

export default function LineChartWidget() {
	return (
		<ResponsiveContainer width='100%' height={300}>
			<AreaChart
				data={data}
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
				{/* <Legend /> */}
				<Area
					type='monotone'
					dataKey='previousTotal'
					name='Previous Total'
					dot={false}
					stroke='#1E649E'
					// fill='rgb(38, 100, 158)'
					fill='url(#colorUv2)'
					// fillOpacity={0.3}
					fillOpacity={1}
					strokeWidth={1.5}
				/>
				<Area
					type='monotone'
					dataKey='total'
					name='Total'
					dot={false}
					stroke='#30D0B6'
					// fill='rgb(48, 208, 182)'
					fill='url(#colorUv)'
					// fillOpacity={0.3}
					fillOpacity={1}
					strokeWidth={1.5}
				/>
			</AreaChart>
		</ResponsiveContainer>
	);
}
