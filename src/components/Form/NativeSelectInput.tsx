import classNames from "classnames";
import { forwardRef, useId } from "react";
import { type TSelectInputOption } from "./SelectInput";

export function getSelectedOptionForSelectInput(
  options: TSelectInputOption[],
  value: string | number,
  key: keyof TSelectInputOption = "value"
) {
  return options.find((option) => `${option[key]}` === `${value}`);
}

interface NativeSelectProps
  extends Omit<
    React.DetailedHTMLProps<
      React.SelectHTMLAttributes<HTMLSelectElement>,
      HTMLSelectElement
    >,
    "value" | "onSelect"
  > {
  value: TSelectInputOption | null | undefined;
  options: TSelectInputOption[];
  onSelect: (value: TSelectInputOption | null) => void;
  label: string;
  name?: string;
  required?: boolean;
  placeHolderSchema?: { value: any; label: string };
  error?: boolean;
  errorText?: string | null;
  disabled?: boolean;
}

export const NativeSelectInput = forwardRef<any, NativeSelectProps>(
  (props, ref) => {
    const reactId = useId();

    const {
      id: propsId,
      label,
      className,
      required,
      error,
      errorText,
      value,
      onSelect,
      options,
      placeHolderSchema,
      onChange,

      ...selectProps
    } = props;

    const id = propsId ?? reactId;
    return (
      <>
        <div className="w-full">
          <label
            htmlFor={id}
            className="block text-sm font-medium text-gray-700"
          >
            {label}
          </label>
          <div className="relative mt-1 rounded shadow-sm">
            <select
              id={id}
              className={classNames(
                "block w-full rounded border-gray-300 focus:outline-none disabled:cursor-not-allowed sm:text-sm",
                error
                  ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
                  : "focus:border-teal-500 focus:ring-teal-500",
                className
              )}
              value={value?.value ?? ""}
              onChange={(evt) => {
                const schema = props.options.find(
                  (option) => option.value === evt.target.value
                );
                if (schema) {
                  onSelect(schema);
                }
              }}
              required={required}
              {...selectProps}
            >
              {placeHolderSchema && (
                <option value={placeHolderSchema.value}>
                  {placeHolderSchema.label}
                </option>
              )}
              {options.map((opt) => (
                <option
                  key={`${id}-${opt.value}-${opt.label}`}
                  value={opt.value}
                >
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          {error && errorText ? (
            <p className="mt-0.5 text-sm text-red-600" id={`${id}-error`}>
              {errorText}
            </p>
          ) : null}
        </div>
      </>
    );
  }
);
