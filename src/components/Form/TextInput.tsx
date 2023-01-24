import { useId, forwardRef } from "react";
import classNames from "classnames";
import { ExclamationCircleIconOutline } from "../icons";

interface TextInputProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label: string;
  error?: boolean;
  errorText?: string | null;
}

export const TextInput = forwardRef<any, TextInputProps>(
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
          <div className="relative mt-1 rounded-md shadow-sm">
            <input
              type={type ?? "text"}
              id={id}
              className={classNames(
                "block w-full rounded-sm border-gray-300 focus:outline-none sm:text-sm",
                error
                  ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
                  : "focus:border-teal-500 focus:ring-teal-500",
                error ? "pr-10" : undefined
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
            {error && (
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <ExclamationCircleIconOutline
                  className="h-5 w-5 text-red-500"
                  aria-hidden="true"
                />
              </div>
            )}
          </div>
          {error && errorText ? (
            <p className="mt-2 text-sm text-red-600" id={`${id}-error`}>
              {errorText}
            </p>
          ) : null}
        </div>
      </>
    );
  }
);
