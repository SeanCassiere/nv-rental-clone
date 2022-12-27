import { useId, Fragment, forwardRef } from "react";
import { Transition, Listbox } from "@headlessui/react";
import classNames from "classnames";
import { TextInput } from ".";

export type TSelectInputOption = {
  label: string;
  value: string;
};

interface SelectProps {
  value: TSelectInputOption | null | undefined;
  options: TSelectInputOption[];
  onSelect: (value: TSelectInputOption | null) => void;
  includeBlank?: boolean;
  label: string;
  name?: string;
  required?: boolean;
}

export const SelectInput = forwardRef((props: SelectProps, ref) => {
  const id = useId();
  const { value, includeBlank, options, onSelect, label, required, name } =
    props;

  const selectOptions = [...options];
  if (includeBlank) {
    selectOptions.unshift({ label: "Select", value: "undefined" });
  }

  return (
    <div className="relative">
      <Listbox value={value} onChange={onSelect} name={name ?? id}>
        {({ open }) => (
          <>
            <Listbox.Button
              key={`${name ?? id}-${JSON.stringify(value ?? []).length}`}
              as={TextInput}
              defaultValue={value ? value.label : "Select"}
              ref={ref}
              readOnly
              label={label}
              required={required}
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
                className="max-h-[250px] overflow-y-auto shadow-sm"
              >
                {selectOptions.map((option) => (
                  <Listbox.Option
                    key={`${id}-${option.label}`}
                    value={option}
                    as={Fragment}
                  >
                    {({ active, selected }) => (
                      <li
                        className={classNames(
                          active
                            ? "bg-blue-500 text-white hover:bg-blue-500"
                            : "bg-white text-black",
                          selected ? "bg-blue-600" : "",
                          "px-2 py-1 text-sm"
                        )}
                      >
                        {option.label}
                      </li>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </>
        )}
      </Listbox>
    </div>
  );
});
