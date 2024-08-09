import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  createRouter as createTanStackRouter,
  parseSearchWith,
  stringifySearchWith,
} from "@tanstack/react-router";
import * as JSURL2 from "jsurl2";

import { CacheDocumentFocusChecker } from "@/components/cache-buster";
import { icons } from "@/components/ui/icons";
import { TooltipProvider } from "@/components/ui/tooltip";

import { GlobalDialogProvider } from "@/lib/context/modals";

import { queryClient } from "@/lib/config/tanstack-query";

import { routeTree } from "@/route-tree.gen";

export function createRouter() {
  const router = createTanStackRouter({
    routeTree,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
    defaultViewTransition: true,
    defaultPendingComponent: function RouterPendingComponent() {
      <div className="grid min-h-full w-full place-items-center">
        <icons.Loading className="h-24 w-24 animate-spin text-foreground" />
      </div>;
    },
    parseSearch: parseSearchWith((value) => JSURL2.parse(value)),
    stringifySearch: stringifySearchWith(
      (value) => JSURL2.stringify(value),
      (value) => JSURL2.parse(value)
    ),
    context: {
      queryClient,
      auth: undefined!, // will be set by an AuthWrapper
    },
    trailingSlash: "never",
    Wrap: function ({ children }) {
      return (
        <QueryClientProvider client={queryClient}>
          <GlobalDialogProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </GlobalDialogProvider>
        </QueryClientProvider>
      );
    },
    InnerWrap: function ({ children }) {
      return (
        <React.Fragment>
          <CacheDocumentFocusChecker />
          {children}
        </React.Fragment>
      );
    },
  });

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
