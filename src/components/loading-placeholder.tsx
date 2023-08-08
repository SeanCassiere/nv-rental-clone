import React from "react";

import { Loader2 } from "lucide-react";

const LoadingPlaceholder = () => {
  return (
    <div className="grid min-h-[100dvh] place-items-center bg-background">
      <Loader2 className="h-24 w-24 animate-spin" />
    </div>
  );
};

export default LoadingPlaceholder;
