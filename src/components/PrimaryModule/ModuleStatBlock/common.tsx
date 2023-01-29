import { type ReactNode } from "react";

import CommonHeader from "../../Layout/CommonHeader";

export const ModuleStatBlockContainer = ({
  children,
  title,
  subtitle,
}: {
  children: ReactNode;
  title: string;
  subtitle?: string;
}) => {
  return (
    <div className="">
      <CommonHeader
        titleContent={
          <h2 className="select-none text-xl font-semibold leading-6 text-gray-700">
            {title}
          </h2>
        }
        {...(subtitle ? { subtitleText: subtitle } : {})}
        includeBottomBorder
      />
      <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {children}
      </div>
    </div>
  );
};

export const ModuleStatBlock = ({
  header,
  stat,
}: {
  header: string;
  stat?: ReactNode;
}) => {
  return (
    <div className="flex min-h-[70px] flex-col rounded border border-slate-200 bg-slate-50 p-4 align-bottom">
      <div className="flex grow items-end">{stat}</div>
      <span className="block min-h-[1rem] w-full shrink-0 select-none truncate text-sm font-medium text-slate-500">
        {header}
      </span>
    </div>
  );
};
