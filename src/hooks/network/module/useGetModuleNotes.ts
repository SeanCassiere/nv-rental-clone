import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import type { AppPrimaryModuleType } from "@/types/General";

import { apiClient } from "@/api";

import { allModulesKeySelector } from "./useGetModuleColumns";

export function useGetModuleNotes({
  module,
  referenceId,
}: {
  module: AppPrimaryModuleType;
  referenceId: string;
}) {
  const auth = useAuth();

  const query = useQuery({
    queryKey: allModulesKeySelector(module).notes(referenceId),
    queryFn: () =>
      apiClient.note.getListForRefId({
        params: {
          referenceType: module,
          referenceId,
        },
        query: {
          clientId: auth.user?.profile.navotar_clientid || "",
        },
      }),
    enabled: auth.isAuthenticated,
  });

  return query;
}
