import * as React from "react";

import { TReportDetail } from "@/schemas/report";

interface ReportContextProps {
  userId: string;
  clientId: string;
  reportId: string;
  report: TReportDetail;
}

const reportContext = React.createContext<ReportContextProps | null>(null);

export const ReportContextProvider = (
  props: React.PropsWithChildren<ReportContextProps>
) => {
  return (
    <reportContext.Provider
      value={{
        clientId: props.clientId,
        userId: props.userId,
        reportId: props.reportId,
        report: props.report,
      }}
    >
      {props.children}
    </reportContext.Provider>
  );
};

export const useReportContext = () => {
  const context = React.useContext(reportContext);
  if (context === null) {
    throw new Error(
      "useReportContext must be used within a ReportContextProvider"
    );
  }
  return context;
};
