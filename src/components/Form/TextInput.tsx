import { useId, forwardRef, type ReactNode } from "react";
import { ExclamationCircleIconOutline } from "../icons";

import { cn } from "@/utils";

interface TextInputProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label: string;
  error?: boolean;
  errorText?: string | null;
  endIcon?: ReactNode;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (props: TextInputProps, ref) => {
    const reactId = useId();
    const {
      type,
      id: propsId,
      label,
      className,
      required,
      error,
      errorText,
      endIcon,
      ...inputProps
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
            <input
              type={type ?? "text"}
              id={id}
              className={cn(
                "block w-full rounded border-gray-300 read-only:cursor-not-allowed focus:outline-none disabled:cursor-not-allowed sm:text-sm",
                error
                  ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
                  : "read-only:text-slate-500 focus:border-teal-500 focus:ring-teal-500 read-only:focus:border-gray-300 read-only:focus:ring-0",
                error ? "pr-10" : undefined,
              )}
              placeholder={inputProps.placeholder || label}
              {...(error
                ? {
                    "aria-invalid": "true",
                  }
                : undefined)}
              aria-describedby={`${id}-error`}
              ref={ref}
              required={required}
              {...inputProps}
            />
            {error && !endIcon && (
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <ExclamationCircleIconOutline
                  className="h-5 w-5 text-red-500"
                  aria-hidden="true"
                />
              </div>
            )}
            {props.endIcon ? (
              <button className="pointer-events-none absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3">
                {props.endIcon}
              </button>
            ) : null}
          </div>
          {error && errorText ? (
            <p className="mt-0.5 text-sm text-red-600" id={`${id}-error`}>
              {errorText}
            </p>
          ) : null}
        </div>
      </>
    );
  },
);
