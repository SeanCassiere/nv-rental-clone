import { useAuth } from "react-oidc-context";

function Protector({ children }: { children: React.ReactNode }) {
  const auth = useAuth();

  switch (auth.activeNavigator) {
    case "signinSilent":
      return <div>Signing you in...</div>;
    case "signoutRedirect":
      return <div>Signing you out...</div>;
  }

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    auth.clearStaleState();
  }

  const isAuthed = auth.isAuthenticated;

  return isAuthed ? (
    <>{children}</>
  ) : (
    <div>
      <p>{auth.signinRedirect() as any}</p>
      <p>Not logged in</p>
      <p>
        <button onClick={() => void auth.signinRedirect()}>Log in</button>
      </p>
    </div>
  );
}

export default Protector;
