import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { fetchNotesForModule } from "../../../api/notes";

import { type AppPrimaryModuleType } from "../../../types/General";
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
      fetchNotesForModule({
        clientId: auth.user?.profile.navotar_clientid || "",
        // userId: auth.user?.profile.navotar_userid || "",
        accessToken: auth.user?.access_token || "",
        module,
        referenceId,
      }).catch((e) => {
        console.error(e);
      }),
    enabled: auth.isAuthenticated,
    initialData: [],
  });

  return query;
}
