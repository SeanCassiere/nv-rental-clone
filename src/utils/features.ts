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

export const dashboardMosaicFeatureFlag: DropdownFeatureFlag = {
  id: "dashboard.layout",
  name: "Dashboard layout",
  description:
    "Toggle this feature to dynamically change the structure and arrangement of the dashboard, enhancing the overall user experience and making relevant information more accessible.",
  input_type: "dropdown",
  default_value: "v1",
  options: ["v1", "v2"],
} as const;

export const temp1_dashboardMosaicFeatureFlag: DropdownFeatureFlag = {
  id: "temp1_dashboard.layout",
  name: "Dashboard layout",
  description:
    "Toggle this feature to dynamically change the structure and arrangement of the dashboard, enhancing the overall user experience and making relevant information more accessible.",
  input_type: "dropdown",
  default_value: "v1",
  options: ["v1", "v2"],
} as const;
export const temp2_dashboardMosaicFeatureFlag: DropdownFeatureFlag = {
  id: "temp2_dashboard.layout",
  name: "Dashboard layout",
  description:
    "Toggle this feature to dynamically change the structure and arrangement of the dashboard, enhancing the overall user experience and making relevant information more accessible.",
  input_type: "dropdown",
  default_value: "v1",
  options: ["v1", "v2"],
} as const;
export const temp3_dashboardMosaicFeatureFlag: DropdownFeatureFlag = {
  id: "temp3_dashboard.layout",
  name: "Dashboard layout",
  description:
    "Toggle this feature to dynamically change the structure and arrangement of the dashboard, enhancing the overall user experience and making relevant information more accessible.",
  input_type: "dropdown",
  default_value: "v1",
  options: ["v1", "v2"],
} as const;
export const temp4_dashboardMosaicFeatureFlag: DropdownFeatureFlag = {
  id: "temp4_dashboard.layout",
  name: "Dashboard layout",
  description:
    "Toggle this feature to dynamically change the structure and arrangement of the dashboard, enhancing the overall user experience and making relevant information more accessible.",
  input_type: "dropdown",
  default_value: "v1",
  options: ["v1", "v2"],
} as const;
export const temp5_dashboardMosaicFeatureFlag: DropdownFeatureFlag = {
  id: "temp5_dashboard.layout",
  name: "Dashboard layout",
  description:
    "Toggle this feature to dynamically change the structure and arrangement of the dashboard, enhancing the overall user experience and making relevant information more accessible.",
  input_type: "dropdown",
  default_value: "v1",
  options: ["v1", "v2"],
} as const;

export const featureFlags: FeatureFlags = [
  dashboardMosaicFeatureFlag,
  temp1_dashboardMosaicFeatureFlag,
  temp2_dashboardMosaicFeatureFlag,
  temp3_dashboardMosaicFeatureFlag,
  temp4_dashboardMosaicFeatureFlag,
  temp5_dashboardMosaicFeatureFlag,
] as const;
