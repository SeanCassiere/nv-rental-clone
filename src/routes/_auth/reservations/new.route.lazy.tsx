import { useCallback } from "react";
import {
  createLazyFileRoute,
  getRouteApi,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";

import AddRentalParentForm from "@/components/add-rental";

import { useDocumentTitle } from "@/lib/hooks/useDocumentTitle";

import { titleMaker } from "@/lib/utils/title-maker";

export const Route = createLazyFileRoute("/_auth/reservations/new")({
  component: AddReservationPage,
});

const routeApi = getRouteApi("/_auth/reservations/new");

function AddReservationPage() {
  const navigate = useNavigate({ from: "/reservations/new" });
  const router = useRouter();

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
        to: "/reservations/$reservationId",
        params: { reservationId: String(reservationId) },
        search: () => ({ tab: "summary" }),
      });
    },
    [navigate]
  );

  const handleCancelAddReservation = useCallback(() => {
    router.navigate({
      to: "..",
    });
  }, [router]);

  useDocumentTitle(titleMaker("New - Reservation"));
  return (
    <AddRentalParentForm
      referenceId={0}
      currentStage={stage}
      module="reservation"
      onStageTabClick={handleStageTabClick}
      onRentalSaveClick={handleReservationSaveComplete}
      onRentalCancelClick={handleCancelAddReservation}
    />
  );
}
