import { z } from "zod";

const ReportOutputFieldSchema = z.object({
  name: z.string(),
  displayName: z.string().catch("Empty column"),
  displayOrder: z.number().catch(0),
  isVisible: z.boolean().catch(false),
  dataType: z
    .preprocess(
      (val) => {
        const value = typeof val === "string" ? val.toLowerCase() : String(val);
        return value;
      },
      z.enum([
        "string",
        "integer",
        "int",
        "decimal",
        "date",
        "datetime",
        "boolean",
      ])
    )
    .catch("string"),
});

export const ReportDetailSchema = z.object({
  reportId: z.coerce.string(),
  baseReportId: z.coerce.string(),
  isExportableToCSV: z.boolean().catch(false),
  isExportableToExcel: z.boolean().catch(false),
  isPrintable: z.boolean().catch(false),
  name: z.coerce.string(),
  title: z.string().optional(),
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
  outputFields: z.array(ReportOutputFieldSchema),
});
export type TReportDetail = z.infer<typeof ReportDetailSchema>;
