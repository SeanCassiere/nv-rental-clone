import React from "react";
import { Link } from "@tanstack/react-router";

import { EmptyState } from "@/components/empty-state";
import { icons } from "@/components/ui/icons";
import { Separator } from "@/components/ui/separator";

import { useDocumentTitle } from "@/lib/hooks/useDocumentTitle";

import { ReportFilters } from "@/routes/_auth/(reports)/-components/view-report/page-filters";
import { useReportContext } from "@/routes/_auth/(reports)/-components/view-report/view-report-context";

import { titleMaker } from "@/lib/utils/title-maker";

import { cn } from "@/lib/utils";

import DefaultView from "./presentation/default-view";
import JsonView from "./presentation/json-view";

const customReports: Record<string, () => React.JSX.Element> = {
  financialsummary: JsonView,
};

export const ViewReport = () => {
  const { report, filtersList, resultState, isPending, runReport } =
    useReportContext();

  const isFiltersAvailable = filtersList.length > 0;

  const lookup = report.name.replaceAll(" ", "").toLowerCase();
  const PresentationView = customReports[lookup] ?? DefaultView;

  useDocumentTitle(titleMaker(report.name));

  return (
    <>
      <section
        className={cn(
          "mx-auto mt-6 flex max-w-full flex-col gap-2 px-2 sm:mx-4 sm:px-1"
        )}
      >
        <div className={cn("flex min-h-[2.5rem] items-center justify-between")}>
          <div className="flex h-full w-full flex-col gap-2 sm:flex-row sm:items-center">
            <Link
              to="/reports"
              className="text-foreground/75 sm:text-foreground inline-block text-xl leading-6 font-semibold sm:text-2xl"
            >
              Reports
            </Link>
            <icons.ChevronRight
              className="hidden h-4 w-4 shrink-0 sm:inline-block"
              aria-hidden="true"
            />
            <h1 className="inline-block text-2xl leading-6 font-semibold">
              {report?.title ? report.title : report.name}
            </h1>
          </div>
          {/* put action details here like save and schedule */}
        </div>

        <p className={cn("text-foreground/80 mt-2 w-full text-base sm:mt-0")}>
          {isFiltersAvailable
            ? "Confirm the search criteria and click the Run button to generate the report."
            : "Click the Run button to generate the report."}
        </p>
        <ReportFilters />
        <Separator className="mt-3.5" />
      </section>

      {resultState.status === "idle" && (
        <section className="mx-2 mt-4 mb-6 sm:mx-4 sm:px-1">
          <EmptyState
            title="Report is ready to run."
            subtitle="Click the Run button to generate the report."
            icon={icons.Folder}
            buttonOptions={{
              content: (
                <>
                  {isPending ? (
                    <icons.Loading className="mr-2 h-3 w-3 animate-spin" />
                  ) : (
                    <icons.Play className="mr-2 h-3 w-3" />
                  )}
                  Run report
                </>
              ),
              onClick: runReport,
            }}
            styles={{ containerClassName: cn("h-[650px]") }}
          />
        </section>
      )}
      {resultState.status === "error" && (
        <section className="mx-2 mt-4 mb-6 sm:mx-4 sm:px-1">
          <EmptyState
            title="Something went wrong"
            subtitle={
              resultState?.error ??
              "Something went wrong, please try again later."
            }
            styles={{ containerClassName: cn("h-[650px]") }}
          />
        </section>
      )}
      {resultState.status === "success" ? <PresentationView /> : null}
    </>
  );
};
