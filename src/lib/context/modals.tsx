import * as React from "react";

type SetStateDispatch = React.Dispatch<React.SetStateAction<boolean>>;

const globalDialogContext = React.createContext<{
  // used for the logout alert dialog
  showLogout: boolean;
  setShowLogout: SetStateDispatch;

  // used for the global search command menu (Cmd + K)
  showCommandMenu: boolean;
  setShowCommandMenu: SetStateDispatch;

  // used for the toggling feature flags
  showFeatureFlags: boolean;
  setShowFeatureFlags: SetStateDispatch;
} | null>(null);

export function GlobalDialogProvider(props: React.PropsWithChildren) {
  const [showLogout, setShowLogout] = React.useState(false);
  const [showCommandMenu, setShowCommandMenu] = React.useState(false);
  const [showFeatureFlags, setShowFeatureFlags] = React.useState(false);
  return (
    <globalDialogContext.Provider
      value={{
        showLogout,
        setShowLogout,
        showCommandMenu,
        setShowCommandMenu,
        showFeatureFlags,
        setShowFeatureFlags,
      }}
    >
      {props.children}
    </globalDialogContext.Provider>
  );
}

export function useGlobalDialogContext() {
  const ctx = React.useContext(globalDialogContext);
  if (!ctx) {
    throw new Error(
      "useGlobalDialogContext must be used within a GlobalDialogProvider"
    );
  }
  return ctx;
}
