import { useCallback, useMemo, useState } from "react";
import { Link } from "@tanstack/router";
import parseISO from "date-fns/parseISO";

import { ChevronRightOutline, PlayIconFilled } from "../icons";
import CommonHeader from "../Layout/CommonHeader";
import { RentalSummary } from "@/components/primary-module/summary/rental-summary";
import { Button } from "../Form";
import {
  ModuleTabs,
  type ModuleTabConfigItem,
} from "@/components/primary-module/ModuleTabs";
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
import StepTaxesAndPaymentsInformation from "./StepTaxesAndPaymentsInformation";

import { useGetClientProfile } from "@/hooks/network/client/useGetClientProfile";
import { useGetAgreementData } from "@/hooks/network/agreement/useGetAgreementData";
import { useGetVehicleTypesList } from "@/hooks/network/vehicle-type/useGetVehicleTypes";
import { useGetVehiclesList } from "@/hooks/network/vehicle/useGetVehiclesList";
import { useGetOptimalRateForRental } from "@/hooks/network/rates/useGetOptimalRateForRental";
import { useGetRentalRates } from "@/hooks/network/rates/useGetRentalRates";
import { usePostCalculateRentalSummaryAmounts } from "@/hooks/network/rates/usePostCalculateRentalSummaryAmounts";
import { useGetMiscCharges } from "@/hooks/network/misc-charges/useGetMiscCharges";
import { useGetTaxes } from "@/hooks/network/taxes/useGetTaxes";

import { addAgreementRoute } from "@/routes/agreements/addAgreement";
import { searchAgreementsRoute } from "@/routes/agreements/searchAgreements";
import {
  checkinAgreementByIdRoute,
  editAgreementByIdRoute,
  viewAgreementByIdRoute,
} from "@/routes/agreements/agreementIdPath";
import { getStartingIndexFromTabName } from "@/utils/moduleTabs";
import { searchReservationsRoute } from "@/routes/reservations/searchReservations";
import { addReservationRoute } from "@/routes/reservations/addReservation";
import {
  editReservationByIdRoute,
  viewReservationByIdRoute,
} from "@/routes/reservations/reservationIdPath";

