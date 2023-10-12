import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import ProtectorShield from "@/components/protector-shield";
import { ViewReport } from "@/components/report/view";
import { Skeleton } from "@/components/ui/skeleton";

import { ReportContextProvider } from "@/hooks/context/view-report";

import { viewReportByIdRoute } from "@/routes/reports/report-id-route";

import { reportQKeys } from "@/utils/query-key";

const ViewReportPage: (typeof viewReportByIdRoute)["options"]["component"] = ({
  useParams,
}) => {
  const auth = useAuth();
  const { reportId } = useParams();

  const clientId = auth.user?.profile?.navotar_clientid;
  const userId = auth.user?.profile?.navotar_userid;

  return (
    <ProtectorShield>
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
    </ProtectorShield>
  );
};

export default ViewReportPage;

const FetchReportLayer = ({
  clientId,
  userId,
  reportId,
}: {
  clientId: string;
  userId: string;
  reportId: string;
}) => {
  const query = useSuspenseQuery(
    reportQKeys.getDetailsById({ reportId, auth: { clientId, userId } })
  );

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
};
