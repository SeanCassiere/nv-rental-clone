import * as React from "react";
import { useTranslation } from "react-i18next";

import { TReportDetail, TReportResult } from "@/schemas/report";

type OutputField = TReportDetail["outputFields"][number];
type Candidate = TReportResult[number];

const BLANK = "-";

export function useReportValueFormatter() {
  const { t } = useTranslation();

  const formatter = React.useCallback(
    (_: string, outputField: OutputField, candidate: Candidate) => {
      const isNumber =
        outputField.dataType === "int" ||
        outputField.dataType === "decimal" ||
        outputField.dataType === "integer";

      const isEmpty = typeof candidate === "undefined" || candidate === null;

      if (isEmpty && !isNumber) {
        return BLANK;
      }

      switch (outputField.dataType) {
        case "datetime":
        case "date":
          return t("intlDate", { ns: "format", value: candidate });
        case "decimal":
          return t("intlCurrency", { ns: "format", value: candidate ?? 0 });
        case "string":
          if (String(candidate).length === 0) {
            return BLANK;
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
