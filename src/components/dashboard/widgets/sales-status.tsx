import React from "react";
import {
  AreaChart,
  YAxis,
  CartesianGrid,
  Legend,
  Area,
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip,
  XAxis,
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
    <ResponsiveContainer width="100%" height="100%" className="min-h-[250px]">
      <LineChart
        data={sales.data || []}
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
          tick
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
                          digits: 0,
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
                          digits: 0,
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
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// export function SalesAreaChart({ locations }: { locations: string[] }) {
//   const { t } = useTranslation();
//   const sales = useGetSalesStatus({ locations, clientDate: new Date() });

//   return sales.status === "loading" ? (
//     <WidgetSkeleton />
//   ) : (
//     <ResponsiveContainer className="min-h-[250px]">
//       <AreaChart data={sales.data || []}>
//         <defs>
//           <linearGradient id="colorThisYear" x1="0" y1="0" x2="0" y2="1">
//             <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.7} />
//             <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
//           </linearGradient>
//           <linearGradient id="colorPreviousYear" x1="0" y1="0" x2="0" y2="1">
//             <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.7} />
//             <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
//           </linearGradient>
//         </defs>
//         <XAxis dataKey="monthName" stroke="#888888" fontSize={13} />
//         <YAxis
//           stroke="#888888"
//           fontSize={13}
//           tickFormatter={(value) =>
//             t("intlCurrency", {
//               value: Number(value),
//               ns: "format",
//               digits: 0,
//             })
//           }
//         />
//         <Tooltip
//           formatter={(value) =>
//             t("intlCurrency", {
//               value: Number(value),
//               ns: "format",
//             })
//           }
//         />
//         <CartesianGrid
//           vertical={false}
//           stroke="#e2e8f0"
//           strokeDasharray="3 3"
//         />
//         <Area
//           name="Last year"
//           type="monotone"
//           dataKey="previousTotal"
//           strokeWidth={2}
//           fillOpacity={1}
//           stroke="#2563eb"
//           fill="url(#colorPreviousYear)"
//         />
//         <Area
//           name="This year"
//           type="monotone"
//           dataKey="total"
//           strokeWidth={2}
//           fillOpacity={1}
//           stroke="#0d9488"
//           fill="url(#colorThisYear)"
//         />
//         <Legend
//           iconType="circle"
//           iconSize={9}
//           verticalAlign="top"
//           layout="horizontal"
//           align="left"
//           wrapperStyle={{ marginLeft: "3.5rem" }}
//           formatter={(value) => {
//             return (
//               <span className="mb-6 inline-block">
//                 <span className="inline-block min-w-[80px] text-base">
//                   {value}
//                 </span>
//               </span>
//             );
//           }}
//         />
//       </AreaChart>
//     </ResponsiveContainer>
//   );
// }
