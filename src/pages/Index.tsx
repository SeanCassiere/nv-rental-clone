import { Link } from "@tanstack/react-router";
import { useAuth } from "react-oidc-context";
import { useGetUserProfile } from "../hooks/network/useGetUserProfile";
import Protector from "../routes/Protector";

function Index() {
  const auth = useAuth();

  const isAuthed = auth.isAuthenticated;

  const userQuery = useGetUserProfile();

  return (
    <Protector>
      <h1 className="text-red-400">Home</h1>
      <p>
        <Link to="/agreements" search={() => ({ page: 1, size: 10 })}>
          Agreements Page
        </Link>
      </p>
      <div className="mt-5 mb-5 border border-red-400">
        <pre className="min-h-[50px] overflow-hidden text-xs">
          {JSON.stringify(userQuery.data, null, 2)}
        </pre>
      </div>
      <div className="mt-10">
        {isAuthed ? (
          <div>
            <p>You are logged in</p>
            <p>Hello {auth.user?.profile.sub}</p>
            <pre className="overflow-hidden text-xs">
              {JSON.stringify(auth.user, null, 2)}
            </pre>

            <p>
              <button
                onClick={() => {
                  auth.signoutRedirect();
                }}
              >
                Log out
              </button>
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
