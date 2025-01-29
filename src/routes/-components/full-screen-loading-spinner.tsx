import type { ComponentPropsWithoutRef } from "react";

import { icons } from "@/components/ui/icons";

import { cn } from "@/lib/utils";

export function FullPageLoadingSpinner({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn(
        "grid min-h-full w-full flex-1 place-items-center",
        className
      )}
      {...props}
    >
      <icons.Loading className="text-foreground h-24 w-24 animate-spin" />
    </div>
  );
}
