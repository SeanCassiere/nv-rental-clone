import * as React from "react";

import { TReportDetail } from "@/schemas/report";

import { makeInitialSearchCriteria } from "@/utils/report";

interface ReportContextProps {
  userId: string;
  clientId: string;
  reportId: string;
  report: TReportDetail;
  searchCriteria: Record<string, string>;
  filtersList: TReportDetail["searchCriteria"];
  resetSearchCriteria: () => void;
}

const reportContext = React.createContext<ReportContextProps | null>(null);

export function ReportContextProvider(
  props: React.PropsWithChildren<
    Pick<ReportContextProps, "userId" | "clientId" | "report" | "reportId">
  >
) {
  const filtersList = props.report.searchCriteria.filter(
    (s) =>
      (s.defaultValue ?? "").toLowerCase() !== "clientid" &&
      (s.defaultValue ?? "").toLowerCase() !== "userid"
  );

  const initialSearchCriteria = makeInitialSearchCriteria(
    props.report.searchCriteria
  );

  const [searchCriteria, setSearchCriteria] = React.useState(
    () => initialSearchCriteria
  );

  const resetSearchCriteria = React.useCallback(() => {
    setSearchCriteria(initialSearchCriteria);
  }, [initialSearchCriteria]);

  return (
    <reportContext.Provider
      value={{
        clientId: props.clientId,
        userId: props.userId,
        reportId: props.reportId,
        report: props.report,
        searchCriteria: searchCriteria,
        filtersList: filtersList,
        resetSearchCriteria: resetSearchCriteria,
      }}
    >
      {props.children}
    </reportContext.Provider>
  );
}

ReportContextProvider.displayName = "ReportContextProvider";

export const useReportContext = () => {
  const context = React.useContext(reportContext);
  if (context === null) {
    throw new Error(
      "useReportContext must be used within a ReportContextProvider"
    );
  }
  return context;
};
