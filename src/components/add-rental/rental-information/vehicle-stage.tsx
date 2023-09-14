import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useGetVehicleTypesList } from "@/hooks/network/vehicle-type/useGetVehicleTypes";
import { useGetVehicleFuelLevelList } from "@/hooks/network/vehicle/useGetVehicleFuelLevelList";
import { useGetVehiclesList } from "@/hooks/network/vehicle/useGetVehiclesList";

import { localDateTimeWithoutSecondsToQueryYearMonthDay } from "@/utils/date";

import i18n from "@/i18next-config";

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
  const { t: tl } = useTranslation("labels");

  const checkoutLocation = useMemo(
    () => rentalInformation?.checkoutLocation || 0,
    [rentalInformation?.checkoutLocation]
  );

  const [showFleetPicker, setShowFleetPicker] = useState(false);

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

  const formVehicleTypeId = form.watch("vehicleTypeId");
  const formVehicleId = form.watch("vehicleId");

  //
  const vehicleTypesData = useGetVehicleTypesList({
    search: {
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
  });
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
  const vehicleListData = useGetVehiclesList({
    page: 1,
    pageSize: 20,
    enabled:
      isEdit === false
        ? !!checkoutLocation && !!form.getValues("vehicleTypeId")
        : true,
    filters: searchFilters,
  });
  const vehiclesList =
    vehicleListData.data?.status === 200 ? vehicleListData?.data?.body : [];

  //
  const fuelLevelListData = useGetVehicleFuelLevelList();
  const fuelLevelsList = fuelLevelListData.data || [];

  return (
    <Form {...form}>
      <SelectVehicleDialog
        show={showFleetPicker}
        setShow={setShowFleetPicker}
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
            setShowFleetPicker(true);
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
                  <Select
                    onValueChange={(value) => {
                      const existingVehicleId = formVehicleId;
                      field.onChange(value);
                      if (existingVehicleId) {
                        form.setValue("fuelOut", "");
                        form.setValue("odometerOut", 0);
                        form.setValue("vehicleId", 0);
                      }
                    }}
                    value={field.value ? `${field.value}` : undefined}
                    disabled={Boolean(checkoutLocation) ? false : true}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select vehicle type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {vehicleTypesList.map((type, idx) => (
                        <SelectItem
                          key={`${type.VehicleTypeId}-${idx}`}
                          value={`${type.VehicleTypeId}`}
                        >
                          {type.VehicleTypeName}
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
              name="vehicleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle</FormLabel>
                  <Select
                    key={`${formVehicleId}-select`}
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
                    value={field.value ? `${field.value}` : undefined}
                    disabled={Boolean(formVehicleTypeId) ? false : true}
                  >
                    <FormControl>
                      <SelectTrigger key={`${formVehicleId}-trigger`}>
                        <SelectValue placeholder="Select vehicle type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {vehiclesList.map((vehicle, idx) => (
                        <SelectItem
                          key={`${vehicle.VehicleId}-${idx}`}
                          value={`${vehicle.VehicleId}`}
                        >
                          {vehicle.VehicleMakeName}&nbsp;{vehicle.ModelName}
                          &nbsp;{vehicle.Year}&nbsp;{vehicle.VehicleNo}&nbsp;
                          {vehicle.LicenseNo}
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
            {tl("buttons.saveAndContinue")}
          </Button>
        </div>
      </form>
    </Form>
  );
};
