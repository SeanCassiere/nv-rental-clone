import React from "react";
import {
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Area,
  ResponsiveContainer,
} from "recharts";
import { useTranslation } from "react-i18next";

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WidgetSkeleton } from "@/components/dashboard/dnd-widget-display-grid";

import { useGetSalesStatus } from "@/hooks/network/dashboard/useGetSalesStatus";

const SalesStatus = ({ locations }: { locations: string[] }) => {
  return (
    <>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Sales status</CardTitle>
      </CardHeader>
      <CardContent className="pt-3.5">
        <SalesAreaChart locations={locations} />
      </CardContent>
    </>
  );
};

export default React.memo(SalesStatus);

export function SalesAreaChart({ locations }: { locations: string[] }) {
  const { t } = useTranslation();
  const sales = useGetSalesStatus({ locations, clientDate: new Date() });

  return sales.status === "loading" ? (
    <WidgetSkeleton />
  ) : (
    <ResponsiveContainer className="min-h-[250px]">
      <AreaChart data={sales.data || []}>
        <defs>
          <linearGradient id="colorThisYear" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.7} />
            <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorPreviousYear" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.7} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="monthName" stroke="#888888" fontSize={13} />
        <YAxis
          stroke="#888888"
          fontSize={13}
          tickFormatter={(value) =>
            t("intlCurrency", {
              value: Number(value),
              ns: "format",
              digits: 0,
            })
          }
        />
        <Tooltip
          formatter={(value) =>
            t("intlCurrency", {
              value: Number(value),
              ns: "format",
            })
          }
        />
        <CartesianGrid
          vertical={false}
          stroke="#e2e8f0"
          strokeDasharray="3 3"
        />
        <Area
          name="Last year"
          type="monotone"
          dataKey="previousTotal"
          strokeWidth={2}
          fillOpacity={1}
          stroke="#2563eb"
          fill="url(#colorPreviousYear)"
        />
        <Area
          name="This year"
          type="monotone"
          dataKey="total"
          strokeWidth={2}
          fillOpacity={1}
          stroke="#0d9488"
          fill="url(#colorThisYear)"
        />
        <Legend
          iconType="circle"
          iconSize={9}
          verticalAlign="top"
          layout="horizontal"
          align="left"
          wrapperStyle={{ marginLeft: "3.5rem" }}
          formatter={(value) => {
            return (
              <span className="mb-6 inline-block">
                <span className="inline-block min-w-[80px] text-base">
                  {value}
                </span>
              </span>
            );
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
