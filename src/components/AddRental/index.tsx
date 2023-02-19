import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { parseISO } from "date-fns";

import CommonHeader from "../Layout/CommonHeader";
import { ChevronRightOutline, PlayIconFilled } from "../icons";
import { RentalRatesSummary } from "../PrimaryModule/ModuleSummary/RentalRatesSummary";
import { Button } from "../Form";
import {
  ModuleTabs,
  type ModuleTabConfigItem,
} from "../PrimaryModule/ModuleTabs";
import AgreementRentalInformationTab, {
  type AgreementRentalInformationSchemaParsed,
} from "./AgreementRentalInformationTab";
import AgreementVehicleInformationTab, {
  type AgreementVehicleInformationSchemaParsed,
} from "./AgreementVehicleInformationTab";
import CommonCustomerInformation, {
  type CommonCustomerInformationSchemaParsed,
} from "./CommonCustomerInformation";

import { useGetClientProfile } from "../../hooks/network/client/useGetClientProfile";
import { useGetAgreementData } from "../../hooks/network/agreement/useGetAgreementData";

import { addAgreementRoute } from "../../routes/agreements/addAgreement";
import { searchAgreementsRoute } from "../../routes/agreements/searchAgreements";
import {
  editAgreementByIdRoute,
  viewAgreementByIdRoute,
} from "../../routes/agreements/agreementIdPath";
import { getStartingIndexFromTabName } from "../../utils/moduleTabs";
import { searchReservationsRoute } from "../../routes/reservations/searchReservations";
import { addReservationRoute } from "../../routes/reservations/addReservation";
import {
  editReservationByIdRoute,
  viewReservationByIdRoute,
} from "../../routes/reservations/reservationIdPath";

import { type TRentalRatesSummarySchema } from "../../utils/schemas/summary";
import { type ReservationDataParsed } from "../../utils/schemas/reservation";
import { sortObject } from "../../utils/sortObject";
import { useGetVehicleTypesList } from "../../hooks/network/vehicle-type/useGetVehicleTypes";
import { useGetVehiclesList } from "../../hooks/network/vehicle/useGetVehiclesList";

interface TAddRentalParentFormProps {
  referenceId: number | string;
  currentStage: string;
  module: "agreement" | "reservation";
  onStageTabClick: (destinationTab: ModuleTabConfigItem) => void;
  onRentalSaveClick: (agreementId: number) => void;
  onRentalCancelClick: () => void;
  referenceNumber?: string;
  summaryData?: TRentalRatesSummarySchema;
  reservationData?: ReservationDataParsed;
}

function DummyComponent(data: any) {
  return (
    <pre className="max-h-[600px] overflow-y-auto text-xs">
      <code>{JSON.stringify(sortObject(data), null, 2)}</code>
    </pre>
  );
}

