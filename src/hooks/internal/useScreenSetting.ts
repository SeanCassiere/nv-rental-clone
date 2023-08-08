import { useGetClientScreenSettings } from "@/hooks/network/client/useGetClientScreenSettings";

import type { TClientScreenSetting } from "@/schemas/client";

type ListOfSettings = TClientScreenSetting[];
type SingleScreenSetting = TClientScreenSetting | null;

function useScreenSetting(
  screenName: string,
  sectionName: string,
  fieldName: string
): SingleScreenSetting;
function useScreenSetting(
  screenName: string,
  sectionName: string
): ListOfSettings;
function useScreenSetting(screenName: string): ListOfSettings;
function useScreenSetting(
  screenName?: string,
  sectionName?: string,
  fieldName?: string
): ListOfSettings;
function useScreenSetting(
  screenName?: string,
  sectionName?: string,
  fieldName?: string
): ListOfSettings | SingleScreenSetting {
  const settingsQuery = useGetClientScreenSettings();

  if (settingsQuery.status !== "success") {
    if (screenName && sectionName && fieldName) {
      return null;
    }
    return [];
  }

  const settings =
    settingsQuery.data.status === 200 ? settingsQuery.data.body : [];

  if (screenName && sectionName && fieldName) {
    return (
      settings.find(
        (setting) =>
          String(setting.screenName).toLowerCase() ===
            screenName.toLowerCase() &&
          String(setting.sectionName).toLowerCase() ===
            sectionName.toLowerCase() &&
          String(setting.fieldName).toLowerCase() === fieldName.toLowerCase()
      ) || null
    );
  }

  if (screenName && sectionName) {
    return settings.filter(
      (setting) =>
        String(setting.screenName).toLowerCase() === screenName.toLowerCase() &&
        String(setting.sectionName).toLowerCase() === sectionName.toLowerCase()
    );
  }

  if (screenName) {
    return settings.filter(
      (setting) =>
        String(setting.screenName).toLowerCase() === screenName.toLowerCase()
    );
  }

  return settings;
}

export { useScreenSetting };
