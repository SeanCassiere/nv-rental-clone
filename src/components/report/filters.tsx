import React from "react";
import { PlayIcon, XIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";

import { useReportContext } from "@/hooks/context/view-report";

import { DateReportFilter } from "./filter";

export const ReportFilters = () => {
  const { t } = useTranslation();
  const { filtersList, resetSearchCriteria, searchCriteria } =
    useReportContext();

  return (
    <ul
      className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center"
      aria-label="Report filters"
    >
      {filtersList.map((filter, idx) => {
        const key = `report_filter_${filter.name}_${idx}`;

        const displayName = filter.displayName;
        const accessor = filter.name;

        let Comp = <>{filter.fieldType}</>;

        if (filter.fieldType === "Date") {
          Comp = (
            <DateReportFilter
              key={key}
              accessor={accessor}
              displayName={displayName}
            />
          );
        }

        return (
          <li
            key={key}
            className="flex h-8 items-center"
            aria-label={displayName}
          >
            {Comp}
          </li>
        );
      })}
      <li
        aria-label="Report filter actions"
        className="mt-2 flex items-center justify-start gap-x-1 sm:mt-0"
      >
        <Button
          type="button"
          variant="default"
          className="grow px-2 sm:h-8 sm:grow-0 lg:px-3"
          size="sm"
          onClick={() => {
            console.log("searchCriteria", searchCriteria);
          }}
        >
          <PlayIcon className="mr-2 h-3 w-3" />
          {t("buttons.run", { ns: "labels" })}
        </Button>
        {filtersList.length > 0 && (
          <Button
            type="button"
            variant="ghost"
            className="grow px-2 sm:h-8 sm:grow-0 lg:px-3"
            size="sm"
            onClick={resetSearchCriteria}
          >
            <XIcon className="mr-2 h-3 w-3" />
            {t("buttons.resetFilters", { ns: "labels" })}
          </Button>
        )}
      </li>
    </ul>
  );
};
