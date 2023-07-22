import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { type StepRatesAndChargesInformationProps } from "./step-rates-and-charges";
import { Button } from "../Form";
import { useGetMiscCharges } from "@/hooks/network/misc-charges/useGetMiscCharges";

import { localDateTimeToQueryYearMonthDay } from "@/utils/date";
import { type MiscChargeListItem } from "@/schemas/misCharges";
import { cn } from "@/utils";

interface CommonMiscChargesInformationProps {
  module: StepRatesAndChargesInformationProps["module"];
  isEdit: StepRatesAndChargesInformationProps["isEdit"];
  rentalInformation: StepRatesAndChargesInformationProps["rentalInformation"];
  vehicleInformation: StepRatesAndChargesInformationProps["vehicleInformation"];

  selectedMisCharges: StepRatesAndChargesInformationProps["misCharges"];
  onSaveMisCharges: StepRatesAndChargesInformationProps["onSelectedMiscCharges"];

  isSupportingInfoAvailable: boolean;

  onNavigateNext: () => void;
  currency?: string;
}

const CommonMiscChargesInformation = (
  props: CommonMiscChargesInformationProps
) => {
  const {
    onNavigateNext,
    onSaveMisCharges,
    selectedMisCharges,
    rentalInformation,
    vehicleInformation,
    isSupportingInfoAvailable,
  } = props;

  const [charges, setCharges] =
    useState<StepRatesAndChargesInformationProps["misCharges"]>(
      selectedMisCharges
    );

  const selectedChargeIds = charges.map((charge) => `${charge.id}`);

  const miscCharges = useGetMiscCharges({
    filters: {
      VehicleTypeId: vehicleInformation?.vehicleTypeId ?? 0,
      LocationId: rentalInformation?.checkoutLocation ?? 0,
      CheckoutDate: rentalInformation?.checkoutDate ?? new Date(),
      CheckinDate: rentalInformation?.checkinDate ?? new Date(),
    },
    enabled:
      Boolean(rentalInformation?.checkinDate) &&
      Boolean(rentalInformation?.checkoutDate) &&
      Boolean(rentalInformation?.checkoutLocation) &&
      Boolean(vehicleInformation?.vehicleTypeId),
  });

  const handleAddMiscCharge = (
    charge: StepRatesAndChargesInformationProps["misCharges"][number]
  ) => {
    setCharges((previousCharges) => {
      const chargesWithoutSameId = previousCharges.filter(
        (prevCharge) => prevCharge.id !== charge.id
      );
      return [...chargesWithoutSameId, charge];
    });
  };
  const handleRemoveMiscCharge = (chargeId: number) => {
    setCharges((previousCharges) => {
      return previousCharges.filter((prevCharge) => prevCharge.id !== chargeId);
    });
  };

  return (
    <div className="mt-4">
      {miscCharges.isLoading && <span>Loading...</span>}
      {!isSupportingInfoAvailable && (
        <span>Please fill out the previous steps</span>
      )}
      <div className="grid grid-cols-1 gap-2">
        {(miscCharges.data || []).map((charge, idx) => (
          <MiscChargeItem
            key={`${charge.Id}-${idx}-${charge.Name}`}
            charge={charge}
            isSelected={selectedChargeIds.includes(`${charge.Id}`)}
            selectedCharge={charges.find((chg) => chg.id === charge.Id)}
            onSave={handleAddMiscCharge}
            onRemove={handleRemoveMiscCharge}
            dates={{
              startDate: rentalInformation?.checkoutDate ?? new Date(),
              endDate: rentalInformation?.checkinDate ?? new Date(),
            }}
          />
        ))}
      </div>
      <div className="mt-4">
        <Button
          type="button"
          color="teal"
          onClick={() => {
            onSaveMisCharges(charges);
            onNavigateNext();
          }}
        >
          Save & Continue
        </Button>
      </div>
    </div>
  );
};

export default CommonMiscChargesInformation;

