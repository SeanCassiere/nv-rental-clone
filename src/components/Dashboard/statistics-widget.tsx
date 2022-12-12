import classNames from "classnames";

import {
  type IconProps,
  CreditCardOutline,
  ArrowDownRightOutline,
  TruckOutline,
  BankNotesOutline,
  BellIconOutline,
} from "../icons";
import type { DashboardStatsType } from "../../types/Dashboard";
import {
  Link,
  type MakeLinkOptions,
  type RegisteredAllRouteInfo,
} from "@tanstack/react-router";
import { localDateToQueryYearMonthDay } from "../../utils/date";

const StatisticsWidget = ({
  statistics,
}: {
  statistics: DashboardStatsType;
}) => {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
      <li>
        <StatBlock
          title="Reservation"
          icon={CreditCardOutline}
          value={statistics.todaysReservationCount.toString()}
        />
      </li>
      <li>
        <StatBlock
          title="Return"
          icon={ArrowDownRightOutline}
          value={statistics.todaysArrivalsCount.toString()}
          linkProps={
            {
              to: "/agreements",
              search: () => ({
                page: 1,
                size: 10,
                filters: {
                  EndDate: localDateToQueryYearMonthDay(new Date()),
                  Statuses: 2,
                  IsSearchOverdues: false,
                },
              }),
            } as any
          }
        />
      </li>
      <li>
        <StatBlock
          title="On rent"
          icon={TruckOutline}
          value={statistics.openAgreement.toString()}
          linkProps={
            {
              to: "/agreements",
              search: () => ({
                page: 1,
                size: 10,
                filters: { Statuses: 2 },
              }),
            } as any
          }
        />
      </li>
      <li>
        <StatBlock
          title="Overdue"
          icon={CreditCardOutline}
          value={statistics.overDues.toString()}
          linkProps={
            {
              to: "/agreements",
              search: () => ({
                page: 1,
                size: 10,
                filters: { Statuses: 2, IsSearchOverdues: true },
              }),
            } as any
          }
        />
      </li>
      <li>
        <StatBlock
          title="Pending payment"
          icon={BankNotesOutline}
          value={statistics.pendingPayment.toString()}
        />
      </li>
      <li>
        <StatBlock
          title="Service alert"
          icon={BellIconOutline}
          value={statistics.serviceAlerts.toString()}
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
  linkProps?: MakeLinkOptions<RegisteredAllRouteInfo, "/", string>;
}) => {
  return (
    <Link {...(linkProps as any)}>
      <div
        className={classNames(
          "grid cursor-pointer grid-cols-7 overflow-hidden rounded-sm bg-white px-4 py-4 shadow"
        )}
      >
        <div className="col-span-2">
          <div className="inline-block rounded-full bg-gray-100 p-4">
            <Icon className="h-6 w-6 text-teal-400" />
            <span className="sr-only">{title} icon</span>
          </div>
        </div>
        <div className="col-span-5">
          <div className="text-5xl font-semibold text-gray-900">{value}</div>
          <div className="truncate text-sm font-medium text-gray-500">
            {title}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default StatisticsWidget;
