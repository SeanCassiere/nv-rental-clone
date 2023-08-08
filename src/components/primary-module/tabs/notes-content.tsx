import { useMemo } from "react";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import parseISO from "date-fns/parseISO";
import { FilesIcon } from "lucide-react";

import { CommonTable } from "@/components/common/common-table";
import CommonEmptyStateContent from "@/components/Layout/CommonEmptyStateContent";

import { useGetModuleNotes } from "@/hooks/network/module/useGetModuleNotes";
import type { TNoteDataParsed } from "@/schemas/note";

import type { AppPrimaryModuleType } from "@/types/General";

const columnHelper = createColumnHelper<TNoteDataParsed>();

type TNoteKeyHelp = {
  type: "text" | "date";
  accessor: keyof TNoteDataParsed;
  header: string;
};

const vehicleNoteColumns: TNoteKeyHelp[] = [
  { type: "text", accessor: "note", header: "Note" },
  { type: "text", accessor: "userName", header: "Username" },
  { type: "date", accessor: "createdDate", header: "Created at" },
];
const customerNoteColumns: TNoteKeyHelp[] = [
  { type: "text", accessor: "note", header: "Note" },
  { type: "text", accessor: "userName", header: "Username" },
  { type: "date", accessor: "createdDate", header: "Created at" },
];
const reservationNoteColumns: TNoteKeyHelp[] = [
  { type: "text", accessor: "note", header: "Note" },
  { type: "date", accessor: "createdDate", header: "Created date" },
  { type: "text", accessor: "userName", header: "Username" },
  { type: "text", accessor: "noteType", header: "Note Type" },
];
const agreementNoteColumns: TNoteKeyHelp[] = [
  { type: "text", accessor: "note", header: "Note" },
  { type: "date", accessor: "createdDate", header: "Created date" },
  { type: "text", accessor: "userName", header: "Username" },
  { type: "text", accessor: "noteType", header: "Note Type" },
];

const emptyContentLabels: Record<
  AppPrimaryModuleType,
  { title: string; subtitle: string }
> = {
  vehicles: {
    title: "No notes",
    subtitle: "No notes have been added to this vehicle",
  },
  reservations: {
    title: "No notes",
    subtitle: "No notes have been added to this reservation",
  },
  agreements: {
    title: "No notes",
    subtitle: "No notes have been added to this agreement",
  },
  customers: {
    title: "No notes",
    subtitle: "No notes have been added to this customer",
  },
};

const ModuleNotesTabContent = ({
  module,
  referenceId,
}: {
  module: AppPrimaryModuleType;
  referenceId: string;
}) => {
  const { t } = useTranslation();
  const notesQuery = useGetModuleNotes({ module, referenceId });

  const colDefs = useMemo(() => {
    const columns: ColumnDef<TNoteDataParsed>[] = [];

    const pushToColumns = (localColumns: TNoteKeyHelp[]) => {
      localColumns.forEach((column) => {
        columns.push(
          columnHelper.accessor(column.accessor as any, {
            id: column.header,
            header: () => column.header,
            cell: (item) => {
              const value = item.getValue();
              if (column.type === "date" && typeof value === "string") {
                return t("intlDate", { value: parseISO(value), ns: "format" });
              }

              if (!value) {
                return "";
              }
              return value;
            },
          })
        );
      });
    };

    if (module === "vehicles") {
      pushToColumns(vehicleNoteColumns);
    }
    if (module === "reservations") {
      pushToColumns(reservationNoteColumns);
    }
    if (module === "agreements") {
      pushToColumns(agreementNoteColumns);
    }
    if (module === "customers") {
      pushToColumns(customerNoteColumns);
    }

    return columns;
  }, [module, t]);

  return (
    <div className="max-w-full focus:ring-0">
      {notesQuery.status === "loading" || notesQuery.data?.status !== 200 ? (
        <CommonEmptyStateContent
          title={emptyContentLabels[module]?.title ?? ""}
          subtitle={emptyContentLabels[module]?.subtitle ?? ""}
          icon={<FilesIcon className="mx-auto h-12 w-12 text-foreground/80" />}
        />
      ) : (
        <CommonTable
          data={notesQuery.data?.status === 200 ? notesQuery.data.body : []}
          columns={colDefs}
        />
      )}
    </div>
  );
};

export default ModuleNotesTabContent;
