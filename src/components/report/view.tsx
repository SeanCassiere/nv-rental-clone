import React from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRightIcon } from "lucide-react";

import { ReportFilters } from "@/components/report/filters";
import { Separator } from "@/components/ui/separator";

import { useReportContext } from "@/hooks/context/view-report";
import { useDocumentTitle } from "@/hooks/internal/useDocumentTitle";

import { titleMaker } from "@/utils/title-maker";

import { cn } from "@/utils";

export const ViewReport = () => {
  const { report, filtersList, resultState, isPending } = useReportContext();

  const isFiltersAvailable = filtersList.length > 0;

  useDocumentTitle(titleMaker(report.name));

  return (
    <>
      <section
        className={cn(
          "mx-auto mt-6 flex max-w-full flex-col gap-2 px-2 pt-1.5 sm:mx-4 sm:px-1"
        )}
      >
        <div className={cn("flex min-h-[2.5rem] items-center justify-between")}>
          <div className="flex h-full w-full flex-col gap-2 sm:flex-row sm:items-center">
            <Link
              to=".."
              className="inline-block text-xl font-semibold leading-6 text-foreground/75 sm:text-2xl sm:text-foreground"
            >
              Reports
            </Link>
            <ChevronRightIcon
              className="hidden h-4 w-4 flex-shrink-0 sm:inline-block"
              aria-hidden="true"
            />
            <h1 className="inline-block text-2xl font-semibold leading-6">
              {report.name}
            </h1>
          </div>
          {/* put action details here like save and schedule */}
        </div>

        <p className={cn("mt-2 w-full text-base text-foreground/80 sm:mt-0")}>
          {isFiltersAvailable
            ? "Confirm the search criteria and click the Run button to generate the report."
            : "Click the Run button to generate the report."}
        </p>
        <ReportFilters />
        <Separator className="mt-3.5" />
      </section>

      <div>
        {isPending && <p className="mx-4 mt-4">Loading...</p>}
        {resultState.status === "idle" && (
          <p className="mx-4 mt-4">
            Click the Run button to generate the report.
          </p>
        )}
        {resultState.status === "error" && <p>{resultState.error}</p>}
        {resultState.status === "success" && (
          <pre className="mx-4 mt-4 max-w-xs overflow-x-scroll text-sm sm:max-w-lg">
            {JSON.stringify(resultState.rows, null, 2)}
          </pre>
        )}
      </div>
      {/*  */}
    </>
  );
};
