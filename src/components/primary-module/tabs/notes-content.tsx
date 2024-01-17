import { useMemo } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { parseISO } from "date-fns";
import { useTranslation } from "react-i18next";

import { CommonTable } from "@/components/common/common-table";
import { EmptyState } from "@/components/layouts/empty-state";
import { icons } from "@/components/ui/icons";

import type { TNoteDataParsed } from "@/schemas/note";

import { fetchNotesForAgreementById } from "@/utils/query/agreement";
import { fetchNotesForCustomerById } from "@/utils/query/customer";
import { fetchNotesForFleetById } from "@/utils/query/fleet";
import { fetchNotesForReservationById } from "@/utils/query/reservation";
import type { AppPrimaryModuleType } from "@/types/General";

const EmptyIcon = icons.Files;

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
  clientId,
  userId,
}: {
  module: AppPrimaryModuleType;
  referenceId: string;
  clientId: string;
  userId: string;
}) => {
  const { t } = useTranslation();
  const auth = { clientId, userId };

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

  let RenderComponent;

  switch (module) {
    case "agreements":
      RenderComponent = AgreementDisplay;
      break;
    case "reservations":
      RenderComponent = ReservationDisplay;
      break;
    case "customers":
      RenderComponent = CustomerDisplay;
      break;
    case "vehicles":
      RenderComponent = FleetDisplay;
      break;
    default:
      throw new Error("Module not supported");
  }

  return (
    <div className="max-w-full focus:ring-0">
      <RenderComponent
        referenceId={referenceId}
        colDefs={colDefs}
        auth={auth}
      />
    </div>
  );
};

interface ModuleDisplayProps {
  colDefs: ColumnDef<TNoteDataParsed>[];
  referenceId: string;
  auth: { clientId: string; userId: string };
}

const AgreementDisplay = ({
  referenceId,
  colDefs,
  auth,
}: ModuleDisplayProps) => {
  const query = useSuspenseQuery(
    fetchNotesForAgreementById({ auth, agreementId: referenceId })
  );

  const list = query.data?.status === 200 ? query.data.body : [];

  return query.status === "error" || list.length === 0 ? (
    <EmptyState
      title={emptyContentLabels.agreements?.title ?? ""}
      subtitle={emptyContentLabels.agreements?.subtitle ?? ""}
      icon={EmptyIcon}
    />
  ) : (
    <CommonTable columns={colDefs} data={list} />
  );
};

const ReservationDisplay = ({
  referenceId,
  colDefs,
  auth,
}: ModuleDisplayProps) => {
  const query = useSuspenseQuery(
    fetchNotesForReservationById({
      reservationId: referenceId,
      auth,
    })
  );

  const list = query.data?.status === 200 ? query.data.body : [];

  return query.status === "error" || list.length === 0 ? (
    <EmptyState
      title={emptyContentLabels.reservations?.title ?? ""}
      subtitle={emptyContentLabels.reservations?.subtitle ?? ""}
      icon={EmptyIcon}
    />
  ) : (
    <CommonTable columns={colDefs} data={list} />
  );
};

const CustomerDisplay = ({
  referenceId,
  colDefs,
  auth,
}: ModuleDisplayProps) => {
  const query = useSuspenseQuery(
    fetchNotesForCustomerById({
      customerId: referenceId,
      auth,
    })
  );

  const list = query.data?.status === 200 ? query.data.body : [];

  return query.status === "error" || list.length === 0 ? (
    <EmptyState
      title={emptyContentLabels.customers?.title ?? ""}
      subtitle={emptyContentLabels.customers?.subtitle ?? ""}
      icon={EmptyIcon}
    />
  ) : (
    <CommonTable columns={colDefs} data={list} />
  );
};

const FleetDisplay = ({ referenceId, colDefs, auth }: ModuleDisplayProps) => {
  const query = useSuspenseQuery(
    fetchNotesForFleetById({
      fleetId: referenceId,
      auth,
    })
  );

  const list = query.data?.status === 200 ? query.data.body : [];

  return query.status === "error" || list.length === 0 ? (
    <EmptyState
      title={emptyContentLabels.vehicles?.title ?? ""}
      subtitle={emptyContentLabels.vehicles?.subtitle ?? ""}
      icon={EmptyIcon}
    />
  ) : (
    <CommonTable columns={colDefs} data={list} />
  );
};

export default ModuleNotesTabContent;