const AddRentalParentForm = ({
  referenceId,
  currentStage: stage,
  module,
  onStageTabClick: handleStageTabClick,
  onRentalCancelClick: handleRentalCancelClick,
  referenceNumber,
  summaryData,
  reservationData,
}: TAddRentalParentFormProps) => {
  const isEdit = Boolean(referenceId);
  const [isSafeToFetchSummary] = useState(false);
  const [creationStagesComplete, setCreationStageComplete] = useState({
    "rental-information": false,
    "customer-information": false,
    "vehicle-information": false,
    "rates-and-taxes": false,
    "other-information": true,
  });

  const [agreementRentalInformation, setAgreementRentalInformation] =
    useState<AgreementRentalInformationSchemaParsed | null>(null);
  const [agreementVehicleInformation, setAgreementVehicleInformation] =
    useState<AgreementVehicleInformationSchemaParsed | null>(null);

  const [commonCustomerInformation, setCommonCustomerInformation] =
    useState<CommonCustomerInformationSchemaParsed | null>(null);

  const clientProfile = useGetClientProfile();

  const tabsConfig = useMemo(() => {
    const tabs: ModuleTabConfigItem[] = [];
    if (module === "agreement") {
      const others = {
        // 5
        id: "others",
        label: "Other information",
        component: "Other information",
      };
      const ratesAndTaxes = {
        // 4
        id: "rates-and-taxes",
        label: "Rates and taxes",
        component: "Rates and taxes",
      };
      const customerInformation = {
        // 3
        id: "customer-information",
        label: "Customer information",
        component: (
          <CommonCustomerInformation
            customerInformation={commonCustomerInformation || undefined}
            isEdit={isEdit}
            onCompleted={(data) => {
              setCommonCustomerInformation(data);
              setCreationStageComplete((prev) => ({
                ...prev,
                "customer-information": true,
              }));
              handleStageTabClick(ratesAndTaxes);
            }}
          />
        ),
      };
      const vehicleInformation = {
        // 2
        id: "vehicle-information",
        label: "Vehicle information",
        component: (
          <AgreementVehicleInformationTab
            rentalInformation={agreementRentalInformation || undefined}
            vehicleInformation={agreementVehicleInformation || undefined}
            isEdit={isEdit}
            onCompleted={(data) => {
              setAgreementVehicleInformation(data);
              setCreationStageComplete((prev) => ({
                ...prev,
                "vehicle-information": true,
              }));
              handleStageTabClick(customerInformation);
            }}
          />
        ),
      };
      const rentalInformation = {
        // 1
        id: "rental-information",
        label: "Rental information",
        component: (
          <AgreementRentalInformationTab
            isEdit={isEdit}
            initialData={agreementRentalInformation ?? undefined}
            onCompleted={(data) => {
              setAgreementRentalInformation(data);
              setCreationStageComplete((prev) => ({
                ...prev,
                "rental-information": true,
              }));
              handleStageTabClick(vehicleInformation);
            }}
          />
        ),
      };
      tabs.push(rentalInformation);
      tabs.push(vehicleInformation);
      tabs.push(customerInformation);
      tabs.push(ratesAndTaxes);
      tabs.push(others);
    }
    if (module === "reservation") {
      const others = {
        id: "others",
        label: "Other information",
        component: "Other information",
      };
      const ratesAndTaxes = {
        id: "rates-and-taxes",
        label: "Rates and taxes",
        component: "Rates and taxes",
      };
      const customerInformation = {
        id: "customer-information",
        label: "Customer information",
        component: (
          <CommonCustomerInformation
            customerInformation={commonCustomerInformation || undefined}
            isEdit={isEdit}
            onCompleted={(data) => {
              setCommonCustomerInformation(data);
              setCreationStageComplete((prev) => ({
                ...prev,
                "customer-information": true,
              }));
              handleStageTabClick(ratesAndTaxes);
            }}
          />
        ),
      };
      const vehicleInformation = {
        id: "vehicle-information",
        label: "Vehicle information",
        component: "Vehicle information",
      };
      const rentalInformation = {
        id: "rental-information",
        label: "Rental information",
        component: (
          <DummyComponent
            {...(reservationData ? reservationData : { rental: null })}
          />
        ),
      };
      tabs.push(rentalInformation);
      tabs.push(vehicleInformation);
      tabs.push(customerInformation);
      tabs.push(ratesAndTaxes);
      tabs.push(others);
    }

    return tabs;
  }, [
    agreementRentalInformation,
    agreementVehicleInformation,
    commonCustomerInformation,
    handleStageTabClick,
    isEdit,
    module,
    reservationData,
  ]);

  useGetAgreementData({
    agreementId:
      module === "agreement" && isEdit && referenceId ? referenceId : 0,
    onSuccess: (data) => {
      if (!agreementRentalInformation) {
        setAgreementRentalInformation({
          agreementNumber: data.agreementNumber ?? "",
          agreementType: data.agreementType ?? "",
          destination: data.destination ?? "",
          checkoutLocation: data.checkoutLocation,
          checkinLocation: data.checkinLocation,
          checkoutDate: parseISO(data.checkoutDate),
          checkinDate: parseISO(data.checkinDate),
        });
        setCreationStageComplete((prev) => ({
          ...prev,
          "rental-information": true,
        }));
      }
      if (!agreementVehicleInformation) {
        setAgreementVehicleInformation({
          fuelOut: data.fuelLevelOut ?? "",
          odometerOut: data.odometerOut ?? 0,
          vehicleTypeId: data.vehicleTypeId ?? 0,
          vehicleId: data.vehicleId ?? 0,
        });
        setCreationStageComplete((prev) => ({
          ...prev,
          "vehicle-information": true,
        }));
      }
    },
  });

  // fetching the data before page navigation
  useGetVehicleTypesList({
    StartDate:
      module === "agreement"
        ? agreementRentalInformation?.checkoutDate
        : undefined,
    EndDate:
      module === "agreement"
        ? agreementRentalInformation?.checkinDate
        : undefined,
    LocationID: agreementRentalInformation?.checkoutLocation ?? 0,
  });

  // fetching the data before page navigation only for rentals in edit mode
  useGetVehiclesList({
    page: 1,
    pageSize: 2000,
    enabled: isEdit,
    filters: {
      VehicleTypeId: agreementVehicleInformation?.vehicleTypeId ?? 0,
      CurrentLocationId: agreementRentalInformation?.checkoutLocation ?? 0,
    },
  });
  return (
    <>
      <div className="py-6">
        <div className="mx-auto max-w-full px-4 sm:px-6 md:px-8">
          <CommonHeader
            titleContent={
              <div className="flex flex-col justify-between gap-4 md:flex-row md:gap-0">
                <div className="flex flex-col items-center justify-start gap-2 align-top md:flex-row">
                  {!isEdit && module === "agreement" && (
                    <>
                      <Link
                        to={searchAgreementsRoute.fullPath}
                        className="select-none text-2xl font-semibold leading-6 text-gray-700 hover:text-gray-800"
                      >
                        Agreements
                      </Link>
                      <ChevronRightOutline
                        className="h-4 w-4 flex-shrink-0 text-gray-500"
                        aria-hidden="true"
                      />
                      <Link
                        to={addAgreementRoute.fullPath}
                        className="max-w-[230px] truncate text-xl leading-6 text-gray-800 md:max-w-full"
                        search={() => ({ stage })}
                      >
                        Add Agreement
                      </Link>
                    </>
                  )}
                  {isEdit && module === "agreement" && (
                    <>
                      <Link
                        to={searchAgreementsRoute.fullPath}
                        className="select-none text-2xl font-semibold leading-6 text-gray-700 hover:text-gray-800"
                      >
                        Agreements
                      </Link>
                      <ChevronRightOutline
                        className="h-4 w-4 flex-shrink-0 text-gray-500"
                        aria-hidden="true"
                      />
                      <Link
                        to={viewAgreementByIdRoute.fullPath}
                        params={{ agreementId: String(referenceId) }}
                        className="select-none text-2xl font-semibold leading-6 text-gray-700 hover:text-gray-800"
                      >
                        {referenceNumber ?? "-"}
                      </Link>
                      <ChevronRightOutline
                        className="h-4 w-4 flex-shrink-0 text-gray-500"
                        aria-hidden="true"
                      />
                      <Link
                        to={editAgreementByIdRoute.fullPath}
                        className="max-w-[230px] truncate text-xl leading-6 text-gray-800 md:max-w-full"
                        search={() => ({ stage })}
                        params={{ agreementId: String(referenceId) }}
                      >
                        Edit Agreement
                      </Link>
                    </>
                  )}
                  {!isEdit && module === "reservation" && (
                    <>
                      <Link
                        to={searchReservationsRoute.fullPath}
                        className="select-none text-2xl font-semibold leading-6 text-gray-700 hover:text-gray-800"
                      >
                        Reservations
                      </Link>
                      <ChevronRightOutline
                        className="h-4 w-4 flex-shrink-0 text-gray-500"
                        aria-hidden="true"
                      />
                      <Link
                        to={addReservationRoute.fullPath}
                        className="max-w-[230px] truncate text-xl leading-6 text-gray-800 md:max-w-full"
                        search={() => ({ stage })}
                      >
                        Add Reservation
                      </Link>
                    </>
                  )}
                  {isEdit && module === "reservation" && (
                    <>
                      <Link
                        to={searchReservationsRoute.fullPath}
                        className="select-none text-2xl font-semibold leading-6 text-gray-700 hover:text-gray-800"
                      >
                        Reservations
                      </Link>
                      <ChevronRightOutline
                        className="h-4 w-4 flex-shrink-0 text-gray-500"
                        aria-hidden="true"
                      />
                      <Link
                        to={viewReservationByIdRoute.fullPath}
                        params={{ reservationId: String(referenceId) }}
                        className="select-none text-2xl font-semibold leading-6 text-gray-700 hover:text-gray-800"
                      >
                        {referenceNumber ?? "-"}
                      </Link>
                      <ChevronRightOutline
                        className="h-4 w-4 flex-shrink-0 text-gray-500"
                        aria-hidden="true"
                      />
                      <Link
                        to={editReservationByIdRoute.fullPath}
                        className="max-w-[230px] truncate text-xl leading-6 text-gray-800 md:max-w-full"
                        search={() => ({ stage })}
                        params={{ reservationId: String(referenceId) }}
                      >
                        Edit Reservation
                      </Link>
                    </>
                  )}
                </div>
                <div className="flex flex-col gap-2 md:flex-row">
                  <Button
                    type="button"
                    color="red"
                    onClick={() => {
                      handleRentalCancelClick?.();
                    }}
                    fullWidth
                  >
                    Cancel
                  </Button>
                  {module === "agreement" ? (
                    <Button
                      type="button"
                      color="teal"
                      onClick={() => {
                        console.log("Functionality not implemented yet.");
                      }}
                      fullWidth
                      className="flex items-center justify-center gap-2"
                      disabled={
                        !Object.values(creationStagesComplete).every(
                          (obj) => obj === true
                        )
                      }
                    >
                      <PlayIconFilled className="h-3 w-3" />
                      {isEdit ? "Save" : "Create"}
                    </Button>
                  ) : null}
                  {module === "reservation" ? (
                    <Button
                      type="button"
                      color="teal"
                      onClick={() => {
                        console.log("Functionality not implemented yet.");
                      }}
                      fullWidth
                      className="flex items-center justify-center gap-2"
                    >
                      <PlayIconFilled className="h-3 w-3" />
                      {isEdit ? "Save" : "Create"}
                    </Button>
                  ) : null}
                </div>
              </div>
            }
            subtitleText={
              module === "agreement" && isEdit
                ? "Edit the rental contract."
                : module === "agreement" && !isEdit
                ? "Create a new rental contract."
                : module === "reservation" && isEdit
                ? "Edit the reservation."
                : module === "reservation" && !isEdit
                ? "Create a new reservation."
                : ""
            }
            headerActionContent
            includeBottomBorder
          />
        </div>

        <div className="mx-auto px-4 sm:px-6 md:grid-cols-12 md:px-8">
          <div className="grid max-w-full grid-cols-1 gap-4 focus:ring-0 lg:grid-cols-12">
            <div className="flex flex-col gap-4 lg:col-span-8">
              <ModuleTabs
                tabConfig={tabsConfig}
                startingIndex={getStartingIndexFromTabName(stage, tabsConfig)}
                onTabClick={handleStageTabClick}
              />
            </div>
            <div className="flex flex-col gap-4 py-4 lg:col-span-4">
              <RentalRatesSummary
                module={
                  module === "agreement"
                    ? "add-edit-agreement"
                    : "add-edit-reservation"
                }
                currency={clientProfile.data?.currency || undefined}
                summaryData={
                  isEdit && !isSafeToFetchSummary && summaryData
                    ? summaryData
                    : undefined
                }
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddRentalParentForm;
