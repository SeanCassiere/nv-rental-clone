import * as React from "react";
import {
  Link,
  type AnyRoute,
  type LinkOptions,
  type RegisteredRouter,
  type RoutePaths,
} from "@tanstack/react-router";
import { cva, type VariantProps } from "class-variance-authority";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CardHeader, CardTitle } from "@/components/ui/card";

import { cn } from "@/lib/utils";

export const SummaryHeader = ({
  title,
  icon,
}: {
  title: string;
  icon: React.ReactNode;
}) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between border-b px-5 py-4">
      <CardTitle className="text-lg font-medium">{title}</CardTitle>
      <span>{icon}</span>
    </CardHeader>
  );
};

export function isFalsy(val: string | number | null | undefined) {
  return !val;
}

const accordionVariants = cva("font-medium", {
  variants: {
    contentSize: {
      default: "px-5 py-3 text-base",
      lg: "px-5 py-4 text-lg",
    },
    contentColor: {
      default: "",
      primary: "bg-foreground text-background",
    },
  },
  defaultVariants: {
    contentSize: "default",
    contentColor: "default",
  },
  compoundVariants: [],
});

const accordionValueVariants = cva("font-semibold", {
  variants: {
    valueType: {
      default: "",
      link: "underline underline-offset-4 hover:opacity-90",
    },
    valueColor: {
      default: "",
      muted: "opacity-60",
      negative: "text-destructive",
    },
  },
  defaultVariants: {
    valueType: "default",
    valueColor: "default",
  },
});

interface SummaryLineItemProps<
  TRouteTree extends AnyRoute = RegisteredRouter["routeTree"],
  TFrom extends RoutePaths<TRouteTree> | string = string,
  TTo extends string = "",
  TMaskFrom extends RoutePaths<TRouteTree> | string = TFrom,
  TMaskTo extends string = "",
> extends VariantProps<typeof accordionVariants>,
    VariantProps<typeof accordionValueVariants> {
  label: string;
  value: React.ReactNode;
  initialDropdownExpanded?: boolean;
  children?: React.ReactNode | undefined;
  linkOptions?: LinkOptions<TRouteTree, TFrom, TTo, TMaskFrom, TMaskTo>;
}

export function SummaryLineItem<
  TRouteTree extends AnyRoute = RegisteredRouter["routeTree"],
  TFrom extends RoutePaths<TRouteTree> | string = string,
  TTo extends string = "",
  TMaskFrom extends RoutePaths<TRouteTree> | string = TFrom,
  TMaskTo extends string = "",
>(props: SummaryLineItemProps<TRouteTree, TFrom, TTo, TMaskFrom, TMaskTo>) {
  const {
    // main
    label,
    value,
    // styling
    contentSize,
    contentColor,
    valueType,
    valueColor,
    // optionals
    children = undefined,
    initialDropdownExpanded = false,
    linkOptions = undefined,
  } = props;

  const [accordionState, onAccordionStateChange] = React.useState(
    initialDropdownExpanded ? "panel-1" : undefined
  );

  return (
    <Accordion
      type="single"
      value={accordionState}
      onValueChange={onAccordionStateChange}
      collapsible
      className={cn("grid w-full")}
    >
      <AccordionItem
        value="panel-1"
        className={cn(accordionVariants({ contentSize, contentColor }))}
        hideBorder
      >
        <div className="flex items-center justify-between gap-2">
          {children ? (
            <AccordionTrigger className="p-0">{label}</AccordionTrigger>
          ) : (
            <span>{label}</span>
          )}
          {valueType === "link" && linkOptions ? (
            <Link
              className={cn(
                accordionValueVariants({
                  valueType,
                  valueColor,
                })
              )}
              {...(linkOptions as any)}
            >
              {value}
            </Link>
          ) : (
            <span
              className={cn(
                accordionValueVariants({
                  valueType,
                  valueColor,
                })
              )}
            >
              {value}
            </span>
          )}
        </div>
        {children ? (
          <AccordionContent className="p-0">{children}</AccordionContent>
        ) : null}
      </AccordionItem>
    </Accordion>
  );
}
