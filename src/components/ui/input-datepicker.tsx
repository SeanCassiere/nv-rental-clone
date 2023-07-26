import { createContext, useContext, type ReactNode } from "react";
import { PopoverContentProps } from "@radix-ui/react-popover";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import { useDateInput } from "@/hooks/internal/useDateInput";
import { dfnsDateFormat, dfnsTimeFormat } from "@/i18n.config";
import { useFormField } from "./form";

const DEFAULT_DATE_FORMAT = dfnsDateFormat;
const DEFAULT_TIME_FORMAT = dfnsTimeFormat;
const DEFAULT_DATE_TIME_FORMAT = `${DEFAULT_DATE_FORMAT} ${DEFAULT_TIME_FORMAT}`;

const InputDatePickerContext = createContext<ReturnType<
  typeof useDateInput
> | null>(null);

interface InputDatePickerProps {
  value: Date;
  mode: "date" | "time" | "datetime";
  children: ReactNode;
  disabled?: boolean;
  readOnly?: boolean;
  onChange?: (date: Date) => void;
  align?: PopoverContentProps["align"];
  format?: string;
}

function InputDatePicker({
  children,
  mode = "datetime",
  align = "end",
  value,
  format,
  disabled,
  readOnly,
  onChange,
}: InputDatePickerProps) {
  const useDateInputHook = useDateInput({
    defaultSelected: value,
    onValidChange: onChange,
    format: format
      ? format
      : mode === "date"
      ? DEFAULT_DATE_FORMAT
      : mode === "datetime"
      ? DEFAULT_DATE_TIME_FORMAT
      : DEFAULT_TIME_FORMAT,
    disabled,
    readOnly,
  });

  return (
    <InputDatePickerContext.Provider value={useDateInputHook}>
      <Popover>
        {children}
        <PopoverContent align={align} className="w-auto p-0">
          {(mode === "date" || mode === "datetime") && (
            <Calendar
              mode="single"
              initialFocus
              {...useDateInputHook.dayPickerProps}
            />
          )}
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
  const ctx = useContext(InputDatePickerContext);
  if (!ctx) {
    throw new Error(
      "InputDatePickerSlotTrigger must be used within a InputDatePicker"
    );
  }

  const { formItemId } = useFormField();

  return (
    <div className="flex gap-1">
      <Input id={formItemId} placeholder={placeholder} {...ctx.inputProps} />
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={ctx.inputProps.disabled || ctx.inputProps.readOnly}
        >
          <CalendarIcon className="h-3.5 w-3.5" />
        </Button>
      </PopoverTrigger>
    </div>
  );
}

export { InputDatePicker, InputDatePickerSlot };
