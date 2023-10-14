import * as React from "react";

const globalDialogContext = React.createContext<{
  showLogout: boolean;
  setShowLogout: React.Dispatch<React.SetStateAction<boolean>>;
} | null>(null);

export function GlobalDialogProvider(props: React.PropsWithChildren) {
  const [showLogout, setShowLogout] = React.useState(false);
  return (
    <globalDialogContext.Provider
      value={{
        showLogout,
        setShowLogout,
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
