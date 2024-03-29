import { useCallback } from "react";
import {
  createLazyFileRoute,
  getRouteApi,
  useNavigate,
} from "@tanstack/react-router";

import AddRentalParentForm from "@/components/add-rental";

import { useDocumentTitle } from "@/lib/hooks/useDocumentTitle";

import { Container } from "@/routes/-components/container";

import { titleMaker } from "@/lib/utils/title-maker";

export const Route = createLazyFileRoute(
  "/_auth/(reservations)/reservations/new"
)({
  component: AddReservationPage,
});

const routeApi = getRouteApi("/_auth/reservations/new");

function AddReservationPage() {
  const navigate = useNavigate({ from: "/reservations/new" });

  const { stage = "rental-information" } = routeApi.useSearch();

  const handleStageTabClick = useCallback(
    (destination: string) => {
      navigate({
        search: () => ({ stage: destination }),
      });
    },
    [navigate]
  );

  const handleReservationSaveComplete = useCallback(
    (reservationId: number) => {
      navigate({
        to: "/reservations/$reservationId/summary",
        params: { reservationId: String(reservationId) },
      });
    },
    [navigate]
  );

  const handleCancelAddReservation = useCallback(() => {
    navigate({
      to: "..",
    });
  }, [navigate]);

  useDocumentTitle(titleMaker("New - Reservation"));
  return (
    <Container>
      <AddRentalParentForm
        referenceId={0}
        currentStage={stage}
        module="reservation"
        onStageTabClick={handleStageTabClick}
        onRentalSaveClick={handleReservationSaveComplete}
        onRentalCancelClick={handleCancelAddReservation}
      />
    </Container>
  );
}
