import * as React from "react";

import { IS_DEV } from "@/lib/utils/constants";

const RouterDevTools = IS_DEV
  ? React.lazy(() =>
      import("@tanstack/router-devtools").then((res) => ({
        default: res.TanStackRouterDevtools,
      }))
    )
  : () => null;

export { RouterDevTools };
