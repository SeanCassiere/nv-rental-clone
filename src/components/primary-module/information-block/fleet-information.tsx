import { useMemo } from "react";
import { Link } from "@tanstack/router";
import { CarIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";

import { viewFleetByIdRoute } from "@/routes/fleet/fleet-id-route";

import { cn } from "@/utils";

import {
  EMPTY_KEY,
  InformationBlockCard,
  type TAnyCustomerValueType,
  type TInformationBlockCardProps,
} from "./common";

interface TVehicleInformationProps {
  data: {
    vehicleId?: TAnyCustomerValueType;
    vehicleNo?: TAnyCustomerValueType;
    vehicleType?: TAnyCustomerValueType;
    licenseNo?: TAnyCustomerValueType;
    make?: TAnyCustomerValueType;
    model?: TAnyCustomerValueType;
    year?: TAnyCustomerValueType;
    doors?: TAnyCustomerValueType;
    batteryLevel?: TAnyCustomerValueType;
    cylinders?: TAnyCustomerValueType;
    trim?: TAnyCustomerValueType;
    spotNo?: TAnyCustomerValueType;
    fuelLevel?: TAnyCustomerValueType;
    fuelLevelOut?: TAnyCustomerValueType;
    fuelLevelIn?: TAnyCustomerValueType;
    tankSize?: TAnyCustomerValueType;
    fuelType?: TAnyCustomerValueType;
    transmission?: TAnyCustomerValueType;
    originalOdometer?: TAnyCustomerValueType;
    odometerOut?: TAnyCustomerValueType;
    odometerIn?: TAnyCustomerValueType;
    vin?: TAnyCustomerValueType;
  };
  isLoading: boolean;
  mode:
    | "vehicle"
    | "agreement-checked-out"
    | "agreement-checked-in"
    | "reservation";
}

const VehicleInformation = (props: TVehicleInformationProps) => {
  const { data, isLoading, mode } = props;

  const title = useMemo(() => {
    let currentTitle = "Vehicle information";
    if (mode === "vehicle") {
      currentTitle = "Specifications";
    }

    return currentTitle;
  }, [mode]);

  const infoBlocks = useMemo(() => {
    const blocks: TInformationBlockCardProps["blocks"] = [];

    const pushVehicleNo = () => {
      if (data.vehicleId && data.vehicleNo) {
        blocks.push({
          heading: "Vehicle no.",
          value: (
            <Link
              to={viewFleetByIdRoute.to}
              params={{ vehicleId: String(data.vehicleId) }}
              search={() => ({ tab: "summary" })}
              className={cn(
                buttonVariants({ variant: "link" }),
                "h-auto p-0 text-base underline"
              )}
            >
              {data.vehicleNo}
            </Link>
          ),
        });
      } else {
        blocks.push({
          heading: "Vehicle no.",
          value: data?.vehicleNo || EMPTY_KEY,
        });
      }
    };
    const pushDoors = () => {
      blocks.push({
        heading: "Doors",
        value: data?.doors || EMPTY_KEY,
      });
    };
    const pushFuelType = () => {
      blocks.push({
        heading: "Fuel type",
        value: data?.fuelType || EMPTY_KEY,
      });
    };
    const pushFuelLevel = () => {
      blocks.push({
        heading: "Fuel level",
        value: data?.fuelLevel || EMPTY_KEY,
      });
    };
    const pushFuelOut = () => {
      blocks.push({
        heading: "Fuel out",
        value: data?.fuelLevelOut || EMPTY_KEY,
      });
    };
    const pushFuelIn = () => {
      blocks.push({
        heading: "Fuel in",
        value: data?.fuelLevelIn || EMPTY_KEY,
      });
    };
    const pushTransmission = () => {
      blocks.push({
        heading: "Transmission",
        value: data?.fuelType || EMPTY_KEY,
      });
    };
    const pushTrim = () => {
      blocks.push({
        heading: "Trim",
        value: data?.trim || EMPTY_KEY,
      });
    };
    const pushSpotNumber = () => {
      blocks.push({
        heading: "Spot no.",
        value: data?.spotNo || EMPTY_KEY,
      });
    };
    const pushCylinders = () => {
      blocks.push({
        heading: "Cylinders",
        value: data?.cylinders || EMPTY_KEY,
      });
    };
    const pushVehicleType = () => {
      blocks.push({
        heading: "Vehicle type",
        value: data?.vehicleType || EMPTY_KEY,
      });
    };
    const pushLicenseNo = () => {
      blocks.push({
        heading: "License no.",
        value: data?.licenseNo || EMPTY_KEY,
      });
    };
    const pushVin = () => {
      blocks.push({
        heading: "VIN.",
        value: data?.vin || EMPTY_KEY,
      });
    };
    const pushMake = () => {
      blocks.push({
        heading: "Make",
        value: data?.make || EMPTY_KEY,
      });
    };
    const pushModel = () => {
      blocks.push({
        heading: "Model",
        value: data?.model || EMPTY_KEY,
      });
    };
    const pushYear = () => {
      blocks.push({
        heading: "Year",
        value: data?.year || EMPTY_KEY,
      });
    };
    // number 0 sorting
    const pushTankSize = () => {
      blocks.push({
        heading: "Tank size",
        value: data?.tankSize !== null ? `${data?.tankSize}` : EMPTY_KEY,
      });
    };
    const pushBatteryLevel = () => {
      blocks.push({
        heading: "Battery level",
        value:
          data?.batteryLevel !== null ? `${data?.batteryLevel}` : EMPTY_KEY,
      });
    };
    const pushOriginalOdometer = () => {
      blocks.push({
        heading: "Original odometer",
        value:
          data?.originalOdometer !== null
            ? `${data?.originalOdometer}`
            : EMPTY_KEY,
      });
    };
    const pushOdometerOut = () => {
      blocks.push({
        heading: "Odometer out",
        value: data?.odometerOut !== null ? `${data?.odometerOut}` : EMPTY_KEY,
      });
    };
    const pushOdometerIn = () => {
      blocks.push({
        heading: "Odometer in",
        value: data?.odometerIn !== null ? `${data?.odometerIn}` : EMPTY_KEY,
      });
    };

    if (mode === "agreement-checked-out") {
      pushVehicleNo();
      pushFuelOut();
      pushOdometerOut();
      pushLicenseNo();
      pushVehicleType();
      pushMake();
      pushModel();
      pushYear();
    }
    if (mode === "agreement-checked-in") {
      pushVehicleNo();
      pushFuelOut();
      pushOdometerOut();
      pushFuelIn();
      pushOdometerIn();
      pushLicenseNo();
      pushVehicleType();
      pushMake();
      pushModel();
      pushYear();
    }
    if (mode === "vehicle") {
      pushVin();
      pushDoors();
      pushBatteryLevel();
      pushCylinders();
      pushFuelLevel();
      pushTrim();
      pushSpotNumber();
      pushTankSize();
      pushFuelType();
      pushTransmission();
      pushOriginalOdometer();
    }
    if (mode === "reservation") {
      if (
        data?.vehicleId === null ||
        data?.vehicleId === undefined ||
        data?.vehicleId === 0 ||
        data?.vehicleId === "0"
      ) {
        pushVehicleType();
      } else {
        pushVehicleNo();
        pushVehicleType();
        pushLicenseNo();
        pushMake();
        pushModel();
        pushYear();
      }
    }

    return blocks;
  }, [data, mode]);

  return (
    <InformationBlockCard
      identifier="vehicle-information"
      icon={<CarIcon className="h-5 w-5" />}
      title={title}
      blocks={infoBlocks}
      numberPerBlock={3}
      isLoading={isLoading}
    />
  );
};

export default VehicleInformation;
