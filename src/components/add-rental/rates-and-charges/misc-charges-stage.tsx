import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useState,
  Fragment,
} from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

import type { RatesAndChargesTabProps } from ".";

import { useGetMiscCharges } from "@/hooks/network/misc-charges/useGetMiscCharges";

import type { MiscChargeListItem } from "@/schemas/misCharges";

import { cn } from "@/utils";
import { localDateTimeToQueryYearMonthDay } from "@/utils/date";

interface MiscChargesStageProps {
  durationStageData: RatesAndChargesTabProps["durationStageData"];
  vehicleStageData: RatesAndChargesTabProps["vehicleStageData"];

  selectedMiscCharges: RatesAndChargesTabProps["miscCharges"];
  onSelectedMiscCharges: RatesAndChargesTabProps["onSelectedMiscCharges"];

  isEdit: boolean;
  onCompleted: () => void;
  currency: string | undefined;
}

export const MiscChargesStage = (props: MiscChargesStageProps) => {
  const {
    durationStageData,
    vehicleStageData,
    selectedMiscCharges,
    onSelectedMiscCharges,
    isEdit,
    onCompleted,
    currency,
  } = props;

  const isSupportingInfoAvailable =
    Boolean(durationStageData) && Boolean(vehicleStageData);

  const [charges, setCharges] =
    useState<RatesAndChargesTabProps["miscCharges"]>(selectedMiscCharges);

  const selectedChargeIds = charges.map((charge) => `${charge.id}`);

  const miscCharges = useGetMiscCharges({
    filters: {
      VehicleTypeId: vehicleStageData?.vehicleTypeId ?? 0,
      LocationId: durationStageData?.checkoutLocation ?? 0,
      CheckoutDate: durationStageData?.checkoutDate ?? new Date(),
      CheckinDate: durationStageData?.checkinDate ?? new Date(),
    },
    enabled:
      Boolean(durationStageData?.checkinDate) &&
      Boolean(durationStageData?.checkoutDate) &&
      Boolean(durationStageData?.checkoutLocation) &&
      Boolean(vehicleStageData?.vehicleTypeId),
  });

  const handleAddMiscCharge = (
    charge: RatesAndChargesTabProps["miscCharges"][number]
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
    <div className="px-1">
      {miscCharges.isLoading && <span>Loading...</span>}
      {!isSupportingInfoAvailable && (
        <span>Please fill out the previous steps</span>
      )}
      <div className="grid grid-cols-1 gap-3">
        {(miscCharges.data || []).map((charge, idx) => (
          <MiscChargeItem
            key={`${charge.Id}-${idx}-${charge.Name}`}
            charge={charge}
            isSelected={selectedChargeIds.includes(`${charge.Id}`)}
            selectedCharge={charges.find((chg) => chg.id === charge.Id)}
            onSave={handleAddMiscCharge}
            onRemove={handleRemoveMiscCharge}
            dates={{
              startDate: durationStageData?.checkoutDate ?? new Date(),
              endDate: durationStageData?.checkinDate ?? new Date(),
            }}
            currency={currency}
          />
        ))}
      </div>
      <div className="mt-4">
        <Button
          type="button"
          onClick={() => {
            onSelectedMiscCharges(charges);
            onCompleted();
          }}
        >
          Save & Continue
        </Button>
      </div>
    </div>
  );
};

