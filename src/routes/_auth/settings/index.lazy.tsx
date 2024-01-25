import { createLazyFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/settings/")({
  component: SettingsIndexPage,
});

function SettingsIndexPage() {
  return (
    <Navigate
      to="/settings/$destination"
      params={{ destination: "profile" }}
      replace
    />
  );
}
