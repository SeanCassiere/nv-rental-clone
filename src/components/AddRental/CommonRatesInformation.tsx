import { useEffect, useMemo } from "react";
import { useForm, type FormState, type UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { StepRatesAndChargesInformationProps } from "./StepRatesAndChargesInformation";
import { useGetRentalRateTypesForRentals } from "../../hooks/network/rates/useGetRentalRateTypesForRental";
import {
  NativeSelectInput,
  getSelectedOptionForSelectInput,
  Button,
} from "../Form";
import {
  RentalRateSchema,
  type RentalRateParsed,
} from "../../utils/schemas/rate";
import classNames from "classnames";

interface CommonRatesInformationProps {
  module: StepRatesAndChargesInformationProps["module"];
  isEdit: StepRatesAndChargesInformationProps["isEdit"];
  rentalInformation: StepRatesAndChargesInformationProps["rentalInformation"];
  vehicleInformation: StepRatesAndChargesInformationProps["vehicleInformation"];

  rate: StepRatesAndChargesInformationProps["rate"];
  onSelectedRate: StepRatesAndChargesInformationProps["onSelectedRate"];
  rateName: StepRatesAndChargesInformationProps["rateName"];
  onSelectRateName: StepRatesAndChargesInformationProps["onSelectRateName"];

  hideRateSelector?: boolean;
  hidePromotionCodesFields?: boolean;

  isSupportingInfoAvailable: boolean;

  onNavigateNext: () => void;
}

const CommonRatesInformation = (props: CommonRatesInformationProps) => {
  const {
    rentalInformation,
    vehicleInformation,
    rateName,
    rate,
    hideRateSelector = false,
    hidePromotionCodesFields = false,
    isSupportingInfoAvailable,
  } = props;

  const checkoutLocation = rentalInformation?.checkoutLocation || 0;
  const vehicleTypeId = vehicleInformation?.vehicleTypeId || 0;

  const rateTypesData = useGetRentalRateTypesForRentals({
    filters: {
      LocationId: String(checkoutLocation),
      VehicleTypeId: String(vehicleTypeId),
    },
  });

  const rateTypeOptions = useMemo(() => {
    const empty = { value: "", label: "Select" };
    if (!rateTypesData.data) return [empty];

    return [
      empty,
      ...rateTypesData.data.map((rateOption) => ({
        value: `${rateOption.rateName}`,
        label: `${rateOption.rateName}`,
      })),
    ];
  }, [rateTypesData.data]);

  const { handleSubmit, reset, watch, register, formState } =
    useForm<RentalRateParsed>({
      resolver: zodResolver(RentalRateSchema),
      defaultValues: useMemo(() => {
        return rate !== null ? rate : undefined;
      }, [rate]),
    });

  useEffect(() => {
    if (rate) {
      reset(rate);
    }
  }, [reset, rate, rate?.rateName, rateName]);

  const isDayRate = watch("isDayRate");
  const isWeekDayRate = watch("isDayWeek");

  const totalDays = watch("totalDays");
  const rentalDays = totalDays ?? 0;

  const commonFormProps: CommonRatesFormProps = {
    registerFn: register,
    formState,
  };

  return (
    <div className="mx-4 my-4">
      {!isSupportingInfoAvailable && (
        <div className="pb-4 text-red-500">
          Rental and Vehicle information not entered.
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="col-span-1 text-base md:col-span-3">
          Total days: <span className="font-semibold">{rentalDays}</span>
        </div>
        {!hideRateSelector && (
          <div className="col-span-1">
            <NativeSelectInput
              label="Rate"
              value={getSelectedOptionForSelectInput(rateTypeOptions, rateName)}
              options={rateTypeOptions}
              onSelect={(value) => {
                if (value && value.value && value.value !== "") {
                  props.onSelectRateName(value.value);
                }
              }}
              disabled={!isSupportingInfoAvailable}
            />
          </div>
        )}
        {!hidePromotionCodesFields && (
          <div className="col-span-1 flex items-end text-sm text-teal-500">
            Implement promotion codes later
          </div>
        )}
      </div>
      <form
        onSubmit={handleSubmit((data) => {
          const valuesToSubmit = { ...rate, ...data };
          props.onSelectedRate(valuesToSubmit);
          props.onNavigateNext();
        })}
        className="mt-8 text-sm"
      >
        {isWeekDayRate ? (
          <WeekDayRatesForm {...commonFormProps} />
        ) : isDayRate ? (
          <DayRatesForm {...commonFormProps} />
        ) : (
          <NormalRatesForm {...commonFormProps} />
        )}
        <div className="mt-4">
          <Button type="submit" color="teal" disabled={!rate}>
            Save & Continue
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CommonRatesInformation;

const optsAsNum = {
  valueAsNumber: true,
};

interface CommonRatesFormProps {
  registerFn: UseFormRegister<RentalRateParsed>;
  formState: FormState<RentalRateParsed>;
}

const numberInputClassnames =
  "rounded border-0 px-2 py-1 outline-none focus:border-0 focus:outline-teal-500 focus:ring-0";
const normalContainerClassnames =
  "grid grid-cols-3 items-center rounded bg-slate-100 py-2 px-4 text-base";
const extraContainerClassnames =
  "flex items-center justify-between rounded bg-slate-100 px-4 py-2 text-base";
const weekDayContainerClassnames =
  "grid grid-cols-2 md:grid-cols-3 gap-2 items-center rounded bg-slate-100 py-2 px-4 text-base";

function NormalRatesForm(props: CommonRatesFormProps) {
  const { registerFn: register } = props;
  return (
    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="flex flex-col gap-4">
        <div className={classNames(normalContainerClassnames)}>
          <div>Hourly</div>
          <div className="col-span-2 flex w-full items-center justify-end gap-4">
            <div>
              <input
                type="number"
                min={0}
                step={1}
                className={classNames("w-[100px]", numberInputClassnames)}
                autoComplete="off"
                {...register("hourlyQty", optsAsNum)}
              />
            </div>
            <span>x</span>
            <div>
              <input
                type="number"
                min={0}
                step={0.01}
                className={classNames("w-[100px]", numberInputClassnames)}
                autoComplete="off"
                {...register("hourlyRate", optsAsNum)}
              />
            </div>
          </div>
        </div>
        <div className={classNames(normalContainerClassnames)}>
          <div>Half daily</div>
          <div className="col-span-2 flex w-full items-center justify-end gap-4">
            <div>
              <input
                type="number"
                min={0}
                step={1}
                className={classNames("w-[100px]", numberInputClassnames)}
                autoComplete="off"
                {...register("halfDayQty", optsAsNum)}
              />
            </div>
            <span>x</span>
            <div>
              <input
                type="number"
                min={0}
                step={0.01}
                className={classNames("w-[100px]", numberInputClassnames)}
                autoComplete="off"
                {...register("halfDayRate", optsAsNum)}
              />
            </div>
          </div>
        </div>
        <div className={classNames(normalContainerClassnames)}>
          <div>Daily</div>
          <div className="col-span-2 flex w-full items-center justify-end gap-4">
            <div>
              <input
                type="number"
                min={0}
                step={1}
                className={classNames("w-[100px]", numberInputClassnames)}
                autoComplete="off"
                {...register("dailyQty", optsAsNum)}
              />
            </div>
            <span>x</span>
            <div>
              <input
                type="number"
                min={0}
                step={0.01}
                className={classNames("w-[100px]", numberInputClassnames)}
                autoComplete="off"
                {...register("dailyRate", optsAsNum)}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className={classNames(normalContainerClassnames)}>
          <div>Weekly</div>
          <div className="col-span-2 flex w-full items-center justify-end gap-4">
            <div>
              <input
                type="number"
                min={0}
                step={1}
                className={classNames("w-[100px]", numberInputClassnames)}
                autoComplete="off"
                {...register("weeklyQty", optsAsNum)}
              />
            </div>
            <span>x</span>
            <div>
              <input
                type="number"
                min={0}
                step={0.01}
                className={classNames("w-[100px]", numberInputClassnames)}
                autoComplete="off"
                {...register("weeklyRate", optsAsNum)}
              />
            </div>
          </div>
        </div>
        <div className={classNames(normalContainerClassnames)}>
          <div>Monthly</div>
          <div className="col-span-2 flex w-full items-center justify-end gap-4">
            <div>
              <input
                type="number"
                min={0}
                step={1}
                className={classNames("w-[100px]", numberInputClassnames)}
                autoComplete="off"
                {...register("monthlyQty", optsAsNum)}
              />
            </div>
            <span>x</span>
            <div>
              <input
                type="number"
                min={0}
                step={0.01}
                className={classNames("w-[100px]", numberInputClassnames)}
                autoComplete="off"
                {...register("monthlyRate", optsAsNum)}
              />
            </div>
          </div>
        </div>
        <div className={classNames(normalContainerClassnames)}>
          <div>Weekend daily</div>
          <div className="col-span-2 flex w-full items-center justify-end gap-4">
            <div>
              <input
                type="number"
                min={0}
                step={1}
                className={classNames("w-[100px]", numberInputClassnames)}
                autoComplete="off"
                {...register("weekendDailyQty", optsAsNum)}
              />
            </div>
            <span>x</span>
            <div>
              <input
                type="number"
                min={0}
                step={0.01}
                className={classNames("w-[100px]", numberInputClassnames)}
                autoComplete="off"
                {...register("weekendDayRate", optsAsNum)}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Extra stuff */}
      <div className="col-span-1 grid w-full grid-cols-1 gap-4 md:col-span-2 md:w-4/5 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <div className={classNames(extraContainerClassnames)}>
            <div>Daily miles allowed</div>
            <div>
              <input
                type="number"
                min={0}
                step={0.25}
                className={classNames("w-[100px]", numberInputClassnames)}
                autoComplete="off"
                {...register("dailyKMorMileageAllowed", optsAsNum)}
              />
            </div>
          </div>
          <div className={classNames(extraContainerClassnames)}>
            <div>Weekly miles allowed</div>
            <div>
              <input
                type="number"
                min={0}
                step={0.25}
                className={classNames("w-[100px]", numberInputClassnames)}
                autoComplete="off"
                {...register("weeklyKMorMileageAllowed", optsAsNum)}
              />
            </div>
          </div>
          <div className={classNames(extraContainerClassnames)}>
            <div>Monthly miles allowed</div>
            <div>
              <input
                type="number"
                min={0}
                step={0.25}
                className={classNames("w-[100px]", numberInputClassnames)}
                autoComplete="off"
                {...register("monthlyKMorMileageAllowed", optsAsNum)}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className={classNames(extraContainerClassnames)}>
            <div>Fuel charge</div>
            <div>
              <input
                type="number"
                min={0}
                step={0.01}
                className={classNames("w-[100px]", numberInputClassnames)}
                autoComplete="off"
                {...register("fuelCharge", optsAsNum)}
              />
            </div>
          </div>
          <div className={classNames(extraContainerClassnames)}>
            <div>Miles charge</div>
            <div>
              <input
                type="number"
                min={0}
                step={0.01}
                className={classNames("w-[100px]", numberInputClassnames)}
                autoComplete="off"
                {...register("kMorMileageCharge", optsAsNum)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DayRatesForm(props: CommonRatesFormProps) {
  const { registerFn: register } = props;
  return (
    <div className="mt-4 grid w-full grid-cols-1 gap-4 md:w-1/2">
      <div>
        <div className={classNames(normalContainerClassnames)}>
          <div>Daily</div>
          <div className="col-span-2 flex w-full items-center justify-end gap-4">
            <div>
              <input
                type="number"
                min={0}
                step={1}
                className={classNames("w-[100px]", numberInputClassnames)}
                autoComplete="off"
                {...register("dailyQty", optsAsNum)}
              />
            </div>
            <span>x</span>
            <div>
              <input
                type="number"
                min={0}
                step={0.01}
                className={classNames("w-[100px]", numberInputClassnames)}
                autoComplete="off"
                {...register("dailyRate", optsAsNum)}
              />
            </div>
          </div>
        </div>
      </div>
      <div className={classNames(extraContainerClassnames)}>
        <div>Daily miles allowed</div>
        <div>
          <input
            type="number"
            min={0}
            step={0.25}
            className={classNames("w-[100px]", numberInputClassnames)}
            autoComplete="off"
            {...register("dailyKMorMileageAllowed", optsAsNum)}
          />
        </div>
      </div>
      <div className={classNames(extraContainerClassnames)}>
        <div>Fuel charge</div>
        <div>
          <input
            type="number"
            min={0}
            step={0.01}
            className={classNames("w-[100px]", numberInputClassnames)}
            autoComplete="off"
            {...register("fuelCharge", optsAsNum)}
          />
        </div>
      </div>
      <div className={classNames(extraContainerClassnames)}>
        <div>Miles charge</div>
        <div>
          <input
            type="number"
            min={0}
            step={0.01}
            className={classNames("w-[100px]", numberInputClassnames)}
            autoComplete="off"
            {...register("kMorMileageCharge", optsAsNum)}
          />
        </div>
      </div>
    </div>
  );
}

function WeekDayRatesForm(props: CommonRatesFormProps) {
  const { registerFn: register } = props;
  return (
    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className={classNames(weekDayContainerClassnames)}>
        <div>Monday</div>
        <div className="col-span-2 flex w-full items-center justify-end gap-4">
          <div>
            <input
              type="number"
              min={0}
              step={1}
              className={classNames("w-[100px]", numberInputClassnames)}
              autoComplete="off"
              {...register("monCount", optsAsNum)}
            />
          </div>
          <span>x</span>
          <div>
            <input
              type="number"
              min={0}
              step={0.01}
              className={classNames("w-[100px]", numberInputClassnames)}
              autoComplete="off"
              {...register("monRate", optsAsNum)}
            />
          </div>
        </div>
      </div>
      <div className={classNames(weekDayContainerClassnames)}>
        <div>Tuesday</div>
        <div className="col-span-2 flex w-full items-center justify-end gap-4">
          <div>
            <input
              type="number"
              min={0}
              step={1}
              className={classNames("w-[100px]", numberInputClassnames)}
              autoComplete="off"
              {...register("tuesCount", optsAsNum)}
            />
          </div>
          <span>x</span>
          <div>
            <input
              type="number"
              min={0}
              step={0.01}
              className={classNames("w-[100px]", numberInputClassnames)}
              autoComplete="off"
              {...register("tuesRate", optsAsNum)}
            />
          </div>
        </div>
      </div>
      <div className={classNames(weekDayContainerClassnames)}>
        <div>Wednesday</div>
        <div className="col-span-2 flex w-full items-center justify-end gap-4">
          <div>
            <input
              type="number"
              min={0}
              step={1}
              className={classNames("w-[100px]", numberInputClassnames)}
              autoComplete="off"
              {...register("wedCount", optsAsNum)}
            />
          </div>
          <span>x</span>
          <div>
            <input
              type="number"
              min={0}
              step={0.01}
              className={classNames("w-[100px]", numberInputClassnames)}
              autoComplete="off"
              {...register("wedRate", optsAsNum)}
            />
          </div>
        </div>
      </div>
      <div className={classNames(weekDayContainerClassnames)}>
        <div>Thursday</div>
        <div className="col-span-2 flex w-full items-center justify-end gap-4">
          <div>
            <input
              type="number"
              min={0}
              step={1}
              className={classNames("w-[100px]", numberInputClassnames)}
              autoComplete="off"
              {...register("thursCount", optsAsNum)}
            />
          </div>
          <span>x</span>
          <div>
            <input
              type="number"
              min={0}
              step={0.01}
              className={classNames("w-[100px]", numberInputClassnames)}
              autoComplete="off"
              {...register("thursRate", optsAsNum)}
            />
          </div>
        </div>
      </div>
      <div className={classNames(weekDayContainerClassnames)}>
        <div>Friday</div>
        <div className="col-span-2 flex w-full items-center justify-end gap-4">
          <div>
            <input
              type="number"
              min={0}
              step={1}
              className={classNames("w-[100px]", numberInputClassnames)}
              autoComplete="off"
              {...register("friCount", optsAsNum)}
            />
          </div>
          <span>x</span>
          <div>
            <input
              type="number"
              min={0}
              step={0.01}
              className={classNames("w-[100px]", numberInputClassnames)}
              autoComplete="off"
              {...register("friRate", optsAsNum)}
            />
          </div>
        </div>
      </div>
      <div className={classNames(weekDayContainerClassnames)}>
        <div>Saturday</div>
        <div className="col-span-2 flex w-full items-center justify-end gap-4">
          <div>
            <input
              type="number"
              min={0}
              step={1}
              className={classNames("w-[100px]", numberInputClassnames)}
              autoComplete="off"
              {...register("satCount", optsAsNum)}
            />
          </div>
          <span>x</span>
          <div>
            <input
              type="number"
              min={0}
              step={0.01}
              className={classNames("w-[100px]", numberInputClassnames)}
              autoComplete="off"
              {...register("satRate", optsAsNum)}
            />
          </div>
        </div>
      </div>
      <div className={classNames(weekDayContainerClassnames)}>
        <div>Sunday</div>
        <div className="col-span-2 flex w-full items-center justify-end gap-4">
          <div>
            <input
              type="number"
              min={0}
              step={1}
              className={classNames("w-[100px]", numberInputClassnames)}
              autoComplete="off"
              {...register("sunCount", optsAsNum)}
            />
          </div>
          <span>x</span>
          <div>
            <input
              type="number"
              min={0}
              step={0.01}
              className={classNames("w-[100px]", numberInputClassnames)}
              autoComplete="off"
              {...register("sunRate", optsAsNum)}
            />
          </div>
        </div>
      </div>
      <div className="hidden md:col-span-1 md:block">{/* empty */}</div>
      <div className="col-span-1 flex flex-col gap-4">
        <div className={classNames(extraContainerClassnames)}>
          <div>Daily miles allowed</div>
          <div>
            <input
              type="number"
              min={0}
              step={0.25}
              className={classNames("w-[100px]", numberInputClassnames)}
              autoComplete="off"
              {...register("dailyKMorMileageAllowed", optsAsNum)}
            />
          </div>
        </div>
        <div className={classNames(extraContainerClassnames)}>
          <div>Fuel charge</div>
          <div>
            <input
              type="number"
              min={0}
              step={0.01}
              className={classNames("w-[100px]", numberInputClassnames)}
              autoComplete="off"
              {...register("fuelCharge", optsAsNum)}
            />
          </div>
        </div>
        <div className={classNames(extraContainerClassnames)}>
          <div>Miles charge</div>
          <div>
            <input
              type="number"
              min={0}
              step={0.01}
              className={classNames("w-[100px]", numberInputClassnames)}
              autoComplete="off"
              {...register("kMorMileageCharge", optsAsNum)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
