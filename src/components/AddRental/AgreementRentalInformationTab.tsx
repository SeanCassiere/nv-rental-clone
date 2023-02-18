import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { add, isBefore, isEqual, differenceInSeconds } from "date-fns";

import { DocumentTextSolid } from "../icons";
import { Button, TextInput, SelectInput, DateTimePicker } from "../Form";
import { InformationBlockCardWithChildren } from "../PrimaryModule/ModuleInformation/common";

import { useGetLocationsList } from "../../hooks/network/location/useGetLocationsList";
import { useGetAgreementTypesList } from "../../hooks/network/agreement/useGetAgreementTypes";
import { useGetNewAgreementNumber } from "../../hooks/network/agreement/useGetNewAgreementNumber";

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

const AgreementRentalInformationTab = ({
  initialData,
  onCompleted,
  isEdit,
}: {
  initialData?: Partial<AgreementRentalInformationSchemaParsed>;
  onCompleted: (data: AgreementRentalInformationSchemaParsed) => void;
  isEdit: boolean;
}) => {
  const values = {
    agreementNumber: initialData?.agreementNumber ?? "",
    agreementType: initialData?.agreementType ?? "Retail",
    checkoutDate: initialData?.checkoutDate ?? new Date(),
    checkinDate: initialData?.checkinDate ?? add(new Date(), { days: 1 }),
    destination: initialData?.destination ?? "Local",
    checkoutLocation: initialData?.checkoutLocation ?? 0,
    checkinLocation: initialData?.checkinLocation ?? 0,
  };
  const {
    handleSubmit,
    register,
    formState: { errors },
    getValues,
    setValue,
  } = useForm({
    resolver: zodResolver(AgreementRentalInformationSchema),
    defaultValues: values,
    values: initialData ? values : undefined,
  });

  const locationData = useGetLocationsList({ locationIsActive: true });
  const locationOptions = useMemo(() => {
    if (!locationData.data) return [];

    return locationData.data.data.map((option) => ({
      value: `${option.locationId}`,
      label: `${option.locationName}`,
    }));
  }, [locationData.data]);

  const getSelectedLocation = useCallback(
    (value: number) =>
      locationOptions.find((option) => option.value === `${value}`),
    [locationOptions]
  );

  const agreementTypeData = useGetAgreementTypesList();
  const agreementTypeOptions = useMemo(() => {
    if (!agreementTypeData.data) return [];

    return agreementTypeData.data.map((option) => ({
      value: `${option.typeId}`,
      label: `${option.typeName}`,
    }));
  }, [agreementTypeData.data]);

  const getSelectedAgreementType = useCallback(
    (value: string) =>
      agreementTypeOptions.find((option) => option.label === `${value}`),
    [agreementTypeOptions]
  );

  useGetNewAgreementNumber({
    agreementType: getValues("agreementType"),
    enabled: getValues("agreementNumber") === "" && isEdit === false,
    onSuccess: (data) => {
      setValue("agreementNumber", data.agreementNo);
    },
  });

  return (
    <InformationBlockCardWithChildren
      identifier="rental-information"
      icon={<DocumentTextSolid className="h-5 w-5" />}
      title="Rental information"
      isLoading={false}
    >
      <form
        onSubmit={handleSubmit(async (data) => {
          onCompleted(data);
        })}
        className="flex flex-col gap-4 p-4"
        autoComplete="off"
      >
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <TextInput
              label="Agreement No."
              {...register("agreementNumber")}
              error={!!errors.agreementNumber}
              errorText={errors.agreementNumber?.message}
              readOnly={isEdit}
            />
          </div>
          <div>
            <SelectInput
              {...register("agreementType")}
              label="Agreement type"
              options={agreementTypeOptions}
              value={getSelectedAgreementType(getValues("agreementType"))}
              onSelect={(value) => {
                if (value !== null) {
                  setValue("agreementType", value.label as any, {
                    shouldValidate: true,
                  });
                }
              }}
              error={!!errors.agreementType}
              errorText={errors.agreementType?.message}
              disabled={isEdit}
            />
          </div>
          <div>
            <TextInput
              label="Destination"
              {...register("destination")}
              error={!!errors.destination}
              errorText={errors.destination?.message}
            />
          </div>
          <div>
            <DateTimePicker
              label="Checkout Date"
              placeholderText="Checkout Date"
              {...register("checkoutDate")}
              selected={getValues("checkoutDate")}
              onChange={(date) => {
                if (date) {
                  const previousCheckoutDate =
                    getValues("checkoutDate") ?? values.checkoutDate;
                  const previousCheckinDate =
                    getValues("checkinDate") ?? values.checkinDate;

                  const differenceInSecondsBetweenDates = differenceInSeconds(
                    previousCheckinDate,
                    previousCheckoutDate
                  );
                  const newCheckinDate = add(new Date(date), {
                    seconds: differenceInSecondsBetweenDates,
                  });
                  setValue("checkinDate", newCheckinDate, {
                    shouldValidate: true,
                  });
                }
                setValue("checkoutDate", date as any, { shouldValidate: true });
              }}
              inputProps={{
                error: !!errors.checkoutDate,
                errorText: errors.checkoutDate?.message,
              }}
            />
          </div>
          <div>
            <SelectInput
              {...register("checkoutLocation")}
              label="Checkout location"
              options={locationOptions}
              value={getSelectedLocation(getValues("checkoutLocation"))}
              onSelect={(value) => {
                if (value !== null) {
                  setValue("checkoutLocation", value.value as any, {
                    shouldValidate: true,
                  });
                }
              }}
              error={!!errors.checkoutLocation}
              errorText={errors.checkoutLocation?.message}
            />
          </div>
          <div>
            <DateTimePicker
              label="Checkin Date"
              placeholderText="Checkin Date"
              {...register("checkinDate")}
              selected={getValues("checkinDate")}
              onChange={(date) => {
                setValue("checkinDate", date as any, { shouldValidate: true });
              }}
              inputProps={{
                error: !!errors.checkinDate,
                errorText: errors.checkinDate?.message,
              }}
            />
          </div>
          <div>
            <SelectInput
              {...register("checkinLocation")}
              label="Checkin location"
              options={locationOptions}
              value={getSelectedLocation(getValues("checkinLocation"))}
              onSelect={(value) => {
                if (value !== null) {
                  setValue("checkinLocation", value.value as any, {
                    shouldValidate: true,
                  });
                }
              }}
              error={!!errors.checkinLocation}
              errorText={errors.checkinLocation?.message}
            />
          </div>
        </div>
        <div>
          <Button type="submit" color="teal">
            Save & Continue
          </Button>
        </div>
      </form>
    </InformationBlockCardWithChildren>
  );
};

export default AgreementRentalInformationTab;
