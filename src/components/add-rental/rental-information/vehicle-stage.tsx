import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useAuth } from "react-oidc-context";
import { z } from "zod";

import { SelectVehicleDialog } from "@/components/dialog/select-vehicle";
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
  InputSelect,
  InputSelectContent,
  InputSelectTrigger,
} from "@/components/ui/input-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  fetchVehiclesFuelLevelsOptions,
  fetchVehiclesSearchListOptions,
} from "@/lib/query/vehicle";
import { fetchVehicleTypesListOptions } from "@/lib/query/vehicle-type";

import { getAuthFromAuthHook } from "@/lib/utils/auth";
import { localDateTimeWithoutSecondsToQueryYearMonthDay } from "@/lib/utils/date";

import i18n from "@/lib/config/i18next";

import type { AgreementRentalInformationSchemaParsed } from "./duration-stage";

const REQUIRED = i18n.t("labels:display.required");

function AgreementVehicleInformationSchema() {
  return z.object({
    vehicleTypeId: z.coerce.number().min(1, REQUIRED),
    vehicleId: z.coerce.number().min(1, REQUIRED),
    fuelOut: z.string().min(1, REQUIRED),
    odometerOut: z.coerce.number().min(0, REQUIRED),
  });
}
export type AgreementVehicleInformationSchemaParsed = z.infer<
  ReturnType<typeof AgreementVehicleInformationSchema>
>;

export interface VehicleStageProps {
  rentalInformation: AgreementRentalInformationSchemaParsed | undefined;
  vehicleInformation: AgreementVehicleInformationSchemaParsed | undefined;
  onCompleted: (data: AgreementVehicleInformationSchemaParsed) => void;
  isEdit: boolean;
}

