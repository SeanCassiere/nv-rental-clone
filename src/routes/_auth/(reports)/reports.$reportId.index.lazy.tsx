import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createLazyFileRoute, getRouteApi } from "@tanstack/react-router";
import { useAuth } from "react-oidc-context";

import { Skeleton } from "@/components/ui/skeleton";

import { ViewReport } from "@/routes/_auth/(reports)/-components/view-report/page";
import { ReportContextProvider } from "@/routes/_auth/(reports)/-components/view-report/view-report-context";

export const Route = createLazyFileRoute("/_auth/(reports)/reports/$reportId/")(
  {
    component: ViewReportPage,
  }
);

const routeApi = getRouteApi("/_auth/reports/$reportId/");

function ViewReportPage() {
  const auth = useAuth();
  const { reportId } = routeApi.useParams();

  const clientId = auth.user?.profile?.navotar_clientid;
  const userId = auth.user?.profile?.navotar_userid;

  return (
    <React.Suspense fallback={<Skeleton className="h-48" />}>
      {clientId && userId && reportId ? (
        <FetchReportLayer
          clientId={clientId}
          userId={userId}
          reportId={reportId}
        />
      ) : (
        <div>
          <h2>Something is missing</h2>
          <pre>
            {JSON.stringify(
              {
                clientId: clientId ?? `typeof ${typeof clientId} ${clientId}`,
                userId: userId ?? `typeof ${typeof userId} ${userId}`,
                reportId: reportId ?? `typeof ${typeof reportId} ${reportId}`,
              },
              null,
              2
            )}
          </pre>
        </div>
      )}
    </React.Suspense>
  );
}

function FetchReportLayer({
  clientId,
  userId,
  reportId,
}: {
  clientId: string;
  userId: string;
  reportId: string;
}) {
  const { searchReportByIdOptions } = routeApi.useRouteContext();

  const query = useSuspenseQuery(searchReportByIdOptions);

  return (
    <>
      {query.data.status !== 200 && (
        <div>
          <h2>Something went wrong</h2>
          <pre>{JSON.stringify(query.data, null, 2)}</pre>
        </div>
      )}
      {query.data.status === 200 && (
        <ReportContextProvider
          clientId={clientId}
          userId={userId}
          reportId={reportId}
          report={query.data.body}
        >
          <ViewReport />
        </ReportContextProvider>
      )}
    </>
  );
}
