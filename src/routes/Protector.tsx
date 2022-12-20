import { useAuth } from "react-oidc-context";

import { LS_OIDC_REDIRECT_URI_KEY } from "../utils/constants";

function Protector({ children }: { children: React.ReactNode }) {
  const auth = useAuth();

  switch (auth.activeNavigator) {
    case "signinRedirect":
      console.log("signinRedirect");
      break;
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

  if (auth.isLoading === false && isAuthenticated === false) {
    const redirectUri = window.location.pathname + window.location.search;
    window.localStorage.setItem(LS_OIDC_REDIRECT_URI_KEY, redirectUri);
    auth.signinRedirect().then(() => {
      console.log("signinRedirect");
    });
  }

  return isAuthenticated ? <>{children}</> : null;
}

export default Protector;
