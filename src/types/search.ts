import { AppPrimaryModuleType } from "./General";

export type GlobalSearchReturnType = {
  module: AppPrimaryModuleType;
  referenceId: string;
  displayText: string;
  fullDisplayText: string;
}[];
