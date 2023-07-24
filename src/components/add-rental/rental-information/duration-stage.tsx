import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import add from "date-fns/add";
import isBefore from "date-fns/isBefore";
import isEqual from "date-fns/isEqual";
import differenceInSeconds from "date-fns/differenceInSeconds";

import {
  DateTimePicker,
  NativeSelectInput,
  getSelectedOptionForSelectInput,
} from "@/components/Form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useGetLocationsList } from "@/hooks/network/location/useGetLocationsList";
import { useGetAgreementTypesList } from "@/hooks/network/agreement/useGetAgreementTypes";
import { useGetNewAgreementNumber } from "@/hooks/network/agreement/useGetNewAgreementNumber";

const AgreementRentalInformationSchema = z
  .object({
    agreementNumber: z.string().min(1, "Required"),
    destination: z.string().min(1, "Required"),
    agreementType: z.string().min(1, "Required"),
    checkoutDate: z.date({
      invalid_type_error: "Required",
      required_error: "Required",
    }),
    checkinDate: z.date({
      invalid_type_error: "Required",
      required_error: "Required",
    }),
    checkoutLocation: z.coerce
      .number({
        required_error: "Required",
        invalid_type_error: "Required",
      })
      .min(1, {
        message: "Required",
      }),
    checkinLocation: z.coerce
      .number({
        required_error: "Required",
        invalid_type_error: "Required",
      })
      .min(1, {
        message: "Required",
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

  const locationData = useGetLocationsList({ locationIsActive: true });
  const locationOptions = useMemo(() => {
    const empty = { value: "", label: "Select" };
    if (!locationData.data) return [empty];

    return [
      empty,
      ...locationData.data.data.map((option) => ({
        value: `${option.locationId}`,
        label: `${option.locationName}`,
      })),
    ];
  }, [locationData.data]);

  const agreementTypeData = useGetAgreementTypesList();
  const agreementTypeOptions = useMemo(() => {
    const empty = { value: "", label: "Select" };
    if (!agreementTypeData.data) return [empty];

    return [
      empty,
      ...agreementTypeData.data.map((option) => ({
        value: `${option.typeId}`,
        label: `${option.typeName}`,
      })),
    ];
  }, [agreementTypeData.data]);

  const agreementNumberQuery = useGetNewAgreementNumber({
    agreementType: form.getValues("agreementType"),
    enabled: form.getValues("agreementNumber") === "" && isEdit === false,
  });

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
                    <Input placeholder="RT-01" readOnly={isEdit} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <NativeSelectInput
              {...form.register("agreementType")}
              label="Agreement type"
              options={agreementTypeOptions}
              value={getSelectedOptionForSelectInput(
                agreementTypeOptions,
                form.getValues("agreementType"),
                "label"
              )}
              onSelect={(value) => {
                if (value !== null && value.value !== "") {
                  form.setValue("agreementType", value.label as any, {
                    shouldValidate: true,
                  });
                }
              }}
              error={!!form.formState.errors.agreementType}
              errorText={form.formState.errors.agreementType?.message}
              disabled={isEdit}
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
            <DateTimePicker
              label="Checkout Date"
              placeholderText="Checkout Date"
              {...form.register("checkoutDate")}
              selected={form.getValues("checkoutDate")}
              onChange={(date) => {
                if (date) {
                  const previousCheckoutDate =
                    form.getValues("checkoutDate") ?? values.checkoutDate;
                  const previousCheckinDate =
                    form.getValues("checkinDate") ?? values.checkinDate;

                  const differenceInSecondsBetweenDates = differenceInSeconds(
                    previousCheckinDate,
                    previousCheckoutDate
                  );
                  const newCheckinDate = add(new Date(date), {
                    seconds: differenceInSecondsBetweenDates,
                  });
                  form.setValue("checkinDate", newCheckinDate, {
                    shouldValidate: true,
                  });
                }
                form.setValue("checkoutDate", date as any, {
                  shouldValidate: true,
                });
              }}
              inputProps={{
                error: !!form.formState.errors.checkoutDate,
                errorText: form.formState.errors.checkoutDate?.message,
              }}
            />
          </div>
          <div>
            <NativeSelectInput
              {...form.register("checkoutLocation")}
              label="Checkout location"
              options={locationOptions}
              value={getSelectedOptionForSelectInput(
                locationOptions,
                form.getValues("checkoutLocation")
              )}
              onSelect={(value) => {
                if (value !== null && value.value !== "") {
                  form.setValue("checkoutLocation", value.value as any, {
                    shouldValidate: true,
                  });
                }
              }}
              error={!!form.formState.errors.checkoutLocation}
              errorText={form.formState.errors.checkoutLocation?.message}
            />
          </div>
          <div>
            <DateTimePicker
              label="Checkin Date"
              placeholderText="Checkin Date"
              {...form.register("checkinDate")}
              selected={form.getValues("checkinDate")}
              onChange={(date) => {
                form.setValue("checkinDate", date as any, {
                  shouldValidate: true,
                });
              }}
              inputProps={{
                error: !!form.formState.errors.checkinDate,
                errorText: form.formState.errors.checkinDate?.message,
              }}
            />
          </div>
          <div>
            <NativeSelectInput
              {...form.register("checkinLocation")}
              label="Checkin location"
              options={locationOptions}
              value={getSelectedOptionForSelectInput(
                locationOptions,
                form.getValues("checkinLocation")
              )}
              onSelect={(value) => {
                if (value !== null && value.value !== "") {
                  form.setValue("checkinLocation", value.value as any, {
                    shouldValidate: true,
                  });
                }
              }}
              error={!!form.formState.errors.checkinLocation}
              errorText={form.formState.errors.checkinLocation?.message}
            />
          </div>
        </div>
        <div>
          <Button type="submit">Save & Continue</Button>
        </div>
      </form>
    </Form>
  );
};
