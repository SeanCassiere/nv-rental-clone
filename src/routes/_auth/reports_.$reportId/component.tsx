import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { RouteApi } from "@tanstack/react-router";
import { useAuth } from "react-oidc-context";

import { ViewReport } from "@/components/report/page";
import { Skeleton } from "@/components/ui/skeleton";

import { ReportContextProvider } from "@/context/view-report";

const routeApi = new RouteApi({ id: "/_auth/reports/$reportId" });

export const component = function ViewReportPage() {
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
};

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
