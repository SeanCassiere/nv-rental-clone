import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { add, differenceInMinutes, isBefore, isEqual } from "date-fns";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useAuth } from "react-oidc-context";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  InputDatePicker,
  InputDatePickerSlot,
} from "@/components/ui/input-datepicker";
import {
  InputSelect,
  InputSelectContent,
  InputSelectTrigger,
} from "@/components/ui/input-select";

import { useDatePreference } from "@/hooks/useDatePreferences";

import { getAuthFromAuthHook } from "@/utils/auth";
import {
  fetchAgreementGeneratedNumberOptions,
  fetchAgreementTypesOptions,
} from "@/utils/query/agreement";
import { fetchLocationsListOptions } from "@/utils/query/location";

import i18n from "@/i18next-config";

const REQUIRED = i18n.t("labels:display.required");

const AgreementRentalInformationSchema = z
  .object({
    agreementNumber: z.string().min(1, REQUIRED),
    destination: z.string().min(1, REQUIRED),
    agreementType: z.string().min(1, REQUIRED),
    checkoutDate: z.date({
      invalid_type_error: REQUIRED,
      required_error: REQUIRED,
    }),
    checkinDate: z.date({
      invalid_type_error: REQUIRED,
      required_error: REQUIRED,
    }),
    checkoutLocation: z.coerce
      .number({
        required_error: REQUIRED,
        invalid_type_error: REQUIRED,
      })
      .min(1, {
        message: REQUIRED,
      }),
    checkinLocation: z.coerce
      .number({
        required_error: REQUIRED,
        invalid_type_error: REQUIRED,
      })
      .min(1, {
        message: REQUIRED,
      }),
  })
  .superRefine((values, ctx) => {
    if (
      isBefore(values.checkinDate, values.checkoutDate) ||
      isEqual(values.checkinDate, values.checkoutDate)
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Must be after checkout date",
        path: ["checkinDate"],
      });
    }
  });
export type AgreementRentalInformationSchemaParsed = z.infer<
  typeof AgreementRentalInformationSchema
>;

export interface DurationStageProps {
  initialData?: AgreementRentalInformationSchemaParsed | undefined;
  onCompleted: (data: AgreementRentalInformationSchemaParsed) => void;
  isEdit: boolean;
}

