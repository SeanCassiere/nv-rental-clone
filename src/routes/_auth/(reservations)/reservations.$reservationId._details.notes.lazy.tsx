import { createLazyFileRoute } from "@tanstack/react-router";

import ModuleNotesTabContent from "@/components/primary-module/tabs/notes-content";

import { Container } from "@/routes/-components/container";

export const Route = createLazyFileRoute(
  "/_auth/(reservations)/reservations/$reservationId/_details/notes"
)({
  component: Component,
});

function Component() {
  const authParams = Route.useRouteContext({ select: (s) => s.authParams });
  const { reservationId } = Route.useParams();

  return (
    <Container as="div">
      <div className="mb-6 px-2 sm:px-4">
        <ModuleNotesTabContent
          module="reservations"
          referenceId={reservationId}
          clientId={authParams.clientId}
          userId={authParams.userId}
        />
      </div>
    </Container>
  );
}
