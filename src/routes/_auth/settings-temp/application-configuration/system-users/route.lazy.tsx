import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute(
  "/_auth/settings-temp/application-configuration/system-users"
)({
  component: () => (
    <div>
      Hello /_auth/settings-temp/application-configuration/system-users!
    </div>
  ),
});
