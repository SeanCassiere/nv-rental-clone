import { useMemo } from "react";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";

import CommonTable from "../../General/CommonTable";
import { useGetModuleNotes } from "../../../hooks/network/module/useGetModuleNotes";
import { type TNoteDataParsed } from "../../../utils/schemas/note";
import { type AppPrimaryModuleType } from "../../../types/General";
import { useTranslation } from "react-i18next";
import { parseISO } from "date-fns";

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

const ModuleNotesTabContent = ({
  module,
  referenceId,
}: {
  module: AppPrimaryModuleType;
  referenceId: string;
}) => {
  const { t } = useTranslation();
  const notesData = useGetModuleNotes({ module, referenceId });

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
                return t("intlDate", { value: parseISO(value) });
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
      <CommonTable data={notesData.data || []} columns={colDefs} />
    </div>
  );
};

export default ModuleNotesTabContent;
