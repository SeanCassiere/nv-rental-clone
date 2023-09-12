import { type ReactNode } from "react";

export const CommonEmptyStateContent = ({
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
      <div className="rounded-lg border-2 border-dashed border-border p-12 text-center outline-none ring-0">
        {icon ? (
          icon
        ) : (
          <svg
            className="foreground mx-auto h-12 w-12"
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
        <h3 className="mt-2 text-sm font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
};
