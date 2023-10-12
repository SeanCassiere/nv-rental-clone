import React from "react";

import { useReportContext } from "@/hooks/context/view-report";
import { useDocumentTitle } from "@/hooks/internal/useDocumentTitle";

import { titleMaker } from "@/utils/title-maker";

export const ViewReport = () => {
  const { report } = useReportContext();

  useDocumentTitle(titleMaker(report.name));

  return (
    <div>
      <pre>{JSON.stringify(report, null, 2)}</pre>
    </div>
  );
};
