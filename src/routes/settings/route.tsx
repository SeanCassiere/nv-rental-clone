import { FileRoute, Navigate } from "@tanstack/react-router";

export const Route = new FileRoute("/settings").createRoute({
  component: () => (
    <Navigate
      to="/settings/$destination"
      params={{ destination: "profile" }}
      replace
    />
  ),
});
