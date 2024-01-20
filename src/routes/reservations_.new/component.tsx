import { useCallback } from "react";
import { RouteApi, useNavigate, useRouter } from "@tanstack/react-router";

import AddRentalParentForm from "@/components/add-rental";
import ProtectorShield from "@/components/protector-shield";

import { useDocumentTitle } from "@/hooks/useDocumentTitle";

import { titleMaker } from "@/utils/title-maker";

const routeApi = new RouteApi({ id: "/reservations/new" });

export const component = function AddReservationPage() {
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
    <ProtectorShield>
      <AddRentalParentForm
        referenceId={0}
        currentStage={stage}
        module="reservation"
        onStageTabClick={handleStageTabClick}
        onRentalSaveClick={handleReservationSaveComplete}
        onRentalCancelClick={handleCancelAddReservation}
      />
    </ProtectorShield>
  );
};
