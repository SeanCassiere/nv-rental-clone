import { z } from "zod";

export const ReportResultSchema = z.record(
  z.string(),
  z.string().or(z.number()).or(z.boolean()).or(z.null())
);
export type TReportResult = z.infer<typeof ReportResultSchema>;
export const ReportResultList = z.array(ReportResultSchema);
