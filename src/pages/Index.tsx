import { Link } from "@tanstack/react-router";
import { useAuth } from "react-oidc-context";
import Protector from "../routes/Protector";

function Index() {
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

  return (
    <Protector>
      <h1 className="text-red-400">Home</h1>
      <p>
        <Link to="/agreements">Agreements Page</Link>
      </p>
      <div className="mt-10">
        {isAuthed ? (
          <div>
            <p>You are logged in</p>
            <p>Hello {auth.user?.profile.sub}</p>
            <pre className="overflow-hidden text-xs">
              {JSON.stringify(auth.user, null, 2)}
            </pre>

            <p>
              <button onClick={() => void auth.removeUser()}>Log out</button>
            </p>
          </div>
        ) : (
          <div>
            <p>Not logged in</p>
            <p>
              <button onClick={() => void auth.signinRedirect()}>Log in</button>
            </p>
          </div>
        )}
      </div>
    </Protector>
  );
}

export default Index;
