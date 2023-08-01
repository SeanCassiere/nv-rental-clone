import {
  useCallback,
  useMemo,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { Link } from "@tanstack/router";
import parseISO from "date-fns/parseISO";
import { ChevronRightIcon, PlayIcon } from "lucide-react";

import { RentalSummary } from "@/components/primary-module/summary/rental-summary";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

import RentalInformationTab, {
  type RentalInformationTabProps as RI_TabProps,
} from "./rental-information";

type AgreementRentalInformationSchemaParsed = RI_TabProps["durationStageData"];
type AgreementVehicleInformationSchemaParsed = RI_TabProps["vehicleStageData"];

import CustomerInformationTab, {
  type CustomerInformationTabProps as CI_TabProps,
} from "./customer-information";

type CommonCustomerInformationSchemaParsed = CI_TabProps["customerStageData"];

import RatesAndChargesTab from "./rates-and-charges";

import TaxesAndPaymentsTab from "./taxes-and-payments";

import { useGetClientProfile } from "@/hooks/network/client/useGetClientProfile";
import { useGetAgreementData } from "@/hooks/network/agreement/useGetAgreementData";
import { useGetVehicleTypesList } from "@/hooks/network/vehicle-type/useGetVehicleTypes";
import { useGetVehiclesList } from "@/hooks/network/vehicle/useGetVehiclesList";
import { useGetOptimalRateForRental } from "@/hooks/network/rates/useGetOptimalRateForRental";
import { useGetRentalRates } from "@/hooks/network/rates/useGetRentalRates";
import { usePostCalculateRentalSummaryAmounts } from "@/hooks/network/rates/usePostCalculateRentalSummaryAmounts";
import { useGetMiscCharges } from "@/hooks/network/misc-charges/useGetMiscCharges";
import { useGetTaxes } from "@/hooks/network/taxes/useGetTaxes";

import { addAgreementRoute } from "@/routes/agreements/add-agreement-route";
import { searchAgreementsRoute } from "@/routes/agreements/search-agreements-route";
import {
  checkinAgreementByIdRoute,
  editAgreementByIdRoute,
  viewAgreementByIdRoute,
} from "@/routes/agreements/agreement-id-route";
import { searchReservationsRoute } from "@/routes/reservations/search-reservations-route";
import { addReservationRoute } from "@/routes/reservations/add-reservation-route";
import {
  editReservationByIdRoute,
  viewReservationByIdRoute,
} from "@/routes/reservations/reservation-id-route";

import { cn } from "@/utils";
import { sortObject } from "@/utils/sortObject";
import { type TRentalRatesSummarySchema } from "@/schemas/summary";
import { type RentalRateParsed } from "@/schemas/rate";
import { type ReservationDataParsed } from "@/schemas/reservation";
import { type CalculateRentalSummaryMiscChargeType } from "@/types/CalculateRentalSummaryAmounts";

const StageKeys = {
  rental: "rental-information",
  customer: "customer-information",
  ratesAndCharges: "rates-and-charges-information",
  taxesAndPayments: "taxes-and-payments-information",
  other: "other-information",
} as const;

const defaultCompletionStages: TRentalCompleteStage = {
  rental: false,
  customer: false,
  insurance: true,
  vehicle: false,
  rates: false,
  taxes: false,
  miscCharges: false,
  payments: true,
  others: true,
};

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
  onStageTabClick: (destinationTab: string) => void;
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
    useState<TRentalCompleteStage>(defaultCompletionStages);

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
    const tabs: { id: string; label: string; component: ReactNode }[] = [];
    if (module === "agreement") {
      const others = {
        // 5
        id: StageKeys.other,
        label: "Other information",
        component: "Other information",
      };
      const taxesAndPayments = {
        // 4
        id: StageKeys.taxesAndPayments,
        label: "Taxes & Payments",
        component: (
          <TaxesAndPaymentsTab
            isEdit={isEdit}
            durationStageData={
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
              handleStageTabClick(others.id);
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
        // 3
        id: StageKeys.ratesAndCharges,
        label: "Rates & Charges",
        component: (
          <RatesAndChargesTab
            durationStageData={
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
            vehicleStageData={
              agreementVehicleInformation
                ? { vehicleTypeId: agreementVehicleInformation.vehicleTypeId }
                : undefined
            }
            rateName={selectedRateName}
            onSelectRateName={handleSetSelectedRateName}
            rate={selectedRate}
            onSelectedRate={handleSetSelectedRate}
            miscCharges={selectedMiscCharges}
            onSelectedMiscCharges={handleSetSelectedMiscCharges}
            isEdit={isEdit}
            onCompleted={() => {
              setHasEdited(true);
              handleStageTabClick(taxesAndPayments.id);
            }}
            currency={clientProfile.data?.currency || undefined}
          />
        ),
      };
      const customerInformation = {
        // 2
        id: StageKeys.customer,
        label: "Customer information",
        component: (
          <CustomerInformationTab
            isEdit={isEdit}
            customerStageData={commonCustomerInformation || undefined}
            onCustomerStageComplete={(data) => {
              setCommonCustomerInformation(data);
              setCreationStageComplete((prev) => ({
                ...prev,
                customer: true,
              }));
              setHasEdited(true);
            }}
            onCompleted={() => {
              setHasEdited(true);
              handleStageTabClick(ratesAndCharges.id);
            }}
          />
        ),
      };
      const rentalInformation = {
        // 1
        id: StageKeys.rental,
        label: "Rental information",
        component: (
          <RentalInformationTab
            isEdit={isEdit}
            durationStageData={agreementRentalInformation ?? undefined}
            onDurationStageComplete={(data) => {
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
            }}
            vehicleStageData={agreementVehicleInformation ?? undefined}
            onVehicleStageComplete={(data) => {
              setAgreementVehicleInformation(data);
              setCreationStageComplete((prev) => ({
                ...prev,
                vehicle: true,
              }));

              setHasEdited(true);
            }}
            onCompleted={() => {
              setHasEdited(true);
              handleStageTabClick(customerInformation.id);
            }}
          />
        ),
      };
      tabs.push(rentalInformation);
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
        component: "Customer information",
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
    clientProfile.data?.currency,
    commonCustomerInformation,
    handleSetSelectedMiscCharges,
    handleSetSelectedRate,
    handleSetSelectedRateName,
    handleStageTabClick,
    isEdit,
    module,
    referenceId,
    reservationData,
    selectedMiscCharges,
    selectedRate,
    selectedRateName,
    selectedTaxIds,
  ]);

  // fetching existing agreement data and set it to state
  const getAgreementQuery = useGetAgreementData({
    agreementId:
      module === "agreement" && isEdit && referenceId ? referenceId : 0,
  });

  useEffect(() => {
    if (getAgreementQuery.status !== "success") return;

    const data = getAgreementQuery.data;

    const originalStartDate = parseISO(data.checkoutDate);
    const originalEndDate = parseISO(data.checkinDate);

    const startingCompletionStages = structuredClone(defaultCompletionStages);

    setAgreementRentalInformation((info) => {
      if (info) return info;
      startingCompletionStages.rental = true;
      return {
        agreementNumber: data.agreementNumber ?? "",
        agreementType: data.agreementType ?? "",
        destination: data.destination ?? "",
        checkoutLocation: data.checkoutLocation,
        checkinLocation: data.checkinLocation,
        checkoutDate: originalStartDate,
        checkinDate: originalEndDate,
      };
    });

    setAgreementVehicleInformation((info) => {
      if (info) return info;
      startingCompletionStages.vehicle = true;
      return {
        fuelOut: data.fuelLevelOut ?? "",
        odometerOut: data.odometerOut ?? 0,
        vehicleTypeId: data.vehicleTypeId ?? 0,
        vehicleId: data.vehicleId ?? 0,
      };
    });

    setCommonCustomerInformation((info) => {
      if (info) return info;
      startingCompletionStages.customer = true;
      return {
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
      };
    });

    setCommonCustomerInformation((info) => {
      if (info) return info;
      startingCompletionStages.customer = true;
      return {
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
      };
    });

    if (data.rateList && data.rateList[0]) {
      const existingAgreementRateName = data.rateList[0].rateName;
      setRateDetails((info) => {
        if (info[0]) return info;
        return [existingAgreementRateName ?? "", null];
      });
    }

    setSelectedMiscCharges((info) => {
      if (info.length > 0) return info;

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
      return filledMiscCharges;
    });
    startingCompletionStages.miscCharges = true;

    const agreementTaxList = data.taxList.filter((tax) => tax.taxId !== null);
    const taxIds = [...agreementTaxList.map((tax) => tax.taxId)].filter(
      (taxId) => typeof taxId === "number" && taxId !== null
    ) as number[];

    setSelectedTaxIds((info) => {
      if (info.length > 0) return info;
      startingCompletionStages.taxes = true;
      return taxIds;
    });

    setCreationStageComplete(startingCompletionStages);
  }, [getAgreementQuery.data, getAgreementQuery.status]);

  // fetching the optimal rate name for new rentals
  const agreementConditionsForOptimalRateFetch =
    creationStagesComplete.rates === false &&
    selectedRateName === "" &&
    Boolean(agreementVehicleInformation?.vehicleTypeId) &&
    Boolean(agreementRentalInformation?.checkoutLocation);
  const reservationConditionsForOptimalRateFetch = false;
  const getOptimalRateQuery = useGetOptimalRateForRental({
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
    enabled:
      module === "agreement"
        ? agreementConditionsForOptimalRateFetch
        : reservationConditionsForOptimalRateFetch,
  });

  useEffect(() => {
    if (getOptimalRateQuery.status !== "success") return;

    const data = getOptimalRateQuery.data;

    if (data && data?.rateName) {
      setRateDetails((values) => {
        const [prev] = values;
        if (prev === "" && data.rateName !== null) {
          return [data.rateName!, null];
        }
        return values;
      });
    }
  }, [getOptimalRateQuery.data, getOptimalRateQuery.status]);

  // fetching the rate for the rental
  const agreementConditionsForFetchingRates =
    Boolean(agreementRentalInformation) &&
    Boolean(agreementVehicleInformation) &&
    selectedRateName !== "";
  const reservationConditionsForFetchingRates = false;
  const getRentalRatesQuery = useGetRentalRates({
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
  });

  useEffect(() => {
    if (getRentalRatesQuery.status !== "success") return;

    const data = getRentalRatesQuery.data;

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
  }, [getRentalRatesQuery.data, getRentalRatesQuery.status]);

  // fetching the data before page navigation
  useGetVehicleTypesList({
    search: {
      StartDate:
        module === "agreement"
          ? agreementRentalInformation?.checkoutDate
          : undefined,
      EndDate:
        module === "agreement"
          ? agreementRentalInformation?.checkinDate
          : undefined,
      LocationID: agreementRentalInformation?.checkoutLocation ?? 0,
    },
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
    Boolean(agreementRentalInformation) &&
    Boolean(agreementVehicleInformation) &&
    isEdit === false;
  const miscChargesReservationReady = false;

  const getMiscChargesQuery = useGetMiscCharges({
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
  });

  useEffect(() => {
    if (getMiscChargesQuery.status !== "success") return;

    const data = getMiscChargesQuery.data;

    const mandatoryCharges = data.filter(
      (charge) => charge.IsOptional === false
    );
    setSelectedMiscCharges((existing) => {
      if (existing.length > 0) {
        // match existing misc charges with the new ones by updating the value
        const updated = existing.map((charge) => {
          const matched = data.find(
            (dataCharge) => String(dataCharge.Id) === String(charge.id)
          );
          if (matched) {
            return {
              ...charge,
              value: matched.Total ?? charge.value,
              dailyQuantity: matched.DailyQuantity ?? charge.dailyQuantity,
              hourlyQuantity: matched.HourlyQuantity ?? charge.hourlyQuantity,
              monthlyQuantity:
                matched.MonthlyQuantity ?? charge.monthlyQuantity,
              minValue: matched.MinValue ?? charge.minValue,
              maxValue: matched.MaxValue ?? charge.maxValue,
            };
          }
          return charge;
        });

        return updated;
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
  }, [
    agreementRentalInformation,
    getMiscChargesQuery.data,
    getMiscChargesQuery.status,
  ]);

  // fetch taxes for the rental
  const taxesAgreementReady = Boolean(agreementRentalInformation);
  const taxesReservationReady = false;
  const getTaxesQuery = useGetTaxes({
    filters: {
      LocationId:
        module === "agreement"
          ? agreementRentalInformation?.checkoutLocation ?? 0
          : 0,
    },
    enabled:
      module === "agreement" ? taxesAgreementReady : taxesReservationReady,
  });

  useEffect(() => {
    if (getTaxesQuery.status !== "success") return;

    const data = getTaxesQuery.data;
    const selectedTaxesNow = (data || []).filter((tax) => !tax.isOptional);

    setSelectedTaxIds((prev) => {
      if (prev.length > 0) return prev;
      return selectedTaxesNow.map((tax) => tax.id);
    });
    setCreationStageComplete((prev) => ({ ...prev, taxes: true }));
  }, [getTaxesQuery.data, getTaxesQuery.status]);

  // fetch a calculated rental summary
  const agreementConditionsForSummaryCalculation =
    Boolean(agreementRentalInformation) &&
    Boolean(agreementVehicleInformation) &&
    Boolean(commonCustomerInformation) &&
    Boolean(selectedRate);

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
      <section
        className={cn(
          "mx-auto mt-6 flex max-w-full flex-col gap-2 px-2 pt-1.5 sm:mx-4 sm:px-1"
        )}
      >
        <div
          className={cn(
            "flex min-h-[2.5rem] flex-col items-center justify-between gap-4 sm:flex-row"
          )}
        >
          <div className="flex w-full items-center justify-start gap-2">
            {!isEdit && module === "agreement" && (
              <>
                <Link
                  to={searchAgreementsRoute.to as any}
                  className="text-2xl font-semibold leading-6 text-primary"
                >
                  Agreements
                </Link>
                <ChevronRightIcon
                  className="h-4 w-4 flex-shrink-0 text-primary"
                  aria-hidden="true"
                />
                <Link
                  to={addAgreementRoute.to}
                  search={() => ({ stage })}
                  className="max-w-[230px] truncate text-2xl font-semibold leading-6 text-primary/80 md:max-w-full"
                >
                  Add Agreement
                </Link>
              </>
            )}
            {isEdit && module === "agreement" && (
              <>
                <Link
                  to={searchAgreementsRoute.to as any}
                  className="text-2xl font-semibold leading-6 text-primary"
                >
                  Agreements
                </Link>
                <ChevronRightIcon
                  className="h-4 w-4 flex-shrink-0 text-primary"
                  aria-hidden="true"
                />
                <Link
                  to={viewAgreementByIdRoute.to as any}
                  params={{ agreementId: String(referenceId) }}
                  className="max-w-[230px] truncate text-2xl font-semibold leading-6 text-primary/80 md:max-w-full"
                >
                  {referenceNumber ?? "-"}
                </Link>
                <ChevronRightIcon
                  className="h-4 w-4 flex-shrink-0 text-primary"
                  aria-hidden="true"
                />
                {isCheckin ? (
                  <Link
                    to={checkinAgreementByIdRoute.to}
                    search={() => ({ stage })}
                    params={{ agreementId: String(referenceId) }}
                    className="max-w-[230px] truncate text-2xl font-semibold leading-6 text-primary/80 md:max-w-full"
                  >
                    Check-in
                  </Link>
                ) : (
                  <Link
                    to={editAgreementByIdRoute.to}
                    search={() => ({ stage })}
                    params={{ agreementId: String(referenceId) }}
                    className="max-w-[230px] truncate text-2xl font-semibold leading-6 text-primary/80 md:max-w-full"
                  >
                    Edit
                  </Link>
                )}
              </>
            )}
            {!isEdit && module === "reservation" && (
              <>
                <Link
                  to={searchReservationsRoute.to as any}
                  className="text-2xl font-semibold leading-6 text-primary"
                >
                  Reservations
                </Link>
                <ChevronRightIcon
                  className="h-4 w-4 flex-shrink-0 text-primary"
                  aria-hidden="true"
                />
                <Link
                  to={addReservationRoute.to}
                  search={() => ({ stage })}
                  className="max-w-[230px] truncate text-2xl font-semibold leading-6 text-primary/80 md:max-w-full"
                >
                  Add Reservation
                </Link>
              </>
            )}
            {isEdit && module === "reservation" && (
              <>
                <Link
                  to={searchReservationsRoute.to as any}
                  className="text-2xl font-semibold leading-6 text-primary"
                >
                  Reservations
                </Link>
                <ChevronRightIcon
                  className="h-4 w-4 flex-shrink-0 text-primary"
                  aria-hidden="true"
                />
                <Link
                  to={viewReservationByIdRoute.to as any}
                  params={{ reservationId: String(referenceId) }}
                  className="max-w-[230px] truncate text-2xl font-semibold leading-6 text-primary/80 md:max-w-full"
                >
                  {referenceNumber ?? "-"}
                </Link>
                <ChevronRightIcon
                  className="h-4 w-4 flex-shrink-0 text-primary"
                  aria-hidden="true"
                />
                <Link
                  to={editReservationByIdRoute.to}
                  search={() => ({ stage })}
                  params={{ reservationId: String(referenceId) }}
                  className="max-w-[230px] truncate text-2xl font-semibold leading-6 text-primary/80 md:max-w-full"
                >
                  Edit
                </Link>
              </>
            )}
          </div>
          <div className="flex w-full gap-2 sm:w-max">
            <Button
              size="sm"
              type="button"
              onClick={() => {
                handleRentalCancelClick?.();
              }}
              variant="outline"
            >
              Cancel
            </Button>
            {module === "agreement" ? (
              <Button
                size="sm"
                type="button"
                onClick={() => {
                  console.log("Agreement Functionality not implemented yet.");
                }}
                disabled={
                  !Object.values(creationStagesComplete).every(
                    (obj) => obj === true
                  )
                }
              >
                <PlayIcon className="mr-2 h-3 w-3" />
                <span>{isEdit ? "Save" : "Create"}</span>
              </Button>
            ) : null}
            {module === "reservation" ? (
              <Button
                size="sm"
                type="button"
                onClick={() => {
                  console.log("Reservation Functionality not implemented yet.");
                }}
                disabled={
                  !Object.values(creationStagesComplete).every(
                    (obj) => obj === true
                  )
                }
              >
                <PlayIcon className="mr-2 h-3 w-3" />
                <span>{isEdit ? "Save" : "Create"}</span>
              </Button>
            ) : null}
          </div>
        </div>
        <p className={cn("text-base text-primary/80")}>
          {isEdit && isCheckin ? "Check-in" : isEdit ? "Edit" : "Create"}
          &nbsp;this&nbsp;
          {module === "agreement" ? "rental" : "booking"} and proceed to&nbsp;
          {isEdit ? "save" : "create"}.
        </p>
        <Separator className="mb-3.5 mt-3.5" />
      </section>

      <section
        className={cn(
          "mx-auto my-1 flex max-w-full flex-col gap-2 px-2 sm:mx-4 sm:my-6 sm:px-1"
        )}
      >
        <div className="grid max-w-full grid-cols-1 gap-4 focus:ring-0 lg:grid-cols-12">
          <div className="flex flex-col gap-4 pt-4 lg:col-span-8">
            <Tabs value={stage} onValueChange={handleStageTabClick}>
              <TabsList className="w-full sm:max-w-max">
                {tabsConfig.map((tab, idx) => (
                  <TabsTrigger key={`tab-trigger-${idx}`} value={tab.id}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              {tabsConfig.map((tab, idx) => (
                <TabsContent
                  key={`tab-content-${idx}`}
                  value={tab.id}
                  className="min-h-[250px]"
                >
                  {tab.component}
                </TabsContent>
              ))}
            </Tabs>
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
      </section>
    </>
  );
};

export default AddRentalParentForm;
