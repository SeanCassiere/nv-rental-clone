import React from "react";

import { icons } from "@/components/ui/icons";

const LoadingPlaceholder = () => {
  return (
    <div className="grid min-h-dvh place-items-center bg-background">
      <icons.Loading className="h-24 w-24 animate-spin text-foreground" />
    </div>
  );
};

export { LoadingPlaceholder };
