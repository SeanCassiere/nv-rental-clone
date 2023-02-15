import { useId, Fragment } from "react";
import { Transition, Listbox } from "@headlessui/react";
import classNames from "classnames";
import { type TSelectInputOption } from ".";
import { ChevronUpDownSolid } from "../icons";

interface TMultiSelectInputOption extends TSelectInputOption {
  isSelectAll?: boolean;
}
interface MultiSelectInputProps {
  values: TMultiSelectInputOption[];
  options: TMultiSelectInputOption[];
  onSelect: (option: TMultiSelectInputOption[]) => void;
  includeBlank?: boolean;
  label: string;
  name?: string;
  required?: boolean;
  placeHolderSchema?: { value: any; label: string };
  clearAll?: () => void;
  disabled?: boolean;
}

const blankOption = { label: "Select", value: "undefined" };

export const MultiSelectInput = (props: MultiSelectInputProps) => {
  const id = useId();
  const {
    values = [],
    includeBlank,
    options = [],
    onSelect,
    name,
    label,
    disabled: isDisabled,
  } = props;

  const selectOptions = [...options];
  if (includeBlank) {
    selectOptions.unshift(blankOption);
  }

  return (
    <div>
      <Listbox
        value={values.map((v) => v.value)}
        onChange={(items) => {
          const itemSend: TSelectInputOption[] = [];
          if (values.map((item) => item.value).includes(undefined)) {
            onSelect([]);
          } else {
            items.forEach((item) => {
              const found = options.find((option) => option.value === item);
              if (found) {
                itemSend.push(found);
              }
            });
            onSelect(itemSend);
          }
        }}
        name={name ?? id}
        multiple
        disabled={isDisabled}
      >
        {({ open }) => (
          <>
            <Listbox.Label className="block text-sm font-medium text-gray-700">
              {label}
            </Listbox.Label>
            <div className="relative mt-1">
              <Listbox.Button className="relative w-full cursor-default rounded border border-gray-300 bg-white py-2 pr-10 text-left shadow-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 sm:text-sm">
                <span className="flex items-center">
                  <span className="ml-3 block truncate">
                    {values.length > 0
                      ? values.map((item) => item.label).join(", ")
                      : blankOption.label}
                  </span>
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
                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {options.map((option) => (
                    <Listbox.Option
                      key={`${id}-${option.label}`}
                      className={({ active }) =>
                        classNames(
                          active ? "bg-teal-600 text-white" : "text-gray-900",
                          "relative cursor-default select-none py-2 pl-3 pr-9"
                        )
                      }
                      value={option.value}
                    >
                      {({ selected, active }) => {
                        const isSelected = values
                          .map((item) => item.value)
                          .includes(option.value);

                        const isSelectedAll =
                          option.isSelectAll &&
                          Boolean(values.find((v) => v.isSelectAll));

                        return (
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={isSelectedAll || isSelected}
                              className="h-3.5 w-3.5 flex-shrink-0 rounded border-gray-300 text-teal-500 focus:ring-teal-500"
                              readOnly
                            />
                            <span
                              className={classNames(
                                "ml-3 block truncate font-normal"
                              )}
                            >
                              {option.label}
                              <span className="sr-only">
                                {" "}
                                is {selected ? "selected" : "not selected"}
                              </span>
                            </span>
                          </div>
                        );
                      }}
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
