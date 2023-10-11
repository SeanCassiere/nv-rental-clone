import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ChevronRightIcon } from "lucide-react";
import { useAuth } from "react-oidc-context";

import ProtectorShield from "@/components/protector-shield";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import { useDocumentTitle } from "@/hooks/internal/useDocumentTitle";

import type { TReportsListItem } from "@/schemas/report";

import { reportQKeys } from "@/utils/query-key";
import { titleMaker } from "@/utils/title-maker";

import { cn } from "@/utils";

export default function SearchReportsPage() {
  const auth = useAuth();

  const clientId = auth.user?.profile?.navotar_clientid || "";
  const userId = auth.user?.profile?.navotar_userid || "";

  useDocumentTitle(titleMaker("Reports"));

  return (
    <ProtectorShield>
      <section
        className={cn(
          "mx-auto mt-6 flex max-w-full flex-col gap-2 px-2 pt-1.5 sm:mx-4 sm:px-1"
        )}
      >
        <div className={cn("flex min-h-[2.5rem] items-center justify-between")}>
          <h1 className="text-2xl font-semibold leading-6">Reports</h1>
        </div>
        <p className={cn("text-base text-foreground/80")}>
          Select and run a report from the list available to you.
        </p>
        <Separator className="mt-3.5" />
      </section>

      <React.Suspense fallback={<Skeleton className="h-24" />}>
        {clientId && userId && (
          <ReportsList clientId={clientId} userId={userId} />
        )}
      </React.Suspense>
    </ProtectorShield>
  );
}

function ReportsList({
  clientId,
  userId,
}: {
  clientId: string;
  userId: string;
}) {
  const query = useSuspenseQuery(
    reportQKeys.getReports({ auth: { clientId, userId } })
  );

  const reports = query.data?.status === 200 ? query.data.body : [];

  const grouped = reports.reduce(
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

  return (
    <section className="mx-auto mb-6 mt-6 flex max-w-full flex-col gap-5 px-2 pt-1.5 sm:mx-4 sm:px-1">
      {[...Object.entries(grouped)].map(([category, list], category_idx) => (
        <div key={`category_${category_idx}_${category}`}>
          <h4 className="mb-3 text-xl font-medium">{category}</h4>
          <ul className="grid w-full grid-cols-1 gap-x-3 gap-y-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {list.map((report, report_idx) => (
              <li
                key={`${category}_${category_idx}_${report.name}_${report_idx}`}
              >
                <Link
                  to="/reports/$reportId"
                  params={{ reportId: report.reportId }}
                >
                  <Card className="flex h-full flex-col justify-between shadow-none transition-all hover:shadow">
                    <CardHeader className="flex h-full flex-row items-center justify-between space-y-0 px-5 py-4 sm:px-4 sm:py-3">
                      <CardTitle className="text-sm font-normal sm:text-base">
                        {report.name}
                      </CardTitle>
                      <ChevronRightIcon className="h-3.5 w-3.5 text-muted-foreground sm:h-4 sm:w-4" />
                      <span className="sr-only">{report.name} icon</span>
                    </CardHeader>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
