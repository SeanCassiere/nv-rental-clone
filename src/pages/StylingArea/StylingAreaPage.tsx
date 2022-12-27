import React, { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import classNames from "classnames";
import { TextInput } from "../../components/Form";

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

type Person = typeof people[number];

const StylingAreaPage: React.FC = () => {
  const [selectedPeople, setSelectedPeople] = React.useState<Person["name"][]>([
    people[0].name,
    people[1].name,
  ]);

  const [selectedPerson, setSelectedPerson] = React.useState<string | null>(
    null
  );

  const [textValue, setTextValue] = React.useState("");

  return (
    <div className="h-full divide-y-2 divide-teal-400 bg-gray-200 px-2">
      <section className="py-10 md:mx-28">
        <h2 className="text-2xl">Multi-Select</h2>
        <div className="relative w-[220px]">
          <Listbox
            value={selectedPeople}
            onChange={(items) => {
              console.log("items", items);
              setSelectedPeople(items);
            }}
            name="persons"
            multiple
          >
            {({ open }) => (
              <>
                <Listbox.Label>Persons:</Listbox.Label>
                <Listbox.Button
                  key={`persons-${selectedPeople.length}`}
                  as="input"
                  className="relative w-full truncate rounded-sm border border-gray-300"
                  defaultValue={
                    selectedPeople.length > 0
                      ? selectedPeople.join(", ")
                      : "Select"
                  }
                  readOnly
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
                    {people
                      .map((p) => p.name)
                      .map((person) => (
                        <Listbox.Option
                          key={person}
                          value={person}
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
                              {person}
                              {selected && " <"}
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
        <h2 className="text-2xl">Single-Select</h2>
        <div className="relative w-[220px]">
          <Listbox
            value={selectedPerson}
            onChange={(item) => {
              console.log("item", item);
              setSelectedPerson((prev) => (prev === item ? null : item));
            }}
            name="person"
          >
            {({ open }) => (
              <>
                <Listbox.Label>Person:</Listbox.Label>
                <Listbox.Button
                  key={`person-${(selectedPerson || "").length}`}
                  as="input"
                  className="relative w-full truncate rounded-sm border border-gray-300"
                  defaultValue={selectedPerson ? selectedPerson : "Select"}
                  readOnly
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
                    {(people as unknown as any[])
                      .map((p) => p.name)
                      .map((person) => (
                        <Listbox.Option
                          key={person}
                          value={person}
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
                              {person}
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
        <h2 className="text-2xl">TextInput</h2>
        <div className="relative my-2 w-full">
          <TextInput
            label="Name"
            value={textValue}
            onChange={(evt) => setTextValue(evt.target.value)}
            required
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
    </div>
  );
};

export default StylingAreaPage;
