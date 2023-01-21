import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { fetchUserProfile } from "../../../api/users";
import { userQKeys } from "../../../utils/query-key";
import { UserProfileSchema } from "../../../utils/schemas/user";

export function useGetUserProfile() {
  const auth = useAuth();
  const query = useQuery({
    queryKey: userQKeys.me(),
    queryFn: () =>
      fetchUserProfile({
        clientId: auth.user?.profile.navotar_clientid || "",
        userId: auth.user?.profile.navotar_userid || "",
        accessToken: auth.user?.access_token || "",
      }).then((data) => UserProfileSchema.parse(data)),
    enabled: auth.isAuthenticated,
  });
  return query;
}
