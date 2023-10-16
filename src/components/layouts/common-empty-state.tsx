import { type ReactNode } from "react";

import { cn } from "@/utils";

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
    <div className={cn("relative flex w-full items-center justify-center")}>
      <div className="w-full rounded-lg border-2 border-dashed border-border p-12 text-center outline-none ring-0">
        {icon && <>{icon}</>}
        <h3 className="mt-2 text-sm font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
};
