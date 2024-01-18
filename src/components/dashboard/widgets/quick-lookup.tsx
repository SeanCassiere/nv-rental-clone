import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { getAuthFromAuthHook } from "@/utils/auth";
import { APP_DEFAULTS, USER_STORAGE_KEYS } from "@/utils/constants";
import {
  fetchAgreementsSearchListFn,
  fetchAgreementsSearchListOptions,
} from "@/utils/query/agreement";
import {
  fetchCustomersSearchListFn,
  fetchCustomersSearchListOptions,
} from "@/utils/query/customer";
import type { Auth } from "@/utils/query/helpers";
import {
  fetchReservationsSearchListFn,
  fetchReservationsSearchListOptions,
} from "@/utils/query/reservation";
import {
  fetchVehiclesSearchListFn,
  fetchVehiclesSearchListOptions,
} from "@/utils/query/vehicle";
import { getLocalStorageForUser } from "@/utils/user-local-storage";

const QuickLookupWidget = (props: Auth) => {
  return (
    <>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Quick lookup</CardTitle>
      </CardHeader>
      <CardContent>
        <QuickLookupForm {...props} />
      </CardContent>
    </>
  );
};

export default React.memo(QuickLookupWidget);

function buildFormSchema() {
  return z.object({
    accessor: z.string(),
    vehicleLicenseNo: z.string().optional(),
    agreementNo: z.string().optional(),
    reservationNo: z.string().optional(),
    customerPhoneNo: z.string().optional(),
  });
}

