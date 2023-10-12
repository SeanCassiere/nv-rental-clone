import { c } from "@/api/c";

import {
  ReportDetailSchema,
  ReportResultList,
  ReportsListSchema,
} from "@/schemas/report";

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
  getById: {
    method: "GET",
    path: "/v3/reports/:reportId",
    query: UserAndClientIdAuthSchema,
    responses: {
      200: ReportDetailSchema,
      401: StructuredErrorSchema,
      404: StructuredErrorSchema,
    },
  },
  runReportById: {
    method: "POST",
    path: "/v3/reports/:reportId/run",
    body: c.type<{
      clientId: string;
      userId: string;
      searchCriteria: { name: string; value: string }[];
    }>(),
    responses: {
      200: ReportResultList,
      401: StructuredErrorSchema,
      404: StructuredErrorSchema,
    },
  },
});

export { rootReportContract };
