import { FileRoute } from "@tanstack/react-router";

import { getAuthFromRouterContext } from "@/utils/auth";
import { fetchReportByIdOptions } from "@/utils/query/report";

export const Route = new FileRoute("/reports/$reportId").createRoute({
  beforeLoad: ({ context, params: { reportId } }) => {
    const auth = getAuthFromRouterContext(context);
    return {
      authParams: auth,
      searchReportByIdOptions: fetchReportByIdOptions({ auth, reportId }),
    };
  },
});
