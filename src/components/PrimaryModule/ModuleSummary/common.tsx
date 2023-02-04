import classNames from "classnames";
import {
  type MakeLinkOptions,
  type RegisteredRoutesInfo,
  Link,
} from "@tanstack/react-router";
import { type ReactNode } from "react";
export const SummaryHeader = ({
  title,
  icon,
}: {
  title: string;
  icon: ReactNode;
}) => {
  return (
    <div className="flex select-none items-center gap-4 bg-slate-100 px-4 pt-3 pb-2">
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
  type?: "text" | "link";
  linkProps?: MakeLinkOptions<RegisteredRoutesInfo["routePaths"], ".">;
  amount: string | number | null;
  shown?: boolean;
  redHighlight?: boolean;
  primaryTextHighlight?: boolean;
  primaryBlockHighlight?: boolean;
  biggerText?: boolean;
};

export const makeSummaryDataStyles = (
  data: Pick<
    TSummaryLineItemProps,
    | "primaryTextHighlight"
    | "redHighlight"
    | "primaryBlockHighlight"
    | "biggerText"
  >
) => {
  return classNames(
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
  );
};

export const SummaryLineItem = ({ data }: { data: TSummaryLineItemProps }) => {
  const { type: lineItemType = "text" } = data;

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
          "flex-shrink break-all font-semibold md:max-w-none",
          !data.primaryBlockHighlight ? "text-gray-700" : "",
          data.biggerText ? "text-lg" : "text-base"
        )}
      >
        {data.label}
      </span>
      {lineItemType === "text" && (
        <span className={makeSummaryDataStyles(data)}>{data.amount}</span>
      )}
      {lineItemType === "link" && (
        <Link
          {...(data?.linkProps as any)}
          className={makeSummaryDataStyles(data)}
        >
          {data.amount}
        </Link>
      )}
    </div>
  );
};
