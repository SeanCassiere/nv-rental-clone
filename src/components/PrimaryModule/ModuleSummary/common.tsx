import { useState, type ReactNode } from "react";
import {
  type MakeLinkOptions,
  type RegisteredRoutesInfo,
  Link,
} from "@tanstack/router";
import { Transition } from "@headlessui/react";

import { cn } from "@/utils";
import { ChevronDownOutline, ChevronRightOutline } from "../../icons";

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
  dropdownContent?: ReactNode;
  hasDropdownContent?: boolean;
  isDropdownContentInitiallyShown?: boolean;
  dropdownContentLabel?: string;
};

export const makeSummaryDataStyles = (
  data: Pick<
    TSummaryLineItemProps,
    | "primaryTextHighlight"
    | "redHighlight"
    | "primaryBlockHighlight"
    | "biggerText"
  >,
) => {
  return cn(
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
    data.biggerText ? "text-lg" : "text-base",
  );
};

export const SummaryLineItem = ({ data }: { data: TSummaryLineItemProps }) => {
  const {
    type: lineItemType = "text",
    hasDropdownContent = false,
    isDropdownContentInitiallyShown = false,
    dropdownContentLabel = "More info",
    dropdownContent,
  } = data;

  const [showDropdownContent, setShowDropdownContent] = useState(
    isDropdownContentInitiallyShown,
  );

  return (
    <div
      className={cn(
        "flex flex-col",
        data.primaryBlockHighlight ? "" : "py-2 px-4",
      )}
    >
      <div
        className={cn(
          "flex items-start justify-between gap-4",
          !data.primaryTextHighlight && data.primaryBlockHighlight
            ? "bg-teal-400 text-white"
            : "",
          data.primaryBlockHighlight ? "py-2 px-4" : "",
        )}
      >
        <span
          className={cn(
            "flex-shrink break-all font-semibold md:max-w-none",
            !data.primaryBlockHighlight ? "text-gray-700" : "",
            data.biggerText ? "text-lg" : "text-base",
          )}
        >
          {data.label}
          {hasDropdownContent && (
            <>
              <br />
              <button
                className="flex items-center font-normal text-slate-500"
                onClick={() => {
                  setShowDropdownContent((prev) => !prev);
                }}
              >
                {showDropdownContent ? (
                  <ChevronDownOutline className="h-3 w-3" />
                ) : (
                  <ChevronRightOutline className="h-3 w-3" />
                )}
                &nbsp;{dropdownContentLabel}
              </button>
            </>
          )}
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
      <Transition
        show={Boolean(
          hasDropdownContent && showDropdownContent && dropdownContent,
        )}
        className="grid origin-top-left gap-1 pt-1 md:pl-6"
        enter="transition-all duration-75"
        enterFrom="opacity-0 scale-0"
        enterTo="opacity-100 scale-100"
        leave="transition-all duration-75"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-0"
      >
        {dropdownContent}
      </Transition>
    </div>
  );
};
