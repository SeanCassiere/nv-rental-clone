import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { EmptyState } from "@/components/layouts/empty-state";
import { icons } from "@/components/ui/icons";

import type { TReportsListItem } from "@/lib/schemas/report";

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

type TransformedReportItem = {
  id: string;
  title: TReportsListItem["title"];
  categories: string[];
  internal_name: TReportsListItem["name"];
};
function transformReportsList(
  list: TReportsListItem[]
): TransformedReportItem[] {
  return list.reduce((acc, report) => {
    const existing = acc.find((item) => item.id === report.reportId);

    if (existing) {
      if (
        !existing.categories.includes(report.reportCategory ?? "Uncategorized")
      ) {
        existing.categories.push(report.reportCategory ?? "Uncategorized");
      }
    } else {
      acc.push({
        id: report.reportId,
        title: report.title,
        categories: [report.reportCategory ?? "Uncategorized"],
        internal_name: report.name,
      });
    }

    return acc;
  }, [] as TransformedReportItem[]);
}

const routeApi = getRouteApi("/_auth/reports/");

export default function ReportsListV2() {
  const { t } = useTranslation();

  const { searchListOptions } = routeApi.useRouteContext();
  const query = useSuspenseQuery(searchListOptions);

  const reportsList = React.useMemo(
    () => (query.data?.status === 200 ? query.data.body : []),
    [query.data?.status, query.data?.body]
  );
  const tenantFiltered = React.useMemo(
    () => reportsList.filter(tenantReportFilterFn),
    [reportsList]
  );
  const reports = React.useMemo(
    () => transformReportsList(tenantFiltered),
    [tenantFiltered]
  );

  return (
    <section className="mx-auto my-4 max-w-full px-2 pt-1.5 sm:mx-4 sm:px-1">
      {/* <h4>Reports List V2</h4> */}
      <nav>
        <ul className="-mx-px grid grid-cols-2 overflow-hidden rounded border-l border-t border-border sm:mx-0 md:grid-cols-2 xl:grid-cols-3">
          {reports.length > 0 ? (
            reports.map((report, idx) => (
              <li
                key={`report_item_${report.id}_${idx}`}
                className="group relative flex min-h-[5rem] flex-col items-start justify-between border-b border-r border-border bg-card p-4 sm:p-6"
              >
                <Link
                  to="/reports/$reportId"
                  params={{ reportId: report.id }}
                  className="w-full text-balance py-2 sm:px-6"
                >
                  {report.title}
                </Link>
                <p className="text-sm text-foreground/60 sm:px-6">
                  {report.categories.join(", ")}
                </p>
              </li>
            ))
          ) : (
            <li className="col-span-2 md:col-span-3 lg:col-span-4">
              <EmptyState
                title={t("display.noResultsFound", { ns: "labels" })}
                subtitle={t("noResultsWereFoundForThisSearch", {
                  ns: "messages",
                })}
                icon={icons.FolderEmpty}
                styles={{ containerClassName: "border-t-0" }}
              />
            </li>
          )}
        </ul>
      </nav>
    </section>
  );
}
