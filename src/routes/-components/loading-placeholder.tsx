import React from "react";

import { icons } from "@/components/ui/icons";

const LoadingPlaceholder = () => {
  return (
    <div className="bg-background grid min-h-dvh place-items-center">
      <icons.Loading className="text-foreground h-24 w-24 animate-spin" />
    </div>
  );
};

export { LoadingPlaceholder };
