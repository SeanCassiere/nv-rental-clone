import { useEffect } from "react";
import { useRouter } from "@tanstack/react-router";
import { useAuth } from "react-oidc-context";

import { LS_OIDC_REDIRECT_URI_KEY } from "@/utils/constants";

function ProtectorShield({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    return auth.events.addAccessTokenExpiring(() => {
      const redirectUri =
        router.history.location.pathname + router.history.location.search;
      window.localStorage.setItem(LS_OIDC_REDIRECT_URI_KEY, redirectUri);
      auth.startSilentRenew();
    });
  }, [
    auth,
    auth.events,
    auth.startSilentRenew,
    router.history.location.pathname,
    router.history.location.search,
  ]);

  useEffect(() => {
    return auth.events.addAccessTokenExpired(() => {
      const redirectUri =
        router.history.location.pathname + router.history.location.search;
      window.localStorage.setItem(LS_OIDC_REDIRECT_URI_KEY, redirectUri);
      auth.signinRedirect();
    });
  }, [
    auth,
    auth.events,
    auth.signoutRedirect,
    router.history.location.pathname,
    router.history.location.search,
  ]);

  useEffect(() => {
    return auth.events.addSilentRenewError(() => {
      auth.signoutRedirect();
    });
  }, [auth, auth.events]);

  return <>{children}</>;
}

export default ProtectorShield;
