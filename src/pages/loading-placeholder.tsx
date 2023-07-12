import React from 'react';

import { Loader2 } from 'lucide-react';

const LoadingPlaceholder = () => {
  return (
    <div className="flex flex-1 justify-center bg-background items-center min-h-screen">
      <Loader2 className="w-24 h-24 text-primary animate-spin" />
    </div>
  )
}

export default LoadingPlaceholder