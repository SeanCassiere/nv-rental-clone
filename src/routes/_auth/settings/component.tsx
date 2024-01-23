import { Navigate } from "@tanstack/react-router";

export const component = function SettingsIndexPage() {
  return (
    <Navigate
      to="/settings/$destination"
      params={{ destination: "profile" }}
      replace
    />
  );
};
