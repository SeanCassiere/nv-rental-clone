import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import add from "date-fns/add";
import isBefore from "date-fns/isBefore";
import isEqual from "date-fns/isEqual";
import differenceInSeconds from "date-fns/differenceInSeconds";

import { DateTimePicker } from "@/components/Form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const locationsList = locationData.data?.data ?? [];

  const agreementTypeData = useGetAgreementTypesList();
  const agreementTypesList = agreementTypeData.data ?? [];

  const currentAgreementType = form.watch("agreementType");
  const agreementNumberQuery = useGetNewAgreementNumber({
    agreementType: currentAgreementType,
    enabled: isEdit === false,
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
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ? field.value : undefined}
                    disabled={isEdit}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an agreement type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {agreementTypesList.map((type, idx) => (
                        <SelectItem
                          key={`${type.typeId}-${idx}`}
                          value={`${type.typeName}`}
                        >
                          {type.typeName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
            <FormField
              control={form.control}
              name="checkoutLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Checkout location</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ? `${field.value}` : undefined}
                    key={`${field.value}`}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select checkout location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {locationsList.map((location, idx) => (
                        <SelectItem
                          key={`${location.locationId}-${idx}-checkout`}
                          value={`${location.locationId}`}
                        >
                          {location.locationName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
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
            <FormField
              control={form.control}
              name="checkinLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Checkin location</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ? `${field.value}` : undefined}
                    key={`${field.value}`}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select checkin location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {locationsList.map((location, idx) => (
                        <SelectItem
                          key={`${location.locationId}-${idx}-checkin`}
                          value={`${location.locationId}`}
                        >
                          {location.locationName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
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