import { Link, type LinkOptions } from "@tanstack/react-router";
import {
  ArrowDownLeftIcon,
  BanknoteIcon,
  BellIcon,
  CarIcon,
  CreditCardIcon,
  type LucideIcon,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { useAuthValues } from "@/hooks/internal/useAuthValues";

import type { TDashboardStats } from "@/schemas/dashboard";

import { APP_DEFAULTS, USER_STORAGE_KEYS } from "@/utils/constants";
import { localDateToQueryYearMonthDay } from "@/utils/date";
import { getLocalStorageForUser } from "@/utils/user-local-storage";

function formatDisplayValue(value: number | null | undefined): string | null {
  if (typeof value === "undefined") return null;
  return Number(value ?? 0).toString();
}

const DashboardStatsBlock = ({
  statistics,
}: {
  statistics: TDashboardStats | null | undefined;
}) => {
  const auth = useAuthValues();

  const rowCountStr =
    getLocalStorageForUser(
      auth.clientId,
      auth.userId,
      USER_STORAGE_KEYS.tableRowCount
    ) || APP_DEFAULTS.tableRowCount;
  const defaultRowCount = parseInt(rowCountStr, 10);

  return (
    <div className="@container">
      <ul className="grid grid-cols-2 gap-4 @xl:grid-cols-3 @3xl:grid-cols-4 @5xl:grid-cols-6 [&>li]:h-full">
        <li>
          <StatBlock
            title="Reservation"
            icon={CreditCardIcon}
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
            icon={ArrowDownLeftIcon}
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
            icon={CarIcon}
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
            icon={CreditCardIcon}
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
            icon={BanknoteIcon}
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
            icon={BellIcon}
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

const StatBlock = ({
  title,
  value,
  icon: Icon,
  linkProps,
}: {
  title: string;
  value: string | null;
  icon: LucideIcon;
  linkProps: LinkOptions;
}) => {
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
          {...(linkProps as any)}
        >
          {value ?? <Skeleton className="h-8 w-full" />}
        </Link>
      </CardContent>
    </Card>
  );
};

export default DashboardStatsBlock;
