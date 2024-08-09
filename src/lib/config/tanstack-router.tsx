import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  createRouteMask,
  createRouter as createTanStackRouter,
  parseSearchWith,
  stringifySearchWith,
} from "@tanstack/react-router";
import * as JSURL2 from "jsurl2";

import { CacheDocumentFocusChecker } from "@/components/cache-buster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { GlobalDialogProvider } from "@/lib/context/modals";

import { queryClient } from "@/lib/config/tanstack-query";

import { routeTree } from "@/route-tree.gen";

export function createRouter() {
  const routeMasks = [
    // hide the widget picker modal's state from the URL
    createRouteMask({
      routeTree,
      from: "/",
      to: "/",
      params: true,
      search: (s) => ({ ...s, show_widget_picker: undefined }),
      unmaskOnReload: true,
    }),

    // hide the summary tab of the agreement summary page
    createRouteMask({
      routeTree,
      from: "/agreements/$agreementId/summary",
      to: "/agreements/$agreementId/summary",
      params: true,
      search: (s) => ({ ...s, summary_tab: undefined }),
      unmaskOnReload: true,
    }),

    // hide the selected category of the reports page
    createRouteMask({
      routeTree,
      from: "/reports",
      to: "/reports",
      params: true,
      search: (s) => ({ ...s, category: undefined }),
      unmaskOnReload: true,
    }),
  ];

  const router = createTanStackRouter({
    routeTree,
    routeMasks,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
    defaultViewTransition: true,
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
