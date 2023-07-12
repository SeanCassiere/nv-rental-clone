import React from 'react';

import { Loader2 } from 'lucide-react';

const LoadingPlaceholder = () => {
  return (
    <div className="grid place-items-center min-h-[100dvh] bg-background">
      <Loader2 className="w-24 h-24 text-primary animate-spin" />
    </div>
  )
}

export default LoadingPlaceholder