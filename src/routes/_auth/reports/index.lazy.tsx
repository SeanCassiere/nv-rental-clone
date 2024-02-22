import React from "react";
import { createLazyRoute, getRouteApi } from "@tanstack/react-router";

import { Separator } from "@/components/ui/separator";

import { useDocumentTitle } from "@/lib/hooks/useDocumentTitle";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";

import { titleMaker } from "@/lib/utils/title-maker";

import { incompleteReportsListPageFeatureFlag } from "@/lib/config/features";

import { cn } from "@/lib/utils";

export const Route = createLazyRoute("/_auth/reports/")({
  component: ReportSearchPage,
});

const ReportsListV1 = React.lazy(() => import("./-components/reports-list-v1"));
const ReportsListV2 = React.lazy(() => import("./-components/reports-list-v2"));

const routeApi = getRouteApi("/_auth/reports/");

function ReportSearchPage() {
  // TODO: Replace with a value from the useTranslation() hook
  const ALL_KEY = "All";

  const { category = ALL_KEY } = routeApi.useSearch();

  const [showNewLayout] = useLocalStorage(
    incompleteReportsListPageFeatureFlag.id,
    incompleteReportsListPageFeatureFlag.default_value
  );

  useDocumentTitle(titleMaker("Reports"));

  return (
    <>
      <section
        className={cn(
          "mx-auto mt-6 flex max-w-full flex-col gap-2 px-2 pt-1.5 sm:mx-4 sm:px-1"
        )}
      >
        <div className={cn("flex min-h-[2.5rem] items-center justify-between")}>
          <h1 className="h-full text-2xl font-semibold leading-6">Reports</h1>
        </div>
        <p className={cn("text-base text-foreground/80")}>
          Select and run a report from the list available to you.
        </p>
        {!showNewLayout ? <Separator className="mt-3.5" /> : null}
      </section>

      {showNewLayout ? (
        <ReportsListV2
          currentCategory={category}
          internationalization={{ all: ALL_KEY }}
        />
      ) : (
        <ReportsListV1
          currentCategory={category}
          internationalization={{ all: ALL_KEY }}
        />
      )}
    </>
  );
}
