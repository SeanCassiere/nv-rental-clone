import React, { useEffect, useState } from "react";
import {
  TextInput,
  SelectInput,
  MultiSelectInput,
  Button,
  type TSelectInputOption,
  DatePicker,
} from "../../components/Form";
import { titleMaker } from "../../utils/title-maker";
import JsURLDecoder from "./JsURLDecoder";

const people = [
  { id: 1, name: "Durward Reynolds" },
  { id: 2, name: "Kenton Towne" },
  { id: 3, name: "Therese Wunsch" },
  { id: 4, name: "Benedict Kessler" },
  { id: 5, name: "Katelyn Rohan" },
  { id: 6, name: "William Sullivan" },
  { id: 7, name: "Vera Bartow" },
  { id: 8, name: "Andy FFFFFFFFFFF Trip" },
  { id: 9, name: "Robert Fowles" },
  { id: 10, name: "Troy McClaine" },
] as const;

const StylingAreaPage: React.FC = () => {
  const [selectedPeople, setSelectedPeople] = React.useState<
    TSelectInputOption[]
  >([
    { label: people[0].name, value: `${people[0].id}` },
    { label: people[1].name, value: `${people[1].id}` },
  ]);

  const [selectedPerson, setSelectedPerson] =
    React.useState<TSelectInputOption | null>(null);

  const [textValue, setTextValue] = React.useState("");

  const [date, setDate] = useState<Date | null>(null);

  useEffect(() => {
    document.title = titleMaker("Styling Area");
  }, []);

  return (
    <div className="h-full divide-y-2 divide-slate-200 overflow-y-auto bg-slate-50 px-2">
      <section className="py-10 md:mx-28">
        <h2 className="text-2xl">JSURL Utils</h2>
        <JsURLDecoder />
      </section>

      <section className="grid grid-cols-1 gap-4 py-10 md:mx-28 md:grid-cols-2">
        <div>
          <h2 className="text-2xl">Multi-Select</h2>
          <div className="relative">
            <MultiSelectInput
              values={selectedPeople}
              options={people.map((item) => ({
                label: item.name,
                value: `${item.id}`,
              }))}
              onSelect={(items) => {
                setSelectedPeople(items);
              }}
              label="People"
            />
          </div>
          <div>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione
              iure nam facilis tempora ducimus temporibus, numquam culpa
              voluptatibus, quia nostrum, minus at! Soluta quos ducimus ipsa
              nemo eaque dolores itaque?
            </p>
          </div>
        </div>
        <div>
          <h2 className="text-2xl">Single-Select</h2>
          <div className="relative">
            <SelectInput
              label="Person"
              value={selectedPerson}
              options={people.map((person) => ({
                value: `${person.id}`,
                label: person.name,
              }))}
              onSelect={(item) => {
                if (typeof item === "undefined") return;
                setSelectedPerson(item);
              }}
            />
          </div>
          <div>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione
              iure nam facilis tempora ducimus temporibus, numquam culpa
              voluptatibus, quia nostrum, minus at! Soluta quos ducimus ipsa
              nemo eaque dolores itaque?
            </p>
          </div>
        </div>
      </section>

      {/*  */}
      <section className="py-10 md:mx-28">
        <h2 className="text-2xl">Dates</h2>
        <DatePicker
          selected={date}
          onChange={(dv) => setDate(dv)}
          label="Select a date"
          placeholderText="Select a date"
        />
      </section>
      {/*  */}

      <section className="py-10 md:mx-28">
        <h2 className="text-2xl">TextInput</h2>
        <div className="relative my-2 w-full">
          <TextInput
            label="Name"
            value={textValue}
            onChange={(evt) => setTextValue(evt.target.value)}
            required
            error={textValue.length > 0}
            errorText={textValue.length ? "Longer than 0" : undefined}
          />
        </div>
        <div>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione
            iure nam facilis tempora ducimus temporibus, numquam culpa
            voluptatibus, quia nostrum, minus at! Soluta quos ducimus ipsa nemo
            eaque dolores itaque?
          </p>
        </div>
      </section>
      <section className="py-10 md:mx-28">
        <h2 className="text-2xl">Button</h2>
        <div className="relative my-2 flex w-full gap-2">
          <Button>Hello World</Button>
          <Button disabled>Hello World</Button>
          <Button color="gray">Hello World</Button>
          <Button color="gray" disabled>
            Hello World
          </Button>
        </div>
        <div>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione
            iure nam facilis tempora ducimus temporibus, numquam culpa
            voluptatibus, quia nostrum, minus at! Soluta quos ducimus ipsa nemo
            eaque dolores itaque?
          </p>
        </div>
      </section>
    </div>
  );
};

export default StylingAreaPage;
