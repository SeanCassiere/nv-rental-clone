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
  onTabClick?: (tab: ModuleTabConfigItem) => void;
}) => {
  const index = props.startingIndex || 0;

  const handleChangeIndex = (changingIndex: number) => {
    if (props.onTabClick && props.tabConfig[changingIndex]) {
      props.onTabClick(props.tabConfig[changingIndex]!);
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
        <Tab.List className="mt-2 mb-2.5 flex w-max max-w-full gap-1 overflow-x-auto rounded py-1.5">
          {props.tabConfig.map((item) => (
            <Tab key={`tab-header-${item.id}`} as={Fragment}>
              {({ selected }) => (
                <button
                  className={classNames(
                    selected
                      ? "bg-slate-100 text-slate-600 hover:shadow-sm"
                      : "font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700",
                    "inline-block min-w-[100px] shrink-0 rounded px-3 py-2 text-sm font-medium transition-all duration-200 ease-in-out",
                    selected ? "" : ""
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
