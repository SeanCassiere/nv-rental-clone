import { type ReactNode } from "react";

const CommonEmptyStateContent = ({
  title,
  subtitle,
  icon,
}: {
  title: string;
  subtitle: string;
  icon?: ReactNode;
}) => {
  return (
    <div className="relative flex min-h-[300px] w-full items-center justify-center">
      <div className="rounded-lg border-2 border-dashed border-slate-200 p-12 text-center outline-none ring-0">
        {icon ? (
          icon
        ) : (
          <svg
            className="mx-auto h-12 w-12 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              vector-effect="non-scaling-stroke"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
            />
          </svg>
        )}
        <h3 className="mt-2 text-sm font-semibold text-slate-900">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        {/* <div className="mt-6">
        <button
          type="button"
          className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          New Project
        </button>
      </div> */}
      </div>
    </div>
  );
};

export default CommonEmptyStateContent;
