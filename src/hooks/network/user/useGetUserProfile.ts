import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { fetchUserProfile } from "../../../api/users";
import type { UserProfileType } from "../../../types/User";

export function useGetUserProfile() {
  const auth = useAuth();
  const query = useQuery<UserProfileType>({
    queryKey: ["users", "me"],
    queryFn: () =>
      fetchUserProfile({
        clientId: auth.user?.profile.navotar_clientid || "",
        userId: auth.user?.profile.navotar_userid || "",
        accessToken: auth.user?.access_token || "",
      }),
    enabled: auth.isAuthenticated,
  });
  return query;
}
