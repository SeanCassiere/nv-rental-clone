import { type ReactNode, Suspense, Fragment } from "react";
import { Tab } from "@headlessui/react";

import { cn } from "@/utils";

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
        <Tab.List
          className={cn(
            "mt-2 mb-2.5 flex w-max max-w-full gap-1 overflow-x-auto rounded py-1.5",
          )}
        >
          {props.tabConfig.map((item) => (
            <Tab key={`tab-header-${item.id}`} as={Fragment}>
              {({ selected }) => (
                <button
                  className={cn(
                    selected
                      ? "bg-slate-100 text-slate-600 hover:shadow-sm"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-700",
                    "inline-block min-w-[100px] shrink-0 rounded px-3 py-2 text-sm font-semibold outline-none transition-all duration-200 ease-in-out focus:outline-none focus:ring focus:ring-inset focus:ring-slate-200",
                  )}
                >
                  {item.label}
                </button>
              )}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className={cn("w-full")}>
          {props.tabConfig.map((item) => (
            <Tab.Panel
              key={`tab-panel-${item.id}`}
              className="outline-none ring-0 focus:outline-none focus:ring-0"
            >
              <Suspense fallback={<div className="min-h-[400px]"></div>}>
                {isTabIndexSelected(item.id) && <>{item.component}</>}
              </Suspense>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};
