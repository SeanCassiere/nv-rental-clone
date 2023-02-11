import { useId, Fragment } from "react";
import { Transition, Listbox } from "@headlessui/react";
import classNames from "classnames";
import { CheckIconOutline, ChevronUpDownSolid } from "../icons";

export type TSelectInputOption = {
  label: string;
  value: string | undefined;
};

interface SelectProps {
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

export const SelectInput = (props: SelectProps) => {
  const id = useId();
  const {
    value,
    options,
    onSelect,
    label,
    name,
    placeHolderSchema,
    error,
    errorText,
    disabled: isDisabled,
  } = props;

  const selectOptions = [...options];

  return (
    <div>
      <Listbox
        value={value}
        onChange={onSelect}
        name={name ?? id}
        disabled={isDisabled}
      >
        {({ open, disabled }) => (
          <>
            <Listbox.Label className="block text-sm font-medium text-gray-700">
              {label}
            </Listbox.Label>
            <div className="relative mt-1">
              <Listbox.Button className="relative w-full">
                <div
                  className={classNames(
                    "relative cursor-default rounded border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 sm:text-sm",
                    error
                      ? "border-red-300 text-red-500 placeholder-red-300 focus:border-red-500 focus:ring-red-500"
                      : undefined
                  )}
                >
                  <span
                    className={classNames(
                      "block truncate",
                      disabled ? "text-slate-500" : ""
                    )}
                  >
                    {typeof value?.value === "undefined" && placeHolderSchema
                      ? placeHolderSchema.label
                      : value?.label ?? "Select"}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownSolid
                      className={classNames(
                        "h-5 w-5 ",
                        disabled ? "text-slate-500" : "text-gray-400",
                        error ? "text-red-500" : undefined
                      )}
                      aria-hidden="true"
                    />
                  </span>
                </div>
                {error && (
                  <div className="mt-2 text-left text-sm text-red-600">
                    {errorText}
                  </div>
                )}
              </Listbox.Button>

              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {selectOptions.map((person, idx) => (
                    <Listbox.Option
                      disabled={disabled}
                      key={`${person.value}.${idx}`}
                      className={({ active }) =>
                        classNames(
                          active ? "bg-teal-600 text-white" : "text-gray-900",
                          "relative cursor-default select-none py-2 pl-3 pr-9"
                        )
                      }
                      value={person}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={classNames("block truncate font-normal")}
                          >
                            {person.label}
                          </span>

                          {selected ? (
                            <span
                              className={classNames(
                                active ? "text-white" : "text-teal-600",
                                "absolute inset-y-0 right-0 flex items-center pr-4"
                              )}
                            >
                              <CheckIconOutline
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </>
        )}
      </Listbox>
    </div>
  );
};
