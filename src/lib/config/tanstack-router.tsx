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
    // hide the widget picker modal's state
    createRouteMask({
      routeTree,
      from: "/",
      to: "/",
      search: { show_widget_picker: undefined },
    }),

    // hide the selected summary tab's state of the agreement summary page
    createRouteMask({
      routeTree,
      from: "/agreements/$agreementId/summary",
      to: "/agreements/$agreementId/summary",
      params: true,
      search: { summary_tab: undefined },
    }),

    // hide the selected category state of the reports page
    createRouteMask({
      routeTree,
      from: "/reports",
      to: "/reports",
      search: { category: undefined },
    }),
  ];

  const router = createTanStackRouter({
    routeTree,
    routeMasks,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
    defaultViewTransition: true,
    trailingSlash: "never",
    context: {
      queryClient,
      auth: undefined!, // will be set when passing it into the RouterProvider
    },
    parseSearch: parseSearchWith(JSURL2.parse),
    stringifySearch: stringifySearchWith(JSURL2.stringify, JSURL2.parse),
    Wrap: function WrapComponent({ children }) {
      return (
        <QueryClientProvider client={queryClient}>
          <GlobalDialogProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </GlobalDialogProvider>
        </QueryClientProvider>
      );
    },
    InnerWrap: function InnerWrapComponent({ children }) {
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
