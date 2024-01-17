import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import { getAuthFromAuthHook } from "@/utils/auth";
import { fetchFeaturesForClientOptions } from "@/utils/query/client";

type FeatureValue = string | null;
type IsFeaturePresent = boolean;

export function useFeature(
  featureName: string,
  defaultValue: string | null = null
): [FeatureValue, IsFeaturePresent] {
  const auth = useAuth();
  const authParams = getAuthFromAuthHook(auth);

  const features = useQuery(
    fetchFeaturesForClientOptions({ auth: authParams })
  );

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
