import React from "react";

import { IS_DEV } from "@/utils/constants";

export const TailwindScreenDevTool = () => {
  if (!IS_DEV) return null;

  return (
    <div className="fixed bottom-2 right-2 z-[100] w-20 rounded-full bg-foreground py-2 text-center font-semibold text-background">
      <span className="block md:hidden">sm</span>
      <span className="hidden md:block lg:hidden">md</span>
      <span className="hidden lg:block xl:hidden">lg</span>
      <span className="hidden xl:block 2xl:hidden">xl</span>
      <span className="3xl:hidden hidden 2xl:block">2xl</span>
    </div>
  );
};