import { sortObject } from "@/utils/sortObject";
import { type TRentalRatesSummarySchema } from "@/schemas/summary";
import { type RentalRateParsed } from "@/schemas/rate";
import { type ReservationDataParsed } from "@/schemas/reservation";
import { type CalculateRentalSummaryMiscChargeType } from "@/types/CalculateRentalSummaryAmounts";

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
  isCheckin?: boolean;
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
  isCheckin = false,
}: TAddRentalParentFormProps) => {
  const isEdit = Boolean(referenceId);
  const [hasEdited, setHasEdited] = useState(false);

  const [creationStagesComplete, setCreationStageComplete] =
    useState<TRentalCompleteStage>({
      rental: false,
      customer: false,
      insurance: true,
      vehicle: false,
      rates: false,
      taxes: false,
      miscCharges: false,
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
  const [selectedMiscCharges, setSelectedMiscCharges] = useState<
    CalculateRentalSummaryMiscChargeType[]
  >([]);

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

  const handleSetSelectedMiscCharges = useCallback(
    (charges: CalculateRentalSummaryMiscChargeType[]) => {
      setSelectedMiscCharges(charges);
      setCreationStageComplete((prev) => ({ ...prev, miscCharges: true }));
    },
    []
  );

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
      const taxesAndPayments = {
        // 5
        id: "taxes-and-payments",
        label: "Taxes & Payments",
        component: (
          <StepTaxesAndPaymentsInformation
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
            onCompleted={() => {
              handleStageTabClick(others);
            }}
            selectedTaxes={selectedTaxIds}
            onSelectedTaxes={(taxIds) => {
              setHasEdited(true);
              setSelectedTaxIds(taxIds);
              setCreationStageComplete((prev) => ({
                ...prev,
                taxes: true,
              }));
            }}
            currency={clientProfile.data?.currency || undefined}
          />
        ),
      };
      const ratesAndCharges = {
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
            misCharges={selectedMiscCharges}
            onSelectedMiscCharges={handleSetSelectedMiscCharges}
            onCompleted={() => {
              setCreationStageComplete((prev) => ({
                ...prev,
                rates: true,
              }));
              setHasEdited(true);
              handleStageTabClick(taxesAndPayments);
            }}
            rateName={selectedRateName}
            onSelectRateName={handleSetSelectedRateName}
            rate={selectedRate}
            onSelectedRate={handleSetSelectedRate}
            currency={clientProfile.data?.currency || undefined}
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
              setHasEdited(true);
              handleStageTabClick(ratesAndCharges);
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
              setHasEdited(true);
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
              setAgreementRentalInformation((prevRentalData) => {
                // if checkout location id not the same, reset vehicle, taxes, and misc charges
                if (
                  prevRentalData &&
                  data &&
                  prevRentalData.checkoutLocation !== data.checkoutLocation
                ) {
                  setCreationStageComplete((prev) => ({
                    ...prev,
                    miscCharges: false,
                    rates: false,
                    vehicle: false,
                    taxes: false,
                  }));
                  setAgreementVehicleInformation(null);
                  setRateDetails(["", null]);
                  setSelectedMiscCharges([]);
                  setSelectedTaxIds([]);
                }
                return data;
              });
              setCreationStageComplete((prev) => ({
                ...prev,
                rental: true,
              }));
              setHasEdited(true);
              handleStageTabClick(vehicleInformation);
            }}
          />
        ),
      };
      tabs.push(rentalInformation);
      tabs.push(vehicleInformation);
      tabs.push(customerInformation);
      tabs.push(ratesAndCharges);
      tabs.push(taxesAndPayments);
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
    selectedTaxIds,
    clientProfile.data?.currency,
    agreementVehicleInformation,
    selectedMiscCharges,
    handleSetSelectedMiscCharges,
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
      const originalStartDate = parseISO(data.checkoutDate);
      const originalEndDate = parseISO(data.checkinDate);

      if (!agreementRentalInformation) {
        setAgreementRentalInformation({
          agreementNumber: data.agreementNumber ?? "",
          agreementType: data.agreementType ?? "",
          destination: data.destination ?? "",
          checkoutLocation: data.checkoutLocation,
          checkinLocation: data.checkinLocation,
          checkoutDate: originalStartDate,
          checkinDate: originalEndDate,
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

      if (selectedMiscCharges.length === 0) {
        const filledMiscCharges: CalculateRentalSummaryMiscChargeType[] = (
          data.mischargeList || []
        ).map((charge) => ({
          id: charge.miscChargeId ?? 0,
          locationMiscChargeId: charge?.locationMiscChargeID ?? 0,
          quantity: charge?.quantity ?? 0,
          startDate: charge?.startDate ?? originalStartDate.toISOString(),
          endDate: charge?.endDate ?? originalEndDate.toISOString(),
          optionId: charge?.optionId ?? 0,
          isSelected: charge?.isSelected ?? false,
          value: charge?.value ?? 0,
          unit: charge?.unit ?? 0,
          isTaxable: charge?.isTaxable ?? false,
          minValue: charge.minValue,
          maxValue: charge.maxValue,
          hourlyValue: charge.hourlyValue,
          hourlyQuantity: charge.hourlyQuantity,
          dailyValue: charge.dailyValue,
          dailyQuantity: charge.dailyQuantity,
          weeklyValue: charge.weeklyValue,
          weeklyQuantity: charge.weeklyQuantity,
          monthlyValue: charge.monthlyValue,
          monthlyQuantity: charge.monthlyQuantity,
        }));
        setSelectedMiscCharges(filledMiscCharges);
      }
      setCreationStageComplete((prev) => ({ ...prev, miscCharges: true }));

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
    creationStagesComplete.rates === false &&
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
  const agreementConditionsForFetchingVehicles =
    Boolean(agreementRentalInformation) && Boolean(agreementVehicleInformation);
  useGetVehiclesList({
    page: 1,
    pageSize: 20,
    enabled:
      module === "agreement" ? agreementConditionsForFetchingVehicles : false,
    filters: {
      VehicleTypeId: agreementVehicleInformation?.vehicleTypeId ?? 0,
      CurrentLocationId: agreementRentalInformation?.checkoutLocation ?? 0,
    },
  });

  // fetching the mandatory misc. charges
  const miscChargesAgreementReady =
    creationStagesComplete.miscCharges === false &&
    Boolean(agreementRentalInformation) &&
    Boolean(agreementVehicleInformation) &&
    isEdit === false;
  const miscChargesReservationReady = false;
  useGetMiscCharges({
    filters: {
      VehicleTypeId: agreementVehicleInformation?.vehicleTypeId ?? 0,
      LocationId: agreementRentalInformation?.checkoutLocation ?? 0,
      CheckoutDate: agreementRentalInformation?.checkoutDate ?? new Date(),
      CheckinDate: agreementRentalInformation?.checkinDate ?? new Date(),
    },
    enabled:
      module === "agreement"
        ? miscChargesAgreementReady
        : miscChargesReservationReady,
    onSuccess: (data) => {
      const mandatoryCharges = (data || []).filter(
        (charge) => charge.IsOptional === false
      );
      setSelectedMiscCharges((existing) => {
        if (existing.length > 0) {
          return existing;
        }
        return mandatoryCharges.map((charge) => ({
          id: charge.Id,
          locationMiscChargeId: charge.LocationMiscChargeID ?? 0,
          quantity: 1,
          startDate: agreementRentalInformation!.checkoutDate.toISOString(),
          endDate: agreementRentalInformation!.checkinDate.toISOString(),
          optionId: 0,
          isSelected: true,
          value: charge.Total ?? 0,
          unit: 0,
          isTaxable: charge.IsTaxable ?? false,
          minValue: charge.MinValue,
          maxValue: charge.MaxValue,
          hourlyValue: charge.HourlyValue,
          hourlyQuantity: charge.HourlyQuantity,
          dailyValue: charge.DailyValue,
          dailyQuantity: charge.DailyQuantity,
          weeklyValue: charge.WeeklyValue,
          weeklyQuantity: charge.WeeklyQuantity,
          monthlyValue: charge.MonthlyValue,
          monthlyQuantity: charge.MonthlyQuantity,
        }));
      });
      setCreationStageComplete((prev) => ({ ...prev, miscCharges: true }));
    },
  });

  // fetch taxes for the rental
  const taxesAgreementReady =
    creationStagesComplete.taxes === false &&
    Boolean(agreementRentalInformation);
  const taxesReservationReady = false;
  useGetTaxes({
    filters: {
      LocationId:
        module === "agreement"
          ? agreementRentalInformation?.checkoutLocation ?? 0
          : 0,
    },
    enabled:
      module === "agreement" ? taxesAgreementReady : taxesReservationReady,
    onSuccess: (data) => {
      const selectedTaxes = (data || []).filter((tax) => !tax.isOptional);
      setSelectedTaxIds(selectedTaxes.map((tax) => tax.id));
      setCreationStageComplete((prev) => ({ ...prev, taxes: true }));
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
      isCheckin: isCheckin,
      startDate: agreementRentalInformation?.checkoutDate || new Date(),
      endDate: agreementRentalInformation?.checkoutDate || new Date(),
      checkoutLocationId: agreementRentalInformation?.checkoutLocation || 0,
      checkinLocationId: agreementRentalInformation?.checkinLocation || 0,
      miscCharges: selectedMiscCharges,
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
        <div className="mx-auto max-w-full px-2 sm:px-4">
          <CommonHeader
            titleContent={
              <div className="flex flex-col justify-between gap-4 md:flex-row md:gap-0">
                <div className="flex flex-col items-center justify-start gap-2 align-top md:flex-row">
                  {!isEdit && module === "agreement" && (
                    <>
                      <Link
                        to={searchAgreementsRoute.to as any}
                        className="select-none text-2xl font-semibold leading-6 text-gray-700 hover:text-gray-800"
                      >
                        Agreements
                      </Link>
                      <ChevronRightOutline
                        className="h-4 w-4 flex-shrink-0 text-gray-500"
                        aria-hidden="true"
                      />
                      <Link
                        to={addAgreementRoute.to}
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
                        to={searchAgreementsRoute.to as any}
                        className="select-none text-2xl font-semibold leading-6 text-gray-700 hover:text-gray-800"
                      >
                        Agreements
                      </Link>
                      <ChevronRightOutline
                        className="h-4 w-4 flex-shrink-0 text-gray-500"
                        aria-hidden="true"
                      />
                      <Link
                        to={viewAgreementByIdRoute.to as any}
                        params={{ agreementId: String(referenceId) }}
                        className="select-none text-xl font-semibold leading-6 text-gray-700 hover:text-gray-800"
                      >
                        {referenceNumber ?? "-"}
                      </Link>
                      <ChevronRightOutline
                        className="h-4 w-4 flex-shrink-0 text-gray-500"
                        aria-hidden="true"
                      />
                      {isCheckin ? (
                        <Link
                          to={checkinAgreementByIdRoute.to}
                          className="max-w-[230px] truncate text-xl leading-6 text-gray-800 md:max-w-full"
                          search={() => ({ stage })}
                          params={{ agreementId: String(referenceId) }}
                        >
                          Check-in Agreement
                        </Link>
                      ) : (
                        <Link
                          to={editAgreementByIdRoute.to}
                          className="max-w-[230px] truncate text-xl leading-6 text-gray-800 md:max-w-full"
                          search={() => ({ stage })}
                          params={{ agreementId: String(referenceId) }}
                        >
                          Edit Agreement
                        </Link>
                      )}
                    </>
                  )}
                  {!isEdit && module === "reservation" && (
                    <>
                      <Link
                        to={searchReservationsRoute.to as any}
                        className="select-none text-2xl font-semibold leading-6 text-gray-700 hover:text-gray-800"
                      >
                        Reservations
                      </Link>
                      <ChevronRightOutline
                        className="h-4 w-4 flex-shrink-0 text-gray-500"
                        aria-hidden="true"
                      />
                      <Link
                        to={addReservationRoute.to}
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
                        to={searchReservationsRoute.to as any}
                        className="select-none text-2xl font-semibold leading-6 text-gray-700 hover:text-gray-800"
                      >
                        Reservations
                      </Link>
                      <ChevronRightOutline
                        className="h-4 w-4 flex-shrink-0 text-gray-500"
                        aria-hidden="true"
                      />
                      <Link
                        to={viewReservationByIdRoute.to as any}
                        params={{ reservationId: String(referenceId) }}
                        className="select-none text-xl font-semibold leading-6 text-gray-700 hover:text-gray-800"
                      >
                        {referenceNumber ?? "-"}
                      </Link>
                      <ChevronRightOutline
                        className="h-4 w-4 flex-shrink-0 text-gray-500"
                        aria-hidden="true"
                      />
                      <Link
                        to={editReservationByIdRoute.to}
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
              module === "agreement" && isEdit && isCheckin
                ? "Check-in the rental contract."
                : module === "agreement" && isEdit && !isCheckin
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

        <div className="mx-auto px-2 sm:px-4 md:grid-cols-12">
          <div className="grid max-w-full grid-cols-1 gap-4 focus:ring-0 lg:grid-cols-12">
            <div className="flex flex-col gap-4 lg:col-span-8">
              <ModuleTabs
                tabConfig={tabsConfig}
                startingIndex={getStartingIndexFromTabName(stage, tabsConfig)}
                onTabClick={handleStageTabClick}
              />
            </div>
            <div className="flex flex-col gap-4 py-4 lg:col-span-4">
              <RentalSummary
                module={
                  module === "agreement"
                    ? "add-edit-agreement"
                    : "add-edit-reservation"
                }
                currency={clientProfile.data?.currency || undefined}
                summaryData={
                  // isEdit && !calculatedSummaryData.data
                  //   ? summaryData
                  //   : calculatedSummaryData.data
                  //   ? calculatedSummaryData.data
                  //   : undefined
                  isEdit && hasEdited
                    ? calculatedSummaryData.data
                    : calculatedSummaryData.data
                    ? calculatedSummaryData.data
                    : summaryData ?? undefined
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
