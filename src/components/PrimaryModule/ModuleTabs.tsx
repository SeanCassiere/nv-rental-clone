import { type ReactNode, Suspense, Fragment } from "react";
import { Tab } from "@headlessui/react";
import classNames from "classnames";

export type ModuleTabConfigItem = {
  id: string;
  label: string;
  component: ReactNode;
};

export const ModuleTabs = (props: {
  tabConfig: ModuleTabConfigItem[];
  startingIndex: number;
  onTabClick?: (tabName: string) => void;
}) => {
  const index = props.startingIndex || 0;

  const handleChangeIndex = (changingIndex: number) => {
    if (props.onTabClick && props.tabConfig[changingIndex]) {
      props.onTabClick(props.tabConfig[changingIndex]!.id);
    }
    // setIndex(changingIndex);
  };

  const isTabIndexSelected = (tabId: string) => {
    const tabConfigItem = props.tabConfig.find((item) => item.id === tabId);
    if (tabConfigItem && props.tabConfig[index]) {
      return tabConfigItem.id === props.tabConfig[index]!.id;
    }
    return false;
  };

  return (
    <div className="w-full">
      <Tab.Group selectedIndex={index} onChange={handleChangeIndex}>
        <Tab.List className="my-2 flex gap-1 overflow-x-scroll py-2 md:px-3">
          {props.tabConfig.map((item, idx) => (
            <Tab key={`tab-header-${item.id}`} as={Fragment}>
              {({ selected }) => (
                <button
                  className={classNames(
                    selected
                      ? "bg-teal-400 font-semibold text-gray-50"
                      : "bg-gray-200 font-medium text-gray-500 hover:bg-gray-300 hover:text-gray-600",
                    "inline-block min-w-[150px] shrink-0 rounded-sm px-4 py-3 text-sm transition-all duration-200 ease-in-out hover:shadow-sm",
                    selected ? "shadow-sm" : ""
                  )}
                >
                  {item.label}
                </button>
              )}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="w-full">
          {props.tabConfig.map((item) => (
            <Tab.Panel key={`tab-panel-${item.id}`}>
              <Suspense
                fallback={
                  <div className="text-aqua-500 text-lg font-semibold">
                    loading component
                  </div>
                }
              >
                {isTabIndexSelected(item.id) && <>{item.component}</>}
              </Suspense>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};
