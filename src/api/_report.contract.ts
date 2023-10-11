import { c } from "@/api/c";

import { ReportsListSchema } from "@/schemas/report";

import { StructuredErrorSchema, UserAndClientIdAuthSchema } from "./helpers";

const rootReportContract = c.router({
  getList: {
    method: "GET",
    path: "/v3/reports",
    query: UserAndClientIdAuthSchema,
    responses: {
      200: ReportsListSchema,
      401: StructuredErrorSchema,
      404: StructuredErrorSchema,
    },
  },
});

export { rootReportContract };
