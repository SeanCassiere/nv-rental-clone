import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, RouteApi, useNavigate, useSearch } from "@tanstack/react-router";
import { useAuth } from "react-oidc-context";

import ProtectorShield from "@/components/protector-shield";
import { icons } from "@/components/ui/icons";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useDocumentTitle } from "@/hooks/internal/useDocumentTitle";

import { searchReportsRoute } from "@/routes/reports/search-reports-route";

import type { TReportsListItem } from "@/schemas/report";

import { titleMaker } from "@/utils/title-maker";

import { cn } from "@/utils";

const routeApi = new RouteApi({ id: "/reports/" });

export default function SearchReportsPage() {
  const auth = useAuth();

  const clientId = auth.user?.profile?.navotar_clientid || "";
  const userId = auth.user?.profile?.navotar_userid || "";
  const ALL_KEY = "All";

  const { category = ALL_KEY } = useSearch({ from: searchReportsRoute.id });

  useDocumentTitle(titleMaker("Reports"));

  return (
    <ProtectorShield>
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
        <Separator className="mt-3.5" />
      </section>

      <React.Suspense fallback={<Skeleton className="h-24" />}>
        {clientId && userId && (
          <ReportsList currentCategory={category} ALL_KEY={ALL_KEY} />
        )}
      </React.Suspense>
    </ProtectorShield>
  );
}

const PAYMENT_BREAKDOWN_REPORT_ID = "117";
const BUSINESS_SUMMARY_REPORT_ID = "116";
const DAILY_BUSINESS_REPORT_ID = "195";

function tenantReportFilterFn(report: TReportsListItem) {
  const tenantReports = [
    PAYMENT_BREAKDOWN_REPORT_ID,
    BUSINESS_SUMMARY_REPORT_ID,
    DAILY_BUSINESS_REPORT_ID,
  ];
  return !tenantReports.includes(report.reportId);
}

function ReportsList({
  ALL_KEY,
  currentCategory,
}: {
  currentCategory: string;
  ALL_KEY: string;
}) {
  const navigate = useNavigate();

  const { searchListOptions } = routeApi.useRouteContext();
  const query = useSuspenseQuery(searchListOptions);

  const reports = query.data?.status === 200 ? query.data.body : [];
  const tenantFiltered = reports.filter(tenantReportFilterFn);

  const grouped = tenantFiltered.reduce(
    (grouping, report) => {
      const category = report.reportCategory ?? "Uncategorized";

      if (grouping.hasOwnProperty(category)) {
        grouping[category]?.push(report);
      } else {
        grouping[category] = [report];
      }

      return grouping;
    },
    {} as Record<string, TReportsListItem[]>
  );

  const chips = [ALL_KEY, ...Object.keys(grouped)];

  return (
    <section className="mx-auto mt-4 flex max-w-full flex-col gap-5 px-2 pt-1.5 sm:mx-4 sm:px-1">
      <Tabs
        value={currentCategory}
        onValueChange={(value) => {
          navigate({
            to: "/reports",
            search: (prev) => ({
              ...prev,
              category: value === ALL_KEY ? undefined : value,
            }),
          });
        }}
      >
        <TabsList className="mb-4 w-full sm:max-w-max">
          {chips.map((chip, idx) => (
            <TabsTrigger key={`tab-trigger-${idx}`} value={chip}>
              {chip}
            </TabsTrigger>
          ))}
        </TabsList>
        {chips.map((chip, idx) => (
          <TabsContent key={`tab-content-${idx}`} value={chip}>
            <div className="mb-6 flex flex-col gap-5">
              {[...Object.entries(grouped)]
                .filter(([category]) =>
                  currentCategory !== ALL_KEY
                    ? category.includes(currentCategory)
                    : true
                )
                .map(([category, list], category_idx) => (
                  <div
                    key={`category_${category_idx}_${category}`}
                    className="sm:mb-3"
                  >
                    <h4 className="mb-3 text-base font-medium sm:text-xl">
                      {category}
                    </h4>
                    <ul
                      className="grid w-full grid-cols-1 gap-1 sm:grid-cols-2 sm:gap-x-2 lg:grid-cols-3"
                      aria-label={`${category} reports`}
                    >
                      {list.map((report, report_idx) => (
                        <li
                          key={`${category}_${category_idx}_${report.name}_${report_idx}`}
                          aria-label={`${report.title}`}
                        >
                          <Link
                            to="/reports/$reportId"
                            params={{ reportId: report.reportId }}
                            className="flex items-center justify-between rounded border border-border/80 px-5 py-3.5 text-foreground/80 outline-none ring-0 transition-all focus-within:ring-0 hover:text-primary focus-visible:text-primary/80 focus-visible:ring-0 sm:justify-start sm:rounded-none sm:border-transparent sm:border-b-muted sm:px-2 sm:py-1.5 sm:hover:border-b-primary sm:focus-visible:border-b-primary/80"
                          >
                            <span className="text-sm sm:text-base">
                              {report.title}
                            </span>
                            <div>
                              <icons.ChevronRight className="ml-1 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              <span className="sr-only">
                                {report.title} icon
                              </span>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
