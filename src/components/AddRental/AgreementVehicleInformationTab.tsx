import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { InformationBlockCardWithChildren } from "../PrimaryModule/ModuleInformation/common";
import { DocumentTextSolid } from "../icons";
import {
  Button,
  TextInput,
  NativeSelectInput,
  getSelectedOptionForSelectInput,
} from "../Form";
import { type AgreementRentalInformationSchemaParsed } from "./AgreementRentalInformationTab";
import { useGetVehicleTypesList } from "../../hooks/network/vehicle-type/useGetVehicleTypes";
import { useGetVehiclesList } from "../../hooks/network/vehicle/useGetVehiclesList";
import { useGetVehicleFuelLevelList } from "../../hooks/network/vehicle/useGetVehicleFuelLevelList";
import SelectVehicleModal from "../Dialogs/SelectVehicleModal";

function AgreementVehicleInformationSchema() {
  return z.object({
    vehicleTypeId: z.number().min(1, "Required"),
    vehicleId: z.number().min(1, "Required"),
    fuelOut: z.string().min(1, "Required"),
    odometerOut: z.coerce.number().min(0, "Required"),
  });
}
export type AgreementVehicleInformationSchemaParsed = z.infer<
  ReturnType<typeof AgreementVehicleInformationSchema>
>;

