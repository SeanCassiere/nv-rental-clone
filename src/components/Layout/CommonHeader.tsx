import { type ReactNode } from "react";
import classNames from "classnames";

const CommonHeader = ({
  subtitleText,
  includeBottomBorder,
  headerActionContent,
  titleContent,
}: {
  subtitleText?: string;
  includeBottomBorder?: boolean;
  headerActionContent?: ReactNode;
  titleContent?: ReactNode;
}) => {
  return (
    <div
      className={classNames(
        "pb-4",
        includeBottomBorder ? "border-b border-slate-100" : ""
      )}
    >
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="w-full">{titleContent}</div>
        {headerActionContent && (
          <>{headerActionContent}</>
          // <div className="mt-3 flex w-min sm:mt-0 sm:ml-4">
          //   <button
          //     type="button"
          //     className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          //   >
          //     Dummy
          //   </button>
          //   <button
          //     type="button"
          //     className="ml-3 inline-flex items-center rounded-md border border-transparent bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          //   >
          //     Dummy
          //   </button>
          // </div>
        )}
      </div>
      {subtitleText && (
        <p className="mt-2 max-w-4xl select-none text-sm text-slate-600">
          {subtitleText}
        </p>
      )}
    </div>
  );
};

export default CommonHeader;
