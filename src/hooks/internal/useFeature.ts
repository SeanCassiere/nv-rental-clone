import { useGetClientFeatures } from "../network/client/useGetClientFeatures";

export function useFeature(
  featureName: string,
  defaultValue: string | null = null
) {
  const features = useGetClientFeatures();

  if (features.status === "loading" || features.status === "error") {
    return defaultValue;
  }

  const feature = features.data?.find(
    (feature) =>
      String(feature.featureName).toLowerCase() ===
      String(featureName).toLowerCase()
  );

  if (!feature) {
    return defaultValue;
  }

  return feature.value;
}