const AgreementVehicleInformationTab = ({
  rentalInformation,
  vehicleInformation,
  isEdit,
  onCompleted,
}: {
  rentalInformation: AgreementRentalInformationSchemaParsed | undefined;
  vehicleInformation: AgreementVehicleInformationSchemaParsed | undefined;
  onCompleted: (data: AgreementVehicleInformationSchemaParsed) => void;
  isEdit: boolean;
}) => {
  const checkoutLocation = rentalInformation?.checkoutLocation || 0;

  const [showFleetPicker, setShowFleetPicker] = useState(false);

  const values: AgreementVehicleInformationSchemaParsed = {
    vehicleTypeId: vehicleInformation?.vehicleTypeId || 0,
    vehicleId: vehicleInformation?.vehicleId || 0,
    fuelOut: vehicleInformation?.fuelOut || "",
    odometerOut: vehicleInformation?.odometerOut || 0,
  };

  const {
    handleSubmit,
    register,
    formState: { errors },
    getValues,
    setValue,
  } = useForm({
    resolver: zodResolver(AgreementVehicleInformationSchema()),
    defaultValues: values,
    values: vehicleInformation ? values : undefined,
  });

  //
  const vehicleTypesData = useGetVehicleTypesList({
    StartDate: rentalInformation?.checkoutDate,
    EndDate: rentalInformation?.checkinDate,
    LocationID: checkoutLocation,
  });
  const vehicleTypeOptions = useMemo(() => {
    const empty = { value: "", label: "Select" };
    if (!vehicleTypesData.data) return [empty];

    return [
      empty,
      ...vehicleTypesData.data.map((option) => ({
        value: `${option.VehicleTypeId}`,
        label: `${option.VehicleTypeName}`,
      })),
    ];
  }, [vehicleTypesData.data]);

  //
  const vehicleListData = useGetVehiclesList({
    page: 1,
    pageSize: 20,
    enabled:
      isEdit === false
        ? !!checkoutLocation && !!getValues("vehicleTypeId")
        : true,
    filters: {
      VehicleTypeId: getValues("vehicleTypeId"),
      CurrentLocationId: checkoutLocation,
    },
  });
  const vehicleOptions = useMemo(() => {
    const empty = { value: "", label: "Select" };
    if (!vehicleListData.data) return [empty];

    return [
      empty,
      ...vehicleListData.data.data.map((opt) => ({
        value: `${opt.VehicleId}`,
        label: `${opt.VehicleMakeName} ${opt.ModelName} ${opt.Year} ${opt.VehicleNo} ${opt.LicenseNo}`,
      })),
    ];
  }, [vehicleListData.data]);

  //
  const fuelLevelListData = useGetVehicleFuelLevelList();
  const fuelOptions = useMemo(() => {
    const empty = { value: "", label: "Select" };
    if (!fuelLevelListData.data) return [empty];

    return [
      empty,
      ...fuelLevelListData.data.map((opt) => ({
        value: `${opt.value}`,
        label: `${opt.value}`,
      })),
    ];
  }, [fuelLevelListData.data]);

  return (
    <>
      <SelectVehicleModal
        show={showFleetPicker}
        setShow={setShowFleetPicker}
        filters={{
          CurrentLocationId: checkoutLocation,
          StartDate: rentalInformation?.checkoutDate,
          EndDate: rentalInformation?.checkinDate,
        }}
        onSelect={(vehicle) => {
          setValue("vehicleTypeId", vehicle.VehicleTypeId, {
            shouldValidate: true,
          });
          setValue("vehicleId", vehicle.VehicleId, { shouldValidate: true });
          setValue("fuelOut", vehicle.FuelLevel ?? "Full", {
            shouldValidate: true,
          });
          setValue("odometerOut", vehicle.CurrentOdometer ?? 0, {
            shouldValidate: true,
          });
        }}
      />
      <InformationBlockCardWithChildren
        identifier="vehicle-information"
        icon={<DocumentTextSolid className="h-5 w-5" />}
        title="Vehicle information"
        isLoading={false}
      >
        {!checkoutLocation && (
          <div className="px-4 pt-4 text-red-500">
            Checkout location not selected.
          </div>
        )}
        <div className="mx-4 mt-4 flex">
          <Button
            onClick={() => {
              setShowFleetPicker(true);
            }}
            disabled={!checkoutLocation}
          >
            Search fleet
          </Button>
        </div>
        <form
          onSubmit={handleSubmit(async (data) => {
            onCompleted?.(data);
          })}
          className="flex flex-col gap-4 p-4"
          autoComplete="off"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <NativeSelectInput
                {...register("vehicleTypeId")}
                label="Vehicle type"
                options={vehicleTypeOptions}
                value={getSelectedOptionForSelectInput(
                  vehicleTypeOptions,
                  getValues("vehicleTypeId")
                )}
                onSelect={(value) => {
                  if (value !== null) {
                    setValue("vehicleTypeId", parseInt(value.value ?? "0"), {
                      shouldValidate: true,
                    });
                    setValue("fuelOut", "");
                    setValue("odometerOut", 0);
                    setValue("vehicleId", 0);
                  }
                }}
                error={!!errors.vehicleTypeId}
                errorText={errors.vehicleTypeId?.message}
                disabled={Boolean(checkoutLocation) ? false : true}
              />
            </div>
            <div>
              <NativeSelectInput
                {...register("vehicleId")}
                label="Vehicle"
                options={vehicleOptions}
                value={getSelectedOptionForSelectInput(
                  vehicleOptions,
                  getValues("vehicleId")
                )}
                onSelect={(value) => {
                  if (value !== null) {
                    setValue("vehicleId", parseInt(value.value ?? "0"), {
                      shouldValidate: true,
                    });
                    const vehicle = vehicleListData.data?.data.find(
                      (v) => v.VehicleId === parseInt(value.value ?? "0")
                    );
                    if (vehicle) {
                      setValue("fuelOut", vehicle.FuelLevel ?? "", {
                        shouldValidate: true,
                      });
                      setValue("odometerOut", vehicle.CurrentOdometer ?? 0, {
                        shouldValidate: true,
                      });
                    }
                  }
                }}
                error={!!errors.vehicleId}
                errorText={errors.vehicleId?.message}
                disabled={Boolean(getValues("vehicleTypeId")) ? false : true}
              />
            </div>
            <div>
              <NativeSelectInput
                {...register("fuelOut")}
                label="Fuel out"
                options={fuelOptions}
                value={getSelectedOptionForSelectInput(
                  fuelOptions,
                  getValues("fuelOut")
                )}
                onSelect={(value) => {
                  if (value !== null) {
                    setValue("fuelOut", value.label, {
                      shouldValidate: true,
                    });
                  }
                }}
                error={!!errors.fuelOut}
                errorText={errors.fuelOut?.message}
                disabled={Boolean(getValues("vehicleId")) ? false : true}
              />
            </div>
            <div>
              <TextInput
                label="Odometer Out"
                type="number"
                inputMode="numeric"
                {...register("odometerOut")}
                error={!!errors.odometerOut}
                errorText={errors.odometerOut?.message}
                disabled={Boolean(getValues("vehicleId")) ? false : true}
              />
            </div>
          </div>
          <div>
            <Button type="submit" color="teal" disabled={!checkoutLocation}>
              Save & Continue
            </Button>
          </div>
        </form>
      </InformationBlockCardWithChildren>
    </>
  );
};

export default AgreementVehicleInformationTab;
