import * as React from "react";
import { useTranslation } from "react-i18next";

import { TReportDetail, TReportResult } from "@/schemas/report";

type OutputField = TReportDetail["outputFields"][number];
type Candidate = TReportResult[number];

export function useReportValueFormatter() {
  const { t } = useTranslation();

  const formatter = React.useCallback(
    (_: string, outputField: OutputField, candidate: Candidate) => {
      if (typeof candidate === "undefined" || candidate === null) {
        return "-";
      }

      switch (outputField.dataType) {
        case "datetime":
        case "date":
          return t("intlDate", { ns: "format", value: candidate });
        case "decimal":
          return t("intlCurrency", { ns: "format", value: candidate });
        case "string":
          if (String(candidate).length === 0) {
            return "-";
          }
          return candidate;
        default:
          return candidate;
      }
    },
    [t]
  );

  return formatter;
}
