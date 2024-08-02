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
const incompleteAgreementCustomerSignatureFeatureFlag: SwitchFeatureFlag = {
  id: "incomplete_agreement.customer.signature",
  name: "Accept digital signatures from the drivers",
  description:
    "Toggle this feature to enable the digital signature acceptance from the drivers.",
  input_type: "switch",
  default_value: false,
} as const;
// Features END

const featureFlags: FeatureFlags = [
  incompleteSettingsNavigationFeatureFlag,
  incompleteApplicationSettingsTabsFeatureFlag,
  incompleteAgreementCustomerSignatureFeatureFlag,
] as const;

export {
  featureFlags, // the array of all the feature flags
  incompleteSettingsNavigationFeatureFlag,
  incompleteApplicationSettingsTabsFeatureFlag,
  incompleteAgreementCustomerSignatureFeatureFlag,
};
