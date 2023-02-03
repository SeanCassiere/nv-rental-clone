import classNames from "classnames";

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
} from "@tanstack/react-router";
import { localDateToQueryYearMonthDay } from "../../utils/date";
import type { TDashboardStats } from "../../utils/schemas/dashboard";

import { indexRoute } from "../../routes";
import { searchReservationsRoute } from "../../routes/reservations/searchReservations";
import { searchAgreementsRoute } from "../../routes/agreements/searchAgreements";

const DashboardStatsBlock = ({
  statistics,
}: {
  statistics: TDashboardStats;
}) => {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5">
      <li>
        <StatBlock
          title="Reservation"
          icon={CreditCardOutline}
          value={Number(statistics.todaysReservationCount).toString()}
          linkProps={{
            to: searchReservationsRoute.fullPath,
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
          value={Number(statistics.todaysArrivalsCount).toString()}
          linkProps={{
            to: searchAgreementsRoute.fullPath,
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
          value={Number(statistics.openAgreement).toString()}
          linkProps={{
            to: searchAgreementsRoute.fullPath,
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
          value={Number(statistics.overDues).toString()}
          linkProps={{
            to: searchAgreementsRoute.fullPath,
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
          value={Number(statistics.pendingPayment).toString()}
          linkProps={{
            to: searchAgreementsRoute.fullPath,
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
          value={Number(statistics.serviceAlerts).toString()}
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
    <Link {...(linkProps as any)}>
      <div
        className={classNames(
          "group grid cursor-pointer grid-cols-7 overflow-hidden rounded border border-slate-200 bg-slate-50 px-4 py-4 transition-all duration-150 ease-in hover:bg-slate-100"
        )}
      >
        <div className="col-span-2">
          <div className="inline-block p-4">
            <Icon className="h-6 w-6 text-slate-500 transition-all duration-200 ease-in hover:bg-slate-100 group-hover:text-teal-500" />
            <span className="sr-only">{title} icon</span>
          </div>
        </div>
        <div className="col-span-5">
          <div
            className={classNames(
              "text-5xl font-semibold transition-all duration-200 ease-in group-hover:text-teal-500",
              value !== "0" ? "text-slate-800" : "text-slate-700"
            )}
          >
            {value}
          </div>
          <div className="truncate text-sm font-medium text-slate-500 transition-all duration-200 ease-in group-hover:text-teal-500">
            {title}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default DashboardStatsBlock;
