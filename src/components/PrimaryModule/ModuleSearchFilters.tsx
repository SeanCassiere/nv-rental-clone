import { useId, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { type ZodSchema } from "zod";

type KeyValueObject = { [key: string]: any };

function makeJsonSafe<T extends KeyValueObject>(data: T) {
  const parse = Object.entries(data).reduce((acc, [key, value]) => {
    let storeValue = value;
    if (
      String(value).trim() === "undefined" ||
      String(value).trim() === "" ||
      typeof value === "undefined"
    )
      return acc;

    if (String(value) === "true") {
      storeValue = true;
    }
    if (String(value) === "false") {
      storeValue = false;
    }
    if (typeof value === "string" && /^\d+$/.test(String(value))) {
      storeValue = parseInt(value);
    }

    return {
      ...acc,
      [key]: storeValue,
    };
  }, {});
  return parse;
}

interface BaseBluePrint<T> {
  label: string;
  required: boolean;
  accessor: keyof T;
  name: string;
}

interface TextSearchBlueprint<T extends KeyValueObject>
  extends BaseBluePrint<T> {
  type: "text";
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

type SearchBlueprint<T extends KeyValueObject> =
  | TextSearchBlueprint<T>
  | NumberSearchBlueprint<T>
  | SingleDropdownSearchBlueprint<T>
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
      className="grid grid-cols-1 gap-2 md:grid-cols-4 lg:grid-cols-6"
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

        const result = props.validationSchema.safeParse(values);

        if (!result.success) {
          console.error("failed submitting module filters\n\n", result.error);
          return;
        }

        const jsonSafe = makeJsonSafe(values);

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
          key={`input-${blueprint.name}-${idx}`}
          blueprint={blueprint}
          value={values[blueprint.accessor]}
          onChange={(evt: any) => {
            let insert = evt.target.value;
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

            setValues((prev) => ({ ...prev, [blueprint.accessor]: insert }));
          }}
        />
      ))}
      <button type="submit" className="bg-teal-500 px-4 py-1 text-white">
        Submit
      </button>
      <button type="reset" className="bg-gray-500 px-4 py-1 text-white">
        Clear
      </button>
      <div className="col-span-1 overflow-scroll text-xs sm:col-span-2 md:col-span-5">
        {JSON.stringify(values)}
      </div>
    </form>
  );
}

const RenderInput = <T extends KeyValueObject>({
  blueprint,
  value,
  onChange,
}: {
  blueprint: SearchBlueprint<T>;
  value: any;
  onChange: any;
}) => {
  const id = useId();

  if (blueprint.type === "text" || blueprint.type === "number") {
    return (
      <div className="grid">
        <label htmlFor={id}>{blueprint.label}</label>
        <input
          id={id}
          type="text"
          name={blueprint.name}
          value={typeof value === "undefined" ? "" : value}
          onChange={onChange}
        />
      </div>
    );
  }

  if (blueprint.type === "single-dropdown") {
    return (
      <div className="grid">
        <label htmlFor={id}>{blueprint.label}</label>
        <select
          id={id}
          name={blueprint.name}
          value={typeof value === "undefined" ? "" : value}
          onChange={onChange}
        >
          {blueprint.options.map((option: any, idx) => (
            <option key={`${blueprint.name}-${idx}`} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (blueprint.type === "date") {
    return (
      <div className="grid">
        <label htmlFor={id}>{blueprint.label}</label>
        <input
          id={id}
          type="date"
          name={blueprint.name}
          value={typeof value === "undefined" ? "" : value}
          onChange={onChange}
        />
      </div>
    );
  }

  return <span>none</span>;
};

export default ModuleSearchFilters;
