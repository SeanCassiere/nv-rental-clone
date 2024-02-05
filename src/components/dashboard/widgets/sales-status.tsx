import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

import { WidgetSkeleton } from "@/components/dashboard/dnd-widget-display-grid";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { fetchDashboardSalesStatisticsOptions } from "@/lib/query/dashboard";
import type { Auth } from "@/lib/query/helpers";

const SalesStatus = (props: { locations: string[] } & Auth) => {
  return (
    <>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Sales status</CardTitle>
      </CardHeader>
      <CardContent className="pt-3.5">
        <SalesAreaChart {...props} />
      </CardContent>
    </>
  );
};

export default React.memo(SalesStatus);

export function SalesAreaChart(props: { locations: string[] } & Auth) {
  const { locations, auth } = props;

  const { t } = useTranslation();
  const salesQuery = useQuery(
    fetchDashboardSalesStatisticsOptions({
      auth,
      filters: {
        locationIds: locations,
        clientDate: new Date(),
      },
    })
  );

  const sales = salesQuery.data?.status === 200 ? salesQuery.data.body : [];

  return salesQuery.status === "pending" ? (
    <WidgetSkeleton />
  ) : (
    <ResponsiveContainer width="100%" height="100%" className="min-h-[250px]">
      <LineChart
        data={sales}
        margin={{
          top: 5,
          right: 15,
          left: 15,
          bottom: 5,
        }}
      >
        <XAxis
          axisLine={false}
          dataKey="monthName"
          stroke="hsl(var(--muted-foreground)/0.7)"
          fontSize={13}
          dy={10}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                        Previous year
                      </span>
                      <span className="font-bold text-muted-foreground">
                        {t("intlCurrency", {
                          value: Number(payload[0]?.value ?? 0),
                          ns: "format",
                        })}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                        This year
                      </span>
                      <span className="font-bold">
                        {t("intlCurrency", {
                          value: Number(payload[1]?.value ?? 0),
                          ns: "format",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        <Line
          type="monotone"
          strokeWidth={2}
          dataKey="previousTotal"
          activeDot={{
            r: 6,
            style: { fill: "var(--theme-primary)", opacity: 0.25 },
          }}
          style={
            {
              stroke: "var(--theme-primary)",
              opacity: 0.25,
              "--theme-primary": "hsl(var(--primary))",
            } as React.CSSProperties
          }
          isAnimationActive={false}
        />
        <Line
          type="monotone"
          dataKey="total"
          strokeWidth={2}
          activeDot={{
            r: 8,
            style: { fill: "var(--theme-primary)" },
          }}
          style={
            {
              stroke: "var(--theme-primary)",
              "--theme-primary": `hsl(var(--primary))`,
            } as React.CSSProperties
          }
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
