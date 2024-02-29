import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

import { Button } from "@/components/ui/button";
import { icons } from "@/components/ui/icons";

import { fetchDashboardSalesStatisticsOptions } from "@/lib/query/dashboard";

import { WidgetSkeleton, type CommonWidgetProps } from "./_common";

export default function SalesStatusWidget(props: CommonWidgetProps) {
  const { auth, selectedLocationIds } = props;

  const { t } = useTranslation();
  const salesQuery = useQuery(
    fetchDashboardSalesStatisticsOptions({
      auth,
      filters: {
        locationIds: selectedLocationIds,
        clientDate: new Date(),
      },
    })
  );

  const sales = salesQuery.data?.status === 200 ? salesQuery.data.body : [];

  return (
    <React.Fragment>
      <div className="flex max-h-8 shrink-0 items-center justify-between gap-2">
        <span className="font-medium">Sales status</span>
        <Button
          type="button"
          variant="ghost"
          className="h-8"
          {...props.draggableAttributes}
          {...props.draggableListeners}
        >
          <icons.GripVertical className="h-3 w-3" />
        </Button>
      </div>
      {salesQuery.status === "pending" ? (
        <WidgetSkeleton />
      ) : (
        <ResponsiveContainer
          width="100%"
          height="100%"
          className="min-h-[250px]"
        >
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
      )}
    </React.Fragment>
  );
}
