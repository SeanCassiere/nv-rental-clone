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

export type FeatureFlag = StringFeatureFlag | DropdownFeatureFlag;

export type FeatureFlags<TFlag = FeatureFlag> = TFlag[];

export const dashboardLayoutFeatureFlag: DropdownFeatureFlag = {
  id: "dashboard.layout",
  name: "Dashboard layout",
  description:
    "Toggle this feature to dynamically change the structure and arrangement of the dashboard, enhancing the overall user experience and making relevant information more accessible.",
  input_type: "dropdown",
  default_value: "v1",
  options: ["v1", "v2"],
} as const;

export const featureFlags: FeatureFlags = [dashboardLayoutFeatureFlag] as const;
