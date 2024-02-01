interface BaseFeatureFlag {
  id: string;
  name: string;
  description: string;
}

export interface StringFeatureFlag extends BaseFeatureFlag {
  default_value: string;
  input_type: "string";
}

export interface DropdownFeatureFlag extends BaseFeatureFlag {
  default_value: string;
  input_type: "dropdown";
  options: string[];
}

export interface SwitchFeatureFlag extends BaseFeatureFlag {
  default_value: boolean;
  input_type: "switch";
}

export type FeatureFlag =
  | StringFeatureFlag
  | DropdownFeatureFlag
  | SwitchFeatureFlag;

export type FeatureFlags<TFlag = FeatureFlag> = TFlag[];

// Features START
const dashboardLayoutFeatureFlag: DropdownFeatureFlag = {
  id: "experimental_dashboard.layout",
  name: "Dashboard layout",
  description:
    "Toggle this feature to dynamically change the structure and arrangement of the dashboard, enhancing the overall user experience and making relevant information more accessible.",
  input_type: "dropdown",
  default_value: "v1",
  options: ["v1", "v2"],
} as const;
const experimentalPrimaryModuleSheetPreviewFeatureFlag: SwitchFeatureFlag = {
  id: "experimental_primaryModule.sheet.preview",
  name: "Primary module sheet preview",
  description:
    "Toggle this feature to view a preview of the pages in the primary modules (e.g. Customers, Fleet, Reservations, and Agreements) when clicking their links on the search pages.",
  input_type: "switch",
  default_value: false,
} as const;
const incompleteSettingsNavigationFeatureFlag: SwitchFeatureFlag = {
  id: "incomplete_all.settings.navigation",
  name: "Incomplete settings navigation",
  description:
    "Toggle this feature to enable the incomplete settings navigation, which will display a list of settings routes that are incomplete provided your account has access to them.",
  input_type: "switch",
  default_value: false,
} as const;
const incompleteApplicationSettingsTabsFeatureFlag: SwitchFeatureFlag = {
  id: "incomplete_application.settings.all",
  name: "All incomplete application settings tabs",
  description:
    'Toggle this feature to enable the incomplete "application" settings tabs/panels, which will display a list of settings panels that are incomplete provided your account has access to them.',
  input_type: "switch",
  default_value: false,
} as const;
const incompleteLocationsApplicationSettingsTabFeatureFlag: SwitchFeatureFlag =
  {
    id: "incomplete_application.settings.locations",
    name: "Unfinished locations application settings tab",
    description:
      "Toggle this feature to enable the incomplete locations application settings tab, which will display a list of settings panels that are incomplete provided your account has access to them.",
    input_type: "switch",
    default_value: false,
  } as const;
// Features END

const featureFlags: FeatureFlags = [
  dashboardLayoutFeatureFlag,
  experimentalPrimaryModuleSheetPreviewFeatureFlag,
  incompleteSettingsNavigationFeatureFlag,
  incompleteApplicationSettingsTabsFeatureFlag,
  incompleteLocationsApplicationSettingsTabFeatureFlag,
] as const;

export {
  featureFlags, // the array of all the feature flags
  dashboardLayoutFeatureFlag,
  incompleteSettingsNavigationFeatureFlag,
  incompleteApplicationSettingsTabsFeatureFlag,
  incompleteLocationsApplicationSettingsTabFeatureFlag,
  experimentalPrimaryModuleSheetPreviewFeatureFlag,
};
