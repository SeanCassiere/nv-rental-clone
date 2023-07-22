import {
  type IconProps,
  CreditCardOutline,
  ArrowDownRightOutline,
  TruckOutline,
  BankNotesOutline,
  BellIconOutline,
} from "../icons";
import {
  Link,
  type MakeLinkOptions,
  type RegisteredRoutesInfo,
} from "@tanstack/router";
import { localDateToQueryYearMonthDay } from "@/utils/date";
import type { TDashboardStats } from "@/schemas/dashboard";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { indexRoute } from "@/routes";
import { searchReservationsRoute } from "@/routes/reservations/search-reservations-route";
import { searchAgreementsRoute } from "@/routes/agreements/search-agreements-route";

const DashboardStatsBlock = ({
  statistics,
}: {
  statistics: TDashboardStats | undefined;
}) => {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6">
      <li>
        <StatBlock
          title="Reservation"
          icon={CreditCardOutline}
          value={Number(statistics?.todaysReservationCount || 0).toString()}
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
          icon={ArrowDownRightOutline}
          value={Number(statistics?.todaysArrivalsCount || 0).toString()}
          linkProps={{
            to: searchAgreementsRoute.to,
            search: () => ({
              page: 1,
              size: 10,
              filters: {
                EndDate: localDateToQueryYearMonthDay(new Date()),
                Statuses: ["2"],
                IsSearchOverdues: false,
              },
            }),
            preload: "intent",
          }}
        />
      </li>
      <li>
        <StatBlock
          title="On rent"
          icon={TruckOutline}
          value={Number(statistics?.openAgreement || 0).toString()}
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
          icon={CreditCardOutline}
          value={Number(statistics?.overDues || 0).toString()}
          linkProps={{
            to: searchAgreementsRoute.to,
            search: () => ({
              page: 1,
              size: 10,
              filters: { Statuses: ["2"], IsSearchOverdues: true },
            }),
            preload: "intent",
          }}
        />
      </li>
      <li>
        <StatBlock
          title="Pending payment"
          icon={BankNotesOutline}
          value={Number(statistics?.pendingPayment || 0).toString()}
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
          icon={BellIconOutline}
          value={Number(statistics?.serviceAlerts || 0).toString()}
          linkProps={{
            to: indexRoute.id,
          }}
        />
      </li>
    </ul>
  );
};

const StatBlock = ({
  title,
  value,
  icon: Icon,
  linkProps,
}: {
  title: string;
  value: string;
  icon: ({ className }: IconProps) => JSX.Element;
  linkProps?: MakeLinkOptions<RegisteredRoutesInfo["routePaths"], ".">;
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-3.5 w-3.5 text-muted-foreground sm:h-4 sm:w-4" />
        <span className="sr-only">{title} icon</span>
      </CardHeader>
      <CardContent>
        <Link
          className="block text-2xl font-bold tabular-nums underline-offset-4 focus-within:underline hover:underline"
          {...(linkProps as any)}
        >
          {value}
        </Link>
      </CardContent>
    </Card>
  );
};

export default DashboardStatsBlock;
