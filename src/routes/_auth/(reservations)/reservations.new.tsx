import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import AddRentalParentForm from "@/components/add-rental";

import { useDocumentTitle } from "@/lib/hooks/useDocumentTitle";

import { Container } from "@/routes/-components/container";

import { titleMaker } from "@/lib/utils/title-maker";

export const Route = createFileRoute("/_auth/(reservations)/reservations/new")({
  validateSearch: (search) =>
    z
      .object({
        stage: z.string().optional(),
      })
      .parse(search),
  component: AddReservationPage,
});

function AddReservationPage() {
  const navigate = Route.useNavigate();

  const stage = Route.useSearch({
    select: (s) => s?.stage ?? "rental-information",
  });

  const handleStageTabClick = React.useCallback(
    (destination: string) => {
      navigate({
        search: () => ({ stage: destination }),
      });
    },
    [navigate]
  );

  const handleReservationSaveComplete = React.useCallback(
    (reservationId: number) => {
      navigate({
        to: "/reservations/$reservationId/summary",
        params: { reservationId: String(reservationId) },
      });
    },
    [navigate]
  );

  const handleCancelAddReservation = React.useCallback(() => {
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
