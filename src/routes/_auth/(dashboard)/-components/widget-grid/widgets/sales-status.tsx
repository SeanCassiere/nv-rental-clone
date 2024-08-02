import * as React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { icons } from "@/components/ui/icons";

import { fetchDashboardSalesStatisticsOptions } from "@/lib/query/dashboard";

import { useWidgetName } from "@/routes/_auth/(dashboard)/-components/useWidgetName";

import { WidgetSkeleton, type CommonWidgetProps } from "./_common";

export default function SalesStatusWidget(props: CommonWidgetProps) {
  const widgetName = useWidgetName(props.widgetId);

  return (
    <React.Fragment>
      <div className="flex max-h-8 shrink-0 items-center justify-between gap-2">
        <span className="font-medium">{widgetName}</span>
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
      <React.Suspense fallback={<WidgetSkeleton />}>
        <SalesChart locations={props.selectedLocationIds} auth={props.auth} />
      </React.Suspense>
    </React.Fragment>
  );
}

const chartConfig = {
  previousTotal: {
    label: "Last year",
    color: "hsl(var(--chart-1))",
  },
  total: {
    label: "This year",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

function SalesChart({
  locations,
  auth,
}: {
  locations: CommonWidgetProps["selectedLocationIds"];
  auth: CommonWidgetProps["auth"];
}) {
  const { t } = useTranslation();

  const query = useSuspenseQuery(
    fetchDashboardSalesStatisticsOptions({
      auth,
      filters: {
        locationIds: locations,
        clientDate: new Date(),
      },
    })
  );

  const sales = React.useMemo(
    () => (query.data.status === 200 ? query.data.body : []),
    [query.data.status, query.data.body]
  );

  return (
    <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
      <LineChart
        accessibilityLayer
        data={sales}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="monthName"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <ChartTooltip
          content={<ChartTooltipContent indicator="dot" />}
          formatter={(value) =>
            t("intlCurrency", {
              value: Number(value ?? 0),
              ns: "format",
            })
          }
        />
        <Line
          dataKey="total"
          type="monotone"
          stroke="var(--color-total)"
          strokeWidth={2}
          dot={{
            fill: "var(--color-total)",
          }}
          activeDot={{
            r: 6,
          }}
        />
        <Line
          dataKey="previousTotal"
          type="monotone"
          stroke="var(--color-previousTotal)"
          strokeWidth={2}
          dot={{
            fill: "var(--color-previousTotal)",
          }}
          activeDot={{
            r: 6,
          }}
        />
      </LineChart>
    </ChartContainer>
  );
}
