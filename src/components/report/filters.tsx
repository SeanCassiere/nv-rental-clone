import React from "react";
import { PlayIcon, XIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  DateReportFilter,
  DropDownReportFilter,
  ListBoxReportFilter,
  TextBoxReportFilter,
} from "@/components/report/filter";
import { Button } from "@/components/ui/button";

import { useReportContext } from "@/hooks/context/view-report";
import { useReportLookupLists } from "@/hooks/internal/useReportLookupLists";

export const ReportFilters = () => {
  const { t } = useTranslation();
  const { report, filtersList, resetSearchCriteria, runReport } =
    useReportContext();

  const lookup = useReportLookupLists(report);

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
            <DateReportFilter accessor={accessor} displayName={displayName} />
          );
        }

        if (filter.fieldType === "TextBox") {
          Comp = (
            <TextBoxReportFilter
              accessor={accessor}
              displayName={displayName}
            />
          );
        }

        if (filter.fieldType === "CheckBox") {
          Comp = (
            <DropDownReportFilter
              accessor={accessor}
              displayName={displayName}
              options={[
                { value: "0", display: "false" },
                { value: "1", display: "true" },
              ]}
            />
          );
        }

        if (filter.fieldType === "ListBox") {
          Comp = (
            <ListBoxReportFilter
              accessor={accessor}
              displayName={displayName}
              options={lookup.getList(filter.name)}
            />
          );
        }

        if (filter.fieldType === "DropDown") {
          Comp = (
            <DropDownReportFilter
              accessor={accessor}
              displayName={displayName}
              options={lookup.getList(filter.name)}
            />
          );
        }

        return (
          <li
            key={key}
            className="flex h-10 items-center sm:h-8"
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
          className="h-10 grow px-2 sm:h-8 sm:grow-0 lg:px-3"
          size="sm"
          onClick={runReport}
        >
          <PlayIcon className="mr-2 h-3 w-3" />
          {t("buttons.run", { ns: "labels" })}
        </Button>
        {filtersList.length > 0 && (
          <Button
            type="button"
            variant="ghost"
            className="h-10 grow px-2 sm:h-8 sm:grow-0 lg:px-3"
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
