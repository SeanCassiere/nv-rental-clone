import { createFileRoute } from "@tanstack/react-router";

import { getAuthFromRouterContext } from "@/utils/auth";
import { fetchReportByIdOptions } from "@/utils/query/report";

export const Route = createFileRoute("/_auth/reports/$reportId/")({
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
});
