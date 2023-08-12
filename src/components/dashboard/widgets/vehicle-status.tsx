import React from "react";
import { Link } from "@tanstack/router";
import {
  PieChart,
  Pie,
  Sector,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { useGetDashboardVehicleStatusCounts } from "@/hooks/network/dashboard/useGetDashboardVehicleStatusCounts";
import { useGetVehicleStatusList } from "@/hooks/network/vehicle/useGetVehicleStatusList";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WidgetSkeleton } from "../dnd-widget-display-grid";
import { searchFleetRoute } from "@/routes/fleet/search-fleet-route";

// generated from https://www.learnui.design/tools/data-color-picker.html#divergent
const PIE_CHART_COLORS = [
  "#16a34a",
  "#62b458",
  "#91c56a",
  "#b9d682",
  "#dee89d",
  "#fffabb",
  "#f8d993",
  "#f2b673",
  "#ec915d",
  "#e26952",
  "#de425b",
];

const VehicleStatusWidget = ({ locations }: { locations: string[] }) => {
  return (
    <>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Fleet status</CardTitle>
      </CardHeader>
      <CardContent>
        <VehicleStatusPieChart locations={locations} />
      </CardContent>
    </>
  );
};

export default VehicleStatusWidget;

export function VehicleStatusPieChart({ locations }: { locations: string[] }) {
  const [activeIdx, setActiveIdx] = React.useState(0);

  const vehicleTypeId = "0";
  const statusCounts = useGetDashboardVehicleStatusCounts({
    locationIds: locations,
    vehicleType: vehicleTypeId,
    clientDate: new Date(),
  });

  const vehicleStatuses = useGetVehicleStatusList();

  const getStatusIdByName = (name: string) => {
    const status = vehicleStatuses.data?.find((s) => s.name === name);
    return status?.id || 0;
  };

  const dataList = statusCounts.data || [];

  const getDataListIndexForName = (name: string) => {
    return dataList.findIndex((d) => d.name === name);
  };

  return statusCounts.status === "loading" ? (
    <WidgetSkeleton />
  ) : (
    <ResponsiveContainer className="min-h-[250px]">
      <PieChart margin={{ top: 10, left: 35, right: 0, bottom: 0 }}>
        <Pie
          activeIndex={activeIdx}
          activeShape={({
            cx,
            cy,
            innerRadius,
            outerRadius,
            startAngle,
            endAngle,
            fill,
            payload,
          }) => {
            return (
              <g>
                <text
                  x={cx}
                  y={cy - 20}
                  dy={8}
                  textAnchor="middle"
                  className="fill-foreground text-2xl font-semibold opacity-90 lg:text-3xl"
                >
                  {payload.total}
                </text>
                <text
                  x={cx}
                  y={cy + 20}
                  dy={8}
                  textAnchor="middle"
                  className="fill-foreground text-sm font-normal opacity-90 lg:text-xl"
                >
                  {String(payload.name)
                    .replace(/([A-Z])/g, " $1")
                    .trim()}
                </text>
                <Sector
                  cx={cx}
                  cy={cy}
                  innerRadius={innerRadius}
                  outerRadius={outerRadius}
                  startAngle={startAngle}
                  endAngle={endAngle}
                  fill={fill}
                />
                <Sector
                  cx={cx}
                  cy={cy}
                  startAngle={startAngle}
                  endAngle={endAngle}
                  innerRadius={outerRadius}
                  outerRadius={outerRadius + 10}
                  fill={fill}
                  fillOpacity="0.3"
                />
              </g>
            );
          }}
          data={dataList}
          cx="30%"
          cy="50%"
          innerRadius="65%"
          outerRadius="90%"
          fill="#8884d8"
          paddingAngle={5}
          dataKey="total"
          onMouseEnter={(_, idx) => setActiveIdx(idx)}
        >
          {dataList.map((_, idx) => (
            <Cell
              stroke="hsl(var(--border)/0.5)"
              key={`vehicle-status-pie-cell-${idx}`}
              fill={PIE_CHART_COLORS[idx % PIE_CHART_COLORS.length]}
            />
          ))}
        </Pie>
        <Legend
          iconType="circle"
          verticalAlign="middle"
          layout="vertical"
          align="right"
          wrapperStyle={{
            marginRight: "1%",
          }}
          formatter={(value, entry) => {
            const dataListIdx = getDataListIndexForName(value);
            return (
              <Link
                className="mb-1 ml-1.5 inline-block text-sm text-foreground md:text-base"
                to={searchFleetRoute.to}
                onMouseEnter={() => setActiveIdx(dataListIdx)}
                search={() => ({
                  page: 1,
                  size: 10,
                  filters: {
                    Active: "true",
                    VehicleStatus: getStatusIdByName(value).toString(),
                    ...(vehicleTypeId !== "0"
                      ? { VehicleTypeId: String(vehicleTypeId) }
                      : {}),
                  },
                })}
              >
                {value.replace(/([A-Z])/g, " $1").trim()}&nbsp;-&nbsp;
                {String((entry.payload as any)?.total || "0")}
              </Link>
            );
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
