import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
} from "recharts";
import type { PieSectorDataItem } from "recharts/types/polar/Pie";

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import { useTernaryDarkMode } from "@/lib/hooks/useTernaryDarkMode";

import { STORAGE_DEFAULTS, STORAGE_KEYS } from "@/lib/utils/constants";

import { fetchDashboardVehicleStatusCountsOptions } from "@/lib/query/dashboard";
import type { Auth } from "@/lib/query/helpers";
import { fetchVehiclesStatusesOptions } from "@/lib/query/vehicle";

import { WidgetSkeleton } from "../dnd-widget-display-grid";

function nameMaker(index: number) {
  return `--pie-segment-${index}-color`;
}

function hslVarNameMaker(index: number) {
  return `hsla(var(${nameMaker(index)}))`;
}

const SYSTEM_PIE_CHART_COLORS: [string, string, string][] = [
  // --css-var-name light-mode-hsl dark-mode-hsl
  [nameMaker(1), "var(--primary) / 1", "var(--primary) / 1"],
  [nameMaker(2), "var(--primary) / 0.2", "var(--primary) / 0.75"],
  [nameMaker(3), "var(--primary) / 0.31", "var(--primary) / 0.55"],
  [nameMaker(4), "var(--primary) / 0.5", "var(--primary) / 0.45"],
  [nameMaker(5), "var(--primary) / 0.63", "var(--primary) / 0.35"],
  [nameMaker(6), "var(--primary) / 0.8", "var(--primary) / 0.25"],
  [nameMaker(7), "var(--primary) / 0.88", "var(--primary) / 0.1"],
];

const VehicleStatusWidget = (props: { locations: string[] } & Auth) => {
  return (
    <>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Fleet status</CardTitle>
      </CardHeader>
      <CardContent>
        <VehicleStatusPieChart {...props} />
      </CardContent>
    </>
  );
};

export default VehicleStatusWidget;

export function VehicleStatusPieChart(props: { locations: string[] } & Auth) {
  const { locations, auth: authParams } = props;
  const [activeIdx, setActiveIdx] = React.useState(0);

  const theme = useTernaryDarkMode();

  const vehicleTypeId = "0";
  const statusCounts = useQuery(
    fetchDashboardVehicleStatusCountsOptions({
      auth: authParams,
      filters: {
        vehicleTypeId,
        locationIds: locations,
        clientDate: new Date(),
      },
    })
  );

  const vehicleStatuses = useQuery(
    fetchVehiclesStatusesOptions({ auth: authParams })
  );

  const getStatusIdByName = (name: string) => {
    const status = vehicleStatuses.data?.find((s) => s.name === name);
    return status?.id || 0;
  };

  const dataList =
    statusCounts.data?.status === 200 ? statusCounts.data?.body : [];

  const getDataListIndexForName = (name: string) => {
    return dataList.findIndex((d) => d.name === name);
  };

  const [rowCountStr] = useLocalStorage(
    STORAGE_KEYS.tableRowCount,
    STORAGE_DEFAULTS.tableRowCount
  );
  const defaultRowCount = parseInt(rowCountStr, 10);

  const pieChartColors: React.CSSProperties = useMemo(() => {
    // if dark mode is the currently selected theme, or if it is system preference and it is dark
    if (
      theme.ternaryDarkMode === "dark" ||
      (theme.ternaryDarkMode === "system" && theme.isDarkMode)
    ) {
      return SYSTEM_PIE_CHART_COLORS.reduce(
        (acc, [key, _, darkValue]) => {
          acc[key] = darkValue;
          return acc;
        },
        {} as { [key: string]: string }
      );
    }

    // if the currently selected theme is light
    return SYSTEM_PIE_CHART_COLORS.reduce(
      (acc, [key, lightValue]) => {
        acc[key] = lightValue;
        return acc;
      },
      {} as { [key: string]: string }
    );
  }, [theme.isDarkMode, theme.ternaryDarkMode]);

  return statusCounts.status === "pending" ? (
    <WidgetSkeleton />
  ) : (
    <ResponsiveContainer className="min-h-[250px]" style={pieChartColors}>
      <PieChart margin={{ top: 10, left: 35, right: 0, bottom: 0 }}>
        <Pie
          activeIndex={activeIdx}
          activeShape={(opts: PieSectorDataItem) => {
            const {
              cx,
              cy = 0,
              innerRadius,
              outerRadius = 0,
              startAngle,
              endAngle,
              fill,
            } = opts;

            return (
              <g>
                <text
                  x={cx}
                  y={cy - 20}
                  dy={8}
                  textAnchor="middle"
                  className="fill-foreground text-2xl font-semibold opacity-90 lg:text-3xl"
                >
                  {opts.value || "0"}
                </text>
                <text
                  x={cx}
                  y={cy + 20}
                  dy={8}
                  textAnchor="middle"
                  className="fill-foreground text-sm font-normal opacity-90 lg:text-xl"
                >
                  {String(opts.name || "")
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
          isAnimationActive={false}
        >
          {dataList.map((_, idx) => (
            <Cell
              key={`vehicle-status-pie-cell-${idx}`}
              stroke="hsla(var(--border) / 0.5)"
              fill={hslVarNameMaker((idx % SYSTEM_PIE_CHART_COLORS.length) + 1)}
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
                className="mb-1 ml-1.5 inline-block border-b border-transparent text-sm text-foreground focus-within:border-foreground hover:border-foreground focus-visible:border-foreground md:text-base"
                to="/fleet"
                onMouseEnter={() => setActiveIdx(dataListIdx)}
                search={() => ({
                  page: 1,
                  size: defaultRowCount,
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
