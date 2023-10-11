import React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { Skeleton } from "@/components/ui/skeleton";

import { reportQKeys } from "@/utils/query-key";

export default function SearchReportsPage() {
  const auth = useAuth();

  const clientId = auth.user?.profile?.navotar_clientid || "";
  const userId = auth.user?.profile?.navotar_userid || "";

  return (
    <div>
      Reports
      <React.Suspense fallback={<Skeleton className="h-24" />}>
        {clientId && userId && (
          <ReportsList clientId={clientId} userId={userId} />
        )}
      </React.Suspense>
    </div>
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

  return <pre>{JSON.stringify(reports, null, 2)}</pre>;
}
