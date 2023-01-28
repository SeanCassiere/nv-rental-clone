import { type ReactNode } from "react";

// status, reference type (retail, insurance),vehicle-type, checkout, checkin, return

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
      <div className="select-none text-xl font-semibold text-gray-700">
        {title}
      </div>
      {subtitle && (
        <span className="hidden select-none pt-2 text-sm text-gray-600 sm:block">
          {subtitle}
        </span>
      )}
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
