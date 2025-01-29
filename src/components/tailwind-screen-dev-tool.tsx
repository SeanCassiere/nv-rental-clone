import React from "react";

import { IS_DEV } from "@/lib/utils/constants";

export const TailwindScreenDevTool = IS_DEV
  ? () => {
      if (!IS_DEV) return null;

      return (
        <div className="bg-foreground text-background fixed right-2 bottom-2 z-100 w-20 rounded-full py-2 text-center font-semibold">
          <span className="block md:hidden">sm</span>
          <span className="hidden md:block lg:hidden">md</span>
          <span className="hidden lg:block xl:hidden">lg</span>
          <span className="hidden xl:block 2xl:hidden">xl</span>
          <span className="3xl:hidden hidden 2xl:block">2xl</span>
        </div>
      );
    }
  : () => null;
