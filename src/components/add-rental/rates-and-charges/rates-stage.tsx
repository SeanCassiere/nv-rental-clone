import { useEffect, useMemo } from "react";
import { useForm, type FormState, type UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import type { RatesAndChargesTabProps } from ".";

import { useGetRentalRateTypesForRentals } from "@/hooks/network/rates/useGetRentalRateTypesForRental";

import { RentalRateSchema, type RentalRateParsed } from "@/schemas/rate";

interface RatesStageProps {
  durationStageData: RatesAndChargesTabProps["durationStageData"];
  vehicleStageData: RatesAndChargesTabProps["vehicleStageData"];

  rate: RatesAndChargesTabProps["rate"];
  onSelectedRate: RatesAndChargesTabProps["onSelectedRate"];

  rateName: RatesAndChargesTabProps["rateName"];
  onSelectRateName: RatesAndChargesTabProps["onSelectRateName"];

  hideRateSelector?: boolean;
  hidePromotionCodeFields?: boolean;
  isEdit: boolean;
  onCompleted: () => void;
}

export const RatesStage = (props: RatesStageProps) => {
  const {
    durationStageData,
    vehicleStageData,
    rateName,
    rate,
    hideRateSelector = false,
    hidePromotionCodeFields = false,
  } = props;

  const isSupportingInfoAvailable =
    Boolean(durationStageData) && Boolean(vehicleStageData);

  const checkoutLocation = durationStageData?.checkoutLocation || 0;
  const vehicleTypeId = vehicleStageData?.vehicleTypeId || 0;

  const rateTypesData = useGetRentalRateTypesForRentals({
    filters: {
      LocationId: String(checkoutLocation),
      VehicleTypeId: String(vehicleTypeId),
    },
  });
  const rateTypesList = rateTypesData.data ?? [];

  const form = useForm<RentalRateParsed>({
    resolver: zodResolver(RentalRateSchema),
    defaultValues: useMemo(() => {
      return rate !== null ? rate : undefined;
    }, [rate]),
  });

  useEffect(() => {
    if (rate) {
      form.reset(rate);
    }
  }, [form, rate, rate?.rateName, rateName]);

  const isDayRate = form.watch("isDayRate");
  const isWeekDayRate = form.watch("isDayWeek");

  const totalDays = form.watch("totalDays");
  const rentalDays = totalDays ?? 0;

  const commonFormProps: CommonRatesFormProps = {
    registerFn: form.register,
    formState: form.formState,
  };

  return (
    <Form {...form}>
      {!isSupportingInfoAvailable && (
        <div className="text-destructive">
          Rental and Vehicle information not entered.
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 px-1 md:grid-cols-3">
        <div className="col-span-1 text-base md:col-span-3">
          Total days: <span className="font-semibold">{rentalDays}</span>
        </div>
        {!hideRateSelector && (
          <div className="col-span-1">
            <FormField
              control={form.control}
              name="rateName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rate</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      if (value && value !== "") {
                        field.onChange(value);
                        props.onSelectRateName(value);
                      }
                    }}
                    value={field.value ? `${field.value}` : undefined}
                    disabled={!isSupportingInfoAvailable}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select rate" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {rateTypesList.map((rate, idx) => (
                        <SelectItem
                          key={`${rate.rateName}-${idx}`}
                          value={`${rate.rateName}`}
                        >
                          {rate.rateName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
        {!hidePromotionCodeFields && (
          <div className="col-span-1 flex items-end text-sm text-primary">
            Implement promotion codes later
          </div>
        )}
      </div>
      <form
        onSubmit={form.handleSubmit((data) => {
          const valuesToSubmit = { ...rate, ...data };
          props.onSelectedRate(valuesToSubmit);
          props.onCompleted();
        })}
        className="mt-4 px-1 text-sm"
      >
        {rate && (
          <>
            {isWeekDayRate ? (
              <WeekDayRatesForm {...commonFormProps} />
            ) : isDayRate ? (
              <DayRatesForm {...commonFormProps} />
            ) : (
              <NormalRatesForm {...commonFormProps} />
            )}
          </>
        )}
        <div className="mt-4">
          <Button type="submit" disabled={!rate}>
            Save & Continue
          </Button>
        </div>
      </form>
    </Form>
  );
};

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
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <div className="flex flex-col gap-3">
        <Card className="flex flex-col items-start shadow-none sm:flex-row sm:items-center">
          <CardHeader className="flex-1 px-4 py-3.5">
            <CardTitle className="text-base font-medium">Hourly</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-row items-center gap-4 px-4 pb-4 sm:pb-0">
            <Input
              type="number"
              min={0}
              step={1}
              autoComplete="off"
              className="h-8 max-w-[100px]"
              {...register("hourlyQty", optsAsNum)}
            />
            <span>x</span>
            <Input
              type="number"
              min={0}
              step={0.01}
              autoComplete="off"
              className="h-8 max-w-[100px]"
              {...register("hourlyRate", optsAsNum)}
            />
          </CardContent>
        </Card>
        <Card className="flex flex-col items-start shadow-none sm:flex-row sm:items-center">
          <CardHeader className="flex-1 px-4 py-3.5">
            <CardTitle className="text-base font-medium">Half daily</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-row items-center gap-4 px-4 pb-4 sm:pb-0">
            <Input
              type="number"
              min={0}
              step={1}
              autoComplete="off"
              className="h-8 max-w-[100px]"
              {...register("halfDayQty", optsAsNum)}
            />
            <span>x</span>
            <Input
              type="number"
              min={0}
              step={0.01}
              autoComplete="off"
              className="h-8 max-w-[100px]"
              {...register("halfDayRate", optsAsNum)}
            />
          </CardContent>
        </Card>
        <Card className="flex flex-col items-start shadow-none sm:flex-row sm:items-center">
          <CardHeader className="flex-1 px-4 py-3.5">
            <CardTitle className="text-base font-medium">Daily</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-row items-center gap-4 px-4 pb-4 sm:pb-0">
            <Input
              type="number"
              min={0}
              step={1}
              autoComplete="off"
              className="h-8 max-w-[100px]"
              {...register("dailyQty", optsAsNum)}
            />
            <span>x</span>
            <Input
              type="number"
              min={0}
              step={0.01}
              autoComplete="off"
              className="h-8 max-w-[100px]"
              {...register("dailyRate", optsAsNum)}
            />
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col gap-3">
        <Card className="flex flex-col items-start shadow-none sm:flex-row sm:items-center">
          <CardHeader className="flex-1 px-4 py-3.5">
            <CardTitle className="text-base font-medium">Weekly</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-row items-center gap-4 px-4 pb-4 sm:pb-0">
            <Input
              type="number"
              min={0}
              step={1}
              autoComplete="off"
              className="h-8 max-w-[100px]"
              {...register("weeklyQty", optsAsNum)}
            />
            <span>x</span>
            <Input
              type="number"
              min={0}
              step={0.01}
              autoComplete="off"
              className="h-8 max-w-[100px]"
              {...register("weeklyRate", optsAsNum)}
            />
          </CardContent>
        </Card>
        <Card className="flex flex-col items-start shadow-none sm:flex-row sm:items-center">
          <CardHeader className="flex-1 px-4 py-3.5">
            <CardTitle className="text-base font-medium">Monthly</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-row items-center gap-4 px-4 pb-4 sm:pb-0">
            <Input
              type="number"
              min={0}
              step={1}
              autoComplete="off"
              className="h-8 max-w-[100px]"
              {...register("monthlyQty", optsAsNum)}
            />
            <span>x</span>
            <Input
              type="number"
              min={0}
              step={0.01}
              autoComplete="off"
              className="h-8 max-w-[100px]"
              {...register("monthlyRate", optsAsNum)}
            />
          </CardContent>
        </Card>
        <Card className="flex flex-col items-start shadow-none sm:flex-row sm:items-center">
          <CardHeader className="flex-1 px-4 py-3.5">
            <CardTitle className="text-base font-medium">
              Weekend daily
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-row items-center gap-4 px-4 pb-4 sm:pb-0">
            <Input
              type="number"
              min={0}
              step={1}
              autoComplete="off"
              className="h-8 max-w-[100px]"
              {...register("weekendDailyQty", optsAsNum)}
            />
            <span>x</span>
            <Input
              type="number"
              min={0}
              step={0.01}
              autoComplete="off"
              className="h-8 max-w-[100px]"
              {...register("weekendDayRate", optsAsNum)}
            />
          </CardContent>
        </Card>
      </div>
      {/* Extra stuff */}
      <div className="col-span-1 grid w-full grid-cols-1 gap-4 md:col-span-2 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Card className="flex flex-col items-start shadow-none sm:flex-row sm:items-center">
            <CardHeader className="flex-1 px-4 py-3.5">
              <CardTitle className="text-base font-medium">
                Daily miles allowed
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 sm:pb-0">
              <Input
                type="number"
                min={0}
                step={0.25}
                autoComplete="off"
                className="h-8 max-w-[100px]"
                {...register("dailyKMorMileageAllowed", optsAsNum)}
              />
            </CardContent>
          </Card>
          <Card className="flex flex-col items-start shadow-none sm:flex-row sm:items-center">
            <CardHeader className="flex-1 px-4 py-3.5">
              <CardTitle className="text-base font-medium">
                Weekly miles allowed
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 sm:pb-0">
              <Input
                type="number"
                min={0}
                step={0.25}
                autoComplete="off"
                className="h-8 max-w-[100px]"
                {...register("weeklyKMorMileageAllowed", optsAsNum)}
              />
            </CardContent>
          </Card>
          <Card className="flex flex-col items-start shadow-none sm:flex-row sm:items-center">
            <CardHeader className="flex-1 px-4 py-3.5">
              <CardTitle className="text-base font-medium">
                Monthly miles allowed
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 sm:pb-0">
              <Input
                type="number"
                min={0}
                step={0.25}
                autoComplete="off"
                className="h-8 max-w-[100px]"
                {...register("monthlyKMorMileageAllowed", optsAsNum)}
              />
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col gap-2">
          <Card className="flex flex-col items-start shadow-none sm:flex-row sm:items-center">
            <CardHeader className="flex-1 px-4 py-3.5">
              <CardTitle className="text-base font-medium">
                Fuel charge
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 sm:pb-0">
              <Input
                type="number"
                min={0}
                step={0.01}
                autoComplete="off"
                className="h-8 max-w-[100px]"
                {...register("fuelCharge", optsAsNum)}
              />
            </CardContent>
          </Card>
          <Card className="flex flex-col items-start shadow-none sm:flex-row sm:items-center">
            <CardHeader className="flex-1 px-4 py-3.5">
              <CardTitle className="text-base font-medium">
                Miles charge
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 sm:pb-0">
              <Input
                type="number"
                min={0}
                step={0.01}
                autoComplete="off"
                className="h-8 max-w-[100px]"
                {...register("kMorMileageCharge", optsAsNum)}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function DayRatesForm(props: CommonRatesFormProps) {
  const { registerFn: register } = props;
  return (
    <div className="grid w-full grid-cols-1 gap-3 md:w-1/2">
      <div>
        <Card className="flex flex-col items-start shadow-none sm:flex-row sm:items-center">
          <CardHeader className="flex-1 px-4 py-3.5">
            <CardTitle className="text-base font-medium">Daily</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-row items-center gap-4 px-4 pb-4 sm:pb-0">
            <Input
              type="number"
              min={0}
              step={1}
              autoComplete="off"
              className="h-8 max-w-[100px]"
              {...register("dailyQty", optsAsNum)}
            />
            <span>x</span>
            <Input
              type="number"
              min={0}
              step={0.01}
              autoComplete="off"
              className="h-8 max-w-[100px]"
              {...register("dailyRate", optsAsNum)}
            />
          </CardContent>
        </Card>
      </div>
      <Card className="flex flex-col items-start shadow-none sm:flex-row sm:items-center">
        <CardHeader className="flex-1 px-4 py-3.5">
          <CardTitle className="text-base font-medium">
            Daily miles allowed
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 sm:pb-0">
          <Input
            type="number"
            min={0}
            step={0.25}
            autoComplete="off"
            className="h-8 max-w-[100px]"
            {...register("dailyKMorMileageAllowed", optsAsNum)}
          />
        </CardContent>
      </Card>
      <Card className="flex flex-col items-start shadow-none sm:flex-row sm:items-center">
        <CardHeader className="flex-1 px-4 py-3.5">
          <CardTitle className="text-base font-medium">Fuel charge</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 sm:pb-0">
          <Input
            type="number"
            min={0}
            step={0.01}
            autoComplete="off"
            className="h-8 max-w-[100px]"
            {...register("fuelCharge", optsAsNum)}
          />
        </CardContent>
      </Card>
      <Card className="flex flex-col items-start shadow-none sm:flex-row sm:items-center">
        <CardHeader className="flex-1 px-4 py-3.5">
          <CardTitle className="text-base font-medium">Miles charge</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 sm:pb-0">
          <Input
            type="number"
            min={0}
            step={0.01}
            autoComplete="off"
            className="h-8 max-w-[100px]"
            {...register("kMorMileageCharge", optsAsNum)}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function WeekDayRatesForm(props: CommonRatesFormProps) {
  const { registerFn: register } = props;
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <div className="col-span-2 grid grid-cols-1 gap-3 md:grid-cols-2">
        <Card className="flex flex-col items-start shadow-none sm:flex-row sm:items-center">
          <CardHeader className="flex-1 px-4 py-3.5">
            <CardTitle className="text-base font-medium">Monday</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-row items-center gap-4 px-4 pb-4 sm:pb-0">
            <Input
              type="number"
              min={0}
              step={1}
              autoComplete="off"
              className="h-8 max-w-[100px]"
              {...register("monCount", optsAsNum)}
            />
            <span>x</span>
            <Input
              type="number"
              min={0}
              step={0.01}
              autoComplete="off"
              className="h-8 max-w-[100px]"
              {...register("monRate", optsAsNum)}
            />
          </CardContent>
        </Card>
        <Card className="flex flex-col items-start shadow-none sm:flex-row sm:items-center">
          <CardHeader className="flex-1 px-4 py-3.5">
            <CardTitle className="text-base font-medium">Tuesday</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-row items-center gap-4 px-4 pb-4 sm:pb-0">
            <Input
              type="number"
              min={0}
              step={1}
              autoComplete="off"
              className="h-8 max-w-[100px]"
              {...register("tuesCount", optsAsNum)}
            />
            <span>x</span>
            <Input
              type="number"
              min={0}
              step={0.01}
              autoComplete="off"
              className="h-8 max-w-[100px]"
              {...register("tuesRate", optsAsNum)}
            />
          </CardContent>
        </Card>
        <Card className="flex flex-col items-start shadow-none sm:flex-row sm:items-center">
          <CardHeader className="flex-1 px-4 py-3.5">
            <CardTitle className="text-base font-medium">Wednesday</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-row items-center gap-4 px-4 pb-4 sm:pb-0">
            <Input
              type="number"
              min={0}
              step={1}
              autoComplete="off"
              className="h-8 max-w-[100px]"
              {...register("wedCount", optsAsNum)}
            />
            <span>x</span>
            <Input
              type="number"
              min={0}
              step={0.01}
              autoComplete="off"
              className="h-8 max-w-[100px]"
              {...register("wedRate", optsAsNum)}
            />
          </CardContent>
        </Card>
        <Card className="flex flex-col items-start shadow-none sm:flex-row sm:items-center">
          <CardHeader className="flex-1 px-4 py-3.5">
            <CardTitle className="text-base font-medium">Thursday</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-row items-center gap-4 px-4 pb-4 sm:pb-0">
            <Input
              type="number"
              min={0}
              step={1}
              autoComplete="off"
              className="h-8 max-w-[100px]"
              {...register("thursCount", optsAsNum)}
            />
            <span>x</span>
            <Input
              type="number"
              min={0}
              step={0.01}
              autoComplete="off"
              className="h-8 max-w-[100px]"
              {...register("thursRate", optsAsNum)}
            />
          </CardContent>
        </Card>
        <Card className="flex flex-col items-start shadow-none sm:flex-row sm:items-center">
          <CardHeader className="flex-1 px-4 py-3.5">
            <CardTitle className="text-base font-medium">Friday</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-row items-center gap-4 px-4 pb-4 sm:pb-0">
            <Input
              type="number"
              min={0}
              step={1}
              autoComplete="off"
              className="h-8 max-w-[100px]"
              {...register("friCount", optsAsNum)}
            />
            <span>x</span>
            <Input
              type="number"
              min={0}
              step={0.01}
              autoComplete="off"
              className="h-8 max-w-[100px]"
              {...register("friRate", optsAsNum)}
            />
          </CardContent>
        </Card>
        <Card className="flex flex-col items-start shadow-none sm:flex-row sm:items-center">
          <CardHeader className="flex-1 px-4 py-3.5">
            <CardTitle className="text-base font-medium">Saturday</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-row items-center gap-4 px-4 pb-4 sm:pb-0">
            <Input
              type="number"
              min={0}
              step={1}
              autoComplete="off"
              className="h-8 max-w-[100px]"
              {...register("satCount", optsAsNum)}
            />
            <span>x</span>
            <Input
              type="number"
              min={0}
              step={0.01}
              autoComplete="off"
              className="h-8 max-w-[100px]"
              {...register("satRate", optsAsNum)}
            />
          </CardContent>
        </Card>
        <Card className="flex flex-col items-start shadow-none sm:flex-row sm:items-center">
          <CardHeader className="flex-1 px-4 py-3.5">
            <CardTitle className="text-base font-medium">Sunday</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-row items-center gap-4 px-4 pb-4 sm:pb-0">
            <Input
              type="number"
              min={0}
              step={1}
              autoComplete="off"
              className="h-8 max-w-[100px]"
              {...register("sunCount", optsAsNum)}
            />
            <span>x</span>
            <Input
              type="number"
              min={0}
              step={0.01}
              autoComplete="off"
              className="h-8 max-w-[100px]"
              {...register("sunRate", optsAsNum)}
            />
          </CardContent>
        </Card>
      </div>
      <div className="col-span-1 flex flex-col gap-3">
        <Card className="flex flex-col items-start shadow-none sm:flex-row sm:items-center">
          <CardHeader className="flex-1 px-4 py-3.5">
            <CardTitle className="text-base font-medium">
              Daily miles allowed
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 sm:pb-0">
            <Input
              type="number"
              min={0}
              step={0.25}
              autoComplete="off"
              className="h-8 max-w-[100px]"
              {...register("dailyKMorMileageAllowed", optsAsNum)}
            />
          </CardContent>
        </Card>
        <Card className="flex flex-col items-start shadow-none sm:flex-row sm:items-center">
          <CardHeader className="flex-1 px-4 py-3.5">
            <CardTitle className="text-base font-medium">Fuel charge</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 sm:pb-0">
            <Input
              type="number"
              min={0}
              step={0.01}
              autoComplete="off"
              className="h-8 max-w-[100px]"
              {...register("fuelCharge", optsAsNum)}
            />
          </CardContent>
        </Card>
        <Card className="flex flex-col items-start shadow-none sm:flex-row sm:items-center">
          <CardHeader className="flex-1 px-4 py-3.5">
            <CardTitle className="text-base font-medium">
              Miles charge
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 sm:pb-0">
            <Input
              type="number"
              min={0}
              step={0.01}
              autoComplete="off"
              className="h-8 max-w-[100px]"
              {...register("kMorMileageCharge", optsAsNum)}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
