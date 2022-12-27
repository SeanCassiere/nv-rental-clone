import { useId, forwardRef } from "react";
import classNames from "classnames";

interface TextInputProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label: string;
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
      ...inputProps
    } = props;
    const id = propsId ?? reactId;

    return (
      <div className="relative">
        <input
          id={id}
          placeholder={`${label}${required ? "*" : ""}`}
          type={type ?? "text"}
          {...inputProps}
          required={required}
          className={classNames(
            "peer h-12 w-full border-b-2 border-gray-300 pt-2 text-gray-900 placeholder-transparent placeholder:px-4 focus:border-teal-600 focus:outline-none",
            className
          )}
          ref={ref}
        />
        <label
          htmlFor={id}
          className={classNames(
            "absolute left-3 top-0 text-xs text-gray-500 transition-all",
            "peer-placeholder-shown:top-2.5 peer-placeholder-shown:left-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500",
            "peer-focus:top-0 peer-focus:left-3 peer-focus:text-xs peer-focus:text-gray-500"
          )}
        >
          {label}
          {required ? (
            <span className="pl-[0.15em] text-red-500">*</span>
          ) : null}
        </label>
      </div>
    );
  }
);
