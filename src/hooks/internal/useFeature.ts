import { useGetClientFeatures } from "../network/client/useGetClientFeatures";

type FeatureValue = string | null;
type IsFeaturePresent = boolean;

export function useFeature(
  featureName: string,
  defaultValue: string | null = null
): [FeatureValue, IsFeaturePresent] {
  const features = useGetClientFeatures();

  if (features.status === "loading" || features.status === "error") {
    return [defaultValue, false];
  }

  const feature = features.data?.find(
    (feature) =>
      String(feature.featureName).toLowerCase() ===
      String(featureName).toLowerCase()
  );

  if (!feature) {
    return [defaultValue, false];
  }

  return [feature.value, true];
}
