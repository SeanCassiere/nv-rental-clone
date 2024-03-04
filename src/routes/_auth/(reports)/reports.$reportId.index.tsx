import { createFileRoute } from "@tanstack/react-router";

import { fetchReportByIdOptions } from "@/lib/query/report";

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
});
