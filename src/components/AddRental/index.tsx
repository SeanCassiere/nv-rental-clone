import { useCallback, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import parseISO from "date-fns/parseISO";

import { ChevronRightOutline, PlayIconFilled } from "../icons";
import CommonHeader from "../Layout/CommonHeader";
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
import StepRatesAndChargesInformation from "./StepRatesAndChargesInformation";

import { useGetClientProfile } from "../../hooks/network/client/useGetClientProfile";
import { useGetAgreementData } from "../../hooks/network/agreement/useGetAgreementData";
import { useGetVehicleTypesList } from "../../hooks/network/vehicle-type/useGetVehicleTypes";
import { useGetVehiclesList } from "../../hooks/network/vehicle/useGetVehiclesList";
import { useGetOptimalRateForRental } from "../../hooks/network/rates/useGetOptimalRateForRental";
import { useGetRentalRates } from "../../hooks/network/rates/useGetRentalRates";

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

import { sortObject } from "../../utils/sortObject";
import { type TRentalRatesSummarySchema } from "../../utils/schemas/summary";
import { type RentalRateParsed } from "../../utils/schemas/rate";
import { type ReservationDataParsed } from "../../utils/schemas/reservation";
import { usePostCalculateRentalSummaryAmounts } from "../../hooks/network/rates/usePostCalculateRentalSummaryAmounts";

export type TRentalCompleteStage = {
  rental: boolean;
  customer: boolean;
  insurance: boolean;
  vehicle: boolean;
  rates: boolean;
  taxes: boolean;
  miscCharges: boolean;
  payments: boolean;
  others: boolean;
};

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

  const [creationStagesComplete, setCreationStageComplete] =
    useState<TRentalCompleteStage>({
      rental: false,
      customer: false,
      insurance: true,
      vehicle: false,
      rates: false,
      taxes: false,
      miscCharges: true,
      payments: true,
      others: true,
    });

  const [agreementRentalInformation, setAgreementRentalInformation] =
    useState<AgreementRentalInformationSchemaParsed | null>(null);
  const [agreementVehicleInformation, setAgreementVehicleInformation] =
    useState<AgreementVehicleInformationSchemaParsed | null>(null);

  const [commonCustomerInformation, setCommonCustomerInformation] =
    useState<CommonCustomerInformationSchemaParsed | null>(null);

  const [selectedTaxIds, setSelectedTaxIds] = useState<number[]>([]);

  const [[selectedRateName, selectedRate], setRateDetails] = useState<
    [string, RentalRateParsed | null]
  >(["", null]);
  const setSelectedRateName = (cb: string | ((name: string) => string)) => {
    if (typeof cb === "function") {
      setRateDetails((prev) => {
        const pos1 = prev[0];
        const cbReturn = cb(pos1);
        return [cbReturn, prev[1]];
      });
      return;
    }
    setRateDetails((prev) => [cb, prev[1]]);
  };
  const setSelectedRate = (
    cb:
      | RentalRateParsed
      | null
      | ((prev: RentalRateParsed | null) => RentalRateParsed | null)
  ) => {
    if (typeof cb === "function") {
      setRateDetails((prev) => {
        const pos2 = prev[1];
        const cbReturn = cb(pos2);
        return [prev[0], cbReturn];
      });
      return;
    }
    setRateDetails((prev) => [prev[0], cb]);
  };

  const handleSetSelectedRateName = useCallback((rateName: string) => {
    // setSelectedRateName(rateName);
    setRateDetails([rateName, null]);
  }, []);

  const handleSetSelectedRate = useCallback((rate: RentalRateParsed) => {
    setSelectedRate(rate);
    setCreationStageComplete((prev) => ({
      ...prev,
      rates: true,
    }));
  }, []);

  const clientProfile = useGetClientProfile();

  const tabsConfig = useMemo(() => {
    const tabs: ModuleTabConfigItem[] = [];
    if (module === "agreement") {
      const others = {
        // 6
        id: "others",
        label: "Other information",
        component: "Other information",
      };
      const chargesAndPayments = {
        // 5
        id: "taxes-and-payments",
        label: "Taxes & Payments",
        component: (
          <div>
            Taxes and payments
            <br />
            <button
              onClick={() => {
                setCreationStageComplete((prev) => ({
                  ...prev,
                  miscCharges: true,
                }));
                handleStageTabClick(others);
              }}
            >
              Next
            </button>
          </div>
        ),
      };
      const ratesAndTaxes = {
        // 4
        id: "rates-and-charges",
        label: "Rates & Charges",
        component: (
          <StepRatesAndChargesInformation
            module="agreements"
            isEdit={isEdit}
            rentalInformation={
              agreementRentalInformation
                ? {
                    checkinDate: agreementRentalInformation.checkinDate,
                    checkoutDate: agreementRentalInformation.checkoutDate,
                    checkoutLocation:
                      agreementRentalInformation.checkoutLocation,
                    checkinLocation: agreementRentalInformation.checkinLocation,
                    rentalType: agreementRentalInformation.agreementType,
                    rentalReferenceId: parseInt(String(referenceId))
                      ? String(referenceId)
                      : "0",
                  }
                : undefined
            }
            vehicleInformation={
              agreementVehicleInformation
                ? { vehicleTypeId: agreementVehicleInformation.vehicleTypeId }
                : undefined
            }
            misCharges={[]}
            onCompleted={() => {
              setCreationStageComplete((prev) => ({
                ...prev,
                rates: true,
              }));
              handleStageTabClick(chargesAndPayments);
            }}
            rateName={selectedRateName}
            onSelectRateName={handleSetSelectedRateName}
            rate={selectedRate}
            onSelectedRate={handleSetSelectedRate}
          />
        ),
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
                customer: true,
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
                vehicle: true,
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
                rental: true,
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
      tabs.push(chargesAndPayments);
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
                customer: true,
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
    module,
    isEdit,
    agreementRentalInformation,
    referenceId,
    agreementVehicleInformation,
    selectedRateName,
    handleSetSelectedRateName,
    selectedRate,
    handleSetSelectedRate,
    commonCustomerInformation,
    handleStageTabClick,
    reservationData,
  ]);

  // fetching existing agreement data and set it to state
  useGetAgreementData({
    agreementId:
      module === "agreement" && isEdit && referenceId ? referenceId : 0,
    onSuccess: (data) => {
      console.log("agreement Data\n", data);
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
          rental: true,
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
          vehicle: true,
        }));
      }

      if (!commonCustomerInformation) {
        setCommonCustomerInformation({
          address: data?.customerDetails?.address1 || "",
          city: data?.customerDetails?.city || "",
          countryId: data?.countryId || 0,
          customerId: data?.customerDetails?.customerId || 0,
          dateOfBirth: data?.customerDetails.dateOfbirth || "",
          email: data?.customerDetails?.email || "",
          firstName: data?.customerDetails?.firstName || "",
          lastName: data?.customerDetails?.lastName || "",
          licenseExpiryDate: data?.customerDetails?.licenseExpiryDate || null,
          licenseIssueDate: data?.customerDetails?.licenseIssueDate || null,
          licenseNumber: data?.customerDetails?.licenseNumber || null,
          bPhone: data?.customerDetails?.bPhone || "",
          cPhone: data?.customerDetails?.cPhone || "",
          hPhone: data?.customerDetails?.hPhone || "",
          stateId: data?.stateId || 0,
          zipCode: data?.zipCode || "",
          isTaxSaver:
            data.customerDetails?.customerType
              ?.toLowerCase()
              .includes("taxsaver") ||
            data?.customerDetails?.isTaxExempt ||
            false,
        });
        setCreationStageComplete((prev) => ({
          ...prev,
          customer: true,
        }));
      }
      if (selectedRateName === "") {
        if (data.rateList && data.rateList[0]) {
          const existingRateName = data.rateList[0].rateName;
          setSelectedRateName(existingRateName ?? "");
        }
      }
      if (selectedTaxIds.length === 0) {
        const list = data.taxList.filter((tax) => tax.taxId !== null);
        const taxIds = [...list.map((tax) => tax.taxId)].filter(
          (taxId) => typeof taxId === "number" && taxId !== null
        ) as number[];
        setSelectedTaxIds(taxIds);
        setCreationStageComplete((prev) => ({ ...prev, taxes: true }));
      }
    },
  });

  // fetching the optimal rate name for new rentals
  const agreementConditionsForOptimalRateFetch =
    isEdit === false &&
    selectedRateName === "" &&
    Boolean(agreementVehicleInformation?.vehicleTypeId) &&
    Boolean(agreementRentalInformation?.checkoutLocation);
  const reservationConditionsForOptimalRateFetch = false;
  useGetOptimalRateForRental({
    filters: {
      CheckoutDate:
        module === "agreement"
          ? agreementRentalInformation?.checkoutDate || new Date()
          : new Date(),
      CheckinDate:
        module === "agreement"
          ? agreementRentalInformation?.checkinDate || new Date()
          : new Date(),
      VehicleTypeId:
        module === "agreement"
          ? String(agreementVehicleInformation?.vehicleTypeId)
          : "demo-reservation-vehicle-type-id",
      LocationId:
        module === "agreement"
          ? String(agreementRentalInformation?.checkoutLocation)
          : "demo-reservation-location-id",
    },
    onSuccess: (data) => {
      if (data && data?.rateName) {
        setRateDetails((values) => {
          const [prev] = values;
          if (prev === "" && data.rateName !== null) {
            return [data.rateName!, null];
          }
          return values;
        });
      }
    },
    enabled:
      module === "agreement"
        ? agreementConditionsForOptimalRateFetch
        : reservationConditionsForOptimalRateFetch,
  });

  // fetching the rate for the rental
  const agreementConditionsForFetchingRates =
    Boolean(agreementRentalInformation) &&
    Boolean(agreementVehicleInformation) &&
    selectedRateName !== "";
  const reservationConditionsForFetchingRates = false;
  useGetRentalRates({
    enabled:
      module === "agreement"
        ? agreementConditionsForFetchingRates
        : reservationConditionsForFetchingRates,
    filters: {
      LocationId: Number(
        agreementRentalInformation?.checkoutLocation
      ).toString(),
      RateName: selectedRateName,
      CheckoutDate:
        module === "agreement"
          ? agreementRentalInformation?.checkoutDate || undefined
          : undefined,
      CheckinDate:
        module === "agreement"
          ? agreementRentalInformation?.checkinDate || undefined
          : undefined,
      VehicleTypeId:
        module === "agreement"
          ? Number(agreementVehicleInformation?.vehicleTypeId || "0").toString()
          : "demo-reservation-vehicle-type-id",
      ...(module === "agreement"
        ? {
            AgreementId: referenceId ? String(referenceId) : undefined,
            AgreementTypeName: agreementRentalInformation?.agreementType || "",
          }
        : {}),
    },
    onSuccess: (data) => {
      if (Array.isArray(data) && data.length > 0) {
        const rate = data[0];
        if (rate) {
          setSelectedRate(rate);
          setCreationStageComplete((prev) => ({
            ...prev,
            rates: true,
          }));
        }
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
    pageSize: 20,
    enabled:
      isEdit &&
      ((module === "agreement" &&
        Boolean(agreementVehicleInformation) &&
        Boolean(agreementRentalInformation)) ||
        (module === "reservation" && Date.now() < 0)), // reservation for now should return false
    filters: {
      VehicleTypeId: agreementVehicleInformation?.vehicleTypeId ?? 0,
      CurrentLocationId: agreementRentalInformation?.checkoutLocation ?? 0,
    },
  });

  const agreementConditionsForSummaryCalculation =
    Boolean(agreementRentalInformation) &&
    Boolean(agreementVehicleInformation) &&
    Boolean(commonCustomerInformation) &&
    Boolean(selectedRate);

  // fetch a calculated rental summary
  const calculatedSummaryData = usePostCalculateRentalSummaryAmounts({
    input: {
      isCheckin: false,
      startDate: agreementRentalInformation?.checkoutDate || new Date(),
      endDate: agreementRentalInformation?.checkoutDate || new Date(),
      checkoutLocationId: agreementRentalInformation?.checkoutLocation || 0,
      checkinLocationId: agreementRentalInformation?.checkinLocation || 0,
      miscCharges: [],
      rate: selectedRate!,
      vehicleTypeId: agreementVehicleInformation?.vehicleTypeId || 0,
      taxIds: selectedTaxIds,
      advancePayment: 0,
      amountPaid: 0,
      preAdjustment: 0,
      postAdjustment: 0,
      securityDeposit: 0,
      additionalCharge: 0,
      unTaxableAdditional: 0,
      fuelLevelOut: agreementVehicleInformation?.fuelOut || "Full",
      takeSize: 0,
      fuelLevelIn: "",
      odometerOut: agreementVehicleInformation?.odometerOut || 0,
      odometerIn: 0,
      agreementId: parseInt(referenceId ? String(referenceId) : "0"),
      agreementTypeName: agreementRentalInformation?.agreementType || "",
      promotionIds: [],
      writeOffAmount: 0,
      customerId: commonCustomerInformation?.customerId || 0,
      agreementInsurance: null,
    },
    enabled:
      module === "agreement" ? agreementConditionsForSummaryCalculation : false,
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
                  isEdit && !calculatedSummaryData.data
                    ? summaryData
                    : calculatedSummaryData.data
                    ? calculatedSummaryData.data
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
