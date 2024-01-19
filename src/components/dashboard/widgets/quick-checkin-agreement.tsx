import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
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

import { useLocalStorage } from "@/hooks/useLocalStorage";

import { STORAGE_DEFAULTS, STORAGE_KEYS } from "@/utils/constants";
import {
  fetchAgreementsSearchListFn,
  fetchAgreementsSearchListOptions,
} from "@/utils/query/agreement";
import type { Auth } from "@/utils/query/helpers";

const QuickCheckinAgreementWidget = (props: Auth) => {
  return (
    <>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">
          Quick rental checkin
        </CardTitle>
      </CardHeader>
      <CardContent>
        <QuickCheckinAgreementForm {...props} />
      </CardContent>
    </>
  );
};

export default React.memo(QuickCheckinAgreementWidget);

function buildFormSchema() {
  return z.object({
    agreementNo: z.string(),
    vehicleNo: z.string(),
  });
}

export function QuickCheckinAgreementForm(props: Auth) {
  const { auth: authParams } = props;
  const { t } = useTranslation();

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(buildFormSchema()),
    defaultValues: {
      agreementNo: "",
      vehicleNo: "",
    },
  });

  const [rowCountStr] = useLocalStorage(
    STORAGE_KEYS.tableRowCount,
    STORAGE_DEFAULTS.tableRowCount
  );
  const defaultRowCount = parseInt(rowCountStr, 10);

  const search = useMutation({
    mutationFn: fetchAgreementsSearchListFn,
    onSuccess: (data, variables) => {
      if (data.status !== 200 || data.body.length === 0) {
        toast.error(t("messages.rentalAgreementNotFound", { ns: "dashboard" }));
        return;
      }

      if (data.body.length > 1) {
        toast.message(t("messages.foundMultipleMatches", { ns: "dashboard" }));
        form.reset();

        const qk = fetchAgreementsSearchListOptions(variables).queryKey;
        queryClient.setQueryData(qk, () => data);

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

      if (!data.body[0]) return;

      const agreement = data.body[0];
      const agreementId = agreement.id;

      navigate({
        to: "/agreements/$agreementId/check-in",
        params: { agreementId: String(agreementId) },
        search: () => ({ stage: "rental-information" }),
      });
    },
  });

  return (
    <Form {...form}>
      <form
        className="grid grid-cols-1 gap-y-2 sm:grid-cols-5 sm:gap-x-4"
        onSubmit={form.handleSubmit(async (values) => {
          if (search.isPending) return;

          // check if any of the values have a string length greater than 0
          // if so, then we can assume that the user has entered some data
          // and we can proceed to the next step
          const hasData = Object.values(values).some(
            (value) => value.length > 0
          );
          if (!hasData) {
            toast.error(
              t("messages.enterVehicleOrAgreementNo", { ns: "dashboard" })
            );
            return;
          }

          search.mutate({
            auth: authParams,
            filters: {
              currentDate: new Date(),
              Statuses: ["2"],
              ...(values.vehicleNo && { VehicleNo: values.vehicleNo }),
              ...(values.agreementNo && {
                AgreementNumber: values.agreementNo,
              }),
            },
            pagination: {
              page: 1,
              pageSize: defaultRowCount,
            },
          });
        })}
      >
        <FormField
          control={form.control}
          name="vehicleNo"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel className="sr-only">
                {t("display.vehicleNo", { ns: "labels" })}
              </FormLabel>
              <FormControl>
                <Input
                  type="search"
                  placeholder={t("display.vehicleNo", { ns: "labels" })}
                  autoComplete="off"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <Button variant="outline" type="submit" className="mt-2">
          <icons.ArrowDownLeft className="mr-2 h-5 w-5" />
          {search.isPending && (
            <icons.Loading className="mr-2 h-4 w-4 animate-spin" />
          )}
          {t("buttons.checkin", { ns: "labels" })}
        </Button>
      </form>
    </Form>
  );
}
