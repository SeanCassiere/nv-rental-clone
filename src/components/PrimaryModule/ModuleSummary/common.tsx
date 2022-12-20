import classNames from "classnames";
import { type ReactNode } from "react";
export const SummaryHeader = ({
  title,
  icon,
}: {
  title: string;
  icon: ReactNode;
}) => {
  return (
    <div className="flex select-none items-center gap-4 py-2 px-4">
      <span>{icon}</span>
      <span className="truncate text-lg font-medium text-gray-700">
        {title}
      </span>
    </div>
  );
};

export type TSummaryLineItemProps = {
  id: string;
  label: string;
  amount: string | number | null;
  shown?: boolean;
  redHighlight?: boolean;
  primaryTextHighlight?: boolean;
  primaryBlockHighlight?: boolean;
  biggerText?: boolean;
};

export const SummaryLineItem = ({ data }: { data: TSummaryLineItemProps }) => {
  return (
    <div
      className={classNames(
        "flex select-none items-center justify-between gap-4 py-2 px-4",
        !data.primaryTextHighlight && data.primaryBlockHighlight
          ? "bg-teal-400 text-white"
          : ""
      )}
    >
      <span
        className={classNames(
          "flex-shrink break-all font-medium md:max-w-none",
          !data.primaryBlockHighlight ? "text-gray-700" : "",
          data.biggerText ? "text-lg" : "text-base"
        )}
      >
        {data.label}
      </span>
      <span
        className={classNames(
          "text-base font-semibold",
          !data.primaryTextHighlight &&
            !data.redHighlight &&
            !data.primaryBlockHighlight
            ? "text-gray-700"
            : "",
          data.redHighlight ? "text-red-400" : "",
          data.primaryTextHighlight && !data.primaryBlockHighlight
            ? "text-teal-400"
            : "",
          data.biggerText ? "text-lg" : "text-base"
        )}
      >
        {data.amount}
      </span>
    </div>
  );
};
