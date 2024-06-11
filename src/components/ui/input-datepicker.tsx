import * as React from "react";
import type { PopoverContentProps } from "@radix-ui/react-popover";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useDateInput } from "@/lib/hooks/useDateInput";

import { dfnsDateFormat, dfnsTimeFormat } from "@/lib/config/i18next";

import { useFormField } from "./form";

const DEFAULT_DATE_FORMAT = dfnsDateFormat;
const DEFAULT_TIME_FORMAT = dfnsTimeFormat;
const DEFAULT_DATE_TIME_FORMAT = `${DEFAULT_DATE_FORMAT} ${DEFAULT_TIME_FORMAT}`;

const InputDatePickerContext = React.createContext<ReturnType<
  typeof useDateInput
> | null>(null);

interface InputDatePickerProps {
  value?: Date;
  mode: "date" | "time" | "datetime";
  children: React.ReactNode;
  disabled?: boolean;
  readOnly?: boolean;
  onChange?: (date: Date) => void;
  align?: PopoverContentProps["align"];
  format?: string;
  timeFormat?: string;
  required?: boolean;
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
  required,
  onChange,
}: InputDatePickerProps) {
  const [tabStage, setTabStage] = React.useState(
    mode === "time" ? "time" : "date"
  );

  const useDateInputHook = useDateInput({
    defaultSelected: value,
    onValidChange: onChange,
    format: format
      ? format
      : mode === "date"
        ? DEFAULT_DATE_FORMAT
        : mode === "datetime"
          ? DEFAULT_DATE_TIME_FORMAT
          : timeFormat,
    disabled,
    readOnly,
    required,
  });

  const useTimeInputHook = useDateInput({
    defaultSelected: value,
    onValidChange: onChange,
    format: timeFormat,
    disabled,
    readOnly,
  });

  return (
    <InputDatePickerContext.Provider value={useDateInputHook}>
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
                {...useDateInputHook.dayPickerProps}
              />
            </TabsContent>
            <TabsContent value="time">
              <div className="h-[300px] w-full px-3.5">
                <Input {...useTimeInputHook.inputProps} />
              </div>
            </TabsContent>
          </Tabs>
        </PopoverContent>
      </Popover>
    </InputDatePickerContext.Provider>
  );
}

interface InputDatePickerSlotProps {
  placeholder?: string;
}

function InputDatePickerSlot({
  placeholder = "Select a date",
}: InputDatePickerSlotProps) {
  const ctx = React.useContext(InputDatePickerContext);
  if (!ctx) {
    throw new Error(
      "InputDatePickerSlotTrigger must be used within a InputDatePicker"
    );
  }

  const { formItemId } = useFormField();

  return (
    <div className="relative">
      <Input id={formItemId} {...ctx.inputProps} placeholder={placeholder} />
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="absolute right-0.5 top-0.5 h-9"
          disabled={ctx.inputProps.disabled || ctx.inputProps.readOnly}
        >
          <icons.Calendar className="h-3.5 w-3.5" />
        </Button>
      </PopoverTrigger>
    </div>
  );
}

export { InputDatePicker, InputDatePickerSlot };
