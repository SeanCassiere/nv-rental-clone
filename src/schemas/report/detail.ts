import { z } from "zod";

export const ReportDetailSchema = z.object({
  reportId: z.coerce.string(),
  baseReportId: z.coerce.string(),
  isExportableToCSV: z.boolean().catch(false),
  isExportableToExcel: z.boolean().catch(false),
  isPrintable: z.boolean().catch(false),
  name: z.coerce.string(),
  searchCriteria: z.array(
    z.object({
      searchCriteriaId: z.coerce.string(),
      name: z.coerce.string(),
      displayName: z.coerce.string(),
      fieldType: z
        .preprocess(
          (val) => (typeof val === "string" ? val : ""),
          z.enum(["TextBox", "DropDown", "Date", "ListBox", "CheckBox"])
        )
        .catch("TextBox"),
      isVisible: z.boolean().catch(false),
      defaultValue: z.string().or(z.null()),
    })
  ),
});
export type TReportDetail = z.infer<typeof ReportDetailSchema>;