export const DurationStage = ({
  initialData,
  onCompleted,
  isEdit,
}: DurationStageProps) => {
  const { t } = useTranslation();
  const { dateTimeFormat, timeFormat } = useDatePreference();
  const auth = useAuth();
  const authParams = getAuthFromAuthHook(auth);

  const values = {
    agreementNumber: initialData?.agreementNumber ?? "",
    agreementType: initialData?.agreementType ?? "Retail",
    checkoutDate: initialData?.checkoutDate ?? new Date(),
    checkinDate: initialData?.checkinDate ?? add(new Date(), { days: 1 }),
    destination: initialData?.destination ?? "Local",
    checkoutLocation: initialData?.checkoutLocation ?? 0,
    checkinLocation: initialData?.checkinLocation ?? 0,
  };
  const form = useForm({
    resolver: zodResolver(AgreementRentalInformationSchema),
    defaultValues: values,
    values: initialData ? values : undefined,
  });

  const locationData = useQuery(
    fetchLocationsListOptions({
      auth: authParams,
      filters: { withActive: true },
    })
  );
  const locationsList =
    locationData.data?.status === 200 ? locationData.data.body : [];

  const agreementTypeData = useQuery(
    fetchAgreementTypesOptions({
      auth: authParams,
    })
  );
  const agreementTypesList = agreementTypeData.data ?? [];

  const currentAgreementType = form.watch("agreementType");
  const agreementNumberQuery = useQuery(
    fetchAgreementGeneratedNumberOptions({
      auth: authParams,
      agreementType: currentAgreementType,
      enabled: isEdit === false,
    })
  );

  const form_checkoutDate = form.watch("checkoutDate");
  const form_checkinDate = form.watch("checkinDate");

  const handleCheckoutDateChange = (date: Date) => {
    const previousCheckoutDate = form_checkoutDate;
    const previousCheckinDate = form_checkinDate;

    const diffMinsBetweenDates = differenceInMinutes(
      previousCheckinDate,
      previousCheckoutDate
    );
    const checkin = add(new Date(date), {
      minutes: diffMinsBetweenDates,
    });
    form.setValue("checkoutDate", date, { shouldValidate: true });
    form.setValue("checkinDate", checkin, { shouldValidate: true });
  };

  const handleCheckinDateChange = (date: Date) => {
    form.setValue("checkinDate", date, { shouldValidate: true });
  };

  useEffect(() => {
    if (agreementNumberQuery.status !== "success") return;

    form.setValue("agreementNumber", agreementNumberQuery.data?.agreementNo);
  }, [
    agreementNumberQuery.data?.agreementNo,
    agreementNumberQuery.status,
    form,
    form.setValue,
  ]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (data) => {
          onCompleted(data);
        })}
        className="flex flex-col gap-4 px-1 pt-4"
        autoComplete="off"
      >
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <FormField
              control={form.control}
              name="agreementNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Agreement No.</FormLabel>
                  <FormControl>
                    <Input placeholder="RT-01" disabled={isEdit} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              control={form.control}
              name="agreementType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Agreement type</FormLabel>
                  <InputSelect
                    placeholder="Select agreement type"
                    disabled={isEdit}
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    items={agreementTypesList.map((type, idx) => ({
                      id: `${type.typeId}-${idx}`,
                      value: `${type.typeName}`,
                      label: `${type.typeName}`,
                    }))}
                  >
                    <FormControl>
                      <InputSelectTrigger />
                    </FormControl>
                    <InputSelectContent />
                  </InputSelect>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              control={form.control}
              name="destination"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Destination</FormLabel>
                  <FormControl>
                    <Input placeholder="Local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              control={form.control}
              name="checkoutDate"
              render={() => (
                <FormItem>
                  <FormLabel>Checkout date</FormLabel>
                  <InputDatePicker
                    value={form_checkoutDate}
                    onChange={handleCheckoutDateChange}
                    mode="datetime"
                    format={dateTimeFormat}
                    timeFormat={timeFormat}
                    required
                  >
                    <FormControl>
                      <InputDatePickerSlot placeholder="Checkout date" />
                    </FormControl>
                  </InputDatePicker>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              control={form.control}
              name="checkoutLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Checkout location</FormLabel>
                  <InputSelect
                    placeholder="Select checkout location"
                    disabled={isEdit}
                    defaultValue={field.value ? `${field.value}` : undefined}
                    onValueChange={field.onChange}
                    items={locationsList.map((location, idx) => ({
                      id: `${location.locationId}-${idx}-checkout`,
                      value: `${location.locationId}`,
                      label: `${location.locationName}`,
                    }))}
                  >
                    <FormControl>
                      <InputSelectTrigger />
                    </FormControl>
                    <InputSelectContent />
                  </InputSelect>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              control={form.control}
              name="checkinDate"
              render={() => (
                <FormItem>
                  <FormLabel>Checkin date</FormLabel>
                  <InputDatePicker
                    value={form_checkinDate}
                    onChange={handleCheckinDateChange}
                    mode="datetime"
                    format={dateTimeFormat}
                    timeFormat={timeFormat}
                    required
                  >
                    <FormControl>
                      <InputDatePickerSlot placeholder="Checkin date" />
                    </FormControl>
                  </InputDatePicker>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              control={form.control}
              name="checkinLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Checkin location</FormLabel>
                  <InputSelect
                    placeholder="Select checkin location"
                    disabled={isEdit}
                    defaultValue={field.value ? `${field.value}` : undefined}
                    onValueChange={field.onChange}
                    items={locationsList.map((location, idx) => ({
                      id: `${location.locationId}-${idx}-checkin`,
                      value: `${location.locationId}`,
                      label: `${location.locationName}`,
                    }))}
                  >
                    <FormControl>
                      <InputSelectTrigger />
                    </FormControl>
                    <InputSelectContent />
                  </InputSelect>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div>
          <Button type="submit">
            {t("buttons.saveAndContinue", { ns: "labels" })}
          </Button>
        </div>
      </form>
    </Form>
  );
};