function MiscChargeItem(props: {
  charge: MiscChargeListItem;
  isSelected: boolean;
  selectedCharge?: RatesAndChargesTabProps["miscCharges"][number];
  onSave: (charge: RatesAndChargesTabProps["miscCharges"][number]) => void;
  onRemove: (chargeId: number) => void;
  dates: { startDate: Date; endDate: Date };
  currency: string | undefined;
}) {
  const id = useId();
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

  const properties = useMemo(() => {
    const items: string[] = [];
    if (charge.CalculationType?.toLowerCase() === "fixed") {
      items.push("Fixed");
    }
    if (charge.IsTaxable === false) {
      items.push("Non-taxable");
    }
    return items;
  }, [charge]);

  const hasContent =
    charge.CalculationType?.toLowerCase() === "range" || // range misc. charge
    (charge.IsDeductible && (charge.Options?.length || 0) > 0); // deductible misc. charge

  useEffect(() => {
    if (!isSelected && charge.IsOptional === false) {
      save({ optionIdToSave: 0, priceToSave: charge.Total ?? 0, qtyToSave: 1 });
    }
  }, [charge.IsOptional, charge.Total, isSelected, save]);

  return (
    <Card className="flex flex-col shadow-none">
      <CardHeader className="flex w-full flex-col items-start justify-between gap-2 pt-4 sm:flex-row sm:items-center">
        <div className="flex flex-col-reverse gap-4 sm:flex-1 sm:flex-row">
          <Switch
            id={id}
            disabled={!charge.IsOptional}
            checked={isSelected}
            onCheckedChange={(checked) => {
              if (checked) {
                save({
                  optionIdToSave: optionId,
                  priceToSave: price,
                  qtyToSave: qty,
                });
              } else {
                handleRemove();
              }
            }}
          />
          <Label htmlFor={id} className="text-base tracking-tight">
            {charge.Name}
            {properties.length > 0 && ` (${properties.join(", ")})`}
          </Label>
        </div>
        <div className="flex items-center justify-start gap-3 sm:justify-end">
          {charge.IsQuantity && (
            <>
              <Input
                type="number"
                value={qty}
                min={1}
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
                className="h-8 max-w-[100px]"
                disabled={!isSelected}
              />
              <span className="block">x</span>
            </>
          )}
          <Input
            type="number"
            value={price}
            min={0}
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
            className="h-8 max-w-[100px]"
            disabled={!isSelected}
          />
        </div>
      </CardHeader>
      {hasContent && (
        <CardContent className="flex flex-col gap-3 pb-6 pt-0 sm:ml-12">
          {charge.CalculationType?.toLowerCase() === "range" && (
            <div>
              {dates.startDate.toISOString().substring(0, 10)}&nbsp;-&nbsp;
              {dates.endDate.toISOString().substring(0, 10)}
            </div>
          )}
          {charge.IsDeductible && charge.Options?.length && (
            <fieldset className="flex flex-col gap-3" disabled={!isSelected}>
              <legend className="sr-only">
                {charge.Name} deductible miscellaneous charge options
              </legend>
              {charge.Options.map((option, idx) => {
                return (
                  <Fragment key={`${idx}-${option.miscChargeOptionId}`}>
                    <label
                      htmlFor={`${idx}-${charge.Id}-${option.miscChargeOptionId}`}
                      className={cn(
                        "relative block w-full rounded-lg border bg-background px-4 py-3.5 focus:outline-none sm:flex sm:justify-between",
                        String(optionId) === String(option.miscChargeOptionId)
                          ? "border-transparent"
                          : "border-primary/10",
                        isSelected ? "cursor-pointer" : "cursor-not-allowed"
                      )}
                    >
                      <input
                        type="radio"
                        name={`${idx}-${charge.Id}`}
                        className="sr-only absolute inset-0"
                        id={`${idx}-${charge.Id}-${option.miscChargeOptionId}`}
                        value={`${option.miscChargeOptionId}`}
                        checked={optionId === option.miscChargeOptionId}
                        aria-labelledby={`${charge.Id}-${option.miscChargeOptionId}-label`}
                        aria-describedby={[
                          String(option.option) !== String(option.value)
                            ? `${charge.Id}-${option.miscChargeOptionId}-description-0`
                            : "",
                          `${charge.Id}-${option.miscChargeOptionId}-description-1`,
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        onChange={() => {
                          setOptionId(option.miscChargeOptionId);
                          setPrice(option.value !== null ? option.value : 0);
                          save({
                            optionIdToSave: option.miscChargeOptionId,
                            priceToSave:
                              option.value !== null ? option.value : 0,
                            qtyToSave: qty,
                          });
                        }}
                      />
                      <div className="flex items-center">
                        <div className="text-sm">
                          <p
                            id={`${charge.Id}-${option.miscChargeOptionId}-label`}
                            className="font-medium text-primary"
                          >
                            {option.name ? option.name : String(option.option)}
                          </p>
                          {String(option.option) !== String(option.value) && (
                            <div
                              id={`${charge.Id}-${option.miscChargeOptionId}-description-0`}
                              className="text-gray-500"
                            >
                              <p className="sm:inline">
                                Option: {Number(option.option).toString()}
                              </p>
                              <span
                                className="hidden sm:mx-1 sm:inline"
                                aria-hidden="true"
                              >
                                &middot;
                              </span>
                              <p className="sm:inline">
                                Value: {Number(option.value).toString()}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div
                        id={`${charge.Id}-${option.miscChargeOptionId}-description-1`}
                        className={cn(
                          "mt-2 flex text-sm sm:ml-4 sm:block sm:text-right",
                          String(option.option) !== String(option.value)
                            ? "sm:mt-2"
                            : "sm:mt-0"
                        )}
                      >
                        <div className="font-medium text-primary">
                          {t("intlCurrency", {
                            currency: props.currency,
                            value: Number(option.value),
                          })}
                        </div>
                      </div>
                      <div
                        className={cn(
                          "pointer-events-none absolute -inset-px rounded-lg",
                          String(optionId) === String(option.miscChargeOptionId)
                            ? "border-2 border-primary/50"
                            : "border border-transparent"
                        )}
                        aria-hidden="true"
                      ></div>
                    </label>
                  </Fragment>
                );
              })}
            </fieldset>
          )}
        </CardContent>
      )}
    </Card>
  );
}
