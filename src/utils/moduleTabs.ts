import { type ModuleTabConfigItem } from "../components/PrimaryModule/ModuleTabs";

export function getStartingIndexFromTabName(
  tabName: string,
  tabsConfig: ModuleTabConfigItem[]
) {
  const index = tabsConfig.findIndex((tab) => tab.id === tabName);
  return index > -1 ? index : 0;
}
