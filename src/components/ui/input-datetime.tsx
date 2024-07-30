import * as React from "react";
import { useTimescape } from "timescape/react";

import { generateShortId } from "@/lib/utils";

interface InputDatetimeProps extends React.HTMLAttributes<HTMLDivElement> {
  date?: Date;
  onDateFocus?: () => void;
  onDateBlur?: () => void;
  onDateChange?: (date: Date | undefined) => void;
  dateFormat?: string;
  disabled?: boolean;
  readOnly?: boolean;
}

function InputDatetime(props: InputDatetimeProps) {
  const elementId = React.useRef(generateShortId());
  const id = props.id ?? elementId.current;

  const [date, setDate] = React.useState<Date | undefined>(
    props.date ?? undefined
  );

  const handleDateChange = React.useCallback(
    (nextDate: Date | undefined) => {
      if (!props.disabled && !props.readOnly) {
        props.onDateChange?.(nextDate);
        setDate(nextDate);
      }
    },
    [props]
  );

  const { segments, hours12 } = React.useMemo(
    () => getTimescapePreferences(props.dateFormat ?? "dd-MMM-yyyy HH:mm"),
    [props.dateFormat]
  );

  const { getRootProps, getInputProps, update, options } = useTimescape({
    date: date,
    onChangeDate: handleDateChange,
    minDate: undefined,
    maxDate: undefined,
    hour12: hours12,
    digits: "2-digit",
    wrapAround: false,
    snapToStep: false,
  });

  React.useEffect(() => {
    if (options.date !== props.date) {
      update((prev) => ({ ...prev, date: props.date }));
    }
  }, [options.date, props.date, update]);

  return (
    <div
      id={`${id}-root`}
      className="flex h-10 items-center justify-start gap-1 rounded-md border border-input bg-background px-3 py-2 text-sm duration-100"
      {...getRootProps()}
    >
      {segments.map((segment, idx) => {
        if (segment.type === "separator") {
          return (
            <span
              key={`${id}-separator-${idx}`}
              className="separator m-0 text-[80%] text-muted-foreground"
            >
              {segment.value}
            </span>
          );
        }

        const inputId = idx === 0 ? id : `${id}-${segment.type}`;
        const placeholder =
          segment.type !== "am/pm" ? segment.value : undefined;

        return (
          <input
            key={`${id}-${segment.type}-${idx}`}
            id={inputId}
            placeholder={placeholder}
            disabled={props.disabled}
            readOnly={props.readOnly}
            onFocus={props.onDateFocus}
            onBlur={props.onDateBlur}
            className="inline-block h-full rounded-md border-none bg-transparent p-0 text-sm tabular-nums text-foreground caret-transparent outline-none ring-offset-background placeholder:text-muted-foreground focus:border-input focus:outline-none focus:ring-ring read-only:focus:ring-ring/80 focus-visible:border-input focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-70"
            {...getInputProps(segment.type)}
          />
        );
      })}
    </div>
  );
}

InputDatetime.displayName = "InputDatetime";

export { InputDatetime };
export type { InputDatetimeProps };

type TimescapeSegment = {
  type:
    | "separator"
    | "years"
    | "months"
    | "days"
    | "hours"
    | "minutes"
    | "seconds"
    | "am/pm";
  value?: string;
};

function getTimescapePreferences(dateformat: string) {
  const pieces = dateformat.split("");

  const segments: TimescapeSegment[] = [];

  let hours12 = false;

  pieces.forEach((piece) => {
    switch (piece) {
      case "Y":
      case "y":
        const existingYearSegment = segments.find(
          (segment) => segment.type === "years"
        );
        if (!existingYearSegment) {
          segments.push({ type: "years", value: "YYYY" });
        }
        break;
      case "M":
        const existingMonthSegment = segments.find(
          (segment) => segment.type === "months"
        );
        if (!existingMonthSegment) {
          segments.push({ type: "months", value: "MM" });
        }
        break;
      case "D":
      case "d":
        const existingDaySegment = segments.find(
          (segment) => segment.type === "days"
        );
        if (!existingDaySegment) {
          segments.push({ type: "days", value: "DD" });
        }
        break;
      case "h":
      case "K":
        const existing12HourSegment = segments.find(
          (segment) => segment.type === "hours"
        );
        hours12 = true;
        if (!existing12HourSegment) {
          segments.push({ type: "hours", value: "hh" });
        }
        break;
      case "H":
      case "k":
        const existing24HourSegment = segments.find(
          (segment) => segment.type === "hours"
        );
        hours12 = false;
        if (!existing24HourSegment) {
          segments.push({ type: "hours", value: "hh" });
        }
        break;
      case "m":
        const existingMinuteSegment = segments.find(
          (segment) => segment.type === "minutes"
        );
        if (!existingMinuteSegment) {
          segments.push({ type: "minutes", value: "mm" });
        }
        break;
      case "S":
      case "s":
        const existingSecondSegment = segments.find(
          (segment) => segment.type === "seconds"
        );
        if (!existingSecondSegment) {
          segments.push({ type: "seconds", value: "ss" });
        }
        break;
      case "a":
      case "A":
      case "b":
        const existingAmPmSegment = segments.find(
          (segment) => segment.type === "am/pm"
        );
        if (!existingAmPmSegment) {
          segments.push({ type: "am/pm" });
        }
        break;
      default:
        segments.push({ type: "separator", value: piece });
    }
  });

  if (hours12 && !segments.find((segment) => segment.type === "am/pm")) {
    segments.push({ type: "am/pm" });
  }

  return {
    segments,
    hours12,
  };
}
