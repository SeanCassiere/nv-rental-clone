import classNames from "classnames";
import { type ReactNode } from "react";

export type TAnyCustomerValueType = string | number | null;
export const EMPTY_KEY = "-";
export const isUndefined = (value: any) => typeof value === "undefined";

interface TInformationBlockProps {
  heading: string;
  value: ReactNode;
  isLoading: boolean;
}

const InformationBlock = (props: TInformationBlockProps) => {
  return (
    <div className="grid gap-0.5 border-b border-b-slate-200 px-4 pb-2">
      <span className="text-base font-bold text-slate-800">
        {props.heading}
      </span>
      <span className="pt-1.5 pb-2 text-base leading-3 text-slate-700">
        {props.isLoading ? "Loading" : props.value}
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
    <div className="rounded border border-slate-200 bg-slate-50 pt-1">
      <div className="flex select-none gap-4 border-b border-b-slate-200 px-4 py-2">
        <span className="flex items-center justify-center text-slate-700">
          {props.icon}
        </span>
        <span className="col-span-11 truncate text-lg font-medium text-gray-700">
          {props.title}
        </span>
      </div>
      <div
        className={classNames("grid gap-y-4 pt-3", {
          "grid-cols-3": props.numberPerBlock === 3,
          "grid-cols-4": props.numberPerBlock === 4,
        })}
      >
        {props.blocks.map((block) => (
          <InformationBlock
            key={`${props.identifier}-${block.heading}`}
            {...block}
            isLoading={props.isLoading}
          />
        ))}
      </div>
    </div>
  );
};
