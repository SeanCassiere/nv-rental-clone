import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { z } from "zod";

import AddRentalParentForm from "@/components/add-rental";

import { useDocumentTitle } from "@/lib/hooks/useDocumentTitle";

import { Container } from "@/routes/-components/container";

import { titleMaker } from "@/lib/utils/title-maker";

export const Route = createFileRoute(
  "/_auth/(reservations)/reservations/$reservationId/edit"
)({
  validateSearch: (search) =>
    z
      .object({
        stage: z.string().optional(),
      })
      .parse(search),
  preSearchFilters: [() => ({ stage: "rental-information" })],
  component: EditReservationPage,
});

function EditReservationPage() {
  const navigate = Route.useNavigate();
  const router = useRouter();

  const routeContext = Route.useRouteContext();
  const stage = Route.useSearch({
    select: (s) => s?.stage ?? "rental-information",
  });
  const { reservationId } = Route.useParams();

  const reservationData = useQuery(routeContext.viewReservationOptions);
  const reservation =
    reservationData.data?.status === 200 ? reservationData.data?.body : null;

  const rentalRatesSummary = useQuery(
    routeContext.viewReservationSummaryOptions
  );
  const summaryData =
    rentalRatesSummary.data?.status === 200
      ? rentalRatesSummary.data?.body
      : undefined;

  const handleStageTabClick = React.useCallback(
    (destination: string) => {
      navigate({
        search: () => ({ stage: destination }),
        params: { reservationId },
      });
    },
    [reservationId, navigate]
  );

  const handleReservationSaveComplete = React.useCallback(() => {
    navigate({
      to: "/reservations/$reservationId/summary",
      params: { reservationId },
    });
  }, [reservationId, navigate]);

  const handleCancelEditReservation = React.useCallback(() => {
    navigate({
      to: "..",
    });
  }, [navigate]);

  useDocumentTitle(
    titleMaker(
      `Edit - ${
        reservation?.reservationview?.reservationNumber || "Loading"
      } - Reservation`
    )
  );

  React.useEffect(() => {
    if (rentalRatesSummary.status !== "error") return;

    router.history.go(-1);
  }, [router.history, rentalRatesSummary.status]);

  return (
    <Container>
      <AddRentalParentForm
        referenceId={parseInt(reservationId)}
        currentStage={stage}
        module="reservation"
        onStageTabClick={handleStageTabClick}
        onRentalSaveClick={handleReservationSaveComplete}
        onRentalCancelClick={handleCancelEditReservation}
        referenceNumber={
          reservation?.reservationview.reservationNumber || undefined
        }
        reservationData={reservation || undefined}
        summaryData={summaryData}
      />
    </Container>
  );
}
