import { useId, useState } from "react";
import { type ZodSchema } from "zod";
import { localDateToQueryYearMonthDay } from "../../utils/date";

import {
  TextInput,
  MultiSelectInput,
  SelectInput,
  Button,
  DatePicker,
  type TSelectInputOption,
} from "../Form";
type KeyValueObject = { [key: string]: any };

function makeJsonSafe<T extends KeyValueObject>(data: T, originalData: any) {
  const parse = Object.entries(data).reduce((acc, [key, value]) => {
    let storeValue = value;

    if (
      String(value).trim() === "undefined" ||
      String(value).trim() === "" ||
      typeof value === "undefined"
    ) {
      return acc;
    }

    if (Array.isArray(originalData[key]) && typeof value === "string") {
      storeValue = value.split(",").map((i) => i.trim());
    } else if (Array.isArray(originalData[key]) && Array.isArray(value)) {
      storeValue = value.filter((i) => i !== undefined);
    } else {
      if (String(value) === "true") {
        storeValue = true;
      }
      if (String(value) === "false") {
        storeValue = false;
      }
    }

    return {
      ...acc,
      [key]: storeValue,
    };
  }, {});
  return parse;
}

function makeBackToArray<T extends KeyValueObject>(
  data: any,
  originalData: any
) {
  const parsed = [...Object.entries(data)].reduce((prev, [key, value]) => {
    let useableValue = value;
    if (Array.isArray(originalData[key]) && typeof value === "string") {
      useableValue = value.split(",").map((i) => i.trim());
    } else if (Array.isArray(originalData[key]) && Array.isArray(value)) {
      useableValue = value.filter((i) => i !== undefined);
    }

    return {
      ...prev,
      [key]: useableValue,
    };
  }, {} as T);

  return parsed;
}

interface BaseBluePrint<T> {
  label: string;
  required: boolean;
  accessor: keyof T;
  queryKey: string;
}

interface TextSearchBlueprint<T> extends BaseBluePrint<T> {
  type: "text" | "hidden";
}

interface DateSearchBlueprint<T> extends BaseBluePrint<T> {
  type: "date";
}

interface NumberSearchBlueprint<T> extends BaseBluePrint<T> {
  type: "number";
}

interface SingleDropdownSearchBlueprint<T> extends BaseBluePrint<T> {
  type: "single-dropdown";
  options: {
    value: string | undefined;
    label: string;
    isPlaceholder?: boolean;
  }[];
}

interface MultipleDropdownSearchBlueprint<T> extends BaseBluePrint<T> {
  type: "multiple-dropdown";
  options: {
    value: string | undefined;
    label: string;
    isPlaceholder?: boolean;
    isSelectAll?: boolean;
  }[];
}

type SearchBlueprint<T extends KeyValueObject> =
  | TextSearchBlueprint<T>
  | NumberSearchBlueprint<T>
  | SingleDropdownSearchBlueprint<T>
  | MultipleDropdownSearchBlueprint<T>
  | DateSearchBlueprint<T>;

interface ModuleSearchFiltersProps<T extends KeyValueObject> {
  validationSchema: ZodSchema<T>;
  initialValues: T;
  searchFiltersBlueprint: SearchBlueprint<T>[];
  onSubmit?: (values: T) => Promise<void>;
  onReset?: () => Promise<void>;
}

function ModuleSearchFilters<T extends KeyValueObject>(
  props: ModuleSearchFiltersProps<T>
) {
  const [values, setValues] = useState(props.initialValues);
  return (
    <form
      className="grid grid-cols-1 items-end gap-2 md:grid-cols-4 lg:grid-cols-6"
      onReset={(evt) => {
        evt.preventDefault();

        if (props.onReset) {
          props.onReset();
        }
      }}
      onSubmit={(evt) => {
        evt.preventDefault();

        // convert dates to query format
        const withDates = Object.entries(values).reduce((acc, [key, value]) => {
          let setValue = value;
          if (value instanceof Date) {
            setValue = localDateToQueryYearMonthDay(value);
          }
          return {
            ...acc,
            [key]: setValue,
          };
        }, {});

        const insert = makeBackToArray(withDates, props.initialValues);

        const result = props.validationSchema.safeParse(insert);
        console.log({ result });
        if (!result.success) {
          console.error("failed submitting module filters\n\n", result.error);
          return;
        }

        const secondInsert = makeBackToArray(result.data, props.initialValues);

        const jsonSafe = makeJsonSafe(secondInsert, props.initialValues);
        if (props.onSubmit) {
          props.onSubmit(jsonSafe as T);
          return;
        }
      }}
    >
      {props.searchFiltersBlueprint.map((blueprint, idx) => (
        <RenderInput
          key={`input-${blueprint.queryKey}-${idx}`}
          blueprint={blueprint}
          value={values[blueprint.accessor]}
          onChange={(evt: any) => {
            let insert: any = evt.target.value;

            // done for select multiple
            // uses a string array
            if (evt.target?.multiple === true) {
              const options = [...evt.target.selectedOptions].map(
                (el) => el.value
              );

              if (options.includes("undefined")) {
                insert = [];
              } else {
                insert = options;
              }
            } else {
              //
              if (
                typeof insert === "string" &&
                (insert.length === 0 || insert === "undefined")
              ) {
                insert = undefined;
              }
              if (String(insert) === "true") {
                insert = true;
              }
              if (String(insert) === "false") {
                insert = false;
              }
              //
            }

            setValues((prev) => ({ ...prev, [blueprint.accessor]: insert }));
          }}
          directSetter={(input: any) => {
            setValues((prev) => {
              const formIt = { ...prev, [blueprint.accessor]: input };
              // console.log(formIt);
              return formIt;
            });
          }}
        />
      ))}
      <Button type="submit">Submit</Button>
      <Button type="reset" color="slate">
        Clear
      </Button>
    </form>
  );
}

