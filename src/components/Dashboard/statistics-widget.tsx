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
        />
      </li>
      <li>
        <StatBlock
          title="On rent"
          icon={TruckOutline}
          value={statistics.openAgreement.toString()}
        />
      </li>
      <li>
        <StatBlock
          title="Overdue"
          icon={CreditCardOutline}
          value={statistics.overDues.toString()}
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
}: {
  title: string;
  value: string;
  icon: ({ className }: IconProps) => JSX.Element;
}) => {
  return (
    <div
      className={classNames(
        "grid grid-cols-7 overflow-hidden rounded-sm bg-white px-4 py-4 shadow",
        { "cursor-pointer": value !== "0", "cursor-not-allowed": value === "0" }
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
  );
};

export default StatisticsWidget;