export function QuickLookupForm(props: Auth) {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const navigate = useNavigate();

  const authParams = props.auth;

  const rowCountStr =
    getLocalStorageForUser(
      authParams.clientId,
      authParams.userId,
      USER_STORAGE_KEYS.tableRowCount
    ) || APP_DEFAULTS.tableRowCount;
  const defaultRowCount = parseInt(rowCountStr, 10);

  const form = useForm({
    resolver: zodResolver(buildFormSchema()),
    defaultValues: {
      accessor: "customerPhoneNo",
      vehicleLicenseNo: "",
      agreementNo: "",
      reservationNo: "",
      customerPhoneNo: "",
    },
    shouldUnregister: true,
  });

  const accessor = form.watch("accessor");

  const customers = useMutation({
    mutationFn: fetchCustomersSearchListFn,
    onSuccess: (data, variables) => {
      if (data.status !== 200 || data.body.length === 0 || !data.body[0]) {
        toast.error(t("notFound", { ns: "messages" }));
        return;
      }

      const searchQuery = fetchCustomersSearchListOptions(variables).queryKey;
      qc.setQueryData(searchQuery, () => data);

      if (data.body.length > 1) {
        toast.message(t("messages.foundMultipleMatches", { ns: "dashboard" }));

        navigate({
          to: "/customers",
          search: () => ({
            page: variables.pagination.page,
            pageSize: variables.pagination.pageSize,
            filters: variables.filters,
          }),
        });
        return;
      }

      const customer = data.body[0];
      navigate({
        to: "/customers/$customerId",
        params: { customerId: String(customer.CustomerId) },
        search: () => ({ tab: "summary" }),
      });
    },
    onError: (err) => {
      toast.error(err?.message ?? t("somethingWentWrong", { ns: "messages" }));
    },
  });

  const agreements = useMutation({
    mutationFn: fetchAgreementsSearchListFn,
    onSuccess: (data, variables) => {
      if (data.status !== 200 || data.body.length === 0 || !data.body[0]) {
        toast.error(t("notFound", { ns: "messages" }));
        return;
      }

      const searchQueryKey =
        fetchAgreementsSearchListOptions(variables).queryKey;
      qc.setQueryData(searchQueryKey, () => data);

      if (data.body.length > 1) {
        toast.message(t("messages.foundMultipleMatches", { ns: "dashboard" }));

        navigate({
          to: "/agreements",
          search: () => ({
            page: variables.pagination.page,
            pageSize: variables.pagination.pageSize,
            filters: variables.filters,
          }),
        });
        return;
      }

      const agreement = data.body[0];
      navigate({
        to: "/agreements/$agreementId",
        params: { agreementId: String(agreement.id) },
        search: () => ({ tab: "summary" }),
      });
    },
    onError: (err) => {
      toast.error(err?.message ?? t("somethingWentWrong", { ns: "messages" }));
    },
  });

  const reservations = useMutation({
    mutationFn: fetchReservationsSearchListFn,
    onSuccess: (data, variables) => {
      if (data.status !== 200 || data.body.length === 0 || !data.body[0]) {
        toast.error(t("notFound", { ns: "messages" }));
        return;
      }

      const searchKey = fetchReservationsSearchListOptions(variables).queryKey;
      qc.setQueryData(searchKey, () => data);

      if (data.body.length > 1) {
        toast.message(t("messages.foundMultipleMatches", { ns: "dashboard" }));

        navigate({
          to: "/reservations",
          search: () => ({
            page: variables.pagination.page,
            pageSize: variables.pagination.pageSize,
            filters: variables.filters,
          }),
        });
        return;
      }

      const reservation = data.body[0];
      navigate({
        to: "/reservations/$reservationId",
        params: { reservationId: String(reservation.id) },
        search: () => ({ tab: "summary" }),
      });
    },
    onError: (err) => {
      toast.error(err?.message ?? t("somethingWentWrong", { ns: "messages" }));
    },
  });

  const vehicles = useMutation({
    mutationFn: fetchVehiclesSearchListFn,
    onSuccess: (data, variables) => {
      if (data.status !== 200 || data.body.length === 0 || !data.body[0]) {
        toast.error(t("notFound", { ns: "messages" }));
        return;
      }

      const searchKey = fetchVehiclesSearchListOptions(variables).queryKey;
      qc.setQueryData(searchKey, () => data);

      if (data.body.length > 1) {
        toast.message(t("messages.foundMultipleMatches", { ns: "dashboard" }));

        navigate({
          to: "/fleet",
          search: () => ({
            page: variables.pagination.page,
            pageSize: variables.pagination.pageSize,
            filters: variables.filters,
          }),
        });
        return;
      }

      const vehicle = data.body[0];
      navigate({
        to: "/fleet/$vehicleId",
        params: { vehicleId: String(vehicle.id) },
        search: () => ({ tab: "summary" }),
      });
    },
    onError: (err) => {
      toast.error(err?.message ?? t("somethingWentWrong", { ns: "messages" }));
    },
  });

  const isSearching =
    customers.isPending ||
    agreements.isPending ||
    reservations.isPending ||
    vehicles.isPending;

  return (
    <Form {...form}>
      <form
        className="grid grid-cols-1 gap-y-2 sm:grid-cols-5 sm:gap-x-4"
        onSubmit={form.handleSubmit(async (values) => {
          if (isSearching) return;

          const { accessor, ...rest } = values;
          const searchKey = Object.keys(rest).find(
            (key) => (rest as Record<string, string>)[key]
          );
          if (!searchKey) return;
          const searchValue = (rest as Record<string, string>)[searchKey];
          if (!searchValue) return;

          switch (accessor) {
            case "customerPhoneNo":
              customers.mutate({
                auth: authParams,
                pagination: {
                  page: 1,
                  pageSize: defaultRowCount,
                },
                filters: {
                  Phone: searchValue,
                },
              });
              break;
            case "agreementNo":
              agreements.mutate({
                auth: authParams,
                pagination: {
                  page: 1,
                  pageSize: defaultRowCount,
                },
                filters: {
                  currentDate: new Date(),
                  AgreementNumber: searchValue,
                },
              });
              break;
            case "reservationNo":
              reservations.mutate({
                auth: authParams,
                pagination: {
                  page: 1,
                  pageSize: defaultRowCount,
                },
                filters: {
                  clientDate: new Date(),
                  ReservationNumber: searchValue,
                },
              });
              break;
            case "vehicleLicenseNo":
              vehicles.mutate({
                auth: authParams,
                pagination: {
                  page: 1,
                  pageSize: defaultRowCount,
                },
                filters: {
                  LicenseNo: searchValue,
                },
              });
              break;
            default:
              console.warn(
                "unknown accessor provided to the QuickLookupForm:",
                accessor
              );
              break;
          }
        })}
      >
        <FormField
          control={form.control}
          name="accessor"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel className="sr-only">Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a verified email to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="customerPhoneNo">
                    {t("display.phoneNo", { ns: "labels" })}
                  </SelectItem>
                  <SelectItem value="agreementNo">
                    {t("display.agreementNo", { ns: "labels" })}
                  </SelectItem>
                  <SelectItem value="reservationNo">
                    {t("display.reservationNo", { ns: "labels" })}
                  </SelectItem>
                  <SelectItem value="vehicleLicenseNo">
                    {t("display.licenseNo", { ns: "labels" })}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {accessor === "customerPhoneNo" && (
          <FormField
            control={form.control}
            name="customerPhoneNo"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel className="sr-only">
                  {t("display.phoneNo", { ns: "labels" })}
                </FormLabel>
                <FormControl>
                  <Input
                    type="search"
                    placeholder={t("display.phoneNo", { ns: "labels" })}
                    autoComplete="off"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {accessor === "reservationNo" && (
          <FormField
            control={form.control}
            name="reservationNo"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel className="sr-only">
                  {t("display.reservationNo", { ns: "labels" })}
                </FormLabel>
                <FormControl>
                  <Input
                    type="search"
                    placeholder={t("display.reservationNo", { ns: "labels" })}
                    autoComplete="off"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {accessor === "agreementNo" && (
          <FormField
            control={form.control}
            name="agreementNo"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel className="sr-only">
                  {t("display.agreementNo", { ns: "labels" })}
                </FormLabel>
                <FormControl>
                  <Input
                    type="search"
                    placeholder={t("display.agreementNo", { ns: "labels" })}
                    autoComplete="off"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {accessor === "vehicleLicenseNo" && (
          <FormField
            control={form.control}
            name="vehicleLicenseNo"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel className="sr-only">
                  {t("display.licenseNo", { ns: "labels" })}
                </FormLabel>
                <FormControl>
                  <Input
                    type="search"
                    placeholder={t("display.licenseNo", { ns: "labels" })}
                    autoComplete="off"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button variant="outline" type="submit" className="mt-2">
          {isSearching ? (
            <icons.Loading className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <icons.Search className="mr-2 h-4 w-4" />
          )}
          {t("buttons.lookup", { ns: "labels" })}
        </Button>
      </form>
    </Form>
  );
}
