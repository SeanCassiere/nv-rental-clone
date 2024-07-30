import * as React from "react";
import type { PopoverContentProps } from "@radix-ui/react-popover";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useFormField } from "@/components/ui/form";
import { icons } from "@/components/ui/icons";
import { InputDatetime } from "@/components/ui/input-datetime";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { dfnsDateFormat, dfnsTimeFormat } from "@/lib/config/i18next";

const DEFAULT_DATE_FORMAT = dfnsDateFormat;
const DEFAULT_TIME_FORMAT = dfnsTimeFormat;
const DEFAULT_DATE_TIME_FORMAT = `${DEFAULT_DATE_FORMAT} ${DEFAULT_TIME_FORMAT}`;

type InputDatePickerContextValue = {
  inputFormat: string;
  value?: InputDatePickerProps["value"];
  onValueChange?: InputDatePickerProps["onChange"];
  disabled?: boolean;
  readOnly?: boolean;
};

const InputDatePickerContext =
  React.createContext<InputDatePickerContextValue | null>(null);

interface InputDatePickerProps {
  value?: Date;
  mode: "date" | "time" | "datetime";
  children: React.ReactNode;
  disabled?: boolean;
  readOnly?: boolean;
  onChange?: (date: Date | undefined) => void;
  align?: PopoverContentProps["align"];
  format?: string;
  timeFormat?: string;
}

function InputDatePicker({
  children,
  mode = "datetime",
  align = "end",
  value,
  format,
  timeFormat = DEFAULT_TIME_FORMAT,
  disabled,
  readOnly,
  onChange,
}: InputDatePickerProps) {
  const [tabStage, setTabStage] = React.useState(
    mode === "time" ? "time" : "date"
  );

  const dateTimeFormat = format ?? DEFAULT_DATE_TIME_FORMAT;

  const { trigger } = useFormField();

  const values: InputDatePickerContextValue = React.useMemo(
    () => ({
      inputFormat: dateTimeFormat,
      value,
      onValueChange: (inputDate) => {
        onChange?.(inputDate);
        void trigger();
      },
      disabled: !!disabled,
      readOnly: !!readOnly,
    }),
    [dateTimeFormat, disabled, onChange, readOnly, trigger, value]
  );

  return (
    <InputDatePickerContext.Provider value={values}>
      <Popover>
        {children}
        <PopoverContent align={align} className="max-w-[300px] p-0">
          <Tabs value={tabStage} onValueChange={setTabStage}>
            {(mode === "time" || mode === "datetime") && (
              <>
                <TabsList className="h-12 w-full rounded-b-none px-2.5">
                  <TabsTrigger className="w-full" value="date">
                    Date
                  </TabsTrigger>
                  <TabsTrigger className="w-full" value="time">
                    Time
                  </TabsTrigger>
                </TabsList>
              </>
            )}
            <TabsContent
              value="date"
              className="flex w-full justify-center pt-0"
            >
              <Calendar
                mode="single"
                initialFocus
                className="pb-4 pt-1"
                selected={value}
                onSelect={(date) => {
                  if (!onChange) return;

                  if (!date) {
                    return onChange(date);
                  }

                  const year = date.getFullYear();
                  const month = date.getMonth();
                  const day = date.getDate();

                  const newDate = value ? new Date(value) : new Date();
                  newDate.setFullYear(year);
                  newDate.setMonth(month);
                  newDate.setDate(day);

                  return onChange(newDate);
                }}
              />
            </TabsContent>
            <TabsContent value="time">
              <div className="h-[300px] w-full px-3.5">
                <InputDatetime
                  date={value}
                  onDateChange={onChange}
                  dateFormat={timeFormat}
                  disabled={disabled}
                  readOnly={readOnly}
                />
              </div>
            </TabsContent>
          </Tabs>
        </PopoverContent>
      </Popover>
    </InputDatePickerContext.Provider>
  );
}

function InputDatePickerSlot() {
  const ctx = React.useContext(InputDatePickerContext);
  if (!ctx) {
    throw new Error(
      "InputDatePickerSlotTrigger must be used within a InputDatePicker"
    );
  }

  const { formItemId, onBlur, onFocus } = useFormField();

  return (
    <div className="relative">
      <InputDatetime
        id={formItemId}
        date={ctx.value}
        onDateChange={ctx.onValueChange}
        onDateFocus={onFocus}
        onDateBlur={onBlur}
        dateFormat={ctx.inputFormat}
        disabled={ctx.disabled}
        readOnly={ctx.readOnly}
      />
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="absolute right-0.5 top-0.5 h-9"
          disabled={ctx.disabled || ctx.readOnly}
        >
          <icons.Calendar className="h-3.5 w-3.5" />
        </Button>
      </PopoverTrigger>
    </div>
  );
}

export { InputDatePicker, InputDatePickerSlot };
