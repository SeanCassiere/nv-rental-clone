import { useEffect } from "react";
import { useAuth, hasAuthParams } from "react-oidc-context";

import { LS_OIDC_REDIRECT_URI_KEY } from "../utils/constants";

function Protector({ children }: { children: React.ReactNode }) {
  const auth = useAuth();

  useEffect(() => {
    if (
      !hasAuthParams() &&
      !auth.isAuthenticated &&
      !auth.activeNavigator &&
      !auth.isLoading
    ) {
      const redirectUri = window.location.pathname + window.location.search;
      window.localStorage.setItem(LS_OIDC_REDIRECT_URI_KEY, redirectUri);
      auth.signinRedirect();
    }
  }, [
    auth.isAuthenticated,
    auth.activeNavigator,
    auth.isLoading,
    auth.signinRedirect,
    auth,
  ]);

  useEffect(() => {
    return auth.events.addAccessTokenExpiring(() => {
      auth.signinSilent();
    });
  }, [auth, auth.events, auth.signinSilent]);

  useEffect(() => {
    return auth.events.addAccessTokenExpired(() => {
      auth.signinSilent();
    });
  }, [auth, auth.events, auth.signinSilent]);

  switch (auth.activeNavigator) {
    case "signinSilent":
      return <div>Signing you in...</div>;
    case "signoutRedirect":
      return <div>Signing you out...</div>;
  }

  if (auth.isLoading) {
    return <div>Auth is loading...</div>;
  }

  if (auth.error) {
    auth.clearStaleState();
  }

  const isAuthenticated = auth.isAuthenticated;

  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <div>Protector auth loading...</div>
  );
}

export default Protector;
