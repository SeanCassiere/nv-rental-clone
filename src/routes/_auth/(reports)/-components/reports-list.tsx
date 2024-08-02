import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, useNavigate, useRouteContext } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { EmptyState } from "@/components/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { icons } from "@/components/ui/icons";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { TReportsListItem } from "@/lib/schemas/report";

import { cn } from "@/lib/utils";

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

interface ReportsListV2Props {
  currentCategory: string;
  internationalization: {
    all: string;
  };
}

export default function ReportsListV2(props: ReportsListV2Props) {
  const { currentCategory, internationalization } = props;

  const selectId = React.useId();

  const { t } = useTranslation();
  const navigate = useNavigate({ from: "/reports" });

  const { searchListOptions } = useRouteContext({ from: "/_auth/reports/" });
  const query = useSuspenseQuery(searchListOptions);

  const reportsList = query.data?.status === 200 ? query.data.body : [];
  const tenantFiltered = reportsList.filter(tenantReportFilterFn);

  const isFiltered =
    currentCategory.length > 0 && currentCategory !== internationalization.all;

  const reports = React.useMemo(() => {
    const transformed = transformReportsList(tenantFiltered);

    if (!isFiltered) {
      return transformed;
    }

    return transformed.filter((report) =>
      report.categories.includes(currentCategory)
    );
  }, [isFiltered, currentCategory, tenantFiltered]);

  const categories = React.useMemo(() => {
    const allCategories = tenantFiltered.reduce((acc, report) => {
      if (report.reportCategory) {
        acc.add(report.reportCategory);
      }
      return acc;
    }, new Set<string>());

    return [internationalization.all, ...Array.from(allCategories)];
  }, [internationalization.all, tenantFiltered]);

  const onValueChange = React.useCallback(
    (value: string) => {
      navigate({ search: (search) => ({ ...search, category: value }) });
    },
    [navigate]
  );

  return (
    <section className="mx-auto mb-4 mt-2 grid max-w-full gap-2 px-2 pt-1.5 sm:mx-4 sm:px-1 md:mb-8">
      <div className="grid grid-cols-1 space-y-2 sm:grid-cols-2 sm:space-x-2 sm:space-y-0 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div>
          <Label htmlFor={selectId} className="sr-only">
            Filter down the reports by their category
          </Label>
          <Select
            value={currentCategory || internationalization.all}
            onValueChange={onValueChange}
          >
            <SelectTrigger
              id={selectId}
              className="w-full truncate whitespace-nowrap bg-card"
            >
              <SelectValue
                placeholder="Select a category"
                className="truncate"
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Report categories</SelectLabel>
                {categories.map((category) => (
                  <SelectItem key={`category_${category}`} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <nav>
        <ul
          className={cn(
            "-mx-px grid grid-cols-1 overflow-hidden rounded-md border-l border-border sm:mx-0 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
            reports.length > 2
              ? "border-t"
              : "[&>li:nth-child(1)]:border-t [&>li]:sm:border-t"
          )}
        >
          {reports.length > 0 ? (
            reports.map((report, idx) => (
              <li
                key={`report_item_${report.id}_${idx}`}
                className="relative flex min-h-[5rem] flex-col items-start justify-between border-b border-r border-border bg-card p-4 sm:p-6"
              >
                <Link
                  to="/reports/$reportId"
                  params={{ reportId: report.id }}
                  className={cn(
                    buttonVariants({ variant: "link" }),
                    "flex w-full grow justify-start text-balance px-0 py-2"
                  )}
                >
                  {report.title}
                </Link>
                <p className="text-sm text-foreground/60">
                  {report.categories.map((category, idx) => (
                    <React.Fragment key={`${report.id}_${category}_${idx}`}>
                      <Link
                        to="/reports"
                        className="underline-offset-4 hover:text-muted-foreground hover:underline"
                        search={(s) => ({ ...s, category })}
                      >
                        {category}
                      </Link>
                      {idx < report.categories.length - 1 && ", "}
                    </React.Fragment>
                  ))}
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
