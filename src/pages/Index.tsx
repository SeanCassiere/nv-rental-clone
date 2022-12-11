import { useAuth } from "react-oidc-context";
import AppShell from "../components/app-shell";
import { useGetUserProfile } from "../hooks/network/useGetUserProfile";
import Protector from "../routes/Protector";

function Index() {
  const auth = useAuth();

  const isAuthed = auth.isAuthenticated;

  const userQuery = useGetUserProfile();

  return (
    <Protector>
      <AppShell>
        <div className="py-6">
          <div className="mx-auto max-w-full px-4 sm:px-6 md:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          </div>
          <div className="mx-auto max-w-full px-4 sm:px-6 md:px-8">
            <div>
              {isAuthed ? (
                <div>
                  <p>You are logged in</p>
                  <p>Hello {auth.user?.profile.sub}</p>
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
                    <button onClick={() => void auth.signinRedirect()}>
                      Log in
                    </button>
                  </p>
                </div>
              )}
            </div>

            <div className="py-4">
              <div className="my-5 border-4 border-dashed border-gray-200">
                <pre className="min-h-[50px] overflow-x-scroll text-sm">
                  {JSON.stringify(userQuery.data, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </AppShell>
    </Protector>
  );
}

export default Index;
