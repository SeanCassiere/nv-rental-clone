import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "react-oidc-context";

import { Skeleton } from "@/components/ui/skeleton";

import { fetchReportByIdOptions } from "@/lib/query/report";

import { ViewReport } from "@/routes/_auth/(reports)/-components/view-report/page";
import { ReportContextProvider } from "@/routes/_auth/(reports)/-components/view-report/view-report-context";
import { Container } from "@/routes/-components/container";

import { getAuthFromRouterContext } from "@/lib/utils/auth";

export const Route = createFileRoute("/_auth/(reports)/reports/$reportId/")({
  beforeLoad: ({ context, params: { reportId } }) => {
    const auth = getAuthFromRouterContext(context);
    return {
      authParams: auth,
      searchReportByIdOptions: fetchReportByIdOptions({ auth, reportId }),
    };
  },
  loader: async ({ context }) => {
    const { queryClient, searchReportByIdOptions } = context;

    if (!context.auth.isAuthenticated) return;

    await queryClient.ensureQueryData(searchReportByIdOptions);

    return;
  },
  component: ViewReportPage,
});

function ViewReportPage() {
  const auth = useAuth();
  const { reportId } = Route.useParams();

  const clientId = auth.user?.profile?.navotar_clientid;
  const userId = auth.user?.profile?.navotar_userid;

  return (
    <Container>
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
    </Container>
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
  const { searchReportByIdOptions } = Route.useRouteContext();

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
