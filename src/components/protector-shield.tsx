import { useEffect } from "react";
import { Navigate, useRouter } from "@tanstack/react-router";
import { useAuth } from "react-oidc-context";

import { LS_OIDC_REDIRECT_URI_KEY } from "@/utils/constants";

function ProtectorShield({ children }: { children: React.ReactNode }) {
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
      // auth.signinSilent();
      auth.startSilentRenew();
    });
  }, [
    auth,
    auth.events,
    // auth.signinSilent,
    auth.startSilentRenew,
    router.history.location.pathname,
    router.history.location.search,
  ]);

  useEffect(() => {
    return auth.events.addAccessTokenExpired(() => {
      const redirectUri =
        router.history.location.pathname + router.history.location.search;
      window.localStorage.setItem(LS_OIDC_REDIRECT_URI_KEY, redirectUri);
      // auth.signinSilent();
      auth.signinRedirect();
    });
  }, [
    auth,
    auth.events,
    // auth.signinSilent,
    auth.signoutRedirect,
    router.history.location.pathname,
    router.history.location.search,
  ]);

  useEffect(() => {
    return auth.events.addSilentRenewError(() => {
      auth.signoutRedirect();
    });
  }, [auth, auth.events]);

  if (!auth.isAuthenticated) {
    return (
      <Navigate
        to="/oidc-callback"
        search={() => ({ redirect: router.state.location.href })}
      />
    );
  }

  return <>{children}</>;
}

export default ProtectorShield;
