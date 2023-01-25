import { type ModuleTabConfigItem } from "../components/PrimaryModule/ModuleTabs";

export function getStartingIndexFromTabName(
  tabName: string,
  tabsConfig: ModuleTabConfigItem[],
  mode: "id" | "label" = "id"
) {
  let index = 0;
  if (mode === "label") {
    index = tabsConfig.findIndex(
      (tab) => tab.label.toLowerCase() === tabName.toLowerCase()
    );
  }
  if (mode === "id") {
    index = tabsConfig.findIndex((tab) => tab.id === tabName);
  }
  return index > -1 ? index : 0;
}
