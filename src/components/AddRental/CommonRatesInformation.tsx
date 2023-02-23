import { useEffect, useMemo } from "react";
import { useForm, type FormState, type UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { StepRatesAndTaxesInformationProps } from "./StepRatesAndTaxesInformation";
import { useGetRentalRateTypesForRentals } from "../../hooks/network/rates/useGetRentalRateTypesForRental";
import { NativeSelectInput, getSelectedOptionForSelectInput } from "../Form";
import {
  RentalRateSchema,
  type RentalRateParsed,
} from "../../utils/schemas/rate";

interface CommonRatesInformationProps {
  module: StepRatesAndTaxesInformationProps["module"];
  isEdit: StepRatesAndTaxesInformationProps["isEdit"];
  rentalInformation: StepRatesAndTaxesInformationProps["rentalInformation"];
  vehicleInformation: StepRatesAndTaxesInformationProps["vehicleInformation"];

  rate: StepRatesAndTaxesInformationProps["rate"];
  onSelectedRate: StepRatesAndTaxesInformationProps["onSelectedRate"];
  rateName: StepRatesAndTaxesInformationProps["rateName"];
  onSelectRateName: StepRatesAndTaxesInformationProps["onSelectRateName"];
}

const CommonRatesInformation = (props: CommonRatesInformationProps) => {
  const { rentalInformation, vehicleInformation, rateName, rate } = props;

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

  const commonFormProps: CommonRatesFormProps = {
    registerFn: register,
    formState,
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
          />
        </div>
        <div className="col-span-1">Number of days</div>
      </div>
      <form
        onSubmit={handleSubmit((data) => {
          const valuesToSubmit = { ...rate, ...data };
          console.log("data", valuesToSubmit);
          props.onSelectedRate(valuesToSubmit);
        })}
        className="text-sm"
      >
        {isWeekDayRate ? (
          <WeekDayRatesForm {...commonFormProps} />
        ) : isDayRate ? (
          <DayRatesForm {...commonFormProps} />
        ) : (
          <NormalRatesForm {...commonFormProps} />
        )}
        <div className="mt-4">
          <button
            type="submit"
            disabled={!rate}
            className="rounded bg-teal-500 px-4 py-2 text-white disabled:bg-red-300 disabled:text-red-800"
          >
            Submit
          </button>
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

function NormalRatesForm(props: CommonRatesFormProps) {
  const { registerFn: register } = props;
  return (
    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-3">
          <div>Hourly</div>
          <div>
            <input {...register("hourlyQty", optsAsNum)} />
            &nbsp;x
          </div>
          <div>
            $
            <input {...register("hourlyRate", optsAsNum)} />
          </div>
        </div>
        <div className="grid grid-cols-3">
          <div>Half daily</div>
          <div>
            <input {...register("halfDayQty", optsAsNum)} />
            &nbsp;x
          </div>
          <div>
            $
            <input {...register("halfDayRate", optsAsNum)} />
          </div>
        </div>
        <div className="grid grid-cols-3">
          <div>Daily</div>
          <div>
            <input {...register("dailyQty", optsAsNum)} />
            &nbsp;x
          </div>
          <div>
            $
            <input {...register("dailyRate", optsAsNum)} />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-3">
          <div>Weekly</div>
          <div>
            <input {...register("weeklyQty", optsAsNum)} />
            &nbsp;x
          </div>
          <div>
            $
            <input {...register("weeklyRate", optsAsNum)} />
          </div>
        </div>
        <div className="grid grid-cols-3">
          <div>Monthly</div>
          <div>
            <input {...register("monthlyQty", optsAsNum)} />
            &nbsp;x
          </div>
          <div>
            $
            <input {...register("monthlyRate", optsAsNum)} />
          </div>
        </div>
        <div className="grid grid-cols-3">
          <div>Weekend daily</div>
          <div>
            <input {...register("weekendDailyQty", optsAsNum)} />
            &nbsp;x
          </div>
          <div>
            $<input {...register("weekendDayRate", optsAsNum)} />
          </div>
        </div>
      </div>
      {/* Extra stuff */}
      <div className="col-span-1 grid w-full grid-cols-1 md:col-span-2 md:w-4/5 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2">
            <div>Daily miles allowed</div>
            <div>
              <input
                className="w-full"
                {...register("dailyKMorMileageAllowed", optsAsNum)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div>Weekly miles allowed</div>
            <div>
              <input
                className="w-full"
                {...register("weeklyKMorMileageAllowed", optsAsNum)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div>Monthly miles allowed</div>
            <div>
              <input
                className="w-full"
                {...register("monthlyKMorMileageAllowed", optsAsNum)}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2">
            <div>Fuel charge (per additional gallon)</div>
            <div className="flex">
              $
              <input
                className="w-full"
                {...register("fuelCharge", optsAsNum)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div>Miles charge (per additional mile)</div>
            <div className="flex">
              $
              <input
                className="w-full"
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
    <div className="mt-4 grid w-full grid-cols-1 gap-4 bg-teal-50 md:w-1/2">
      <div>
        <div className="grid grid-cols-3">
          <div>Daily</div>
          <div>
            <input {...register("dailyQty", optsAsNum)} />
            &nbsp;x
          </div>
          <div>
            $
            <input {...register("dailyRate", optsAsNum)} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2">
        <div>Daily miles allowed</div>
        <div>
          <input
            className="w-full"
            {...register("dailyKMorMileageAllowed", optsAsNum)}
          />
        </div>
      </div>
      <div className="grid grid-cols-2">
        <div>Fuel charge (per additional gallon)</div>
        <div className="flex">
          $
          <input className="w-full" {...register("fuelCharge", optsAsNum)} />
        </div>
      </div>
      <div className="grid grid-cols-2">
        <div>Miles charge (per additional mile)</div>
        <div className="flex">
          $
          <input
            className="w-full"
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
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-3">
          <div>Monday</div>
          <div>
            <input {...register("monCount", optsAsNum)} />
            &nbsp;x
          </div>
          <div>
            $
            <input {...register("monRate", optsAsNum)} />
          </div>
        </div>
        <div className="grid grid-cols-3">
          <div>Wednesday</div>
          <div>
            <input {...register("wedCount", optsAsNum)} />
            &nbsp;x
          </div>
          <div>
            $
            <input {...register("wedRate", optsAsNum)} />
          </div>
        </div>
        <div className="grid grid-cols-3">
          <div>Friday</div>
          <div>
            <input {...register("friCount", optsAsNum)} />
            &nbsp;x
          </div>
          <div>
            $
            <input {...register("friRate", optsAsNum)} />
          </div>
        </div>
        <div className="grid grid-cols-3">
          <div>Sunday</div>
          <div>
            <input {...register("sunCount", optsAsNum)} />
            &nbsp;x
          </div>
          <div>
            $
            <input {...register("sunRate", optsAsNum)} />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-3">
          <div>Tuesday</div>
          <div>
            <input {...register("tuesCount", optsAsNum)} />
            &nbsp;x
          </div>
          <div>
            $
            <input {...register("tuesRate", optsAsNum)} />
          </div>
        </div>
        <div className="grid grid-cols-3">
          <div>Thursday</div>
          <div>
            <input {...register("thursCount", optsAsNum)} />
            &nbsp;x
          </div>
          <div>
            $
            <input {...register("thursRate", optsAsNum)} />
          </div>
        </div>
        <div className="grid grid-cols-3">
          <div>Saturday</div>
          <div>
            <input {...register("satCount", optsAsNum)} />
            &nbsp;x
          </div>
          <div>
            $
            <input {...register("satRate", optsAsNum)} />
          </div>
        </div>
      </div>
      <div className="col-span-1 md:col-span-2">Extra</div>
    </div>
  );
}
