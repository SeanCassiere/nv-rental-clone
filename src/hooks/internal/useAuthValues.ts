import { useAuth } from "react-oidc-context";

export function useAuthValues(): {
  isAuthed: boolean;
  accessToken: string;
  userId: string;
  clientId: string;
} {
  const auth = useAuth();

  if (!auth.isAuthenticated || !auth.user) {
    return {
      isAuthed: false,
      accessToken: "",
      userId: "",
      clientId: "",
    };
  }

  return {
    isAuthed: true,
    accessToken: auth.user.access_token,
    clientId: auth.user.profile.navotar_clientid,
    userId: auth.user.profile.navotar_userid,
  };
}
