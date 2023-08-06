import { Link, type LinkPropsOptions } from "@tanstack/router";
import {
  type LucideIcon,
  CreditCardIcon,
  ArrowDownLeftIcon,
  CarIcon,
  BanknoteIcon,
  BellIcon,
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { indexRoute } from "@/routes";
import { searchReservationsRoute } from "@/routes/reservations/search-reservations-route";
import { searchAgreementsRoute } from "@/routes/agreements/search-agreements-route";

import type { TDashboardStats } from "@/schemas/dashboard";

import { localDateToQueryYearMonthDay } from "@/utils/date";

function formatDisplayValue(value: number | null | undefined): string | null {
  if (typeof value === "undefined") return null;
  return Number(value ?? 0).toString();
}

const DashboardStatsBlock = ({
  statistics,
}: {
  statistics: TDashboardStats | undefined;
}) => {
  return (
    <div className="@container">
      <ul className="grid grid-cols-2 gap-4 @xl:grid-cols-3 @3xl:grid-cols-4 @5xl:grid-cols-6 [&>li]:h-full">
        <li>
          <StatBlock
            title="Reservation"
            icon={CreditCardIcon}
            value={formatDisplayValue(statistics?.todaysReservationCount)}
            linkProps={{
              to: searchReservationsRoute.to,
              search: () => ({
                page: 1,
                size: 10,
                filters: {
                  Statuses: ["2"],
                  CreatedDateFrom: localDateToQueryYearMonthDay(new Date()),
                  CreatedDateTo: localDateToQueryYearMonthDay(new Date()),
                },
              }),
              preload: "intent",
            }}
          />
        </li>
        <li>
          <StatBlock
            title="Return"
            icon={ArrowDownLeftIcon}
            value={formatDisplayValue(statistics?.todaysArrivalsCount)}
            linkProps={{
              to: searchAgreementsRoute.to,
              search: () => ({
                page: 1,
                size: 10,
                filters: {
                  EndDate: localDateToQueryYearMonthDay(new Date()),
                  Statuses: ["2"],
                  IsSearchOverdues: "false",
                },
              }),
              preload: "intent",
            }}
          />
        </li>
        <li>
          <StatBlock
            title="On rent"
            icon={CarIcon}
            value={formatDisplayValue(statistics?.openAgreement)}
            linkProps={{
              to: searchAgreementsRoute.to,
              search: () => ({
                page: 1,
                size: 10,
                filters: { Statuses: ["2"] },
              }),
              preload: "intent",
            }}
          />
        </li>
        <li>
          <StatBlock
            title="Overdue"
            icon={CreditCardIcon}
            value={formatDisplayValue(statistics?.overDues)}
            linkProps={{
              to: searchAgreementsRoute.to,
              search: () => ({
                page: 1,
                size: 10,
                filters: { Statuses: ["2"], IsSearchOverdues: "true" },
              }),
              preload: "intent",
            }}
          />
        </li>
        <li>
          <StatBlock
            title="Pending payment"
            icon={BanknoteIcon}
            value={formatDisplayValue(statistics?.pendingPayment)}
            linkProps={{
              to: searchAgreementsRoute.to,
              search: () => ({
                page: 1,
                size: 10,
                filters: { Statuses: ["5"] },
              }),
              preload: "intent",
            }}
          />
        </li>
        <li>
          <StatBlock
            title="Service alert"
            icon={BellIcon}
            value={formatDisplayValue(statistics?.serviceAlerts)}
            linkProps={{
              to: indexRoute.id,
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
  linkProps: LinkPropsOptions;
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