export const VehicleStage = ({
  rentalInformation,
  vehicleInformation,
  isEdit,
  onCompleted,
}: VehicleStageProps) => {
  const { t } = useTranslation();
  const auth = useAuth();

  const authParams = getAuthFromAuthHook(auth);

  const checkoutLocation = rentalInformation?.checkoutLocation || 0;

  const [showVehiclePicker, setShowVehiclePicker] = React.useState(false);

  const values: AgreementVehicleInformationSchemaParsed = {
    vehicleTypeId: vehicleInformation?.vehicleTypeId || 0,
    vehicleId: vehicleInformation?.vehicleId || 0,
    fuelOut: vehicleInformation?.fuelOut || "",
    odometerOut: vehicleInformation?.odometerOut || 0,
  };

  const form = useForm({
    resolver: zodResolver(AgreementVehicleInformationSchema()),
    defaultValues: values,
    values: vehicleInformation ? values : undefined,
  });

  const formVehicleTypeId = React.useMemo(
    () => form.watch("vehicleTypeId"),
    // eslint-disable-next-line react-compiler/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [form.watch("vehicleTypeId")]
  );
  const formVehicleId = React.useMemo(
    () => form.watch("vehicleId"),
    // eslint-disable-next-line react-compiler/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [form.watch("vehicleId")]
  );

  //
  const vehicleTypesData = useQuery(
    fetchVehicleTypesListOptions({
      auth: authParams,
      filters: {
        StartDate: rentalInformation?.checkoutDate
          ? localDateTimeWithoutSecondsToQueryYearMonthDay(
              rentalInformation?.checkoutDate
            )
          : undefined,
        EndDate: rentalInformation?.checkinDate
          ? localDateTimeWithoutSecondsToQueryYearMonthDay(
              rentalInformation?.checkinDate
            )
          : undefined,
        LocationId: Number(checkoutLocation).toString(),
      },
    })
  );
  const vehicleTypesList =
    vehicleTypesData.data?.status === 200 ? vehicleTypesData.data.body : [];

  //
  const searchFilters = {
    VehicleTypeId: formVehicleTypeId
      ? Number(formVehicleTypeId).toString()
      : undefined,
    CurrentLocationId: checkoutLocation
      ? Number(checkoutLocation).toString()
      : undefined,
    StartDate: rentalInformation?.checkoutDate,
    EndDate: rentalInformation?.checkinDate,
  };
  const vehicleListData = useQuery(
    fetchVehiclesSearchListOptions({
      auth: authParams,
      pagination: { page: 1, pageSize: 20 },
      filters: searchFilters,
      enabled:
        isEdit === false
          ? !!checkoutLocation && !!form.getValues("vehicleTypeId")
          : true,
    })
  );
  const vehiclesList =
    vehicleListData.data?.status === 200 ? vehicleListData?.data?.body : [];

  //
  const fuelLevelListData = useQuery(
    fetchVehiclesFuelLevelsOptions({ auth: authParams })
  );
  const fuelLevelsList = fuelLevelListData.data || [];

  return (
    <Form {...form}>
      <SelectVehicleDialog
        show={showVehiclePicker}
        setShow={setShowVehiclePicker}
        filters={searchFilters}
        onSelect={(vehicle) => {
          form.setValue("vehicleTypeId", vehicle.VehicleTypeId, {
            shouldValidate: true,
          });
          form.setValue("vehicleId", vehicle.VehicleId, {
            shouldValidate: true,
          });
          form.setValue("fuelOut", vehicle.FuelLevel ?? "Full", {
            shouldValidate: true,
          });
          form.setValue("odometerOut", vehicle.CurrentOdometer ?? 0, {
            shouldValidate: true,
          });
        }}
        setVehicleTypeId={(selectedVehicleTypeId) => {
          form.setValue("vehicleTypeId", selectedVehicleTypeId ?? 0, {
            shouldValidate: true,
          });
        }}
      />
      {!checkoutLocation && (
        <span className="block text-base text-destructive">
          Checkout location not selected.
        </span>
      )}
      <div className="flex">
        <Button
          variant="outline"
          onClick={() => {
            setShowVehiclePicker(true);
          }}
          disabled={!checkoutLocation}
        >
          Search fleet
        </Button>
      </div>
      <form
        onSubmit={form.handleSubmit(async (data) => {
          onCompleted?.(data);
        })}
        className="flex flex-col gap-4 px-1 pt-4"
        autoComplete="off"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <FormField
              control={form.control}
              name="vehicleTypeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle type</FormLabel>
                  <InputSelect
                    placeholder="Select vehicle type"
                    disabled={isEdit}
                    defaultValue={field.value ? `${field.value}` : undefined}
                    onValueChange={(value) => {
                      const existingVehicleId = formVehicleId;
                      field.onChange(value);
                      if (existingVehicleId) {
                        form.setValue("fuelOut", "");
                        form.setValue("odometerOut", 0);
                        form.setValue("vehicleId", 0);
                      }
                    }}
                    items={vehicleTypesList.map((type, idx) => ({
                      id: `${type.VehicleTypeId}-${idx}`,
                      value: `${type.VehicleTypeId}`,
                      label: `${type.VehicleTypeName}`,
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
              name="vehicleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle</FormLabel>
                  <InputSelect
                    placeholder="Select vehicle"
                    disabled={Boolean(formVehicleTypeId) ? false : true}
                    defaultValue={field.value ? `${field.value}` : undefined}
                    onValueChange={(value) => {
                      field.onChange(value);
                      const vehicle = vehiclesList.find(
                        (v) => v.VehicleId === parseInt(value ?? "0")
                      );
                      if (vehicle) {
                        form.setValue("fuelOut", vehicle.FuelLevel ?? "", {
                          shouldValidate: true,
                        });
                        form.setValue(
                          "odometerOut",
                          vehicle.CurrentOdometer ?? 0,
                          {
                            shouldValidate: true,
                          }
                        );
                      }
                    }}
                    items={vehiclesList.map((vehicle, idx) => ({
                      id: `${vehicle.VehicleId}-${idx}`,
                      value: `${vehicle.VehicleId}`,
                      label: `${vehicle.VehicleMakeName} ${vehicle.ModelName} ${vehicle.Year} ${vehicle.VehicleNo} ${vehicle.LicenseNo}`,
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
              name="fuelOut"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fuel level out</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ? `${field.value}` : undefined}
                    disabled={formVehicleId ? false : true}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select fuel level out" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {fuelLevelsList.map((level, idx) => (
                        <SelectItem
                          key={`${level.value}-${idx}`}
                          value={level.value}
                        >
                          {level.value}
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
              name="odometerOut"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Odometer out</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="100"
                      disabled={formVehicleId ? false : true}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div>
          <Button type="submit" disabled={!checkoutLocation}>
            {t("buttons.saveAndContinue", { ns: "labels" })}
          </Button>
        </div>
      </form>
    </Form>
  );
};
