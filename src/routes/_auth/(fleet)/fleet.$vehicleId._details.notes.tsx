import { createFileRoute } from "@tanstack/react-router";

import { fetchVehiclesByIdOptions } from "@/lib/query/vehicle";

import ModuleNotesTabContent from "@/routes/_auth/-modules/tabs/notes-content";
import { Container } from "@/routes/-components/container";

export const Route = createFileRoute(
  "/_auth/(fleet)/fleet/$vehicleId/_details/notes"
)({
  beforeLoad: ({ context: { authParams: auth }, params: { vehicleId } }) => {
    return {
      viewVehicleOptions: fetchVehiclesByIdOptions({
        auth,
        vehicleId,
      }),
    };
  },
  loader: async ({ context }) => {
    if (!context.auth.isAuthenticated) return;

    await context.queryClient.ensureQueryData(context.viewVehicleOptions);

    return;
  },
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
