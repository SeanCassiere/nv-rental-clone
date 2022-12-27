import { useId, Fragment } from "react";
import { Transition, Listbox } from "@headlessui/react";
import classNames from "classnames";
import { type TSelectInputOption, TextInput } from ".";

interface MultiSelectInputProps {
  values: TSelectInputOption[];
  options: TSelectInputOption[];
  onSelect: (value: TSelectInputOption[]) => void;
  includeBlank?: boolean;
  label: string;
  name?: string;
  required?: boolean;
}

export const MultiSelectInput = (props: MultiSelectInputProps) => {
  const id = useId();
  const {
    values = [],
    includeBlank,
    options = [],
    onSelect,
    name,
    label,
  } = props;

  const selectOptions = [...options];
  if (includeBlank) {
    selectOptions.unshift({ label: "Select", value: "undefined" });
  }

  return (
    <div className="relative">
      <Listbox
        value={values.map((v) => v.value)}
        onChange={(items) => {
          const itemSend: TSelectInputOption[] = [];
          items.forEach((item) => {
            const found = options.find((option) => option.value === item);
            if (found) {
              itemSend.push(found);
            }
          });
          onSelect(itemSend);
        }}
        name={name ?? id}
        multiple
      >
        {({ open }) => (
          <>
            <Listbox.Button
              key={`${name ?? id}-${JSON.stringify(values).length}`}
              as={TextInput}
              className="relative w-full truncate rounded-sm border border-gray-300"
              defaultValue={
                values.length > 0
                  ? values.map((item) => item.label).join(", ")
                  : "Select"
              }
              readOnly
              label={label}
            />

            <Transition
              show={open}
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
              className="absolute left-0 top-full z-10 min-w-full"
            >
              <Listbox.Options
                static
                className="max-h-[190px] overflow-y-auto shadow-sm"
              >
                {selectOptions.map((option) => (
                  <Listbox.Option
                    key={`${id}-${option.label}`}
                    value={option.value}
                    as={Fragment}
                  >
                    {({ active, selected }) => {
                      const isSelected = values
                        .map((item) => item.value)
                        .includes(option.value);
                      return (
                        <li
                          className={classNames(
                            active
                              ? "bg-blue-500 text-white hover:bg-blue-500"
                              : "bg-white text-black",
                            isSelected ? "bg-blue-600" : "",
                            "flex gap-x-1.5 px-2 py-1 text-sm"
                          )}
                        >
                          <span className="w-[1rem]">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              readOnly
                            />
                          </span>
                          <span className="col-span-11">{option.label}</span>
                        </li>
                      );
                    }}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </>
        )}
      </Listbox>
    </div>
  );
};
