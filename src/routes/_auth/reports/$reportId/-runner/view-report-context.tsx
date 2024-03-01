import * as React from "react";
import { useMutation } from "@tanstack/react-query";

import type { TReportDetail, TReportResult } from "@/lib/schemas/report";

import { makeInitialSearchCriteria } from "@/lib/utils/report";

import { apiClient } from "@/lib/api";

interface ReportContextProps {
  userId: string;
  clientId: string;
  reportId: string;
  report: TReportDetail;
  initialSearchCriteria: Record<string, string>;
  searchCriteria: Record<string, string>;
  setCriteriaValue: (accessor: string, value: string) => void;
  filtersList: TReportDetail["searchCriteria"];
  resetSearchCriteria: () => void;
  runReport: () => void;
  isPending: boolean;
  resultState: ReturnType<typeof reducer>;
}

const reportContext = React.createContext<ReportContextProps | null>(null);

type DataState =
  | { error: null; status: "fetching"; rows: null }
  | { error: null; status: "idle"; rows: null }
  | { error: string; status: "error"; rows: null }
  | { error: null; status: "success"; rows: TReportResult[] };
type ActionType =
  | { type: "error"; error: string }
  | { type: "success"; rows: TReportResult[] }
  | { type: "idle" };

function reducer(state: DataState, action: ActionType): DataState {
  switch (action.type) {
    case "idle":
      return { ...state, error: null, status: "idle", rows: null };
    case "success":
      return { ...state, error: null, status: "success", rows: action.rows };
    case "error":
      return { ...state, error: action.error, status: "error", rows: null };
    default:
      throw new Error("Invalid action type");
  }
}

export function ReportContextProvider(
  props: React.PropsWithChildren<
    Pick<ReportContextProps, "userId" | "clientId" | "report" | "reportId">
  >
) {
  const filtersList = props.report.searchCriteria.filter(
    (s) =>
      (s.defaultValue ?? "").toLowerCase() !== "clientid" &&
      (s.defaultValue ?? "").toLowerCase() !== "userid" &&
      (s.name ?? "").toLowerCase() !== "customerid"
  );

  const initialSearchCriteria = React.useMemo(
    () => makeInitialSearchCriteria(props.report.searchCriteria),
    [props.report.searchCriteria]
  );

  const [searchCriteria, setSearchCriteria] = React.useState(
    () => initialSearchCriteria
  );

  const [state, dispatch] = React.useReducer(reducer, {
    status: "idle",
    error: null,
    rows: null,
  });

  const resetSearchCriteria = React.useCallback(() => {
    setSearchCriteria(initialSearchCriteria);
  }, [initialSearchCriteria]);

  const setCriteriaValue = React.useCallback(
    (accessor: string, value: string) => {
      setSearchCriteria((prev) => ({ ...prev, [accessor]: value }));
    },
    []
  );

  const _mutation = useMutation({
    mutationFn: () =>
      apiClient.report.runReportById({
        params: { reportId: props.reportId },
        body: {
          clientId: props.clientId,
          userId: props.userId,
          searchCriteria: Object.entries(searchCriteria).map(
            ([key, value]) => ({ name: key, value })
          ),
        },
      }),
    onMutate: () => {},
    onSuccess: (data) => {
      if (data.status !== 200) {
        throw new Error("There was an error running the report");
      }

      const rows = data.body ?? [];

      dispatch({ type: "success", rows });
    },
    onError: (error) => {
      const message = "Something went wrong. Please try again later.";
      if (error instanceof Error) {
        dispatch({ type: "error", error: error?.message ?? message });
      } else {
        dispatch({ type: "error", error: message });
      }
    },
  });

  const runReport = React.useCallback(() => {
    if (_mutation.isPending) return;

    _mutation.mutate();
  }, [_mutation]);

  return (
    <reportContext.Provider
      value={{
        clientId: props.clientId,
        userId: props.userId,
        reportId: props.reportId,
        report: props.report,
        initialSearchCriteria: initialSearchCriteria,
        searchCriteria: searchCriteria,
        filtersList: filtersList,
        resetSearchCriteria: resetSearchCriteria,
        setCriteriaValue: setCriteriaValue,
        runReport: runReport,
        isPending: _mutation.isPending,
        resultState: state,
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
