import React from "react";

import { cn } from "@/lib/utils/styles";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  as?: React.ElementType;
};

type Ref = React.ElementRef<"main">;

export const Container = React.forwardRef<Ref, Props>((props, ref) => {
  const { className, children, as, ...otherProps } = props;

  const Comp = as ?? "main";

  return (
    <Comp
      ref={ref}
      className={cn(
        "mx-auto w-full max-w-[1700px] flex-1 px-1 md:px-10",
        className
      )}
      {...otherProps}
    >
      {children}
    </Comp>
  );
});
