import { useGetClientFeatures } from "@/hooks/network/client/useGetClientFeatures";

type FeatureValue = string | null;
type IsFeaturePresent = boolean;

export function useFeature(
  featureName: string,
  defaultValue: string | null = null
): [FeatureValue, IsFeaturePresent] {
  const features = useGetClientFeatures();

  if (features.status !== "success") {
    return [defaultValue, false];
  }

  const list = features.data?.status === 200 ? features.data?.body : [];

  const feature = list.find(
    (feature) =>
      String(feature.featureName).toLowerCase() ===
      String(featureName).toLowerCase()
  );

  if (!feature) {
    return [defaultValue, false];
  }

  return [feature.value, true];
}
