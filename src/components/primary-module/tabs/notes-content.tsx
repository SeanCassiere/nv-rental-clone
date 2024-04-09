import { useMemo } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";

import { CommonTable } from "@/components/common/common-table";
import { icons } from "@/components/ui/icons";

import type { TNoteDataParsed } from "@/lib/schemas/note";
import { fetchAgreementNotesByIdOptions } from "@/lib/query/agreement";
import { fetchCustomerNotesByIdOptions } from "@/lib/query/customer";
import { fetchReservationNotesByIdOptions } from "@/lib/query/reservation";
import { fetchVehiclesNotesByIdOptions } from "@/lib/query/vehicle";

import { EmptyState } from "@/routes/-components/empty-state";

import { parseISO } from "@/lib/config/date-fns";

import type { AppModule } from "@/lib/types/app-module";

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
  AppModule,
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
  module: AppModule;
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
      RenderComponent = VehicleDisplay;
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
    fetchAgreementNotesByIdOptions({ auth, agreementId: referenceId })
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
    fetchReservationNotesByIdOptions({
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
    fetchCustomerNotesByIdOptions({
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

const VehicleDisplay = ({ referenceId, colDefs, auth }: ModuleDisplayProps) => {
  const query = useSuspenseQuery(
    fetchVehiclesNotesByIdOptions({
      vehicleId: referenceId,
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
