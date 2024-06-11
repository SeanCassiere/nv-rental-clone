import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useAuth } from "react-oidc-context";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";

import type { MiscChargeListItem } from "@/lib/schemas/misc-charge";
import { fetchMiscChargesListOptions } from "@/lib/query/misc-charge";

import { getAuthFromAuthHook } from "@/lib/utils/auth";
import {
  localDateTimeToQueryYearMonthDay,
  localDateTimeWithoutSecondsToQueryYearMonthDay,
} from "@/lib/utils/date";

import { cn } from "@/lib/utils";

import type { RatesAndChargesTabProps } from ".";

interface MiscChargesStageProps {
  durationStageData: RatesAndChargesTabProps["durationStageData"];
  vehicleStageData: RatesAndChargesTabProps["vehicleStageData"];

  selectedMiscCharges: RatesAndChargesTabProps["miscCharges"];
  onSelectedMiscCharges: RatesAndChargesTabProps["onSelectedMiscCharges"];

  isEdit: boolean;
  onCompleted: () => void;
}

export const MiscChargesStage = (props: MiscChargesStageProps) => {
  const {
    durationStageData,
    vehicleStageData,
    selectedMiscCharges,
    onSelectedMiscCharges,
    onCompleted,
  } = props;
  const auth = useAuth();

  const authParams = getAuthFromAuthHook(auth);

  const { t: tl } = useTranslation("labels");

  const isSupportingInfoAvailable =
    Boolean(durationStageData) && Boolean(vehicleStageData);

  const [charges, setCharges] =
    React.useState<RatesAndChargesTabProps["miscCharges"]>(selectedMiscCharges);

  const selectedChargeIds = charges.map((charge) => `${charge.id}`);

  const miscCharges = useQuery(
    fetchMiscChargesListOptions({
      auth: authParams,
      filters: {
        VehicleTypeId: vehicleStageData?.vehicleTypeId ?? 0,
        LocationId: durationStageData?.checkoutLocation ?? 0,
        CheckoutDate: localDateTimeWithoutSecondsToQueryYearMonthDay(
          durationStageData?.checkoutDate ?? new Date()
        ),
        CheckinDate: localDateTimeWithoutSecondsToQueryYearMonthDay(
          durationStageData?.checkinDate ?? new Date()
        ),
        Active: "true",
      },
      enabled:
        Boolean(durationStageData?.checkinDate) &&
        Boolean(durationStageData?.checkoutDate) &&
        Boolean(durationStageData?.checkoutLocation) &&
        Boolean(vehicleStageData?.vehicleTypeId),
    })
  );

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
      {!isSupportingInfoAvailable && (
        <span>Please fill out the previous steps</span>
      )}
      {miscCharges.isLoading && (
        <div className="grid grid-cols-1 gap-3">
          <Skeleton className="h-[78px] w-full" />
          <Skeleton className="h-[78px] w-full" />
          <Skeleton className="h-[78px] w-full" />
        </div>
      )}
      <div className="grid grid-cols-1 gap-3">
        {(miscCharges.data?.status === 200 ? miscCharges.data.body : []).map(
          (charge, idx) => (
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
            />
          )
        )}
      </div>
      <div className="mt-4">
        <Button
          type="button"
          onClick={() => {
            onSelectedMiscCharges(charges);
            onCompleted();
          }}
        >
          {tl("buttons.saveAndContinue")}
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
}) {
  const id = React.useId();
  const { t } = useTranslation();

  const { charge, isSelected, selectedCharge, onSave, dates, onRemove } = props;

  const startDate = React.useMemo(
    () =>
      selectedCharge?.startDate
        ? new Date(selectedCharge?.startDate)
        : dates.startDate,
    [dates.startDate, selectedCharge?.startDate]
  );

  const endDate = React.useMemo(
    () =>
      selectedCharge?.endDate
        ? new Date(selectedCharge?.endDate)
        : dates.endDate,
    [dates.endDate, selectedCharge?.endDate]
  );

  const [accordionValue, setAccordionValue] = React.useState(
    isSelected ? "show" : "no-show"
  );

  const [qty, setQty] = React.useState(
    isSelected && selectedCharge ? selectedCharge.quantity : 1
  );
  const [price, setPrice] = React.useState(
    isSelected && selectedCharge ? selectedCharge.value : charge.Total ?? 0
  );
  const [optionId, setOptionId] = React.useState(
    isSelected && selectedCharge ? selectedCharge.optionId : 0
  );

  const [localViewState, setLocalViewState] = React.useState({
    hourlyQuantity:
      isSelected && selectedCharge
        ? selectedCharge.hourlyQuantity
        : charge.HourlyQuantity,
    hourlyValue:
      isSelected && selectedCharge
        ? selectedCharge.hourlyValue
        : charge.HourlyValue,
    dailyQuantity:
      isSelected && selectedCharge
        ? selectedCharge.dailyQuantity
        : charge.DailyQuantity,
    dailyValue:
      isSelected && selectedCharge
        ? selectedCharge.dailyValue
        : charge.DailyValue,
    weeklyQuantity:
      isSelected && selectedCharge
        ? selectedCharge.weeklyQuantity
        : charge.WeeklyQuantity,
    weeklyValue:
      isSelected && selectedCharge
        ? selectedCharge.weeklyValue
        : charge.WeeklyValue,
    monthlyQuantity:
      isSelected && selectedCharge
        ? selectedCharge.monthlyQuantity
        : charge.MonthlyQuantity,
    monthlyValue:
      isSelected && selectedCharge
        ? selectedCharge.monthlyValue
        : charge.MonthlyValue,
  });

  const save = React.useCallback(
    ({
      optionIdToSave,
      priceToSave,
      qtyToSave,
      key = undefined,
      value = undefined,
    }: {
      optionIdToSave: number;
      priceToSave: number;
      qtyToSave: number;
      key?: keyof typeof localViewState;
      value?: number;
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

      const isKeyUpdateAvailable =
        typeof key !== "undefined" && typeof value !== "undefined";
      if (isKeyUpdateAvailable) {
        setLocalViewState((prev) => ({ ...prev, [key]: value }));
      }

      const objToSave: Parameters<typeof onSave>[0] = {
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
        hourlyValue: localViewState.hourlyValue ?? 0,
        dailyValue: localViewState.dailyValue ?? 0,
        weeklyValue: localViewState.weeklyValue ?? 0,
        monthlyValue: localViewState.monthlyValue ?? 0,
        hourlyQuantity: localViewState.hourlyQuantity ?? 0,
        dailyQuantity: localViewState.dailyQuantity ?? 0,
        weeklyQuantity: localViewState.weeklyQuantity ?? 0,
        monthlyQuantity: localViewState.monthlyQuantity ?? 0,
        ...(isKeyUpdateAvailable ? { [key]: value } : {}),
      };

      onSave(objToSave);
    },
    [charge, startDate, endDate, onSave, localViewState]
  );

  const handleRemove = () => {
    onRemove(charge.Id);
    setPrice(charge.Total ?? 0);
    setOptionId(0);
    setQty(1);
  };

  const properties = React.useMemo(() => {
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
    (charge.IsDeductible && (charge.Options?.length || 0) > 0) || // deductible misc. charge
    charge.CalculationType?.toLowerCase() === "perday"; // show per day misc. charge

  const showAccordionTrigger =
    charge.CalculationType?.toLowerCase() === "perday" ||
    Boolean(charge.IsDeductible);

  React.useEffect(() => {
    if (!isSelected && charge.IsOptional === false) {
      save({ optionIdToSave: 0, priceToSave: charge.Total ?? 0, qtyToSave: 1 });
    }
  }, [charge.IsOptional, charge.Total, isSelected, save]);

  return (
    <AccordionPrimitive.Root
      type="single"
      value={accordionValue}
      onValueChange={setAccordionValue}
      collapsible
    >
      <AccordionPrimitive.Item value="show">
        <Card className="flex flex-col shadow-none">
          <CardHeader className="flex w-full flex-col items-start justify-between gap-2 pt-4 sm:flex-row sm:items-center">
            <div className="flex flex-col-reverse gap-4 sm:flex-1 sm:flex-row">
              <Switch
                id={id}
                disabled={!charge.IsOptional}
                checked={isSelected}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setAccordionValue("show");
                    save({
                      optionIdToSave: optionId,
                      priceToSave: price,
                      qtyToSave: qty,
                    });
                  } else {
                    setAccordionValue("no-show");
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
              {charge.CalculationType?.toLowerCase() !== "perday" && (
                <>
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
                  {!charge.IsDeductible && (
                    <span className="invisible w-5"></span>
                  )}
                </>
              )}
              {showAccordionTrigger && (
                <AccordionPrimitive.Trigger
                  className={cn(
                    buttonVariants({ size: "sm", variant: "ghost" }),
                    "flex h-6 w-6 items-center justify-center p-0 [&[data-state=open]>svg]:rotate-180"
                  )}
                >
                  <icons.ChevronDown className="h-3 w-3 shrink-0 transition-transform duration-200" />
                </AccordionPrimitive.Trigger>
              )}
            </div>
          </CardHeader>
          {hasContent && (
            <CardContent className="flex flex-col gap-3 pb-0 pt-0 sm:ml-12">
              {charge.CalculationType?.toLowerCase() === "range" && (
                <div className="pb-6">
                  {dates.startDate.toISOString().substring(0, 10)}&nbsp;-&nbsp;
                  {dates.endDate.toISOString().substring(0, 10)}
                </div>
              )}
              {charge.IsDeductible && charge.Options?.length && (
                <AccordionPrimitive.Content className="overflow-hidden transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                  <fieldset
                    className="flex flex-col gap-3 pb-6"
                    disabled={!isSelected}
                  >
                    <legend className="sr-only">
                      {charge.Name} deductible miscellaneous charge options
                    </legend>
                    {charge.Options.map((option, idx) => {
                      return (
                        <React.Fragment
                          key={`${idx}-${option.miscChargeOptionId}`}
                        >
                          <label
                            htmlFor={`${idx}-${charge.Id}-${option.miscChargeOptionId}`}
                            className={cn(
                              "relative block w-full rounded-lg border bg-background px-4 py-3.5 focus:outline-none sm:flex sm:justify-between",
                              String(optionId) ===
                                String(option.miscChargeOptionId)
                                ? "border-transparent"
                                : "border-primary/10",
                              isSelected
                                ? "cursor-pointer"
                                : "cursor-not-allowed"
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
                                setPrice(
                                  option.value !== null ? option.value : 0
                                );
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
                                  className="font-medium"
                                >
                                  {option.name
                                    ? option.name
                                    : String(option.option)}
                                </p>
                                {String(option.option) !==
                                  String(option.value) && (
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
                              <div className="font-medium">
                                {t("intlCurrency", {
                                  value: Number(option.value),
                                  ns: "format",
                                })}
                              </div>
                            </div>
                            <div
                              className={cn(
                                "pointer-events-none absolute -inset-px rounded-lg",
                                String(optionId) ===
                                  String(option.miscChargeOptionId)
                                  ? "border-2 border-primary"
                                  : "border border-transparent"
                              )}
                              aria-hidden="true"
                            ></div>
                          </label>
                        </React.Fragment>
                      );
                    })}
                  </fieldset>
                </AccordionPrimitive.Content>
              )}
              {charge.CalculationType?.toLowerCase() === "perday" && (
                <AccordionPrimitive.Content className="overflow-hidden transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                  <div className="grid grid-cols-2 items-center gap-3 pb-6 sm:max-w-[500px] sm:grid-cols-3">
                    <div className="hidden font-semibold sm:block">
                      Description
                    </div>
                    <div className="hidden font-semibold sm:block">Charge</div>
                    <div className="hidden font-semibold sm:block">
                      Quantity
                    </div>
                    <div className="col-span-2 sm:col-span-1">Hour(s):</div>
                    <div>
                      <Input
                        type="number"
                        min={0}
                        step={0.25}
                        className="h-8"
                        disabled={!isSelected}
                        value={String(localViewState.hourlyValue)}
                        onChange={(evt) => {
                          const num = evt.target.valueAsNumber;
                          if (num !== undefined) {
                            save({
                              optionIdToSave: 0,
                              priceToSave: 0,
                              qtyToSave: 0,
                              key: "hourlyValue",
                              value: num,
                            });
                          }
                        }}
                      />
                    </div>
                    <div>
                      <Input
                        type="number"
                        min={0}
                        step={1}
                        className="h-8"
                        disabled={!isSelected}
                        value={String(localViewState.hourlyQuantity)}
                        onChange={(evt) => {
                          const num = evt.target.valueAsNumber;
                          if (num !== undefined) {
                            save({
                              optionIdToSave: 0,
                              priceToSave: 0,
                              qtyToSave: 0,
                              key: "hourlyQuantity",
                              value: num,
                            });
                          }
                        }}
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">Day(s):</div>
                    <div>
                      <Input
                        type="number"
                        min={0}
                        step={0.25}
                        className="h-8"
                        disabled={!isSelected}
                        value={String(localViewState.dailyValue)}
                        onChange={(evt) => {
                          const num = evt.target.valueAsNumber;
                          if (num !== undefined) {
                            save({
                              optionIdToSave: 0,
                              priceToSave: 0,
                              qtyToSave: 0,
                              key: "dailyValue",
                              value: num,
                            });
                          }
                        }}
                      />
                    </div>
                    <div>
                      <Input
                        type="number"
                        min={0}
                        step={1}
                        className="h-8"
                        disabled={!isSelected}
                        value={String(localViewState.dailyQuantity)}
                        onChange={(evt) => {
                          const num = evt.target.valueAsNumber;
                          if (num !== undefined) {
                            save({
                              optionIdToSave: 0,
                              priceToSave: 0,
                              qtyToSave: 0,
                              key: "dailyQuantity",
                              value: num,
                            });
                          }
                        }}
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">Week(s):</div>
                    <div>
                      <Input
                        type="number"
                        min={0}
                        step={0.25}
                        className="h-8"
                        disabled={!isSelected}
                        value={String(localViewState.weeklyValue)}
                        onChange={(evt) => {
                          const num = evt.target.valueAsNumber;
                          if (num !== undefined) {
                            save({
                              optionIdToSave: 0,
                              priceToSave: 0,
                              qtyToSave: 0,
                              key: "weeklyValue",
                              value: num,
                            });
                          }
                        }}
                      />
                    </div>
                    <div>
                      <Input
                        type="number"
                        min={0}
                        step={1}
                        className="h-8"
                        disabled={!isSelected}
                        value={String(localViewState.weeklyQuantity)}
                        onChange={(evt) => {
                          const num = evt.target.valueAsNumber;
                          if (num !== undefined) {
                            save({
                              optionIdToSave: 0,
                              priceToSave: 0,
                              qtyToSave: 0,
                              key: "weeklyQuantity",
                              value: num,
                            });
                          }
                        }}
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">Month(s):</div>
                    <div>
                      <Input
                        type="number"
                        min={0}
                        step={0.25}
                        className="h-8"
                        disabled={!isSelected}
                        value={String(localViewState.monthlyValue)}
                        onChange={(evt) => {
                          const num = evt.target.valueAsNumber;
                          if (num !== undefined) {
                            save({
                              optionIdToSave: 0,
                              priceToSave: 0,
                              qtyToSave: 0,
                              key: "monthlyValue",
                              value: num,
                            });
                          }
                        }}
                      />
                    </div>
                    <div>
                      <Input
                        type="number"
                        min={0}
                        step={1}
                        className="h-8"
                        disabled={!isSelected}
                        value={String(localViewState.monthlyQuantity)}
                        onChange={(evt) => {
                          const num = evt.target.valueAsNumber;
                          if (num !== undefined) {
                            save({
                              optionIdToSave: 0,
                              priceToSave: 0,
                              qtyToSave: 0,
                              key: "monthlyQuantity",
                              value: num,
                            });
                          }
                        }}
                      />
                    </div>
                  </div>
                </AccordionPrimitive.Content>
              )}
            </CardContent>
          )}
        </Card>
      </AccordionPrimitive.Item>
    </AccordionPrimitive.Root>
  );
}