const RenderInput = <T extends KeyValueObject>({
  blueprint,
  value,
  onChange,
  directSetter,
}: {
  blueprint: SearchBlueprint<T>;
  value: any;
  onChange: any;
  directSetter: (input: any) => void;
}) => {
  const id = useId();

  if (blueprint.type === "text" || blueprint.type === "number") {
    return (
      <TextInput
        label={blueprint.label}
        key={`input-${blueprint.queryKey}`}
        onChange={onChange}
        type={blueprint.type}
        value={
          typeof value === "undefined"
            ? ""
            : Array.isArray(value)
            ? value.join(",")
            : value
        }
      />
    );
  }

  if (blueprint.type === "single-dropdown") {
    const getValue = () => {
      if (typeof value !== "undefined") {
        const item = value;
        const find = blueprint.options.find((el) => el.value === item);
        return find;
      }

      return undefined;
    };
    const getPlaceholder = () => {
      const find = blueprint.options.find((el) => el.isPlaceholder);
      if (find) {
        return find;
      }
      return undefined;
    };
    return (
      <SelectInput
        label={blueprint.label}
        key={`input-${blueprint.queryKey}`}
        options={blueprint.options}
        value={getValue()}
        onSelect={(item) => {
          if (item) {
            directSetter(item?.value);
          }
        }}
        placeHolderSchema={getPlaceholder()}
      />
    );
  }

  if (blueprint.type === "multiple-dropdown") {
    const getValues = () => {
      if (Array.isArray(value)) {
        const sendItems: TSelectInputOption[] = [];
        value.forEach((item) => {
          const found = blueprint.options.find(
            (option) => option.value === item
          );
          if (found) {
            sendItems.push(found);
          }
        });
        return sendItems;
      }
      return [];
    };
    const getPlaceholder = () => {
      const find = blueprint.options.find(
        (el) => typeof el.value === "undefined"
      );
      if (find) {
        return find;
      }
      return undefined;
    };

    return (
      <MultiSelectInput
        label={blueprint.label}
        key={`input-${blueprint.queryKey}`}
        values={getValues()}
        onSelect={(selectValues) => {
          const allUndefined = selectValues.filter(
            (item) => item.value === undefined
          );
          const allIsSelectAll = allUndefined.filter((e) => e.isSelectAll);

          if (allIsSelectAll.length > 0) {
            if (selectValues.length === blueprint.options.length) {
              directSetter([]);
            } else {
              directSetter([...blueprint.options.map((e) => e.value)]);
            }
            return;
          } else if (
            selectValues.map((item) => item.value).includes("undefined")
          ) {
            directSetter([]);
            return;
          }

          directSetter(selectValues.map((item) => item.value));
        }}
        options={blueprint.options}
        placeHolderSchema={getPlaceholder()}
      />
    );
  }

  // if (blueprint.type === "date") {
  //   return (
  //     <TextInput
  //       type="date"
  //       key={`input-${blueprint.queryKey}-${typeof value}`}
  //       label={blueprint.label}
  //       name={blueprint.queryKey}
  //       value={typeof value === "undefined" ? "" : value}
  //       onChange={onChange}
  //     />
  //   );
  // }

  if (blueprint.type === "date") {
    return (
      <DatePicker
        selected={
          typeof value === "undefined" || value === null
            ? undefined
            : new Date(value)
        }
        placeholderText={blueprint.label}
        name={blueprint.queryKey}
        onChange={(date) => {
          if (date) {
            directSetter(date);
          } else {
            directSetter(undefined);
          }
        }}
      />
    );
  }

  if (blueprint.type === "hidden") {
    return (
      <input
        id={id}
        key={`input-${blueprint.queryKey}`}
        type="hidden"
        name={blueprint.queryKey}
        value={value}
      />
    );
  }

  return <span key={`input-${blueprint.queryKey}`}>none</span>;
};

export default ModuleSearchFilters;
