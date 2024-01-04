import * as React from "react";

const globalDialogContext = React.createContext<{
  // used for the logout alert dialog
  showLogout: boolean;
  setShowLogout: React.Dispatch<React.SetStateAction<boolean>>;

  // used for the global search command menu (Cmd + K)
  showCommandMenu: boolean;
  setShowCommandMenu: React.Dispatch<React.SetStateAction<boolean>>;
} | null>(null);

export function GlobalDialogProvider(props: React.PropsWithChildren) {
  const [showLogout, setShowLogout] = React.useState(false);
  const [showCommandMenu, setShowCommandMenu] = React.useState(false);
  return (
    <globalDialogContext.Provider
      value={{
        showLogout,
        setShowLogout,
        showCommandMenu,
        setShowCommandMenu,
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
