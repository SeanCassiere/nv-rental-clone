import { createFileRoute } from "@tanstack/react-router";

import ModuleNotesTabContent from "@/components/primary-module/tabs/notes-content";

import { fetchReservationNotesByIdOptions } from "@/lib/query/reservation";

import { Container } from "@/routes/-components/container";

export const Route = createFileRoute(
  "/_auth/(reservations)/reservations/$reservationId/_details/notes"
)({
  beforeLoad: ({
    context: { authParams: auth },
    params: { reservationId },
  }) => {
    return {
      viewReservationNotesOptions: fetchReservationNotesByIdOptions({
        auth,
        reservationId,
      }),
    };
  },
  loader: async ({ context }) => {
    if (!context.auth.isAuthenticated) return;

    await context.queryClient.ensureQueryData(
      context.viewReservationNotesOptions
    );

    return;
  },
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
