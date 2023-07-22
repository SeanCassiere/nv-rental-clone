import { useNavigate, useRouter, useSearch } from "@tanstack/router";

import { useCallback } from "react";
import AddRentalParentForm from "@/components/add-rental";
import Protector from "@/components/protector-shield";

import { useDocumentTitle } from "@/hooks/internal/useDocumentTitle";

import { addReservationRoute } from "@/routes/reservations/add-reservation-route";
import { viewReservationByIdRoute } from "@/routes/reservations/reservation-id-route";

import { titleMaker } from "@/utils/title-maker";

const AddReservationPage = () => {
  const navigate = useNavigate({ from: addReservationRoute.id });
  const router = useRouter();

  const { stage = "rental-information" } = useSearch({
    from: addReservationRoute.id,
  });

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
        to: viewReservationByIdRoute.to,
        params: { reservationId: String(reservationId) },
        search: () => ({ tab: "summary" }),
      });
    },
    [navigate]
  );

  const handleCancelAddReservation = useCallback(() => {
    router.navigate({
      to: "../",
    });
  }, [router]);

  useDocumentTitle(titleMaker("New - Reservation"));
  return (
    <Protector>
      <AddRentalParentForm
        referenceId={0}
        currentStage={stage}
        module="reservation"
        onStageTabClick={handleStageTabClick}
        onRentalSaveClick={handleReservationSaveComplete}
        onRentalCancelClick={handleCancelAddReservation}
      />
    </Protector>
  );
};

export default AddReservationPage;
