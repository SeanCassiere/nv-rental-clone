import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { Skeleton } from "@/components/ui/skeleton";

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
    <React.Suspense fallback={<Skeleton className="h-48" />}>
      {clientId && userId && reportId ? (
        <ViewReport clientId={clientId} userId={userId} reportId={reportId} />
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

export default ViewReportPage;

const ViewReport = ({
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

  if (query.data.status !== 200) {
    return (
      <div>
        <h2>Something went wrong</h2>
        <pre>{JSON.stringify(query.data, null, 2)}</pre>
      </div>
    );
  }

  const report = query.data.body;

  return (
    <div>
      <pre>{JSON.stringify(report, null, 2)}</pre>
    </div>
  );
};
