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

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetSalesStatus } from "@/hooks/network/dashboard/useGetSalesStatus";

import { WidgetSkeleton } from "../dnd-widget-display-grid";
import { useTranslation } from "react-i18next";

const SalesStatus = ({
  locations,
  currency = "USD",
}: {
  locations: string[];
  currency: string;
}) => {
  const { t } = useTranslation();
  const sales = useGetSalesStatus({ locations, clientDate: new Date() });

  return (
    <>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Sales status</CardTitle>
      </CardHeader>
      <CardContent className="pt-3.5">
        {sales.status === "loading" ? (
          <WidgetSkeleton />
        ) : (
          <ResponsiveContainer className="min-h-[300px]">
            <AreaChart data={sales.data || []}>
              <defs>
                <linearGradient id="colorThisYear" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.7} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                </linearGradient>
                <linearGradient
                  id="colorPreviousYear"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.7} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="monthName" stroke="#475569" />
              <YAxis />
              <Tooltip
                formatter={(value) =>
                  t("intlCurrency", { currency, value: Number(value) })
                }
              />
              <CartesianGrid vertical={false} stroke="#e2e8f0" />
              <Area
                name="Previous year"
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
                verticalAlign="top"
                layout="horizontal"
                align="left"
                wrapperStyle={{ marginLeft: "3.5rem" }}
                formatter={(value) => {
                  return (
                    <span className="mb-6 inline-block">
                      <span className="inline-block min-w-[100px] text-primary/70">
                        {value}
                      </span>
                      <span>&nbsp;&nbsp;&nbsp;</span>
                    </span>
                  );
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </>
  );
};

export default React.memo(SalesStatus);
