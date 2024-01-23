import React from "react";

import { cn } from "@/utils/styles";

type Props = React.HTMLAttributes<HTMLDivElement>;

type Ref = React.ElementRef<"main">;

export const Container = React.forwardRef<Ref, Props>((props, ref) => {
  const { className, children, ...otherProps } = props;

  return (
    <main
      ref={ref}
      className={cn(
        "mx-auto w-full max-w-[1700px] flex-1 px-1 md:px-10",
        className
      )}
      {...otherProps}
    >
      {children}
    </main>
  );
});
