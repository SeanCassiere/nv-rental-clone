import { useId, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { type ZodSchema } from "zod";
import {
  TextInput,
  MultiSelectInput,
  SelectInput,
  type TSelectInputOption,
} from "../Form";
import { Button } from "../Form/Button";
type KeyValueObject = { [key: string]: any };

function makeJsonSafe<T extends KeyValueObject>(data: T, originalData: any) {
  const parse = Object.entries(data).reduce((acc, [key, value]) => {
    let storeValue = value;

    if (
      String(value).trim() === "undefined" ||
      String(value).trim() === "" ||
      typeof value === "undefined"
    )
      return acc;

    if (Array.isArray(originalData[key]) && typeof value === "string") {
      storeValue = value.split(",").map((i) => i.trim());
    } else {
      if (String(value) === "true") {
        storeValue = true;
      }
      if (String(value) === "false") {
        storeValue = false;
      }

      if (typeof value === "string" && /^\d+$/.test(String(value))) {
        storeValue = parseInt(value);
      }
    }

    return {
      ...acc,
      [key]: storeValue,
    };
  }, {});
  return parse;
}

function makeBackToArray(data: any, originalData: any) {
  const parsed = [...Object.entries(data)].reduce((prev, [key, value]) => {
    let useableValue = value;
    if (Array.isArray(originalData[key]) && typeof value === "string") {
      useableValue = value.split(",").map((i) => i.trim());
    }

    return {
      ...prev,
      [key]: useableValue,
    };
  }, {});

  return parsed;
}

interface BaseBluePrint<T> {
  label: string;
  required: boolean;
  accessor: keyof T;
  name: string;
}

interface TextSearchBlueprint<T extends KeyValueObject>
  extends BaseBluePrint<T> {
  type: "text" | "hidden";
}

interface DateSearchBlueprint<T extends KeyValueObject>
  extends BaseBluePrint<T> {
  type: "date";
}

interface NumberSearchBlueprint<T extends KeyValueObject>
  extends BaseBluePrint<T> {
  type: "number";
}

interface SingleDropdownSearchBlueprint<T extends KeyValueObject>
  extends BaseBluePrint<T> {
  type: "single-dropdown";
  options: { value: string; label: string }[];
}

interface MultipleDropdownSearchBlueprint<T extends KeyValueObject>
  extends BaseBluePrint<T> {
  type: "multiple-dropdown";
  options: { value: string; label: string }[];
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
  persistSearchFilters: { [key: string]: any };
  toLocation: string;
  queryFilterKey: string;
}

function ModuleSearchFilters<T extends KeyValueObject>(
  props: ModuleSearchFiltersProps<T>
) {
  const router = useRouter();

  const [values, setValues] = useState(props.initialValues);
  return (
    <form
      className="grid grid-cols-1 items-end gap-2 md:grid-cols-4 lg:grid-cols-6"
      onReset={(evt) => {
        evt.preventDefault();
        router.navigate<any>({
          to: props.toLocation as any,
          search: {
            ...props.persistSearchFilters,
            [props.queryFilterKey]: undefined,
          },
        });
      }}
      onSubmit={(evt) => {
        evt.preventDefault();

        const insert = makeBackToArray(values, props.initialValues);

        const result = props.validationSchema.safeParse(insert);

        if (!result.success) {
          console.error("failed submitting module filters\n\n", result.error);
          return;
        }

        const secondInsert = makeBackToArray(result.data, props.initialValues);

        const jsonSafe = makeJsonSafe(secondInsert, props.initialValues);

        router.navigate<any>({
          to: props.toLocation as any,
          search: {
            ...props.persistSearchFilters,
            [props.queryFilterKey]: jsonSafe,
          } as any,
        });
      }}
    >
      {props.searchFiltersBlueprint.map((blueprint, idx) => (
        <RenderInput
          key={`input-${blueprint.name}-${idx}-${
            props.initialValues[blueprint.accessor]
          }`}
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
            setValues((prev) => ({ ...prev, [blueprint.accessor]: input }));
          }}
        />
      ))}
      <Button type="submit">Submit</Button>
      <Button type="reset" color="gray">
        Clear
      </Button>
      {/* <div className="col-span-1 overflow-y-auto text-xs sm:col-span-2 md:col-span-5">
        {JSON.stringify(values)}
      </div> */}
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
        key={`input-${blueprint.name}`}
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
        const item = `${value}`;
        const find = blueprint.options.find((el) => el.value === item);
        return find;
      }

      return undefined;
    };
    return (
      <SelectInput
        label={blueprint.label}
        key={`input-${blueprint.name}-${typeof value}`}
        options={blueprint.options}
        value={typeof value === "undefined" ? undefined : getValue()}
        onSelect={(item) => {
          onChange({ target: { value: item ? item.value : undefined } });
        }}
        includeBlank={false}
      />
    );
  }

  if (blueprint.type === "multiple-dropdown") {
    const getValues = () => {
      if (Array.isArray(value)) {
        const sendItems: TSelectInputOption[] = [];
        value.forEach((item) => {
          const found = blueprint.options.find(
            (option) => option.value === `${item}`
          );
          if (found) {
            sendItems.push(found);
          }
        });
        return sendItems;
      }
      return [];
    };

    return (
      <MultiSelectInput
        label={blueprint.label}
        key={`input-${blueprint.name}-${typeof value}`}
        values={getValues()}
        onSelect={(selectValues) => {
          if (selectValues.map((item) => item.value).includes("undefined")) {
            directSetter([]);
            return;
          }

          directSetter(selectValues.map((item) => item.value));
        }}
        options={blueprint.options}
        includeBlank={false}
      />
    );
  }

  if (blueprint.type === "date") {
    return (
      <TextInput
        type="date"
        key={`input-${blueprint.name}-${typeof value}`}
        label={blueprint.label}
        name={blueprint.name}
        value={typeof value === "undefined" ? "" : value}
        onChange={onChange}
      />
    );
  }

  if (blueprint.type === "hidden") {
    return <input id={id} type="hidden" name={blueprint.name} value={value} />;
  }

  return <span>none</span>;
};

export default ModuleSearchFilters;
