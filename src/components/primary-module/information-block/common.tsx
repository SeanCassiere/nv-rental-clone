import { type ReactNode } from "react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { cn } from "@/utils";

export type TAnyCustomerValueType = string | number | null;
export const EMPTY_KEY = "-";
export const isUndefined = (value: any) => typeof value === "undefined";

interface TInformationBlockProps {
  heading: string;
  value: ReactNode;
  isLoading: boolean;
  isHiddenOnMobile?: boolean;
}

const InformationBlock = (props: TInformationBlockProps) => {
  const { isHiddenOnMobile } = props;
  return (
    <div
      className={cn(
        {
          hidden: isHiddenOnMobile,
          grid: !isHiddenOnMobile,
        },
        "gap-0.5 border-b pb-2 sm:grid"
      )}
    >
      <span className="select-none truncate px-1 text-base font-semibold text-primary">
        {props.heading}
      </span>
      <span className="truncate px-1 pb-2 pt-1.5 text-base leading-3 text-primary/80">
        {props.isLoading ? EMPTY_KEY : props.value}
      </span>
    </div>
  );
};

export interface TInformationBlockCardProps {
  identifier: string;
  icon: ReactNode;
  title: string;
  blocks: Omit<TInformationBlockProps, "isLoading">[];
  numberPerBlock: 3 | 4;
  isLoading: boolean;
}
export const InformationBlockCard = (props: TInformationBlockCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between border-b px-5 py-4 text-primary">
        <CardTitle className="text-lg font-medium">{props.title}</CardTitle>
        <span className="text-primary/80">{props.icon}</span>
      </CardHeader>
      <CardContent
        className={cn(
          "grid grid-cols-1 gap-4 pt-6 sm:grid-cols-2",
          props.numberPerBlock === 3 ? "lg:grid-cols-3" : "",
          props.numberPerBlock === 4 ? "lg:grid-cols-4" : ""
        )}
      >
        {props.blocks.map((block) => (
          <InformationBlock
            key={`${props.identifier}-${block.heading}`}
            {...block}
            isLoading={props.isLoading}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export const InformationBlockCardWithChildren = (
  props: Omit<
    TInformationBlockCardProps & { children: ReactNode },
    "numberPerBlock" | "blocks"
  > & { renderEndIcon?: ReactNode }
) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between border-b px-5 py-4 text-primary">
        <CardTitle className="text-lg font-medium">{props.title}</CardTitle>
        <span className="flex items-center text-primary/80">
          {props.icon}
          {props.renderEndIcon && <>{props.renderEndIcon}</>}
        </span>
      </CardHeader>
      <CardContent>{props.children}</CardContent>
    </Card>
  );
};
