import { createLazyFileRoute } from "@tanstack/react-router";

import ModuleNotesTabContent from "@/components/primary-module/tabs/notes-content";

import { Container } from "@/routes/-components/container";

export const Route = createLazyFileRoute(
  "/_auth/(fleet)/fleet/$vehicleId/_details/notes"
)({
  component: Component,
});

function Component() {
  const { authParams } = Route.useRouteContext();
  const { vehicleId } = Route.useParams();

  return (
    <Container as="div">
      <div className="mb-6 px-2 sm:px-4">
        <ModuleNotesTabContent
          module="vehicles"
          referenceId={vehicleId}
          clientId={authParams.clientId}
          userId={authParams.userId}
        />
      </div>
    </Container>
  );
}
