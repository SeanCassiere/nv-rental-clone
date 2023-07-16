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
import { WidgetSkeleton } from "../DashboardDndWidgetGrid";
import { searchFleetRoute } from "@/routes/fleet/searchFleet";

const PIE_CHART_COLORS = [
  "#14b8a6",
  "#3b82f6",
  "#06b6d4",
  "#0ea5e9",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#047857",
  "#b45309",
  "#fb7185",
];

const VehicleStatusWidget = ({ locations }: { locations: string[] }) => {
  const [activeIdx, setActiveIdx] = React.useState<number | undefined>(
    undefined
  );
  const vehicleTypeId = 0;
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

  return (
    <>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Vehicle Status</CardTitle>
      </CardHeader>
      <CardContent>
        {statusCounts.status === "loading" ? (
          <WidgetSkeleton />
        ) : (
          <ResponsiveContainer className="min-h-[300px]">
            <PieChart margin={{ top: 0, left: 25, right: 0, bottom: 0 }}>
              <Pie
                activeIndex={activeIdx}
                activeShape={RenderActiveShape}
                data={statusCounts.data || []}
                cx="40%"
                cy="50%"
                innerRadius="60%"
                outerRadius="90%"
                fill="#8884d8"
                paddingAngle={5}
                dataKey="total"
                onMouseEnter={(_, idx) => setActiveIdx(idx)}
                onMouseLeave={() => setActiveIdx(undefined)}
              >
                {[...(statusCounts.data ? statusCounts.data : [])].map(
                  (_, idx) => (
                    <Cell
                      key={`pie-cell-${idx}`}
                      fill={PIE_CHART_COLORS[idx % PIE_CHART_COLORS.length]}
                    />
                  )
                )}
              </Pie>
              <Legend
                iconType="circle"
                verticalAlign="middle"
                layout="vertical"
                align="right"
                wrapperStyle={{
                  marginRight: "2%",
                }}
                formatter={(value, entry) => {
                  console.log("entry", entry);
                  return (
                    <Link
                      className="mb-1 inline-block text-primary"
                      to={searchFleetRoute.to}
                      search={() => ({
                        page: 1,
                        size: 10,
                        filters: {
                          Active: true,
                          VehicleStatus: getStatusIdByName(value).toString(),
                          ...(vehicleTypeId > 0
                            ? { VehicleTypeId: vehicleTypeId }
                            : {}),
                        },
                      })}
                    >
                      {value.replace(/([A-Z])/g, " $1").trim()}{" "}
                      &nbsp;-&nbsp;&nbsp;
                      {String((entry.payload as any)?.total || "0")}
                    </Link>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </>
  );
};

export default VehicleStatusWidget;

function RenderActiveShape(props: any) {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
  } = props;

  return (
    <g>
      <text
        x={cx}
        y={cy + 20}
        dy={8}
        textAnchor="middle"
        style={{
          fontSize: 18,
          fill: "var(--primary)",
          fontWeight: 600,
        }}
      >
        {payload.name}
      </text>
      <text
        x={cx}
        y={cy - 20}
        dy={8}
        textAnchor="middle"
        style={{ fontSize: 28, fill: "var(--primary)" }}
      >
        {payload.total}
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
        outerRadius={outerRadius + 15}
        fill={fill}
        fillOpacity="0.5"
      />
    </g>
  );
}
