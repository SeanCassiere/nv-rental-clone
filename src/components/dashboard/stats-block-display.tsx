import React from "react";
import {
  Link,
  type AnyRoute,
  type LinkProps,
  type RegisteredRouter,
  type RoutePaths,
} from "@tanstack/react-router";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { icons, type LucideIcon } from "@/components/ui/icons";
import { Skeleton } from "@/components/ui/skeleton";

import { useLocalStorage } from "@/lib/hooks/useLocalStorage";

import type { TDashboardStats } from "@/lib/schemas/dashboard";

import { STORAGE_DEFAULTS, STORAGE_KEYS } from "@/lib/utils/constants";
import { localDateToQueryYearMonthDay } from "@/lib/utils/date";

function formatDisplayValue(value: number | null | undefined): string | null {
  if (typeof value === "undefined") return null;
  return Number(value ?? 0).toString();
}

const DashboardStatsBlock = ({
  statistics,
}: {
  statistics: TDashboardStats | null | undefined;
}) => {
  const [rowCountStr] = useLocalStorage(
    STORAGE_KEYS.tableRowCount,
    STORAGE_DEFAULTS.tableRowCount
  );
  const defaultRowCount = parseInt(rowCountStr, 10);

  return (
    <div className="@container">
      <ul className="grid grid-cols-2 gap-4 @xl:grid-cols-3 @2xl:grid-cols-4 @6xl:grid-cols-6 [&>li]:h-full">
        <li>
          <StatBlock
            title="Reservation"
            icon={icons.CreditCard}
            value={formatDisplayValue(statistics?.todaysReservationCount)}
            linkProps={{
              to: "/reservations",
              search: () => ({
                page: 1,
                size: defaultRowCount,
                filters: {
                  Statuses: ["2"],
                  CreatedDateFrom: localDateToQueryYearMonthDay(new Date()),
                  CreatedDateTo: localDateToQueryYearMonthDay(new Date()),
                },
              }),
            }}
          />
        </li>
        <li>
          <StatBlock
            title="Return"
            icon={icons.ArrowDownLeft}
            value={formatDisplayValue(statistics?.todaysArrivalsCount)}
            linkProps={{
              to: "/agreements",
              search: () => ({
                page: 1,
                size: defaultRowCount,
                filters: {
                  EndDate: localDateToQueryYearMonthDay(new Date()),
                  Statuses: ["2"],
                  IsSearchOverdues: "false",
                },
              }),
            }}
          />
        </li>
        <li>
          <StatBlock
            title="On rent"
            icon={icons.Car}
            value={formatDisplayValue(statistics?.openAgreement)}
            linkProps={{
              to: "/agreements",
              search: () => ({
                page: 1,
                size: defaultRowCount,
                filters: { Statuses: ["2"] },
              }),
            }}
          />
        </li>
        <li>
          <StatBlock
            title="Overdue"
            icon={icons.CreditCard}
            value={formatDisplayValue(statistics?.overDues)}
            linkProps={{
              to: "/agreements",
              search: () => ({
                page: 1,
                size: defaultRowCount,
                filters: { Statuses: ["2"], IsSearchOverdues: "true" },
              }),
            }}
          />
        </li>
        <li>
          <StatBlock
            title="Pending payment"
            icon={icons.Banknote}
            value={formatDisplayValue(statistics?.pendingPayment)}
            linkProps={{
              to: "/agreements",
              search: () => ({
                page: 1,
                size: defaultRowCount,
                filters: { Statuses: ["5"] },
              }),
            }}
          />
        </li>
        <li>
          <StatBlock
            title="Service alert"
            icon={icons.Bell}
            value={formatDisplayValue(statistics?.serviceAlerts)}
            linkProps={{
              to: "/",
            }}
          />
        </li>
      </ul>
    </div>
  );
};

const StatBlock = <
  TRouteTree extends AnyRoute = RegisteredRouter["routeTree"],
  TFrom extends RoutePaths<TRouteTree> | string = string,
  TTo extends string = "",
  TMaskFrom extends RoutePaths<TRouteTree> | string = TFrom,
  TMaskTo extends string = "",
>(props: {
  title: string;
  value: string | null;
  icon: LucideIcon;
  linkProps: Omit<
    React.PropsWithoutRef<
      LinkProps<TRouteTree, TFrom, TTo, TMaskFrom, TMaskTo> &
        Omit<React.ComponentPropsWithoutRef<"a">, "preload" | "className">
    >,
    "children"
  >;
}) => {
  const { title, value, icon: Icon, linkProps } = props;

  return (
    <Card className="flex h-full flex-col justify-between">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium sm:text-base">
          {title}
        </CardTitle>
        <Icon className="h-3.5 w-3.5 text-muted-foreground sm:h-4 sm:w-4" />
        <span className="sr-only">{title} icon</span>
      </CardHeader>
      <CardContent>
        <Link
          className="block text-2xl font-bold tabular-nums underline-offset-4 focus-within:underline hover:underline"
          {...linkProps}
        >
          {value ?? <Skeleton className="h-8 w-full" />}
        </Link>
      </CardContent>
    </Card>
  );
};

export default DashboardStatsBlock;
