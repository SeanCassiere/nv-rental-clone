import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { useRouter } from "@tanstack/router";

import { LS_OIDC_REDIRECT_URI_KEY } from "@/utils/constants";

function Protector({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (
      auth.isAuthenticated ||
      router.history.location.pathname.startsWith("/oidc-callback")
    )
      return;

    const redirection =
      router.history.location.pathname + router.history.location.search;
    const includesOidcCallback = redirection.includes("oidc-callback");

    router.navigate({
      to: "/oidc-callback",
      search: () => {
        return {
          redirect: !includesOidcCallback ? redirection : "/",
        };
      },
    });
  }, [auth.isAuthenticated, router]);

  useEffect(() => {
    return auth.events.addAccessTokenExpiring(() => {
      const redirectUri =
        router.history.location.pathname + router.history.location.search;
      window.localStorage.setItem(LS_OIDC_REDIRECT_URI_KEY, redirectUri);
      auth.signinSilent();
    });
  }, [
    auth,
    auth.events,
    auth.signinSilent,
    router.history.location.pathname,
    router.history.location.search,
  ]);

  useEffect(() => {
    return auth.events.addAccessTokenExpired(() => {
      const redirectUri =
        router.history.location.pathname + router.history.location.search;
      window.localStorage.setItem(LS_OIDC_REDIRECT_URI_KEY, redirectUri);
      auth.signinSilent();
    });
  }, [
    auth,
    auth.events,
    auth.signinSilent,
    router.history.location.pathname,
    router.history.location.search,
  ]);

  return <>{children}</>;
}

export default Protector;
