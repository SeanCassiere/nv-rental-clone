import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { calculatePercentage, cn } from "@/lib/utils";

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, style, max = 100, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "bg-muted relative h-4 w-full overflow-hidden rounded-full",
      className
    )}
    style={{ transform: "translateZ(0)", ...style }}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="bg-primary h-full w-full flex-1 transition-all"
      style={{
        transform: `translateX(-${100 - calculatePercentage(value || 0, max)}%)`,
      }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
