import { useId, Fragment, forwardRef } from "react";
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
}

export const SelectInput = forwardRef((props: SelectProps, ref) => {
  const id = useId();
  const { value, options, onSelect, label, name, placeHolderSchema } = props;

  const selectOptions = [...options];

  return (
    <div>
      <Listbox value={value} onChange={onSelect} name={name ?? id}>
        {({ open }) => (
          <>
            <Listbox.Label className="block text-sm font-medium text-gray-700">
              {label}
            </Listbox.Label>
            <div className="relative mt-1">
              <Listbox.Button className="relative w-full cursor-default rounded-sm border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 sm:text-sm">
                <span className="block truncate">
                  {typeof value?.value === "undefined" && placeHolderSchema
                    ? placeHolderSchema.label
                    : value?.label ?? "Select"}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownSolid
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>

              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {selectOptions.map((person) => (
                    <Listbox.Option
                      key={person.value}
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
});
