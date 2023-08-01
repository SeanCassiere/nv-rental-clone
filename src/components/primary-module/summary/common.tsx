import { useState, type ReactNode } from "react";
import { Link, type LinkPropsOptions } from "@tanstack/router";

import { CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { cn } from "@/utils";

export const SummaryHeader = ({
  title,
  icon,
}: {
  title: string;
  icon: ReactNode;
}) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between border-b px-5 py-4 text-primary">
      <CardTitle className="text-lg font-medium">{title}</CardTitle>
      <span className="text-primary/80">{icon}</span>
    </CardHeader>
  );
};

export type TSummaryLineItemProps = {
  id: string;
  label: string;
  type?: "text" | "link";
  linkProps?: LinkPropsOptions;
  amount: string | number | null;
  shown?: boolean;
  redHighlight?: boolean;
  primaryTextHighlight?: boolean;
  primaryBlockHighlight?: boolean;
  biggerText?: boolean;
  dropdownContent?: ReactNode;
  hasDropdownContent?: boolean;
  isDropdownContentInitiallyShown?: boolean;
};

export const makeSummaryDataStyles = (
  data: Pick<
    TSummaryLineItemProps,
    | "primaryTextHighlight"
    | "redHighlight"
    | "primaryBlockHighlight"
    | "biggerText"
    | "label"
  >
) => {
  const colorMode = data.primaryBlockHighlight
    ? "primary-block-only"
    : data.redHighlight
    ? "red-highlight"
    : data.primaryTextHighlight
    ? "primary-text-only"
    : ("" as const);

  return cn(
    "text-base font-semibold",
    data.biggerText ? "text-lg" : "text-base",
    colorMode === "" ? "text-primary/70" : "",
    colorMode === "primary-block-only" ? "text-primary-foreground" : "",
    colorMode === "primary-text-only" ? "text-primary" : "",
    colorMode === "red-highlight" ? "text-destructive" : ""
  );
};

export const SummaryLineItem = ({ data }: { data: TSummaryLineItemProps }) => {
  const {
    type: lineItemType = "text",
    hasDropdownContent = false,
    isDropdownContentInitiallyShown = false,
    dropdownContent,
  } = data;

  const [value, onValueChange] = useState(
    isDropdownContentInitiallyShown ? "value-1" : undefined
  );

  return (
    <Accordion
      type="single"
      value={value}
      onValueChange={onValueChange}
      collapsible
      className={cn("flex w-full flex-col")}
    >
      <AccordionItem
        value="value-1"
        className={cn(
          "px-5",
          !data.primaryTextHighlight && data.primaryBlockHighlight
            ? "bg-primary text-primary-foreground"
            : ""
        )}
        hideBorder
      >
        <div className="flex items-center justify-between gap-2">
          {hasDropdownContent && dropdownContent ? (
            <AccordionTrigger
              className={cn(
                "w-full py-3 text-left",
                data.biggerText ? "text-lg" : "text-base"
              )}
            >
              {data.label}
            </AccordionTrigger>
          ) : (
            <span
              className={cn(
                "flex flex-1 items-center justify-between py-3 font-medium transition-all",
                data.biggerText ? "text-lg" : "text-base"
              )}
            >
              {data.label}
            </span>
          )}
          {lineItemType === "text" && (
            <span className={makeSummaryDataStyles(data)}>{data.amount}</span>
          )}
          {lineItemType === "link" && (
            <Link
              {...(data?.linkProps as any)}
              className={cn(
                makeSummaryDataStyles(data),
                "underline underline-offset-4"
              )}
            >
              {data.amount}
            </Link>
          )}
        </div>
        {hasDropdownContent && dropdownContent && (
          <AccordionContent>{dropdownContent}</AccordionContent>
        )}
      </AccordionItem>
    </Accordion>
  );
};