function MiscChargeItem(props: {
  charge: MiscChargeListItem;
  isSelected: boolean;
  selectedCharge?: StepRatesAndChargesInformationProps["misCharges"][number];
  onSave: (
    charge: StepRatesAndChargesInformationProps["misCharges"][number]
  ) => void;
  onRemove: (chargeId: number) => void;
  dates: { startDate: Date; endDate: Date };
  currency?: string;
}) {
  const { t } = useTranslation();

  const { charge, isSelected, selectedCharge, onSave, dates, onRemove } = props;

  const startDate = useMemo(
    () =>
      selectedCharge?.startDate
        ? new Date(selectedCharge?.startDate)
        : dates.startDate,
    [dates.startDate, selectedCharge?.startDate]
  );

  const endDate = useMemo(
    () =>
      selectedCharge?.endDate
        ? new Date(selectedCharge?.endDate)
        : dates.endDate,
    [dates.endDate, selectedCharge?.endDate]
  );

  const [qty, setQty] = useState(
    isSelected && selectedCharge ? selectedCharge.quantity : 1
  );
  const [price, setPrice] = useState(
    isSelected && selectedCharge ? selectedCharge.value : charge.Total ?? 0
  );
  const [optionId, setOptionId] = useState(
    isSelected && selectedCharge ? selectedCharge.optionId : 0
  );

  const save = useCallback(
    ({
      optionIdToSave,
      priceToSave,
      qtyToSave,
    }: {
      optionIdToSave: number;
      priceToSave: number;
      qtyToSave: number;
    }) => {
      let saveOptionId = optionIdToSave;
      let savePrice = priceToSave;

      if (
        saveOptionId === 0 &&
        charge.IsDeductible &&
        charge.Options &&
        charge.Options?.length > 0
      ) {
        const firstOption = charge.Options[0];
        if (firstOption) {
          saveOptionId = firstOption.miscChargeOptionId;
          setOptionId(saveOptionId);

          savePrice = firstOption.value ?? 0;
          setPrice(savePrice);
        }
      }

      onSave({
        id: charge.Id,
        locationMiscChargeId: charge.LocationMiscChargeID ?? 0,
        quantity: qtyToSave,
        startDate: localDateTimeToQueryYearMonthDay(startDate),
        endDate: localDateTimeToQueryYearMonthDay(endDate),
        optionId: saveOptionId,
        isSelected: true,
        value: savePrice,
        unit: 0,
        isTaxable: charge.IsTaxable ?? false,
        minValue: charge.MinValue ?? 0,
        maxValue: charge.MaxValue ?? 0,
        hourlyValue: charge.HourlyValue ?? 0,
        dailyValue: charge.DailyValue ?? 0,
        weeklyValue: charge.WeeklyValue ?? 0,
        monthlyValue: charge.MonthlyValue ?? 0,
        hourlyQuantity: charge.HourlyQuantity ?? 0,
        dailyQuantity: charge.DailyQuantity ?? 0,
        weeklyQuantity: charge.WeeklyQuantity ?? 0,
        monthlyQuantity: charge.MonthlyQuantity ?? 0,
      });
    },
    [charge, startDate, endDate, onSave]
  );

  const handleRemove = () => {
    onRemove(charge.Id);
    setPrice(charge.Total ?? 0);
    setOptionId(0);
    setQty(1);
  };

  useEffect(() => {
    if (!isSelected && charge.IsOptional === false) {
      save({ optionIdToSave: 0, priceToSave: charge.Total ?? 0, qtyToSave: 1 });
    }
  }, [charge.IsOptional, charge.Total, isSelected, save]);

  return (
    <div className="grid grid-cols-12 items-center rounded bg-slate-100 p-1 md:w-11/12 md:p-2 md:pl-6">
      <div className="col-span-1">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(evt) => {
            evt.target.checked
              ? save({
                  optionIdToSave: optionId,
                  priceToSave: price,
                  qtyToSave: qty,
                })
              : handleRemove();
          }}
          disabled={!charge.IsOptional}
          id={`${charge.Id}-${charge.Name}-parent`}
          className="rounded text-teal-500 focus:outline-teal-500 disabled:text-slate-400"
        />
      </div>
      <label
        htmlFor={`${charge.Id}-${charge.Name}-parent`}
        className="col-span-11 md:col-span-8"
      >
        {charge.Name}
      </label>
      <div
        className={cn(
          "col-span-12 flex cursor-pointer items-center gap-2 px-4 md:col-span-3",
          "justify-start md:justify-end"
        )}
      >
        {charge.IsQuantity && (
          <>
            <input
              type="number"
              value={qty}
              onChange={(evt) => {
                setQty(Number(evt.target.value));
                if (isSelected) {
                  save({
                    optionIdToSave: optionId,
                    priceToSave: price,
                    qtyToSave: Number(evt.target.value),
                  });
                }
              }}
              className="w-20 rounded border-0 px-2 py-1 outline-none focus:border-0 focus:outline-teal-500 focus:ring-0"
              min={1}
            />
            <span className="block">x</span>
          </>
        )}
        <input
          type="number"
          value={price}
          onChange={(evt) => {
            setPrice(Number(evt.target.value));
            if (isSelected) {
              save({
                optionIdToSave: optionId,
                priceToSave: Number(evt.target.value),
                qtyToSave: qty,
              });
            }
          }}
          className="w-20 rounded border-0 px-2 py-1 outline-none focus:border-0 focus:outline-teal-500 focus:ring-0"
          min={0}
        />
      </div>
      {charge.CalculationType?.toLowerCase() === "range" && (
        <div className="col-span-12 flex items-center justify-start md:justify-end">
          {dates.startDate.toISOString().substring(0, 10)}&nbsp;-&nbsp;
          {dates.endDate.toISOString().substring(0, 10)}
        </div>
      )}
      {charge.IsDeductible && charge.Options?.length && (
        <>
          <span className="hidden md:block" />
          <div className="col-span-12 grid gap-2 pt-4 md:col-span-11">
            {charge.Options.map((option, idx) => (
              <div
                key={`${option.miscChargeOptionId}-${idx}`}
                className={cn("flex items-center gap-2")}
              >
                <input
                  type="radio"
                  id={`${charge.Id}-${option.miscChargeOptionId}`}
                  name={`${charge.Id}-${charge.Name}`}
                  value={option.miscChargeOptionId}
                  checked={optionId === option.miscChargeOptionId}
                  onChange={() => {
                    setOptionId(option.miscChargeOptionId);
                    setPrice(option.value !== null ? option.value : 0);
                    save({
                      optionIdToSave: option.miscChargeOptionId,
                      priceToSave: option.value !== null ? option.value : 0,
                      qtyToSave: qty,
                    });
                  }}
                  disabled={!isSelected}
                  className="bg-gray-50 p-0.5 text-teal-500 focus:outline-teal-500 disabled:cursor-not-allowed disabled:bg-gray-100"
                />
                <div className="w-full">
                  <label
                    className={cn(
                      "block w-full",
                      !isSelected ? "cursor-not-allowed" : "cursor-pointer"
                    )}
                    htmlFor={`${charge.Id}-${option.miscChargeOptionId}`}
                  >
                    {t("intlCurrency", {
                      currency: props.currency,
                      value: Number(option.value),
                    })}
                    {option.name && <>&nbsp;-&nbsp;{option.name}</>}
                  </label>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
